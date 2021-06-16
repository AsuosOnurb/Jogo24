// MultiplayerScene.ts
/**
 * Module responsible for the implementation of the Multiplayer scene.
 * @module
 */



import Phaser from 'phaser'

import { BetterText } from '../components/BetterText'
import { BetterButton } from '../components/BetterButton'
import { Solutions } from '../utils/Solutions'
import { MultiplayerGame, PlayerState } from '../game/MultiplayerGame';
import { Difficulty } from '../utils/CardGenerator';
import { Minicard } from '../components/Minicard';
import { ValueOfExpression } from '../utils/Utils';
import { CountdownTimer } from '../components/CountdownTimer';


export class MultiplayerScene extends Phaser.Scene {

    private isInstanced: boolean = false;

    private m_GameState: MultiplayerGame;



    /* =========================== Instructions Panel ======================== */
    /*
        This panel is actually just composed of the single image. No Phaser group is being used.
    */
    private m_ImageText_Rules: Phaser.GameObjects.Image;


    /* ================================= Difficulty Panel ========================== */

    /**
     * A phaser group object containing all the other objects that compose the "Choose difficulty" panel.
     */
    private m_Group_SelectDifficultyPanel: Phaser.GameObjects.Group;
    private m_ImageText_PickADifficulty: Phaser.GameObjects.Image;
    private m_DifficultyButtons: Array<BetterButton>;
    private m_Tween_ShowDifficultyPanel;

    /* =========================== Expression Bars Group ======================= */
    /**
     * This mode has 4 bars where the arithemtic expressions are displayed.
     * These bars will ahve to be updated at the same time (their text will be the same)
     * Things get easier if they are in an array.
     * The array will be an array of BetterButtons, although the bars wont act as buttons.
     */
    private m_Array_ExpressionBars: Array<BetterButton>

    /* ============================  The 2 mini cards ======================= */
    private mMinicard1: Minicard;
    private mMinicard2: Minicard;

    // ===================== UI Objects (text objects, buttons, etc....) ==================

    /*
        In this game mode, the card will have to flip vertically to accomodate its reading from different angles.
        We create a group that contains all its elements (the card background, the numbers, the new card button).
        When the card 'flips', its actually the group that flips.
    */
    private m_Group_CardGroup: Phaser.GameObjects.Group;
    private m_Image_CardBG: Phaser.GameObjects.Image;
    private m_CardButtons: Array<BetterButton>;
    private m_BtnUsed: Array<Boolean>;
    private m_Btn_NewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers


    // Text
    private textSolution!: BetterText; // debug only

    // Buttons
    private m_Array_PlayerButtons: Array<BetterButton>; // The array that holds the 4 coloured player buttons

    private btnOperationAdd!: BetterButton;         // Performs Addition
    private btnOperationSubtract!: BetterButton;    // Performs Subtraction
    private btnOperationMultiply!: BetterButton;    // Performs Multiplication
    private btnOperationDivide!: BetterButton;      // Perfroms Division

    private btnGotoMenu!: BetterButton;             // Redirects player to the main menu
    private imageDifficulty: Phaser.GameObjects.Image; // The image that displays the current game difficulty
    private cardCounter: BetterButton;  // The card counter (Its a button just for simplicity)
    

    private mCountDownTimer: CountdownTimer;
    private mCountdownTimerImage: Phaser.GameObjects.Image;

    /**
     *  The button that allows to peek a solution for the current card.
     */
    private mBtnPeekSolution: BetterButton;


    constructor() {
        super("MultiplayerGame");
    }

    init() {
        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, this.scale.width / 2, 70, 0.7, 0.7, "", { fontSize: 64 }, 'btn_gotoMenu');
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

        


        // Debug solutution label
        this.textSolution = new BetterText(this, 128, 256, "", { fontSize: 32 });

        /**
         * Register event handlers/listeners only if the scene hasn't been started before.
         */
        if (!this.isInstanced) {

            this.events.on('DifficultyButtonClick', this.HandleDifficultyButtonClick, this);
            this.events.on('PlayerButtonClick', this.HandleButtonClick_Player, this);
            this.events.on('NumberButtonClick', this.HandleButtonClick_Number, this);
            this.events.on('OperationButtonClick', this.HandleButtonClick_Operation, this);
            this.events.on('PeekSolutionButtonClick', this.HandleButtonClick_PeekSolution, this);

            // This flag is important. Prevents duplication of event listeners!!
            this.isInstanced = true;

        }

        this.Setup();
    }




    NewCard(): void {

        // Disable this btn
        this.m_Btn_NewCard.SetDisabled();

        // Tell the mutiplayer player game that we're going to be playing a new card.
        this.m_GameState.NewCard();


        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < this.m_GameState.GetCurrentCard().length; i++) {

            // Set the text of the number button
            this.m_CardButtons[i].NumberButtonSetText(this.m_GameState.GetCurrentCard()[i]);
            this.m_CardButtons[i].SetDisabled(0.7);

            this.m_BtnUsed[i] = false;
        }


        // Disable Operation buttons
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`Solução: ${Solutions.GetSolution(this.m_GameState.GetCurrentCard())}`);

        // Clear the text from expression bars
        for (let i = 0; i < 4; i++)
            this.m_Array_ExpressionBars[i].SetText("");

        // Enable the 4 colored player buttons
        for (let i = 0; i < 4; i++)
            this.m_Array_PlayerButtons[i].SetEnabled();

        // Add the text to the mini cards
        this.mMinicard1.SetCard(this.m_GameState.GetCurrentCard());
        this.mMinicard2.SetCard(this.m_GameState.GetCurrentCard());

        // Reset expression bars
        this.m_Array_ExpressionBars.forEach((exprBar) => {
            exprBar.SetText("");
            exprBar.SetTextColor("#FFFFFF");
        });


        // Reset the countdown timer so that it gets set to the default initial time for this game mode.
        this.mCountDownTimer.Reset();


        // Make the 'peek solution' button go away
        this.HidePeekSolutionButton();


        // Increment the total of cards played, and update the tard counter
        const totalCards = this.m_GameState.IncrementTotalCardsUsed();
        this.cardCounter.SetText(`${totalCards} / ${this.m_GameState.MAX_CARD_TOTAL}`)
        


    }



    DisableAllButtons() {
        for (let i = 0; i < 4; i++)
            this.m_CardButtons[i].SetDisabled();



        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        this.m_Btn_NewCard.SetDisabled();
    }

    HandleButtonClick_Player(clickedButtonIndex: number): void {
        this.m_GameState.SetCurrentPlayer(clickedButtonIndex);

        // The colored player button was clicked. Disable all others right away
        for (let i = 0; i < 4; i++) {
            if (clickedButtonIndex != i) {
                this.m_Array_PlayerButtons[i].SetDisabled();

            }

            // Disable the clicked button, but still make it clearly visible
            this.m_Array_PlayerButtons[clickedButtonIndex].SetDisabled(1.0);
        }

        // Enable the card buttons
        for (let i = 0; i < 4; i++)
            this.m_CardButtons[i].SetEnabled();

        // Redraw Card
        this.RedrawCard(clickedButtonIndex);

        // Prevent player from getting a new card
        this.m_Btn_NewCard.SetDisabled();


        this.RedrawMiniCards(clickedButtonIndex);

        // Start counting time
        this.mCountDownTimer.StartCountdown();




    }

    /**
     * Redraws the current card by fliping its numbers to accomodate the current player view.
     * @param clickedButtonIndex The index associated with the player button that was just clicked. 
     * This parameter is important because this procedure needs to know how it should flip the card.
     */
    RedrawCard(clickedButtonIndex: number): void {
        if (clickedButtonIndex === 0 || clickedButtonIndex === 1) {
            this.m_Btn_NewCard.setFlipY(true);

            for (let i = 0; i < 4; i++)
                this.m_CardButtons[i].FlipY(true);

        } else {
            this.m_Btn_NewCard.setFlipY(false);


            for (let i = 0; i < 4; i++)
                this.m_CardButtons[i].FlipY(false);


        }

    }

    /**
     * Redraws the two mini cards by repositioning and flipping them to accomodate the players that are not currently playing.     * 
     * @param clickedButtonIndex The index associated with the player button that was just clicked. 
     * This parameter is important because this procedure needs to know how it should flip the two mini cards.
     */
    RedrawMiniCards(clickedButtonIndex: number): void {
        // Flip the card according to the new current player
        if (clickedButtonIndex == 0 || clickedButtonIndex == 1) {
            // Top player is  playing.
            // Put minicards on the bottom 
            this.mMinicard1.SetPosition(384, this.scale.height - 128);
            this.mMinicard1.FlipForBottom();

            this.mMinicard2.SetPosition(this.scale.width - 384, this.scale.height - 128);
            this.mMinicard2.FlipForBottom();

        } else {
            // Bottom player is  playing.
            // Put minicards on the top 
            this.mMinicard1.SetPosition(384, 128);
            this.mMinicard1.FlipForTop();

            this.mMinicard2.SetPosition(this.scale.width - 384, 128);
            this.mMinicard2.FlipForTop();
        }
    }

    HandleButtonClick_Number(clickedButtonIndex: number): void {

        const pickedNumber = this.m_CardButtons[clickedButtonIndex].GetText();

        if (this.m_GameState.GetPlayerState() === PlayerState.PickingOperand1) {

            this.m_CardButtons[clickedButtonIndex].SetDisabled();

            // Mark it as used, so that it doesnt get enabled again.
            this.m_BtnUsed[clickedButtonIndex] = true;

            // Also enable the operation buttons
            this.EnableOperationButtons();

            // Update current operation
            this.m_GameState.PickOperand1(pickedNumber, clickedButtonIndex);

            // Update the expression bars
            this.m_Array_ExpressionBars.forEach((exprBar: BetterButton) => {
                exprBar.SetText(pickedNumber)
            });



        } else if (this.m_GameState.GetPlayerState() === PlayerState.PickingOperand2) {

            // Get the newly calculated expression
            const expression = this.m_GameState.PickOperand2(pickedNumber, clickedButtonIndex);

            this.m_CardButtons[clickedButtonIndex].NumberButtonSetText(expression);

            // Update the expression bars
            this.m_Array_ExpressionBars.forEach((exprBar: BetterButton) => {
                exprBar.SetText(expression)
            });

            /*
                We can also check if this is the last available/enabled button.
                If it is, then it means we now must check if the solution is correct
            */
            let usedCount = 0;
            for (let i = 0; i < 4; i++)
                if (this.m_BtnUsed[i] === true)
                    usedCount++;


            if (usedCount === 3) {
                const won: boolean = this.m_GameState.CheckSolution(expression);

                if (won) {
                    this.m_GameState.IncrTotalCorrect();
                    this.ShowPlayerWon(expression);
                }

                else {

                    this.m_GameState.IncrTotalWrong();
                    this.ShowPlayerLost(expression);
                    this.ShowPeekSolutionButton();

                }

                // Disable all numbers and operations
                this.DisableNumberButtons();
                this.DisableOperationButtons()
                this.m_Btn_NewCard.SetEnabled(); // PLayers have to pick a new cards

                // Stop time counter
                this.mCountDownTimer.StopCountdown();

                // Check if the total of cards was reached
                if (this.m_GameState.IsMaxCardCountReached())
                    this.ShowEndgamePanel();

            }

            this.m_GameState.ResetOperationState()
        }


    }

    HandleButtonClick_Operation(operator: string) {

        const mostRecentExpression: string = this.m_GameState.PickOperator(operator);

        // Enable card buttons
        this.EnableNumberButtons();

        // Disable operation buttons
        this.DisableOperationButtons();

        // Update the expression bars
        this.m_Array_ExpressionBars.forEach((exprBar: BetterButton) => {
            exprBar.SetText(mostRecentExpression);
        });

    }


    /* ============================= Instructions Panel ========================= */

    Setup() {

        // Show the rules / instructions 
        this.m_ImageText_Rules = this.add.image(this.scale.width / 2, this.scale.height / 2, 'textImage_rules')
        this.m_ImageText_Rules.setScale(1.5);

        this.input.on('pointerup', () => {

            this.input.removeListener('pointerup');
            // When the player clicks the screen, then the instructions fade out.
            this.tweens.add(
                {
                    targets: this.m_ImageText_Rules,
                    alpha: 0.0,

                    duration: 500,
                    ease: 'Power1'
                }
            );

            // Then show the difficuly panel
            this.Show_DifficultyPanel();

        });

    }



    /* ================================ Difficulty Panel ======================= */

    Show_DifficultyPanel() {

        this.m_Group_SelectDifficultyPanel = this.add.group();

        // The label
        this.m_ImageText_PickADifficulty = this.add.image(this.scale.width / 2, 200, 'textImage_pickDiff');
        this.m_ImageText_PickADifficulty.setAlpha(0);
        this.m_Group_SelectDifficultyPanel.add(this.m_ImageText_PickADifficulty);


        // Setup the diff buttons
        this.m_DifficultyButtons = [
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 192, 1, 1, "", {}, 'btn_easy', 0),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 1, 1, "", {}, 'btn_medium', 0),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 192, 1, 1, "", {}, 'btn_hard', 0),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 384, 1, 1, "", {}, 'btn_allDifficulties', 0),
        ];

        for (let i = 0; i < 4; i++) {
            this.m_DifficultyButtons[i].on('pointerup', () => this.events.emit('DifficultyButtonClick', i));
            this.m_DifficultyButtons[i].setAlpha(0);
            this.m_Group_SelectDifficultyPanel.add(this.m_DifficultyButtons[i]);
        }

        // Setup the tweens
        this.m_Tween_ShowDifficultyPanel = this.tweens.add({
            targets: this.m_Group_SelectDifficultyPanel.getChildren().map(function (c) { return c }),
            alpha: 1,
            duration: 1000,
            delay: 500,
        });
    }


    HandleDifficultyButtonClick(clickedButtonIndex: number) {
        // Hide the difficulty panel
        this.m_Group_SelectDifficultyPanel.setVisible(false);

        // The Difficulty was chosen. Time to start the game.
        let diff: Difficulty;
        switch (clickedButtonIndex) {
            case 0:
                diff = Difficulty.Easy;
                break;

            case 1:
                diff = Difficulty.Medium;

                break;

            case 2:
                diff = Difficulty.Hard;

                break;

            case 3:
                diff = Difficulty.Any;

                break;

            default:
                diff = Difficulty.Easy; // This should never happen though.
                break;
        }

        this.m_GameState = new MultiplayerGame(diff);


        // Setup the GUI's initial state
        this.Setup_GUI();
    }


    Setup_GUI() {


        /* ======================= Setting up the static elements (static images, static labels, etc...) =============== */
        this.m_Group_CardGroup = this.add.group();

        // Setup the game card group
        this.m_Image_CardBG = this.add.image(this.scale.width / 2, this.scale.height / 2 + 60, 'cardBG');
        this.m_Image_CardBG.setScale(1.1);

        // Card Counter
        this.cardCounter = new BetterButton(this, this.scale.width / 2 + 256, 70, 0.5, 0.5, `0 / ${this.m_GameState.MAX_CARD_TOTAL}`, 
                    { fontFamily: 'Vertiky', align: 'center', fontSize: 38, color: "white", fontStye:"bold"}, 'cardCounterBG' );
        this.cardCounter.SetDisabled(1);

        // Setup a button for each number in the card (4 buttons)
        this.m_BtnUsed = new Array<Boolean>();
        this.m_CardButtons = [
            new BetterButton(this, this.scale.width / 2 - 204, this.m_Image_CardBG.y,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y - 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 204, this.m_Image_CardBG.y,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y + 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG")

        ]

        for (let i = 0; i < this.m_CardButtons.length; i++) {
            // Each button starts disabled
            this.m_CardButtons[i].SetDisabled();
            this.m_CardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i));

            this.m_BtnUsed[i] = false;

            // Add each one to the grouo
            this.m_Group_CardGroup.add(this.m_CardButtons[i]);
        }

        // 'New Card' button
        this.m_Btn_NewCard = new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y, 0.6, 0.6, "", { fontSize: 32 }, "btn_playCard");
        this.m_Btn_NewCard.on("pointerup", () => this.NewCard());
        this.m_Group_CardGroup.add(this.m_Btn_NewCard);

        /* =========================== Setting up the other buttons ============================= */

        // Setup the 4 coloured player buttons
        this.m_Array_PlayerButtons = [
            new BetterButton(this, 128, 128,
                0.8, 0.8, "", { fontFamily: 'Vertiky', fontSize: 96 }, "btn_player1"),

            new BetterButton(this, this.scale.width - 128, 128,
                0.8, 0.8, "", { fontFamily: 'Vertiky', fontSize: 96 }, "btn_player2"),

            new BetterButton(this, 128, this.scale.height - 128,
                0.8, 0.8, "", { fontFamily: 'Vertiky', fontSize: 96 }, "btn_player3"),

            new BetterButton(this, this.scale.width - 128, this.scale.height - 128,
                0.8, 0.8, "", { fontFamily: 'Vertiky', fontSize: 96 }, "btn_player4")
        ];

        for (let i = 0; i < 4; i++) {
            this.m_Array_PlayerButtons[i].SetDisabled();
            this.m_Array_PlayerButtons[i].on('pointerup', () => this.events.emit('PlayerButtonClick', i));
        }

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "+"));
        this.btnOperationAdd.SetDisabled();

        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "-"));
        this.btnOperationSubtract.SetDisabled();

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "x"));
        this.btnOperationMultiply.SetDisabled();

        // Division operation button
        this.btnOperationDivide = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_division");
        this.btnOperationDivide.on("pointerup", () => this.events.emit('OperationButtonClick', "/"));
        this.btnOperationDivide.SetDisabled();


        /* ================== Setup the expression bars ==================== */
        this.m_Array_ExpressionBars = [
            new BetterButton(this, this.scale.width / 2 - 420, this.m_Image_CardBG.y, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar').SetAngle(-90),
            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y - 416, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar'),
            new BetterButton(this, this.scale.width / 2 + 420, this.m_Image_CardBG.y, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar').SetAngle(90),
            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y + 416, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar').SetAngle(180)
        ];

        // And make them all un-interactible
        this.m_Array_ExpressionBars.forEach((b) => { b.SetDisabled(1.0) })




        /* ============================Main menu button ================ */
        // Move the main menu button to the side (just a bit)
        this.tweens.add({
            targets: this.btnGotoMenu,
            x: this.scale.width / 2 - 256,
            repeat: 0,
            ease: 'Power1'
        });

        /* ==================== Difficulty image ================ */
        // Show an image on the top of the page that displays the difficulty of the current card
        switch (this.m_GameState.difficulty) {
            case Difficulty.Any:
                this.imageDifficulty = this.add.image(this.scale.width / 2, -96, 'btn_allDifficulties');
                break;

            case Difficulty.Easy:
                this.imageDifficulty = this.add.image(this.scale.width / 2, -96, 'btn_easy');
                break;

            case Difficulty.Medium:
                this.imageDifficulty = this.add.image(this.scale.width / 2, -96, 'btn_medium');
                break;

            case Difficulty.Hard:
                this.imageDifficulty = this.add.image(this.scale.width / 2, -96, 'btn_hard');
                break;
        }
        this.imageDifficulty.setScale(0.7)
        this.tweens.add({
            targets: this.imageDifficulty,
            y: 70,
            repeat: 0,
            ease: 'Elastic1'
        });


        /* ============ Setup minicards =========== */
        this.mMinicard1 = new Minicard(this, 384, 128, '    ');
        this.mMinicard2 = new Minicard(this, this.scale.width - 384, 128, '    ');


        // Setup the countdown timer
        this.mCountdownTimerImage = this.add.image(256 - 32, this.scale.height / 2, "clockBG1");
        this.mCountDownTimer = new CountdownTimer(this, 12, this.NoTimeLeft.bind(this), 256 + 60, this.scale.height / 2, 40, "00 : 12");


        /* =============== Setup the 'Peek Solution' Button ================ */
        this.mBtnPeekSolution = new BetterButton(this, this.scale.width / 2 + 320, - 40, 0.8, 0.8, "", {}, 'btn_peekImage');
        this.mBtnPeekSolution.SetDisabled(0);
        this.mBtnPeekSolution.on('pointerup', () => this.events.emit('PeekSolutionButtonClick'));
    }


    EnableNumberButtons(): void {
        for (let i = 0; i < 4; i++) {
            if (this.m_BtnUsed[i] === false)
                this.m_CardButtons[i].SetEnabled();
        }
    }

    DisableNumberButtons(): void {
        this.m_CardButtons.forEach((button: BetterButton) => {
            button.SetDisabled();
        });
    }

    EnableOperationButtons(): void {
        this.btnOperationAdd.SetEnabled();
        this.btnOperationSubtract.SetEnabled();
        this.btnOperationMultiply.SetEnabled();
        this.btnOperationDivide.SetEnabled();
    }

    DisableOperationButtons(): void {
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();
    }

    ShowPlayerWon(expression: string): void {

        this.m_Array_ExpressionBars.forEach((exprBar: BetterButton) => {
            exprBar.SetText(expression + ` = ${24}`);
            exprBar.SetTextColor("#00ff1a");

        });

        this.m_Array_PlayerButtons[this.m_GameState.GetCurrentPlayer()].SetText(this.m_GameState.GetCurrentPlayerScore().toString());


    }

    ShowPlayerLost(expression: string): void {
        this.m_Array_ExpressionBars.forEach((exprBar: BetterButton) => {
            exprBar.SetText(expression + ` = ${ValueOfExpression(expression)}`);
            exprBar.SetTextColor("#ff2600");


        });

        this.m_Array_PlayerButtons[this.m_GameState.GetCurrentPlayer()].SetText(this.m_GameState.GetCurrentPlayerScore().toString());




    }

    /**
     * Activated when the countdown timer rings (reaches zero).
     * Activates only once each round.
     */
    NoTimeLeft() {
        this.DisableNumberButtons();
        this.DisableOperationButtons();

        this.m_Array_ExpressionBars.forEach((exprBar) => {
            exprBar.SetTextColor("#ff2600");
        });

        this.m_GameState.IncrTotalWrong();
        this.m_Array_PlayerButtons[this.m_GameState.GetCurrentPlayer()].SetText(this.m_GameState.GetCurrentPlayerScore().toString());

        this.m_Btn_NewCard.SetEnabled();

        // Also let the player see a possible solution
        this.ShowPeekSolutionButton();

        // Check if the total of cards was reached
        if (this.m_GameState.IsMaxCardCountReached()) {
            this.ShowEndgamePanel();
        }

    }

    /**
     * Displays (visualy enables) the 'eye' button that sits on top of the expression bar).
     * This button allows the user to peek one of the (possibly many) solutions for the current card.
     * Should only be called when the user fails to ansert the card (i.e: When we throw an error).
     */
    ShowPeekSolutionButton(): void {
        /*
            We're using a tween for this one as well.
            First, enable the interactivity of the button.
            Then use the tween to make its alpha go to 1 (100% alpha).
        */

        // Enable, but still hide it.
        this.mBtnPeekSolution.SetEnabled(0);


        this.tweens.add(
            {
                targets: this.mBtnPeekSolution,
                y: this.scale.height / 2 - 384,
                alpha: 1,
                duration: 500,
                ease: 'Power1'
            }
        );


    }

    /**
     * Clears all of the expression bars and displays a suggested solution for the current card.
     * This procedure gets is started by the asasociated phaser event. 
     */
    HandleButtonClick_PeekSolution(): void {
        // Get the suggested solution for this card
        const solution: string = Solutions.GetSolution(this.m_GameState.GetCurrentCard());


        // Show the solution in all expression bars
        this.m_Array_ExpressionBars.forEach((exprBar) => {
            exprBar.SetText(solution.replaceAll('*', 'x') + " = 24");
            exprBar.SetTextColor("#00ff1a");
        })

        this.HidePeekSolutionButton();


    }

    /**
     * Disables and hides the button that allows the player to peek the solution for the current card.
     */
    HidePeekSolutionButton(): void {
        // Put this button back where it should be (make it dissapear to the top of the canvas)
        this.mBtnPeekSolution.SetDisabled(1);
        this.tweens.add(
            {
                targets: this.mBtnPeekSolution,
                y: -64,
                alpha: 0,
                duration: 500,
                ease: 'Power1',
                delay: 200,
            }
        );
    }


    ShowEndgamePanel(): void {
        // Disabling, hiding some elements that are overlapped
        this.m_Array_ExpressionBars.forEach((exprBar) => exprBar.SetDisabled(0));
        this.mBtnPeekSolution.SetDisabled(0);
        this.mBtnPeekSolution.setVisible(false);
        this.m_Array_PlayerButtons.forEach((pBtn) => pBtn.SetDisabled());
        this.mMinicard1.SetVisible(false)
        this.mMinicard2.SetVisible(false)
        this.m_Btn_NewCard.SetDisabled();


        // Show an empty panel where we later put a warning text
        let panelImg: Phaser.GameObjects.Image = this.add.image(this.scale.width / 2, this.scale.height / 2 + 64, "gameEndBGg");
        panelImg.setAlpha(0);
        this.tweens.add(
            {
                targets: panelImg,
                scale: 1.5,
                alpha: 1,
                duration: 500,
                ease: 'Power1'
            }
        )


        // Was the game a tie? If so, then show a message saying that.
        // If someone won, then show a message for them.
        /*
            Outcomes:
            1 - Empate -> "O Jogo ficou empatado"
            2 - Não foi empate 
                2.a - Existe apenas um jogador com a pontuação máxima -> Mostrar apenas esse jogador
                2.b - Existem vários jogadores com a pontuação máxima -> Mostrar esses jogadores
        */
        if (this.m_GameState.IsGameTied()) {
            this.ShowEndgamePanelTieMessage();
        }
        else {
            this.ShowEndgamePanelWinningMessage();
        }


        // Move the main menu button to the panel
        this.btnGotoMenu.setDepth(1);
        this.tweens.add({
            targets: this.btnGotoMenu,
            scale: 1,
            duration: 500,
            ease: 'Power1',
            x: this.scale.width / 2,
            y: this.scale.height / 2 + 300
        });


    }

    ShowEndgamePanelTieMessage(): void {
        let tieMessage = new BetterText(this, this.scale.width / 2, this.scale.height / 2 + 54,
            `O jogo ficou empatado!`, { fontFamily: 'Vertiky', align: 'center', fontSize: 54, color: "#4e2400" });

        tieMessage.setAlpha(0);


        this.tweens.add(
            {
                targets: tieMessage,
                alpha: 1,
                duration: 500,
                ease: 'Power1',
            }
        )
    }

    ShowEndgamePanelWinningMessage(): void {

        const winningPlayersIndexes: Array<number> = this.m_GameState.GetWinningPlayersIndexes();
        const winningScore: number = this.m_GameState.GetWinningScore();

        let congratsText: BetterText;
        if (winningPlayersIndexes.length > 1) {
            // More than one winner
            congratsText = new BetterText(this, this.scale.width / 2, this.scale.height / 2 + 54,
                `Parabéns               \n\n\nObtiveram um total de ${winningScore} pontos!`, { fontFamily: 'Vertiky', align: 'center', fontSize: 54, color: "#4e2400" });
        }
        else {
            // Only one winner

            congratsText = new BetterText(this, this.scale.width / 2, this.scale.height / 2 + 54,
                `Parabéns               \n\n\nObtiveste um total de ${winningScore} pontos!`, { fontFamily: 'Vertiky', align: 'center', fontSize: 54, color: "#4e2400" });


        }


        congratsText!.setAlpha(0);
        this.tweens.add(
            {
                targets: [congratsText],
                alpha: 1,
                duration: 500,
                ease: 'Power1',
            }
        )

        // Move the buttons to the panel to show which players won
        for (let i = 0; i < winningPlayersIndexes.length; i++) {
            const associatedButton: BetterButton = this.m_Array_PlayerButtons[winningPlayersIndexes[i]];
            associatedButton.SetText("");
            associatedButton.setDepth(1);

            this.tweens.add(
                {
                    targets: associatedButton,
                    alpha: 1,
                    x: this.scale.width / 2 + 96 + i*64,
                    y: this.scale.height / 2 - 25,
                    scale: 0.6,
                    duration: 500,
                    ease: 'Power1',
                }
            )
        }


    }

}
