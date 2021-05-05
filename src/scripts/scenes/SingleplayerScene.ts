import Phaser from 'phaser'

import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);


import { OperationToString } from '../game/Operations'
import { BetterText } from '../better/BetterText'
import { BetterButton } from '../better/BetterButton'
import { Solutions } from '../game/Solutions'
import { CountdownTimer } from '../game/CountdownTimer'
import { SoloGame } from '../game/SoloGame';


export class SingleplayerScene extends Phaser.Scene {

    private isInstanced: boolean = false;

    private m_Data; // The data object that comes from the main menu
    private m_GameState: SoloGame;
    private countdownTimer: CountdownTimer;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label 
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textExpression!: BetterText; // Displays on the top bar the whole arithmetic expression made by the player
    private textSolution!: BetterText; // debug only

    // Buttons
    private m_BtnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private m_BtnReset!: BetterButton;           // Resets player input. Lets him try again the current card.
    private m_BtnUndo!: BetterButton;           // Lets the user delete the last inserted character.

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
        super("SoloGame");
    }

    preload() {
        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Insert the title image
        const titleImg = this.add.sprite(256, 96, 'smallTitle');
        titleImg.setScale(1, 1);

        // Add card background image
        const cardBG = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'cardBG');

        // Add the corect/incorrect label backgrounds
        const correctBG = this.add.sprite(this.scale.width / 2 + 680, 128, 'correctCounter')
        const wrongBG = this.add.sprite(this.scale.width / 2 + 680, 288, 'wrongCounter')

        // Add the player input bar ::: TODO: We should probably just delete this? (Because we aren't gonna use it?)
        const inputBG = this.add.sprite(this.scale.width / 2, 128, 'inputBar');

        // We might as well, for now, use the input bar as a place for player messages
        this.textExpression = new BetterText(this, this.scale.width / 2, 128, "",
            { fontSize: 48, color: "#ffffff", fontStyle: "bold", align: "center" });
        this.textExpression.setOrigin(0.5, 0.5);

        // Setup labels 
        this.Setup_Labels();

        // Setup ALL the buttons
        this.Setup_Buttons();

        // Add the timer background
        this.add.sprite(this.scale.width / 2 - 640, this.scale.height / 2 - 64, 'clockBG2');
        // Setup the timer with a callback function that disables all buttons once the timer runs out.
        this.countdownTimer =
            new CountdownTimer(this, 120, this.DisableAllButtons.bind(this), 320, this.scale.height / 2 + 20, 64);

        this.textSolution =
            new BetterText(this, 32, 256, "", { fontSize: 32 });
    }

    init(data) {

        this.m_Data = data;
        this.m_GameState = new SoloGame(this.m_Data.difficulty);

        /**
         * Register event handlers/listeners onyl if the scene hasn't been started before.
         */
        if (!this.isInstanced) {

            this.events.on('NumberButtonClick', this.HandleButtonClick_Number, this);
            this.events.on('OperationButtonClick', this.HandleButtonClick_Operation, this);

            this.events.on('ResetButtonClick', this.HandleButtonClick_Reset, this);
            this.events.on('UndoButtonClick', this.HandleButtonClick_Undo, this);


            // This flag is important. Prevents duplication of event listeners!!
            this.isInstanced = true;

        }
    }



    Setup_Labels() {


        this.textTotalCorrect = new BetterText(this, this.scale.width / 2 + 740, 128, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalCorrect.setOrigin(0.5, 0.5);
        this.textTotalWrong = new BetterText(this, this.scale.width / 2 + 740, 288, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalWrong.setOrigin(0.5, 0.5);

    }

    Setup_Buttons() {


        // Setup a button for each number in the card (4 buttons)
        this.m_CardButtons = [
            new BetterButton(this, this.scale.width / 2 - 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

        ]

        for (let i = 0; i < this.m_CardButtons.length; i++) {
            // Each button starts disabled
            this.m_CardButtons[i].SetDisabled();
            this.m_CardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, this.m_GameState.GetNumbers()[i]));
        }

        // This button lets the user reset his attempt at the current card.
        this.m_BtnReset = new BetterButton(this, this.scale.width / 2 - 196, this.scale.height - 96, 1, 1, "", { fontSize: 64 }, "btn_reset");
        this.m_BtnReset.on("pointerup", () => this.events.emit('ResetButtonClick'));
        this.m_BtnReset.SetDisabled();

        // 'Backspace' button
        this.m_BtnUndo = new BetterButton(this, this.scale.width / 2 + 196, this.scale.height - 96, 1, 1, "", { fontSize: 32 }, "btn_undo");
        this.m_BtnUndo.on("pointerup", () => this.events.emit('UndoButtonClick'));
        this.m_BtnUndo.SetDisabled();

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
        this.btnGotoMenu = new BetterButton(this, 96, this.scale.height - 96, 0.5, 0.5, "", { fontSize: 64 }, 'btn_gotoMenu');
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

        // Disable 'Reset' button
        this.m_BtnReset.SetDisabled();

        // Disable 'Backspace' button
        this.m_BtnUndo.SetDisabled();

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


            // We can disable the 'Reset' and 'Backspace' buttons
            this.m_BtnReset.SetDisabled();
            this.m_BtnUndo.SetDisabled();

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

        this.m_BtnReset.SetDisabled();
        this.m_BtnUndo.SetDisabled();

        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        this.m_BtnNewCard.SetDisabled();
    }

    // Reset the calculations to the original state (happens when the 'Reset' button is clicked)
    HandleButtonClick_Reset(): void {

        this.m_GameState.ResetState();


        // Then reset the number buttons
        let currentCard = this.m_GameState.GetCurrentCard();
        for (let i = 0; i < 4; i++) {
            this.m_CardButtons[i].SetText(currentCard[i]);
            this.m_CardButtons[i].SetEnabled();
        }

        // Disable the 'Reset' and 'Backspace' button
        this.m_BtnUndo.SetDisabled();
        this.m_BtnReset.SetDisabled();
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

            // Enable 'Backspace' button
            this.m_BtnUndo.SetEnabled();

            // Enable 'Reset' button
            this.m_BtnReset.SetEnabled();
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

    /**
     * Undo the last performed operation.
     * 
     * Currently, we're using a stack made of Operation objects.
     */
    HandleButtonClick_Undo(): void {


        if (this.m_GameState.IsPickingOperand1()) {
            /* 
                The user has not yet picked the first operand.
                The fact that he pressed 'Undo' means that he wants to go back to the previous operation. 
                We pop the top-most operation on the stack to revert to those values.
            */
            let lastOperation = this.m_GameState.RevertToLastOperation();
            if (lastOperation === undefined)
                return;

            // We have to change the buttons to the previous numbers and enable them
            this.m_CardButtons[lastOperation.operand1BtnIndex].SetText(OperationToString(lastOperation.operand1));
            this.m_CardButtons[lastOperation.operand1BtnIndex].SetEnabled();

            this.m_CardButtons[lastOperation.operand2BtnIndex].SetText(OperationToString(lastOperation.operand2));
            this.m_CardButtons[lastOperation.operand2BtnIndex].SetEnabled();

            // Update the text expression bar
            console.log(this.m_GameState.GetCurrentOperation())
            this.textExpression.setText(this.m_GameState.GetCurrentOperation().ToString());
        }
        else {
            /*
                Player already picked the first operand. 
                If he pressed 'Undo', that means he wants to re-chose the first operand.
                That means reseting the operation state.
            */

            // Re-enable the number buttons that were used
            const currentOperation = this.m_GameState.GetCurrentOperation();
            this.m_CardButtons[currentOperation.operand1BtnIndex].SetEnabled();

            // Reset the operation state
            this.m_GameState.ResetOperationState();

            this.textExpression.setText("");
        }

        // Check if the operation stack is now empty. If it is, then disable some buttons.
        if (this.m_GameState.IsOperationStackEmpty()) {
            this.m_BtnReset.SetDisabled();
            this.m_BtnUndo.SetDisabled();

            this.btnOperationAdd.SetDisabled();
            this.btnOperationSubtract.SetDisabled();
            this.btnOperationMultiply.SetDisabled();
            this.btnOperationDivide.SetDisabled();

            this.textExpression.setText("");
        }



    }

}
