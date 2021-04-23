import Phaser from 'phaser'

import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);

import { OperationsStack, Operation,  FractionToString, OperationToString  } from '../operations/Operations'

import BetterText from '../better/BetterText'
import BetterButton from '../better/BetterButton'
import CardGenerator, { Difficulty } from '../utils/CardGenerator'
import Solutions from '../utils/Solutions'
import CountdownTimer from '../utils/CountdownTimer';
import { TextStack } from '../utils/TextStack';

/**
 * At any given moment, the player can either be:
 *  * Picking the first operand of the operation
 *  * Picking the operation to perform (+, -, * ,/)
 *  * Picking the second operand of the operation
 */
enum m_PlayerState {
    PickingOperand1,
    PickingOperation,
    PickingOperand2
}

type GameState = {
    difficulty: Difficulty;

    currentCard: string; // A string like "1459"
    totalCorrect: integer;
    totalWrong: integer;

    m_PlayerState: m_PlayerState;

    currentOperation: Operation;
    operationStack: OperationsStack;

    solutionTextStack: TextStack;

    buttonNumbers: {}, // And array of 4 operations;

    debug_debuggingCard: boolean;
    debug_card: string;
}


export default class SoloGame extends Phaser.Scene {

    private isInstanced: boolean = false;

    private gameState!: GameState;
    private countdownTimer: CountdownTimer;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label 
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textExpression!: BetterText; // Displays on the top bar the whole arithmetic expression made by the player
    private textSolution!: BetterText; // debug only

    // Buttons
    private btnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private btnReset!: BetterButton;           // Resets player input. Lets him try again the current card.
    private btnBackspace!: BetterButton;           // Lets the user delete the last inserted character.

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
    private numberBtns!: Array<BetterButton>;

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
            new CountdownTimer(this, 120, this.DisableAllButtons.bind(this), this.scale.width / 2 - 730, this.scale.height / 2 - 10, 64);



        this.textSolution =
            new BetterText(this, 32, 256, "", { fontSize: 32 });
    }

    init(data) {


        this.gameState = {
            difficulty: data.difficulty, // This data comes from the main menu
            currentCard: "?  ?  ?  ?",
            totalCorrect: 0,
            totalWrong: 0,

            // The current operation starts initialized to some default values
            currentOperation: new Operation(),

            buttonNumbers: { 0: -1, 1: -1, 2: -1, 3: -1 },

            m_PlayerState: m_PlayerState.PickingOperand1,

            operationStack: new OperationsStack,

            solutionTextStack: new TextStack,

            debug_debuggingCard: data.debugging,
            debug_card: data.card

        };

        /**
         * Register event handlers/listeners onyl if the scene hasn't been started before.
         */
        if (!this.isInstanced) {

            this.events.on('NumberButtonClick', this.HandleButtonClick_Number, this);
            this.events.on('OperationButtonClick', this.HandleButtonClick_Operation, this);

            this.events.on('ResetButtonClick', this.HandleButtonClick_Reset, this);
            this.events.on('BackspaceButtonClick', this.HandleButtonClick_Backspace, this);


            // This flag is important. Prevents duplication of event listeners!!
            this.isInstanced = true;

        }
    }


    // =============================== Game Setup (Button events/callbacks, labels/texts) ===================
    Setup_Labels() {


        this.textTotalCorrect = new BetterText(this, this.scale.width / 2 + 740, 128, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalCorrect.setOrigin(0.5, 0.5);
        this.textTotalWrong = new BetterText(this, this.scale.width / 2 + 740, 288, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalWrong.setOrigin(0.5, 0.5);

    }

    Setup_Buttons() {


        // Setup a button for each number in the card (4 buttons)
        this.numberBtns = [
            new BetterButton(this, this.scale.width / 2 - 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

        ]

        for (let i = 0; i < this.numberBtns.length; i++) {
            // Each button starts disabled
            this.numberBtns[i].SetDisabled();
            this.numberBtns[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, this.gameState.buttonNumbers[i]));
        }

        // This button lets the user reset his attempt at the current card.
        this.btnReset = new BetterButton(this, this.scale.width / 2 - 196, this.scale.height - 128, 1, 1, "", { fontSize: 64 }, "btn_reset");
        this.btnReset.on("pointerup", () => this.events.emit('ResetButtonClick'));
        this.btnReset.SetDisabled();


        // 'Backspace' button
        this.btnBackspace = new BetterButton(this, this.scale.width / 2 + 196, this.scale.height - 128, 1, 1, "", { fontSize: 32 }, "btn_undo");
        this.btnBackspace.on("pointerup", () => this.events.emit('BackspaceButtonClick'));
        this.btnBackspace.SetDisabled();



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
        this.btnNewCard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 0.3, 0.3, "", { fontSize: 32 }, "btn_playCard");
        this.btnNewCard.setScale(0.6, 0.6);
        this.btnNewCard.on("pointerup", () => this.NewCard());



        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, 96, 1080 - 96, 0.4, 0.4, "", { fontSize: 64 }, 'btn_gotoMenu');
        this.btnGotoMenu.setScale(0.8, 0.8);
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

    }


    // ============================================== Game Functionality ==============================================


    NewCard(): void {

        // We have to reset the game state here
        this.ResetGameState(true);



        let generatedCard: string;
        if (this.gameState.debug_debuggingCard) {
            generatedCard = this.gameState.debug_card;
        } else {
            generatedCard = CardGenerator.generateCard(this.gameState.difficulty);
        }


        this.gameState.currentCard = generatedCard;

        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < generatedCard.length; i++) {
            // Set the text of the number button
            this.numberBtns[i].SetText(generatedCard[i]);

            // Enable the button
            this.numberBtns[i].SetEnabled();

            // Store the card numbers
            this.gameState.buttonNumbers[i] = mathJS.fraction(parseInt(generatedCard[i]));

        }

        // DIsable 'Reset' button
        this.btnReset.SetDisabled();

        // Disable 'Backspace' button
        this.btnBackspace.SetDisabled();

        // Disable Operation buttons
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(this.gameState.currentCard)}`);



        // Start the timer
        this.countdownTimer.StartCountdown();


        // Debug state
        console.log(this.gameState);

    }


    CheckSolution(): void {
        // Check if we have 3 disabled/picked numbers.
        let disabledCardCount = 0;
        for (let i = 0; i < 4; i++) {
            if (!this.numberBtns[i].IsEnabled())
                disabledCardCount += 1;
        }

        if (disabledCardCount === 3) {


            if (this.gameState.currentOperation.result.n === 24 &&
                this.gameState.currentOperation.result.d === 1) {



                // Update game state and 'Total correct' text
                this.gameState.totalCorrect += 1;
                this.textTotalCorrect.setText(this.gameState.totalCorrect.toString());
            }
            else {

                // Update game state and 'Total incorrect' text
                this.gameState.totalWrong += 1;
                this.textTotalWrong.setText(this.gameState.totalWrong.toString());

            }

            // We can disable the 'Reset' and 'Backspace' buttons
            this.btnReset.SetDisabled();
            this.btnBackspace.SetDisabled();


        }


    }

    /**
     * Resets the game state to the default/initial values.
     * After this, the player  has to the first operand.
     * @param flagFullReset Whether or not to fully wipe the operation stack. This flag will fully reset the operation stack,
     * so the scene will as if it was just started from the main menu.
     */
    ResetGameState(flagFullReset: boolean = false): void {
        this.gameState.m_PlayerState = m_PlayerState.PickingOperand1;

        this.gameState.currentOperation = new Operation();

        if (flagFullReset) {
            // Fully reset the game. Operation stack is renewd
            this.gameState.operationStack = new OperationsStack;
            this.gameState.solutionTextStack = new TextStack;
        }

    }


    DisableAllButtons() {
        for (let i = 0; i < 4; i++) {
            this.numberBtns[i].SetDisabled();

        }

        this.btnReset.SetDisabled();
        this.btnBackspace.SetDisabled();

        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        this.btnNewCard.SetDisabled();

    }

    // ============================================================= EVENT HANDLERS =======================================================

    // Reset the calculations to the original state (happens when the 'Reset' button is clicked)
    HandleButtonClick_Reset(): void {
        // First we reset the state (true flag to also wipe the operation stack)
        this.ResetGameState(true);

        // Then reset the number buttons
        for (let i = 0; i < 4; i++) {
            this.numberBtns[i].SetText(this.gameState.currentCard[i]);
            this.gameState.buttonNumbers[i] = parseInt(this.gameState.currentCard[i])
            this.numberBtns[i].SetEnabled();
        }

        // Disable the 'Reset' and 'Backspace' button
        this.btnBackspace.SetDisabled();
        this.btnReset.SetDisabled();
    }


    /**
     * 
     * @param clickedButtonIndex The index of the number button that was clicked. This index is used
     * for accessing the array of number buttons.
     * @param num The number associated with the button (i.e the value/text on the button in the range [1,9])
     */
    HandleButtonClick_Number(clickedButtonIndex: number, op: Operation): void {

        // We decide what happens next based on the current state
        if (this.gameState.m_PlayerState == m_PlayerState.PickingOperand1) {

            // User is picking the first operand
            this.gameState.currentOperation.operand1 = op;

            // Store the index of the button that was clicked
            this.gameState.currentOperation.operand1BtnIndex = clickedButtonIndex;

            // Then he has to pick an operation. Go to the 'Operation Picking' player state
            this.gameState.m_PlayerState = m_PlayerState.PickingOperation;

            // Disable the number button
            this.numberBtns[clickedButtonIndex].SetDisabled();

            // We have to enable the operation buttons 
            this.btnOperationAdd.SetEnabled();
            this.btnOperationSubtract.SetEnabled();
            this.btnOperationMultiply.SetEnabled();
            this.btnOperationDivide.SetEnabled();

            // Enable 'Backspace' button
            this.btnBackspace.SetEnabled();

            // Enable 'Reset' button
            this.btnReset.SetEnabled();

        } else if (this.gameState.m_PlayerState == m_PlayerState.PickingOperand2) {
            // User is picking the second operand. 
            this.gameState.currentOperation.operand2 = op;

            // Store the index of the button that was clicked
            this.gameState.currentOperation.operand2BtnIndex = clickedButtonIndex;

            // Store the value of the number 
            this.gameState.buttonNumbers[clickedButtonIndex] = op;

            // Do the math on the current operation
            const operationResult = this.gameState.currentOperation.Calculate();
            this.gameState.currentOperation.result = operationResult;
            console.log(operationResult);

            // Display result as a fraction if the denominator is not 1
            if (operationResult.d != 1)
                this.numberBtns[clickedButtonIndex].SetText(operationResult.n.toString() + "/" + operationResult.d.toString());
            else
                this.numberBtns[clickedButtonIndex].SetText(operationResult.n.toString());

           

            this.gameState.operationStack.Push(this.gameState.currentOperation);


            // Display the operation to the screen
            console.log(this.gameState.currentOperation.ToString());
            this.textExpression.setText(this.gameState.currentOperation.ToString());

            // Here is where we check for the solution
            // If 3 cards are picked/disable and the the result is 24, then the player won.
            this.CheckSolution();

            // Associate the new value to the the button
            this.gameState.buttonNumbers[clickedButtonIndex] = this.gameState.currentOperation;


            // The operation was completed. Now the player has to pick a new first operand again.
            // We reset the operation state, but dont delete the stack of operations
            this.ResetGameState(false);

            // Operation buttons can be disabled
            this.btnOperationAdd.SetDisabled();
            this.btnOperationSubtract.SetDisabled();
            this.btnOperationMultiply.SetDisabled();
            this.btnOperationDivide.SetDisabled();

            console.log(this.gameState);

        }
    }

    HandleButtonClick_Operation(operation: string) {
        // Update the current operation
        this.gameState.currentOperation.operation = operation;

        // Player chose the operation. Now he has to pick the second operan
        this.gameState.m_PlayerState = m_PlayerState.PickingOperand2;
    }

    /**
     * Undo the last performed operation.
     * 
     * Currently, we're using a stack made of Operation objects.
     */
    HandleButtonClick_Backspace(): void {

        /* What is the user trying to UNDO?
            Could be trying to undo an entire operation;
            Could be trting to undo the first picked operand;
        */
        if (this.gameState.m_PlayerState === m_PlayerState.PickingOperation) {

            // RE-enable the picked button
            this.numberBtns[this.gameState.currentOperation.operand1BtnIndex].SetEnabled();

            // Player picked the operation (and so he has also picked the first operand. This undo will UNDO the first operand)
            this.ResetGameState(false);

            this.btnOperationAdd.SetDisabled();
            this.btnOperationSubtract.SetDisabled();
            this.btnOperationMultiply.SetDisabled();
            this.btnOperationDivide.SetDisabled();

        }

        else {
            // Pop the last performed operation from the operation stack
            let lastOp = this.gameState.operationStack.Pop();

            // Check if the stack had at least one element/Operation (Do nothing it is empty)
            if (lastOp) {

                // We have to change the buttons to the previous numbers and enable them
                console.log("Last operation was = ")
                console.log(lastOp);
                //this.numberBtns[lastOp.operand1BtnIndex].SetText(lastOp.operand1.toString());
                this.numberBtns[lastOp.operand1BtnIndex].SetText(OperationToString(lastOp.operand1));
                this.numberBtns[lastOp.operand1BtnIndex].SetEnabled();
                this.numberBtns[lastOp.operand2BtnIndex].SetText(OperationToString(lastOp.operand2));
                this.numberBtns[lastOp.operand2BtnIndex].SetEnabled();

                // Assign the new values to the buttons
                this.gameState.buttonNumbers[lastOp.operand1BtnIndex] = lastOp.operand1;
                this.gameState.buttonNumbers[lastOp.operand2BtnIndex] = lastOp.operand2;

                // Reset the operation state
                this.ResetGameState(false);


            }


        }

        // Check if the operation stack is now empty. If it is, then disable some buttons.
        if (this.gameState.operationStack.IsEmpty()) {
            this.btnReset.SetDisabled();
            this.btnBackspace.SetDisabled();

            this.btnOperationAdd.SetDisabled();
            this.btnOperationSubtract.SetDisabled();
            this.btnOperationMultiply.SetDisabled();
            this.btnOperationDivide.SetDisabled();
        }

        console.log("Depois do undo")
        console.log(this.gameState);


    }

}
