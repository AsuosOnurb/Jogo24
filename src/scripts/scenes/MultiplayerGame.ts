import Phaser from 'phaser'

import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);

import { OperationsStack, Operation, PerformOperation, FractionToString, OperationToString } from '../operations/Operations'

import BetterText from '../better/BetterText'
import BetterButton from '../better/BetterButton'
import CardGenerator, { Difficulty } from '../utils/CardGenerator'
import Solutions from '../utils/Solutions'
import CountdownTimer from '../utils/CountdownTimer';

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

    currentCard: string; // A string like "1459"
    totalCorrect: integer;
    totalWrong: integer;

    m_PlayerState: m_PlayerState;

    currentOperation: Operation;
    operationStack: OperationsStack;


    buttonNumbers: {},

}


export default class MultiplayerGame extends Phaser.Scene {

    private isInstanced: boolean = false;

    private gameState!: GameState;
    private countdownTimer: CountdownTimer;


    // ===================== UI Objects (text objects, buttons, etc....) ==================


    // Buttons
    private btnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private btnReset!: BetterButton;           // Resets player input. Lets him try again the current card.
    private btnBackspace!: BetterButton;           // Lets the user delete the last inserted character.

    private btnOperationAdd!: BetterButton;         // Perdorms Addition
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
        super("MultiplayerGame");
    }

    preload() {
        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Add card background image
        const cardBG = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'cardBG');

        // Setup labels 
        this.Setup_Labels();

        // Setup ALL the buttons
        this.Setup_Buttons();

    }

    init(data) {

        this.gameState = {
            currentCard: "?  ?  ?  ?",
            totalCorrect: 0,
            totalWrong: 0,

            // The current operation starts initialized to some default values
            currentOperation:
            {
                operand1: -1,
                operand1BtnIndex: -1,
                operand2: -1,
                operand2BtnIndex: -1,
                operation: "none",
                result: -1,

            },

            buttonNumbers: { 0: -1, 1: -1, 2: -1, 3: -1 },

            m_PlayerState: m_PlayerState.PickingOperand1,

            operationStack: new OperationsStack,


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


      

    }

    Setup_Buttons() {


        // Setup a button for each number in the card (4 buttons)
        this.numberBtns = [
            new BetterButton(this, this.scale.width / 2 - 196, this.scale.height / 2,
                0.3, 0.3, "?", { fontSize: 80 }, "cardBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 196,
                0.3, 0.3, "?", { fontSize: 80 }, "cardBG"),

            new BetterButton(this, this.scale.width / 2 + 196, this.scale.height / 2,
                0.3, 0.3, "?", { fontSize: 80 }, "cardBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 196,
                0.3, 0.3, "?", { fontSize: 80 }, "cardBG"),

        ]

        for (let i = 0; i < this.numberBtns.length; i++) {
            // Each button starts disabled
            this.numberBtns[i].SetDisabled();
            this.numberBtns[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, this.gameState.buttonNumbers[i]));
        }

        // This button lets the user reset his attempt at the current card.
        this.btnReset = new BetterButton(this, this.scale.width / 2 - 196, this.scale.height - 128, 0.2, 0.2, "↺", { fontSize: 64 }, "cardBG");
        this.btnReset.on("pointerup", () => this.events.emit('ResetButtonClick'));
        this.btnReset.SetDisabled();


        // 'Backspace' button
        this.btnBackspace = new BetterButton(this, this.scale.width / 2 + 196, this.scale.height - 128, 0.2, 0.2, '🠔', { fontSize: 32 }, "cardBG");
        this.btnBackspace.on("pointerup", () => this.events.emit('BackspaceButtonClick'));
        this.btnBackspace.SetDisabled();



        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "addition"));
        this.btnOperationAdd.SetDisabled();


        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, this.scale.width  / 2 + 800, this.scale.height  / 2- 64, 1, 1, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "subtraction"));
        this.btnOperationSubtract.SetDisabled();



        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "multiplication"));
        this.btnOperationMultiply.SetDisabled();



        // Division operation button
        this.btnOperationDivide = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height  / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_division");
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
        generatedCard = CardGenerator.generateCard(Difficulty.Any);


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

        //  the solution debug text
        console.log(`${Solutions.getSolution(this.gameState.currentCard)}`);



        // Start the timer
        // this.countdownTimer.StartCountdown();


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

        this.gameState.currentOperation =
        {
            operand1: -1,
            operand1BtnIndex: -1,
            operand2: -1,
            operand2BtnIndex: -1,
            operation: "none",
            result: -1
        };

        if (flagFullReset)
        {
            // Fully reset the game. Operation stack is renewd
            this.gameState.operationStack = new OperationsStack;
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
    HandleButtonClick_Number(clickedButtonIndex: number, num): void {

        // We decide what happens next based on the current state
        if (this.gameState.m_PlayerState == m_PlayerState.PickingOperand1) {

            // Disable the number button
            this.numberBtns[clickedButtonIndex].SetDisabled();

            // User is picking the first operand
            this.gameState.currentOperation.operand1 = num;

            // Store the index of the button that was clicked
            this.gameState.currentOperation.operand1BtnIndex = clickedButtonIndex;

            // Store the value of the number 
            this.gameState.buttonNumbers[clickedButtonIndex] = num;

            // Then he has to pick an operation. Go to the 'Operation Picking' player state
            this.gameState.m_PlayerState = m_PlayerState.PickingOperation;

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
            this.gameState.currentOperation.operand2 = num;

            // Store the index of the button that was clicked
            this.gameState.currentOperation.operand2BtnIndex = clickedButtonIndex;

            // Store the value of the number 
            this.gameState.buttonNumbers[clickedButtonIndex] = num;


            const operationResult = PerformOperation(
                this.gameState.currentOperation.operation,
                this.gameState.currentOperation.operand1,
                this.gameState.currentOperation.operand2
            );

            this.gameState.currentOperation.result = operationResult;


            // Display result as a fraction if the denominator is not 1
            if (operationResult.d != 1)
                this.numberBtns[clickedButtonIndex].SetText(operationResult.n.toString() + " / " + operationResult.d.toString());
            else
                this.numberBtns[clickedButtonIndex].SetText(operationResult.n.toString());

            // Associate the new value to the the button
            this.gameState.buttonNumbers[clickedButtonIndex] = operationResult;

            // Here is where we check for the solution
            // If 3 cards are picked/disable and the the result is 24, then the player won.
            this.CheckSolution();

            // This operation is added to the operation stack
            this.gameState.operationStack.Push({
                operand1: this.gameState.currentOperation.operand1,
                operand1BtnIndex: this.gameState.currentOperation.operand1BtnIndex,

                operand2: this.gameState.currentOperation.operand2,
                operand2BtnIndex: this.gameState.currentOperation.operand2BtnIndex,

                operation: this.gameState.currentOperation.operation,
                result: this.gameState.currentOperation.result

            });

            
          


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
                this.numberBtns[lastOp.operand1BtnIndex].SetText(FractionToString(lastOp.operand1));
                this.numberBtns[lastOp.operand1BtnIndex].SetEnabled();
                this.numberBtns[lastOp.operand2BtnIndex].SetText(FractionToString(lastOp.operand2));
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
