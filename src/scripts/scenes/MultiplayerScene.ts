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

    private gameState: MultiplayerGame;



    /* =========================== Instructions Panel ======================== */
    /*
        This panel is actually just composed of the single image. No Phaser group is being used.
    */

    /**
     * The imagge with te rules.
     * Shows up on right when this scene starts.
     */
    private imgRules: Phaser.GameObjects.Image;


    /* ================================= Difficulty Panel ========================== */

    /**
     * A phaser group object containing all the other objects that compose the "Choose difficulty" panel.
     */
    private groupDifficultyPanel: Phaser.GameObjects.Group;
    private imgPickADiff: Phaser.GameObjects.Image;
    private difficultyButtons: Array<BetterButton>;


    /* =========================== Expression Bars Group ======================= */
    /**
     * This mode has 4 bars where the arithemtic expressions are displayed.
     * These bars will have to be updated at the same time (their text will be the same)
     * Things get easier if they are in an array.
     * The array will be an array of BetterButtons, although the bars wont act as buttons.
     */
    private expressionBars: Array<BetterButton>



    /* ============================  The 2 mini cards ======================= */
    private minicard1: Minicard;
    private minicard2: Minicard;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    /*
        In this game mode, the card will have to flip vertically to accomodate its reading from different angles.
        We create a group that contains all its elements (the card background, the numbers, the new card button).
        When the card 'flips', its actually the group that flips.
    */

    private groupCardGroup: Phaser.GameObjects.Group;
    private imgCardBackground: Phaser.GameObjects.Image;
    private cardButtons: Array<BetterButton>;
    private usedButtons: Array<boolean>;
    private btnNewcard: BetterButton;              // Resets player input and gives player a new card / new numbers

    private playerButtons: Array<BetterButton>; // The array that holds the 4 coloured player buttons

    private btnOperationAdd: BetterButton;         // Performs Addition
    private btnOperationSubtract: BetterButton;    // Performs Subtraction
    private btnOperationMultiply: BetterButton;    // Performs Multiplication
    private btnOperationDivide: BetterButton;      // Perfroms Division

    private btnGotoMenu: BetterButton;             // Redirects player to the main menu
    private btnPlayAgain: BetterButton;


    private imageDifficulty: Phaser.GameObjects.Image; // The image that displays the current game difficulty
    private cardCounter: BetterButton;  // The card counter (Its a button just for simplicity)

    private countdownTimer: CountdownTimer;

    /**
     *  The button that allows to peek a solution for the current card.
     */
    private btnPeekSolution: BetterButton;


    constructor() {
        super("MultiplayerGame");
    }

    init() {

        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, this.scale.width / 2, 70, 0.6, 0.6, "", {}, 'btn_gotoMenu');
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

        this.btnPlayAgain = new BetterButton(this, this.scale.width / 2, 70, 0.75, 0.75, "", {}, 'btn_playCard');
        this.btnPlayAgain.SetDisabled(0);
        this.btnPlayAgain.on('pointerup', () => {
            this.registry.destroy(); // destroy registry
            this.scene.restart(); // restart current scene
        });

        this.countdownTimer = new CountdownTimer(this, 13, this.NoTimeLeft.bind(this), 256 + 60, this.scale.height / 2, "00:12", 40);
        this.countdownTimer.setVisible(false);
        



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

    update(time, delta)
    {
        this.countdownTimer.update();
    }




    NewCard(): void {

        // Disable this btn
        this.btnNewcard.SetDisabled();

        // Tell the mutiplayer player game that we're going to be playing a new card.
        this.gameState.NewCard();


        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < this.gameState.GetCurrentCard().length; i++) {

            // Set the text of the number button
            this.cardButtons[i].NumberButtonSetText(this.gameState.GetCurrentCard()[i]);
            this.cardButtons[i].SetDisabled(0.7);

            this.usedButtons[i] = false;
        }


        // Disable Operation buttons
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();


        // Clear the text from expression bars
        for (let i = 0; i < 4; i++)
            this.expressionBars[i].SetText("");

        // Enable the 4 colored player buttons
        for (let i = 0; i < 4; i++)
            this.playerButtons[i].SetEnabled();

        // Add the text to the mini cards
        this.minicard1.SetCard(this.gameState.GetCurrentCard());
        this.minicard2.SetCard(this.gameState.GetCurrentCard());

        // Reset expression bars
        this.expressionBars.forEach((exprBar) => {
            exprBar.SetText("");
            exprBar.SetTextColor("#FFFFFF");
        });


        // Reset the countdown timer so that it gets set to the default initial time for this game mode.
        this.countdownTimer.Reset();


        // Make the 'peek solution' button go away
        this.HidePeekSolutionButton();


        // Increment the total of cards played, and update the card counter text
        const totalCards = this.gameState.IncrementTotalCardsUsed();
        this.cardCounter.SetText(`${totalCards} / ${this.gameState.MAX_CARD_TOTAL}`)



    }



    DisableAllButtons() {
        for (let i = 0; i < 4; i++)
            this.cardButtons[i].SetDisabled();



        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        this.btnNewcard.SetDisabled();
    }

    HandleButtonClick_Player(clickedButtonIndex: number): void {
        this.gameState.SetCurrentPlayer(clickedButtonIndex);

        // The colored player button was clicked. Disable all others right away
        for (let i = 0; i < 4; i++) {
            if (clickedButtonIndex != i) {
                this.playerButtons[i].SetDisabled();

            }

            // Disable the clicked button, but still make it clearly visible
            this.playerButtons[clickedButtonIndex].SetDisabled(1.0);
        }

        // Enable the card buttons
        for (let i = 0; i < 4; i++)
            this.cardButtons[i].SetEnabled();

        // Redraw Card
        this.RedrawCard(clickedButtonIndex);

        // Prevent player from getting a new card
        this.btnNewcard.SetDisabled();

        // Draw the minicards in the correct place
        this.RedrawMiniCards(clickedButtonIndex);

        // Start counting time
        this.countdownTimer.StartCountdown();
    }

    /**
     * Redraws the current card by fliping its numbers to accomodate the current player view.
     * @param clickedButtonIndex The index associated with the player button that was just clicked. 
     * This parameter is important because this procedure needs to know how it should flip the card.
     */
    RedrawCard(clickedButtonIndex: number): void {
        if (clickedButtonIndex === 0 || clickedButtonIndex === 1) {
            this.btnNewcard.setFlipY(true);

            for (let i = 0; i < 4; i++)
                this.cardButtons[i].FlipY(true);

        } else {
            this.btnNewcard.setFlipY(false);


            for (let i = 0; i < 4; i++)
                this.cardButtons[i].FlipY(false);


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
            this.minicard1.SetPosition(384, this.scale.height - 128);
            this.minicard1.FlipForBottom();

            this.minicard2.SetPosition(this.scale.width - 384, this.scale.height - 128);
            this.minicard2.FlipForBottom();

        } else {
            // Bottom player is  playing.
            // Put minicards on the top 
            this.minicard1.SetPosition(384, 128);
            this.minicard1.FlipForTop();

            this.minicard2.SetPosition(this.scale.width - 384, 128);
            this.minicard2.FlipForTop();
        }
    }

    HandleButtonClick_Number(clickedButtonIndex: number): void {

        const pickedNumber = this.cardButtons[clickedButtonIndex].GetText();

        if (this.gameState.GetPlayerState() === PlayerState.PickingOperand1) {

            this.cardButtons[clickedButtonIndex].SetDisabled();

            // Mark it as used, so that it doesnt get enabled again.
            this.usedButtons[clickedButtonIndex] = true;

            // Also enable the operation buttons
            this.EnableOperationButtons();

            // Update current operation
            this.gameState.PickOperand1(pickedNumber, clickedButtonIndex);

            // Update the expression bars
            this.expressionBars.forEach((exprBar: BetterButton) => {
                exprBar.SetText(pickedNumber)
            });



        } else if (this.gameState.GetPlayerState() === PlayerState.PickingOperand2) {

            // Get the newly calculated expression
            const expression = this.gameState.PickOperand2(pickedNumber, clickedButtonIndex);

            this.cardButtons[clickedButtonIndex].NumberButtonSetText(expression);

            // Update the expression bars
            this.expressionBars.forEach((exprBar: BetterButton) => {
                exprBar.SetText(expression)
            });

            /*
                We can also check if this is the last available/enabled button.
                If it is, then it means we now must check if the solution is correct
            */
            let usedCount = 0;
            for (let i = 0; i < 4; i++)
                if (this.usedButtons[i] === true)
                    usedCount++;


            if (usedCount === 3) {
                const won: boolean = this.gameState.CheckSolution(expression);

                if (won) {
                    this.gameState.IncrTotalCorrect();
                    this.ShowPlayerWon(expression);
                }

                else {

                    this.gameState.IncrTotalWrong();
                    this.ShowPlayerLost(expression);
                    this.ShowPeekSolutionButton();

                }

                // Disable all numbers and operations
                this.DisableNumberButtons();
                this.DisableOperationButtons()
                this.btnNewcard.SetEnabled(); // Players have to pick a new cards

                // Stop time counter
                this.countdownTimer.StopCountdown();

                // Check if the total of cards was reached
                if (this.gameState.IsMaxCardCountReached())
                    this.ShowEndgamePanel();

            }

            this.gameState.ResetOperationState()
        }


    }

    HandleButtonClick_Operation(operator: string) {

        const mostRecentExpression: string = this.gameState.PickOperator(operator);

        // Enable card buttons
        this.EnableNumberButtons();

        // Disable operation buttons
        this.DisableOperationButtons();

        // Update the expression bars
        this.expressionBars.forEach((exprBar: BetterButton) => {
            exprBar.SetText(mostRecentExpression);
        });

    }


    /* ============================= Instructions Panel ========================= */

    Setup() {

        // Show the rules / instructions 
        this.imgRules = this.add.image(this.scale.width / 2, this.scale.height / 2, 'textImage_rules')
        this.imgRules.setScale(1.5);

        this.input.on('pointerup', () => {

            this.input.removeListener('pointerup');
            // When the player clicks the screen, then the instructions fade out.
            this.tweens.add(
                {
                    targets: this.imgRules,
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

        this.groupDifficultyPanel = this.add.group();

        // The label
        this.imgPickADiff = this.add.image(this.scale.width / 2, 200, 'textImage_pickDiff');
        this.imgPickADiff.setAlpha(0);
        this.groupDifficultyPanel.add(this.imgPickADiff);


        // Setup the diff buttons
        this.difficultyButtons = [
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 192, 1, 1, "", {}, 'btn_easy'),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 1, 1, "", {}, 'btn_medium'),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 192, 1, 1, "", {}, 'btn_hard'),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 384, 1, 1, "", {}, 'btn_allDifficulties'),
        ];

        for (let i = 0; i < 4; i++) {
            this.difficultyButtons[i].on('pointerup', () => this.events.emit('DifficultyButtonClick', i));
            this.difficultyButtons[i].setAlpha(0);
            this.groupDifficultyPanel.add(this.difficultyButtons[i]);
        }

        // Make everyting appear
        this.tweens.add({
            targets: this.groupDifficultyPanel.getChildren().map(function (c) { return c }),
            alpha: 1,
            duration: 1000,
            delay: 500,
        });
    }


    HandleDifficultyButtonClick(clickedButtonIndex: number) {
        // Hide the difficulty panel
        this.groupDifficultyPanel.setVisible(false);

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

        this.gameState = new MultiplayerGame(diff);


        // Setup the GUI's initial state
        this.Setup_GUI();
    }


    Setup_GUI() {


        /* ======================= Setting up the static elements (static images, static labels, etc...) =============== */
        this.groupCardGroup = this.add.group();

        // Setup the game card group
        this.imgCardBackground = this.add.image(this.scale.width / 2, this.scale.height / 2 + 60, 'cardBG');
        this.imgCardBackground.setScale(1.1);

        // Card Counter
        this.cardCounter = new BetterButton(this, this.scale.width / 2 + 256, 70, 0.5, 0.5, `0 / ${this.gameState.MAX_CARD_TOTAL}`,
            { fontFamily: 'Vertiky', align: 'center', fontSize: 38, color: "white", fontStye: "bold" }, 'cardCounterBG');
        this.cardCounter.SetDisabled(1);

        // Setup a button for each number in the card (4 buttons)
        this.usedButtons = new Array<boolean>();
        this.cardButtons = [
            new BetterButton(this, this.scale.width / 2 - 204, this.imgCardBackground.y,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.imgCardBackground.y - 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 204, this.imgCardBackground.y,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.imgCardBackground.y + 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fill: "#FFFFFF" }, "btn_numberBG")

        ]

        for (let i = 0; i < this.cardButtons.length; i++) {
            // Each button starts disabled
            this.cardButtons[i].SetDisabled();
            this.cardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i));

            this.usedButtons[i] = false;

            // Add each one to the grouo
            this.groupCardGroup.add(this.cardButtons[i]);
        }

        // 'New Card' button
        this.btnNewcard = new BetterButton(this, this.scale.width / 2, this.imgCardBackground.y, 0.6, 0.6, "", { fontSize: 32 }, "btn_playCard");
        this.btnNewcard.on("pointerup", () => this.NewCard());
        this.groupCardGroup.add(this.btnNewcard);

        /* =========================== Setting up the other buttons ============================= */

        // Setup the 4 coloured player buttons
        this.playerButtons = [
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
            this.playerButtons[i].SetDisabled();
            this.playerButtons[i].on('pointerup', () => this.events.emit('PlayerButtonClick', i));
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
        this.expressionBars = [
            new BetterButton(this, this.scale.width / 2 - 420, this.imgCardBackground.y, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar').SetAngle(-90),
            new BetterButton(this, this.scale.width / 2, this.imgCardBackground.y - 416, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar'),
            new BetterButton(this, this.scale.width / 2 + 420, this.imgCardBackground.y, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar').SetAngle(90),
            new BetterButton(this, this.scale.width / 2, this.imgCardBackground.y + 416, 0.9, 0.7, "", { fontFamily: 'Bubblegum', fontSize: 48, color: "#FFFFFF" }, 'inputBar').SetAngle(180)
        ];

        // And make them all un-interactible
        this.expressionBars.forEach((b) => { b.SetDisabled(1.0) })




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
        switch (this.gameState.difficulty) {
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
        this.minicard1 = new Minicard(this, 384, 128, '    ');
        this.minicard2 = new Minicard(this, this.scale.width - 384, 128, '    ');


       


        /* =============== Setup the 'Peek Solution' Button ================ */
        this.btnPeekSolution = new BetterButton(this, this.scale.width / 2 + 320, - 40, 0.8, 0.8, "", {}, 'btn_peekImage');
        this.btnPeekSolution.SetDisabled(0);
        this.btnPeekSolution.on('pointerup', () => this.events.emit('PeekSolutionButtonClick'));
        this.SetupCountdownTimer();
    }


    EnableNumberButtons(): void {
        for (let i = 0; i < 4; i++) {
            if (this.usedButtons[i] === false)
                this.cardButtons[i].SetEnabled();
        }
    }

    DisableNumberButtons(): void {
        this.cardButtons.forEach((button: BetterButton) => {
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

        this.expressionBars.forEach((exprBar: BetterButton) => {
            exprBar.SetText(expression + ` = ${24}`);
            exprBar.SetTextColor("#00ff1a");
        });

        this.playerButtons[this.gameState.GetCurrentPlayer()]
            .SetText(this.gameState.GetCurrentPlayerScore().toString());
    }

    ShowPlayerLost(expression: string): void {
        this.expressionBars.forEach((exprBar: BetterButton) => {
            exprBar.SetText(expression + ` = ${ValueOfExpression(expression)}`);
            exprBar.SetTextColor("#ff2600");
        });

        this.playerButtons[this.gameState.GetCurrentPlayer()]
            .SetText(this.gameState.GetCurrentPlayerScore().toString());
    }

    /**
     * Activated when the countdown timer rings (reaches zero).
     * Activates only once each round.
     */
    NoTimeLeft() {
        this.DisableNumberButtons();
        this.DisableOperationButtons();

        this.expressionBars.forEach((exprBar) => {
            exprBar.SetTextColor("#ff2600");
        });

        this.gameState.IncrTotalWrong();
        this.playerButtons[this.gameState.GetCurrentPlayer()].SetText(this.gameState.GetCurrentPlayerScore().toString());

        this.btnNewcard.SetEnabled();

        // Also let the player see a possible solution
        this.ShowPeekSolutionButton();

        // Check if the total of cards was reached
        if (this.gameState.IsMaxCardCountReached()) {
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
        this.btnPeekSolution.SetEnabled(0);


        this.tweens.add(
            {
                targets: this.btnPeekSolution,
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
        const solution: string = Solutions.GetSolution(this.gameState.GetCurrentCard());


        // Show the solution in all expression bars
        this.expressionBars.forEach((exprBar) => {
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
        this.btnPeekSolution.SetDisabled(1);
        this.tweens.add(
            {
                targets: this.btnPeekSolution,
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
        this.expressionBars.forEach((exprBar) => exprBar.SetDisabled(0));
        this.btnPeekSolution.SetDisabled(0);
        this.btnPeekSolution.setVisible(false);
        this.playerButtons.forEach((pBtn) => pBtn.SetDisabled());
        this.minicard1.SetVisible(false)
        this.minicard2.SetVisible(false)
        this.btnNewcard.SetDisabled();


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
        if (this.gameState.IsGameTied()) {
            this.ShowEndgamePanelTieMessage();
        }
        else {
            this.ShowEndgamePanelWinningMessage();
        }


        this.MoveMenuPlayAgainBtns();
        


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

        const winningPlayersIndexes: Array<number> = this.gameState.GetWinningPlayersIndexes();
        const winningScore: number = this.gameState.GetWinningScore();

        let congratsText: BetterText;
        if (winningPlayersIndexes.length > 1) {
            // More than one winner
            congratsText = new BetterText(this, this.scale.width / 2, this.scale.height / 2 + 54,
                `Parabéns               \n\n\nObtiveram um total de ${winningScore} pontos!`, 
                            { fontFamily: 'Vertiky', align: 'center', fontSize: 54, color: "#4e2400" });
        }
        else {
            // Only one winner
            congratsText = new BetterText(this, this.scale.width / 2, this.scale.height / 2 + 54,
                `Parabéns               \n\n\nObtiveste um total de ${winningScore} pontos!`, 
                            { fontFamily: 'Vertiky', align: 'center', fontSize: 54, color: "#4e2400" });
        }


        congratsText.setAlpha(0);
        this.tweens.add(
            {
                targets: [congratsText],
                alpha: 1,
                duration: 500,
                ease: 'Power1',
            }
        )

        // Move the buttons, of the players that won, to the panel 
        for (let i = 0; i < winningPlayersIndexes.length; i++) {
            const associatedButton: BetterButton = this.playerButtons[winningPlayersIndexes[i]];
            associatedButton.SetText("");
            associatedButton.setDepth(1);

            this.tweens.add({
                    targets: associatedButton,
                    alpha: 1,
                    x: this.scale.width / 2 + 96 + i * 64,
                    y: this.scale.height / 2 - 25,
                    scale: 0.6,
                    duration: 500,
                    ease: 'Power1',
                }
            )
        }


    }


    private MoveMenuPlayAgainBtns (): void 
    {
        this.btnGotoMenu.setDepth(1);
        this.btnGotoMenu.SetNewDefaultScale(1)
        this.btnPlayAgain.setDepth(1);
        this.btnPlayAgain.SetEnabled(0);

        this.tweens.add(
            {
                targets: this.btnGotoMenu,
                x: this.scale.width / 2 - 128,
                y: this.scale.height / 2 + 280,
                scale: 1,
                duration: 500,
                ease: 'Power1'
            }
        );

        this.tweens.add(
            {
                targets: this.btnPlayAgain,
                x: this.scale.width / 2 + 128,
                y: this.scale.height / 2 + 280,
                alpha: 1,
                duration: 500,
                ease: 'Power1'
            }
        );
    }

    SetupCountdownTimer () : void 
    {
         // Setup the countdown timer
         this.add.image(256 - 32, this.scale.height / 2, "clockBG1");
         this.countdownTimer.setVisible(true);
         this.countdownTimer.setDepth(1)
    }
}
