import Phaser from 'phaser'



import { BetterText } from '../better/BetterText'
import { BetterButton } from '../better/BetterButton'
import { Solutions } from '../utils/Solutions'
import { CountdownTimer } from '../utils/CountdownTimer';
import { MultiplayerGame } from '../game/MultiplayerGame';


export class MultiplayerScene extends Phaser.Scene {

    private isInstanced: boolean = false;

    private m_GameState: MultiplayerGame;
    private countdownTimer: CountdownTimer;



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
    private m_Label_PickADifficulty: BetterText;
    private m_DifficultyButtons: Array<BetterButton>;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label 
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textExpression!: BetterText; // Displays on the top bar the whole arithmetic expression made by the player
    private textSolution!: BetterText; // debug only

    // Buttons
    private m_PlayerButtons: Array<BetterButton>; // The array that holds the 4 coloured player buttons
    private m_BtnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers

    private btnOperationAdd!: BetterButton;         // Performs Addition
    private btnOperationSubtract!: BetterButton;    // Performs Subtraction
    private btnOperationMultiply!: BetterButton;    // Performs Multiplication
    private btnOperationDivide!: BetterButton;      // Perfroms Division

    private btnGotoMenu!: BetterButton;             // Redirects player to the main menu

    /*
     Card Buttons.
     These buttons are changed everytime we generate a new card. 
     Each button is associated with one of the 4 numbers.
    */
    private m_CardButtons: Array<BetterButton>;

    constructor() {
        super("MultiplayerGame");
    }

    preload() {



    }

    init() {
        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Add card background image
        // const cardBG = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'cardBG');

        // Add the player input bar ::: TODO: We should probably just delete this? (Because we aren't gonna use it?)
        // const inputBG = this.add.sprite(this.scale.width / 2, 128, 'inputBar');

        // We might as well, for now, use the input bar as a place for player messages
        // this.textExpression = new BetterText(this, this.scale.width / 2, 128, "",
        // { fontSize: 48, color: "#ffffff", fontStyle: "bold", align: "center" });
        // this.textExpression.setOrigin(0.5, 0.5);


        // Setup ALL the buttons
        // this.Setup_Buttons();



        // this.textSolution =
        // new BetterText(this, 32, 256, "", { fontSize: 32 });

        // Setup the "Choose difficulty panel"

        this.m_GameState = new MultiplayerGame();

        /**
         * Register event handlers/listeners only if the scene hasn't been started before.
         */
        if (!this.isInstanced) {

            this.events.on('DifficultyButtonClick', this.DifficultyButtonClick, this);
            this.events.on('PlayerButtonClick', this.HandleButtonClick_Player, this);
            this.events.on('NumberButtonClick', this.HandleButtonClick_Number, this);
            this.events.on('OperationButtonClick', this.HandleButtonClick_Operation, this);

            // This flag is important. Prevents duplication of event listeners!!
            this.isInstanced = true;

        }

        this.Show_StartPanel    ();
        //this.Setup_DifficultyPanel();
        // this.Show_DifficultyPanel();
    }



    Setup_Buttons() {

        // Setup the 4 coloured player buttons
        this.m_PlayerButtons = [
            new BetterButton(this, 128, 128,
                1, 1, "", {}, "btn_player1"),

            new BetterButton(this, this.scale.width - 128, 128,
                1, 1, "", {}, "btn_player2"),

            new BetterButton(this, 128, this.scale.height - 128,
                1, 1, "", {}, "btn_player3"),

            new BetterButton(this, this.scale.width - 128, this.scale.height - 128,
                1, 1, "", {}, "btn_player4")
        ];

        for (let i = 0; i < 4; i++) {
            this.m_PlayerButtons[i].IsEnabled();
            this.m_PlayerButtons[i].on('pointerup', () => this.events.emit('PlayerButtonClick', i));
        }

        // Setup a button for each number in the card (4 buttons)
        this.m_CardButtons = [
            new BetterButton(this, this.scale.width / 2 - 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG")

        ]

        for (let i = 0; i < this.m_CardButtons.length; i++) {
            // Each button starts disabled
            this.m_CardButtons[i].SetDisabled();
            this.m_CardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, this.m_GameState.GetNumbers()[i]));
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

        // 'New Card' button
        this.m_BtnNewCard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 0.3, 0.3, "", { fontSize: 32 }, "btn_playCard");
        this.m_BtnNewCard.setScale(0.6, 0.6);
        this.m_BtnNewCard.on("pointerup", () => this.NewCard());

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, this.scale.width - 384, 128, 0.5, 0.5, "", { fontSize: 64 }, 'btn_gotoMenu');
        this.btnGotoMenu.setScale(0.8, 0.8);
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

    }

    NewCard(): void {

        let generatedCard = this.m_GameState.NewCard();


        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < generatedCard.length; i++) {

            // Set the text of the number button
            this.m_CardButtons[i].SetText(generatedCard[i]);

            // Enable the button
            this.m_CardButtons[i].SetEnabled();
        }


        // Disable Operation buttons
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(generatedCard)}`);

        // Clear the expression text
        this.textExpression.setText("");

        // Start the timer
        this.countdownTimer.StartCountdown();
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
                // Update game state and 'Total correct' text
                let totalCorrect = this.m_GameState.IncrTotalCorrect();
                this.textTotalCorrect.setText(totalCorrect.toString());
            }
            else {
                // Update game state and 'Total incorrect' text
                let totalWrong = this.m_GameState.IncrTotalWrong();
                this.textTotalWrong.setText(totalWrong.toString());
            }



            /*
             TODO: Maybe also pause the timer here?
             At this stage the player either failed or won the card answer. Since he has to pick a new card, maybe we should not
             be counting time.
            */
        }
    }

    DisableAllButtons() {
        for (let i = 0; i < 4; i++)
            this.m_CardButtons[i].SetDisabled();



        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        this.m_BtnNewCard.SetDisabled();
    }

    HandleButtonClick_Player(clickedButtonIndex: number): void {
        this.m_GameState.SetCurrentPlayer(clickedButtonIndex);

        // The colored player button was clicked. Disable it and all other right away
        for (let i = 0; i < 4; i++) {
            this.m_PlayerButtons[i].SetDisabled();
        }
    }



    HandleButtonClick_Number(clickedButtonIndex: number, operand): void {

        if (this.m_GameState.IsPickingOperand1()) {
            this.m_GameState.GetCurrentOperation().SetOperand1(operand, clickedButtonIndex);
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

            this.m_GameState.GetCurrentOperation().SetOperand2(operand, clickedButtonIndex);


            // Do the math on the current operation
            const operationResult = this.m_GameState.PerformCurrentOperation();

            // Display result as a fraction if the denominator is not 1
            if (operationResult.d != 1)
                this.m_CardButtons[clickedButtonIndex].SetText(operationResult.n.toString() + "/" + operationResult.d.toString());
            else
                this.m_CardButtons[clickedButtonIndex].SetText(operationResult.n.toString());


            // Display the operation to the screen
            this.textExpression.setText(this.m_GameState.GetCurrentOperation().ToString());

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

    Show_StartPanel() {
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

    Hide_InstructionsPanel() {
        this.m_ImageText_Rules.setVisible(false);
    }



    /* ================================ Difficulty Panel ======================= */

    Show_DifficultyPanel() {

        this.m_Group_SelectDifficultyPanel = this.add.group();

        // The label
        this.m_Label_PickADifficulty = new BetterText(this, this.scale.width / 2, this.scale.height / 2 - 384, "Escolhe o Nível", { fontSize: 64, color: "#ffffff" });
        this.m_Label_PickADifficulty.setAlpha(0);
        this.m_Group_SelectDifficultyPanel.add(this.m_Label_PickADifficulty);


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

    Hide_DifficultyPanel() {

        // this.m_Tween_HideDifficultyPanel.play();
        this.m_Group_SelectDifficultyPanel.setVisible(false);

    }


    DifficultyButtonClick(clickedButtonIndex: number) {
        this.Hide_DifficultyPanel();
        // The Difficulty was chosen. Time to start the game.
    }



}
