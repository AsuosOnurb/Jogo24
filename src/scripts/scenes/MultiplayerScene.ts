import Phaser from 'phaser'



import { BetterText } from '../better/BetterText'
import { BetterButton } from '../better/BetterButton'
import { Solutions } from '../game/Solutions'
import { MultiplayerGame } from '../game/MultiplayerGame';
import { Difficulty } from '../game/CardGenerator';


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


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    /*
        In this game mode, the card will have to flip vertically to accomodate its reading from different angles.
        We create a group that contains all its elements (the card background, the numbers, the new card button).
        When the card 'flips', its actually the group that flips.
    */
    private m_Group_CardGroup: Phaser.GameObjects.Group;
    private m_Image_CardBG: Phaser.GameObjects.Image;
    private m_CardButtons: Array<BetterButton>;
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


    constructor() {
        super("MultiplayerGame");
    }

    preload() {



    }

    init() {
        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, this.scale.width / 2, 96, 0.3, 0.3, "", { fontSize: 64 }, 'btn_gotoMenu');
        this.btnGotoMenu.setScale(0.6, 0.6);
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

            // This flag is important. Prevents duplication of event listeners!!
            this.isInstanced = true;

        }

        this.Setup();
    }




    NewCard(): void {

        let generatedCard = this.m_GameState.NewCard();


        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < generatedCard.length; i++) {

            // Set the text of the number button
            this.m_CardButtons[i].SetText(generatedCard[i]);
            this.m_CardButtons[i].SetDisabled(1.0);
        }


        // Disable Operation buttons
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`Solução: ${Solutions.getSolution(generatedCard)}`);

        // Clear the text from expression bars
        for (let i = 0; i < 4; i++)
            this.m_Array_ExpressionBars[i].SetText("");

        // Enable the 4 colored player buttons
        for (let i = 0; i < 4; i++)
            this.m_Array_PlayerButtons[i].SetEnabled();



    }

    CheckSolution(): void {
        // Check if we have 3 disabled/picked numbers.
        let disabledCardCount = 0;
        for (let i = 0; i < 4; i++) {
            if (!this.m_CardButtons[i].IsEnabled())
                disabledCardCount += 1;
        }

        /*
            If 3 numbers are disabled, then the player is at the last operation.
            In that case, then we have to check if the player won or not.
        */
        if (disabledCardCount === 3) {

            if (this.m_GameState.IsCardWon()) {

                // Add one point to the current player
                const newPlayerScore = this.m_GameState.AwardCurrentPlayer();
                this.m_Array_PlayerButtons[this.m_GameState.GetCurrentPlayer()].SetText(newPlayerScore.toString());

                // Make the button "APPEAR" enabled
                this.m_Array_PlayerButtons[this.m_GameState.GetCurrentPlayer()].setAlpha(1);


            }
            else {
                //Subtract one point from the current player score
                const newPlayerScore = this.m_GameState.PunishCurrentPlayer();
                this.m_Array_PlayerButtons[this.m_GameState.GetCurrentPlayer()].SetText(newPlayerScore.toString());
            }

            // Allow players to generate new cards
            this.m_Btn_NewCard.SetEnabled();




        }
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
            if (clickedButtonIndex != i)
                this.m_Array_PlayerButtons[i].SetDisabled();

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

    }

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

    HandleButtonClick_Number(clickedButtonIndex: number, operand): void {

        if (this.m_GameState.IsPickingOperand1()) {

            // this.m_GameState.GetCurrentOperation().SetOperand1(operand, clickedButtonIndex);
            this.m_GameState.NextPlayerState();

            // Disable the number button
            this.m_CardButtons[clickedButtonIndex].SetDisabled();

            // We have to enable the operation buttons 
            this.btnOperationAdd.SetEnabled();
            this.btnOperationSubtract.SetEnabled();
            this.btnOperationMultiply.SetEnabled();
            this.btnOperationDivide.SetEnabled();

        }
        else {

          

            

          


            // Display the operation to all the bars
            for (let i = 0; i < 4; i++)
                this.m_Array_ExpressionBars[i].SetText(this.m_GameState.GetCurrentOperation().ToString());

            // Here is where we check for the solution
            // If 3 cards are picked/disable and the the result is 24, then the player won.
            this.CheckSolution();


            // The operation was completed. Now the player has to pick a new first operand again.
            this.m_GameState.ResetOperationState();

            // Operation buttons can be disabled
            this.btnOperationAdd.SetDisabled();
            this.btnOperationSubtract.SetDisabled();
            this.btnOperationMultiply.SetDisabled();
            this.btnOperationDivide.SetDisabled();


        }

    }

    HandleButtonClick_Operation(operation: string) {
        // Update the current operation
        this.m_GameState.GetCurrentOperation().SetOperator(operation);

        // Player chose the operation. Now he has to pick the second operand
        this.m_GameState.SetPickingOperand2();
    }


    /* ============================= Instructions Panel ========================= */

    Setup() {

        // Show the rules / instructions 
        this.m_ImageText_Rules = this.add.image(this.scale.width / 2, this.scale.height / 2, 'textImage_rules')
        this.m_ImageText_Rules

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
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 192, 1, 1, "", {}, 'btn_easy'),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 1, 1, "", {}, 'btn_medium'),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 192, 1, 1, "", {}, 'btn_hard'),
            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 384, 1, 1, "", {}, 'btn_allDifficulties'),
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
        this.m_Image_CardBG = this.add.image(this.scale.width / 2, this.scale.height / 2 + 80, 'cardBG');
        //this.m_Group_CardGroup.add(this.m_Image_CardBG);


        // Setup a button for each number in the card (4 buttons)
        this.m_CardButtons = [
            new BetterButton(this, this.scale.width / 2 - 196, this.m_Image_CardBG.y,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y - 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 196, this.m_Image_CardBG.y,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y + 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG")

        ]

        for (let i = 0; i < this.m_CardButtons.length; i++) {
            // Each button starts disabled
            this.m_CardButtons[i].SetDisabled(1.0);
            this.m_CardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, this.m_GameState.GetNumbers()[i]));

            // Add each one to the grouo
            this.m_Group_CardGroup.add(this.m_CardButtons[i]);
        }

        // 'New Card' button
        this.m_Btn_NewCard = new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y, 0.3, 0.3, "", { fontSize: 32 }, "btn_playCard");
        this.m_Btn_NewCard.setScale(0.6, 0.6);
        this.m_Btn_NewCard.on("pointerup", () => this.NewCard());
        this.m_Group_CardGroup.add(this.m_Btn_NewCard);

        /* =========================== Setting up the other buttons ============================= */

        // Setup the 4 coloured player buttons
        this.m_Array_PlayerButtons = [
            new BetterButton(this, 128, 128,
                1, 1, "", { fontSize: 128 }, "btn_player1"),

            new BetterButton(this, this.scale.width - 128, 128,
                1, 1, "", { fontSize: 128 }, "btn_player2"),

            new BetterButton(this, 128, this.scale.height - 128,
                1, 1, "", { fontSize: 128 }, "btn_player3"),

            new BetterButton(this, this.scale.width - 128, this.scale.height - 128,
                1, 1, "", { fontSize: 128 }, "btn_player4")
        ];

        for (let i = 0; i < 4; i++) {
            this.m_Array_PlayerButtons[i].SetDisabled();
            this.m_Array_PlayerButtons[i].on('pointerup', () => this.events.emit('PlayerButtonClick', i));
        }

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "addition"));
        this.btnOperationAdd.SetDisabled();

        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "subtraction"));
        this.btnOperationSubtract.SetDisabled();

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "multiplication"));
        this.btnOperationMultiply.SetDisabled();

        // Division operation button
        this.btnOperationDivide = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_division");
        this.btnOperationDivide.on("pointerup", () => this.events.emit('OperationButtonClick', "division"));
        this.btnOperationDivide.SetDisabled();


        /* ================== Setup the expression bars ==================== */
        this.m_Array_ExpressionBars = [
            new BetterButton(this, this.scale.width / 2 - 390, this.m_Image_CardBG.y, 0.9, 0.8, "", { fontSize: 48, color: "#ffffff" }, 'inputBar').SetAngle(-90),
            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y - 390, 0.9, 0.8, "", { fontSize: 48, color: "#ffffff" }, 'inputBar'),
            new BetterButton(this, this.scale.width / 2 + 390, this.m_Image_CardBG.y, 0.9, 0.8, "", { fontSize: 48, color: "#ffffff" }, 'inputBar').SetAngle(90),
            new BetterButton(this, this.scale.width / 2, this.m_Image_CardBG.y + 390, 0.9, 0.8, "", { fontSize: 48, color: "#ffffff" }, 'inputBar').SetAngle(180)
        ];

        // And make them all un-interactible
        this.m_Array_ExpressionBars.forEach((b) => { b.SetDisabled(1.0) })
        console.log(this.m_Array_ExpressionBars)


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
        switch (this.m_GameState.Difficulty) {
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
        this.imageDifficulty.setScale(0.8)
        this.tweens.add({
            targets: this.imageDifficulty,
            y: 96,
            repeat: 0,
            ease: 'Power1'
        });
    
    }





}
