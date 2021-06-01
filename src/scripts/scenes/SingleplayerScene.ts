import Phaser, { Utils } from 'phaser'

import { BetterText } from '../better/BetterText'
import { BetterButton } from '../better/BetterButton'
import { Solutions } from '../game/Solutions'
import { CountdownTimer } from '../game/CountdownTimer'
import { PlayerState, SingleplayerGame } from '../game/SingleplayerGame'
import { ValueOfExpression } from '../game/Utils'
import { LoginData } from '../backend/LoginData'
import { Operation } from '../game/Operations'
import { timers } from 'jquery'
import { BackendConnection } from '../backend/BackendConnection'


export class SingleplayerScene extends Phaser.Scene {

    private isInstanced: boolean = false;

    private m_Data; // The data object that comes from the main menu
    private m_GameState: SingleplayerGame;
    private countdownTimer: CountdownTimer;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label 
    private textTotalCorrect!: BetterText; // Total correct counter label

    private mExpressionBar: BetterButton; // Displays on the top bar the whole arithmetic expression made by the player

    private textSolution!: BetterText; // debug only

    // Buttons
    private mBtn_NewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private m_BtnReset!: BetterButton;           // Resets player input. Lets him try again the current card.
    private m_BtnUndo!: BetterButton;           // Lets the user delete the last inserted character.

    private btnOperationAdd!: BetterButton;         // Performs Addition
    private btnOperationSubtract!: BetterButton;    // Performs Subtraction
    private btnOperationMultiply!: BetterButton;    // Performs Multiplication
    private btnOperationDivide!: BetterButton;      // Perfroms Division

    private btnGotoMenu!: BetterButton;             // Redirects player to the main menu

    // The final warning image that appears if the user is not logged in
    private mImgLoginWarning: Phaser.GameObjects.Image;
    private mTextLoginWarning: BetterText;




    /*
     Card Buttons.
     These buttons are changed everytime we generate a new card. 
     Each button is associated with one of the 4 numbers.
    */
    private m_CardButtons: Array<BetterButton>;
    private m_BtnUsed: Array<Boolean>;
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
        cardBG.setScale(1.15);

        // Add the corect/incorrect label backgrounds
        const correctBG = this.add.sprite(this.scale.width / 2 + 680, 128, 'correctCounter')
        const wrongBG = this.add.sprite(this.scale.width / 2 + 680, 288, 'wrongCounter')


        // Setup labels 
        this.Setup_Labels();

        // Setup ALL the buttons
        this.Setup_Buttons();

        // Add the timer background
        this.add.sprite(this.scale.width / 2 - 640, this.scale.height / 2 - 64, 'clockBG2');
        // Setup the timer with a callback function that disables all buttons once the timer runs out.
        this.countdownTimer =
            new CountdownTimer(this, 60, this.NoTimeLeft.bind(this), 320, this.scale.height / 2 + 20, 64, "");

        this.textSolution =
            new BetterText(this, 256, 256, "", { fontFamily: 'Vertiky', fontSize: 32 });

        // Add the player input bar :
        this.mExpressionBar = new BetterButton(this, this.scale.width / 2, 128 - 32, 1, 0.9, '', { fontFamily: 'Bubblegum', fontSize: 48, fill: '#FFFFFF' }, 'inputBar', 0);
        this.mExpressionBar.SetDisabled(1);


        // Login warning
        this.mImgLoginWarning = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "gameEndBGg");
        this.mImgLoginWarning.setScale(1.5)
        this.mImgLoginWarning.setAlpha(0);

        this.mTextLoginWarning = new BetterText(this, this.scale.width / 2, this.scale.height / 2 - 32,
            "\n\n Para que o teu nome figure nos TOPs \n tens de estar registado.\n\n\n\nRegista-te em www.hypatiamat.com",
            { fontFamily: 'Vertiky', align: 'center' , fontSize: 34 });
        this.mTextLoginWarning.setColor("#4e2400");
        this.mTextLoginWarning.setAlpha(0);

    }

    init(data) {

        this.m_Data = data;
        this.m_GameState = new SingleplayerGame(this.m_Data.difficulty);

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


        this.textTotalCorrect = new BetterText(this, this.scale.width / 2 + 740, 128, "0", { fontFamily: 'Vertiky', fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalCorrect.setOrigin(0.5, 0.5);
        this.textTotalWrong = new BetterText(this, this.scale.width / 2 + 740, 288, "0", { fontFamily: 'Vertiky', fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalWrong.setOrigin(0.5, 0.5);

    }

    Setup_Buttons() {

        // 'New Card' button
        this.mBtn_NewCard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 0.6, 0.6, "", {}, "btn_playCard");
        this.mBtn_NewCard.on("pointerup", () => this.NewCard());

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, 96, this.scale.height - 96, 0.7, 0.7, "", {}, 'btn_gotoMenu');
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

        // Setup a button for each number in the card (4 buttons)
        this.m_CardButtons = [
            new BetterButton(this, this.scale.width / 2 - 204, this.scale.height / 2,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 204, this.scale.height / 2,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

        ]

        this.m_BtnUsed = new Array<Boolean>();
        for (let i = 0; i < this.m_CardButtons.length; i++) {
            this.m_CardButtons[i].SetTextColor("#ffffff")

            // Each button starts disabled
            this.m_CardButtons[i].SetDisabled();
            this.m_CardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i));
            this.m_BtnUsed[i] = false;
        }

        // This button lets the user reset his attempt at the current card.
        this.m_BtnReset = new BetterButton(this, this.scale.width / 2 - 196, this.scale.height - 96, 0.8, 0.8, "", { fontSize: 64 }, "btn_reset");
        this.m_BtnReset.on("pointerup", () => this.events.emit('ResetButtonClick'));
        this.m_BtnReset.SetDisabled();

        // 'Backspace' button
        this.m_BtnUndo = new BetterButton(this, this.scale.width / 2 + 196, this.scale.height - 96, 0.8, 0.8, "", { fontSize: 32 }, "btn_undo");
        this.m_BtnUndo.on("pointerup", () => this.events.emit('UndoButtonClick'));
        this.m_BtnUndo.SetDisabled();

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "+"));

        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "-"));

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "x"));

        // Division operation button
        this.btnOperationDivide = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_division");
        this.btnOperationDivide.on("pointerup", () => this.events.emit('OperationButtonClick', "/"));

        // Operation buttons start disabled
        this.DisableOperationButtons();

    }

    NewCard(): void {

        let generatedCard = this.m_GameState.NewCard();

        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < generatedCard.length; i++) {

            // Set the text of the number button
            this.m_CardButtons[i].SetText(generatedCard[i]);

            // Enable the button
            this.m_CardButtons[i].SetEnabled();

            // Mark all number buttons as "un-used"
            this.m_BtnUsed[i] = false;

            // Reset number buttons font size
            this.m_CardButtons[i].SetFontSize(128);

        }

        // Disable 'Reset' button
        this.m_BtnReset.SetDisabled();

        // Disable 'Backspace' button
        this.m_BtnUndo.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(generatedCard)}`);

        // Clear the expression text
        this.mExpressionBar.SetText("");

        // Reset game state
        this.m_GameState.ResetOperationState();
        this.m_GameState.ResetOperationStack();
        this.m_GameState.SetCard(generatedCard);

        // Reset expression bar text color
        this.mExpressionBar.SetTextColor("#FFFFFF");


        // Start the timer
        this.countdownTimer.StartCountdown();
    }


    /**
     * Activated when the countdown timer rings (reaches zero).
     * Activates only once during the whole game.
     */
    NoTimeLeft() {
        for (let i = 0; i < 4; i++)
            this.m_CardButtons[i].SetDisabled();

        this.m_BtnReset.SetDisabled();
        this.m_BtnUndo.SetDisabled();

        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();


        this.mBtn_NewCard.SetDisabled();

        if (LoginData.IsLoggedIn()) {
            // Save player data
            this.SavePlayerData(false); // Register another loss
        } else {
            this.ShowPleaseLoginWarning();
        }
    }


    /**
        Callback that handles the click of a number button (one of the numbers on the card)
    */
    HandleButtonClick_Number(clickedButtonIndex: number): void {



        const pickedNumber = this.m_CardButtons[clickedButtonIndex].GetText();
        const state = this.m_GameState.GetCurrentPlayerState();

        // Enable reset btn
        this.m_BtnReset.SetEnabled();

        // Enable undo btn
        this.m_BtnUndo.SetEnabled();

        if (this.m_GameState.GetCurrentPlayerState() === PlayerState.PickingOperand1) {

            // this.m_CardButtons[clickedButtonIndex].SetDisabled();

            // Mark it as used, so that it doesnt get enabled again.
            this.m_BtnUsed[clickedButtonIndex] = true;

            // Also enable the operation buttons
            this.EnableOperationButtons();

            // Update current operation
            this.m_GameState.SetOperand1(pickedNumber, clickedButtonIndex);

            // Update the expression text
            this.mExpressionBar.SetText(pickedNumber);

            // Disable the number buttons
            this.DisableNumberButtons();

            this.m_GameState.NextState();


        } else if (state === PlayerState.PickingOperand2) {

            this.m_GameState.SetOperand2(pickedNumber, clickedButtonIndex);

            // Update the button text if the button we just clicked was the 2nd operand
            const expression = this.m_GameState.CompleteOperation();

            this.m_CardButtons[clickedButtonIndex].NumberButtonSetText(expression);

            // Set the text on the expression bar
            this.mExpressionBar.SetText(expression);

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

                }

                // Disable all numbers and operations
                this.DisableNumberButtons();
                this.DisableOperationButtons()
                this.m_BtnReset.SetDisabled();
                this.m_BtnUndo.SetDisabled();
            }

            // Push the operation 
            this.m_GameState.PushCurrentOperation();
            this.m_GameState.ResetOperationState()
        }

        console.log(`Current state: ${this.m_GameState.StateToString()}`);


    }

    HandleButtonClick_Operation(operator: string) {

        const mostRecentExpression: string = this.m_GameState.SetOperator(operator);
        this.m_GameState.NextState();

        // Enable card buttons
        this.EnableNumberButtons();

        // Disable operation buttons
        this.DisableOperationButtons();
        //this.mExpressionBar.SetText(`(${this.mExpressionBar.GetText()})${operator}`);
        this.mExpressionBar.SetText(mostRecentExpression);
    }

    /**
     * Undo the last performed operation.
     * 
     * Currently, we're using a stack made of Operation objects.
     */
    HandleButtonClick_Undo(): void {

        const currentPlayerState: PlayerState = this.m_GameState.GetCurrentPlayerState()
        if (currentPlayerState === PlayerState.PickingOperand1) {
            /* 
               The user has not yet picked the first operand.
               The fact that he pressed 'Undo' means that he wants to go back to the previous operation. 
               We pop the top-most operation on the stack to revert to those values.
           */

            console.log("Player is wants to undo the previous operation completely")
            let lastOperation = this.m_GameState.RevertToLastOperation();
            if (lastOperation === undefined) {
                console.log("No defined operation was pushed")
                return;


            }

            // We have to change the buttons to the previous numbers and enable them
            this.m_CardButtons[lastOperation.operand1BtnIndex].NumberButtonSetText(lastOperation.operand1);
            this.m_CardButtons[lastOperation.operand1BtnIndex].SetEnabled();
            this.m_BtnUsed[lastOperation.operand1BtnIndex] = false;

            this.m_CardButtons[lastOperation.operand2BtnIndex].NumberButtonSetText(lastOperation.operand2);
            this.m_CardButtons[lastOperation.operand2BtnIndex].SetEnabled();
            this.m_BtnUsed[lastOperation.operand2BtnIndex] = false;


            // Update the text expression bar
            this.mExpressionBar.SetText("");

        } else if (currentPlayerState === PlayerState.PickingOperator) {
            /*
                Player picked the first operand, and now he is supposed to be picking the operator.
                But he wants to go back, so he can re-select the first operand.

                This means we have to:
                1 - Re-enable the number buttons
                2 - Also mark the button of the number as being un-used
                2 - Disable the operator buttons
                3 - Erase the number/text from the expression bar (make it empty)
                4 - Set the current state to be PickingOperand1
            */

            // Enable number buttons
            let currentOperation: Operation = this.m_GameState.PeekCurrentOperation();
            console.log("Undoing the picking of the first operand:")
            console.log(currentOperation);
            this.m_BtnUsed[currentOperation.operand1BtnIndex] = false;

            this.EnableNumberButtons();

            // Disable operation buttons
            this.DisableOperationButtons()

            // Erase number from expression bar
            this.mExpressionBar.SetText("");

            // Set the new state to PickingOperand1
            this.m_GameState.SetPlayerState(PlayerState.PickingOperand1);
        }
        else if (currentPlayerState === PlayerState.PickingOperand2) {
            /*
                Player picked the operator, but now we wants to go back and select a different one.

                This means we have to:
                1 - Disable the number buttons
                2 - Enable the operator buttons
                3 - Change the expression bar text (remove the current operator)
                4 - Set the current player state as being PickingOperator
            */

            // Disable the numbers
            this.DisableNumberButtons()

            // Enable operators
            this.EnableOperationButtons();

            // Change the expression on the bar (remove the last character, which corresponds to the operator symbol)
            const currentText = this.mExpressionBar.GetText();
            const substring = currentText.substring(0, currentText.length - 1);
            console.log(`..${substring}..`)
            this.mExpressionBar.SetText(substring);

            // Change the current state
            this.m_GameState.SetPlayerState(PlayerState.PickingOperator);

            // Enable undo button
        }



        console.log(`Current state: ${this.m_GameState.StateToString()}`);

        // Disable the undo button if the stack is empty
        /*
        if (this.m_GameState.IsStackEmpty()) {
            this.m_BtnUndo.SetDisabled();
            this.m_BtnReset.SetDisabled();

        }*/


    }

    // Reset the calculations to the original state (happens when the 'Reset' button is clicked)
    HandleButtonClick_Reset(): void {
        // Reset game state
        this.m_GameState.ResetOperationState();

        this.DisableOperationButtons();

        this.EnableNumberButtons();
        this.ResetNumberButtons();

        // Clean expression bar
        this.mExpressionBar.SetText("");


    }


    ShowPlayerWon(expression: string): void {
        this.mExpressionBar.SetText(expression + ` = ${24}`);
        this.mExpressionBar.SetTextColor("#00ff1a");
        this.textTotalCorrect.setText(this.m_GameState.GetTotalCorrect().toString());
        this.mExpressionBar.PlayCorrectExpressionTween();
    }

    ShowPlayerLost(expression: string): void {
        this.mExpressionBar.SetText(expression + ` = ${ValueOfExpression(expression)}`);
        this.mExpressionBar.SetTextColor("#ff2600");
        this.textTotalWrong.setText(this.m_GameState.GetTotalWrong().toString());
        this.mExpressionBar.PlayIncorrectExpressionTween();


    }


    EnableNumberButtons() {
        for (let i = 0; i < 4; i++) {
            if (this.m_BtnUsed[i] === false)
                this.m_CardButtons[i].SetEnabled();
        }
    }

    DisableNumberButtons() {
        for (let i = 0; i < 4; i++) {
            this.m_CardButtons[i].SetDisabled();
        }
    }

    EnableOperationButtons(): void {
        this.btnOperationAdd.SetEnabled();
        this.btnOperationSubtract.SetEnabled();
        this.btnOperationDivide.SetEnabled();
        this.btnOperationMultiply.SetEnabled();
    }
    DisableOperationButtons(): void {
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
    }

    ResetNumberButtons(): void {
        for (let i = 0; i < 4; i++) {
            this.m_CardButtons[i].SetText(this.m_GameState.GetCurrentCard()[i])
            this.m_CardButtons[i].SetFontSize(128);
            this.m_CardButtons[i].SetEnabled();
            this.m_BtnUsed[i] = false;
        }


    }

    ShowPleaseLoginWarning(): void {


        this.tweens.add(
            {
                targets: [this.mImgLoginWarning, this.mTextLoginWarning],
                alpha: 1.0,
                scale: 1.6,

                duration: 500,
                ease: 'Power1'
            }
        );

        // Clear the artithmetic expression text
        this.mExpressionBar.SetText("");

        // Hide the other buttons
        this.tweens.add(
            {
                targets: [this.btnOperationAdd,
                this.btnOperationSubtract,
                this.btnOperationMultiply,
                this.btnOperationDivide,
                this.m_BtnReset,
                this.m_BtnUndo,
                this.mExpressionBar],
                alpha: 0.0,

                duration: 500,
                ease: 'Power1'
            }
        );

        // Move the home button to the center the other buttons
        this.tweens.add(
            {
                targets: this.btnGotoMenu,
                x: this.scale.width / 2,
                y: this.scale.height - 64,
                duration: 1500,
                ease: 'Power1'
            }
        );


    }


    SavePlayerData(playerWon: boolean): void {
       

        let connection = BackendConnection.SendScore(
            this.m_GameState.GetTotalCorrect(), 
            this.m_GameState.mDifficulty + 1);

        connection.then((data) => 
        {
            console.log("Game data was sent to DB");
        }).catch((err) => {
            console.log("Failed to send game data to DB");
            console.log(`Error: ${err}`);
        });

    }




}
