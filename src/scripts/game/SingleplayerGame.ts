

import { Operation } from "../utils/Operations";
import { CardGenerator, Difficulty } from "../utils/CardGenerator";
import { evaluate } from 'mathjs'
import { IsNumeric } from "../utils/Utils";
import { Stack } from '../utils/Stack'


/**
 * Defines the states that the player can be in.
 * 
 * A player can either be:
 * 1. Picking the first operand of an operation;
 * 2. Picking the operator of the operation.
 * 3. Picking the second (and last) operand of the operation.
 * 
 * The whole game process revolves around these three states.
 */
export enum PlayerState {
    PickingOperand1,
    PickingOperator,
    PickingOperand2,
}


/**
 * This class implements the logics side of the single player game mode.
 * 
 
 * It has a few responsabilities:
 * 1. It stores basic game information like the difficulty, the card that is being played and the player's scores.
 * 2. It handles the game/player state. This player state is what allows us to know what the player is trying to do and how we should respond.
 * 3. It manages the whole process of operation creation, manipulation and storage. It also provides ways to navigate to previous operations using a stack.
 * 
 * 
 * @remarks This class should only handle the logics side of things; Graphics/text/buttons and UI things are all done in the SingleplayerScene class!
 */
export class SingleplayerGame {

    /**
     * The current game's difficulty mode.
     */
    public readonly difficulty: Difficulty;

    /**
     * The string representation of the current card (for example a string such as "5678").
     */
    private currentCard: string;

    /**
     * The amount of times the player submited a correct arithemetic expression (one that evalueated to 24).
     * This is also the final score of the player when the game ends.
     */
    private totalCorrect: number;

    /**
     * The amount of times the player failed to construct a correct arithmetic expression.
     */
    private totalWrong: number;

    /**
     * The current state of the player.
     * This is how we know what the player is supposed to be doing next, and it's also how we know what we have to do next.
     */
    private playerState: PlayerState;


    /**
     * The stack where all operations are stored.
     * This data structure is important because we want to provide a way to 'undo' the operations and allow the player to backtrack.
     */
    private operationStack: Stack<Operation>;

    /** 
     * The operation that is currently being constructed.
     */
    private currentOperation: Operation;



    /**
     * Constructs a new SinglePlayerGame object
     * @param diff The difficulty of the cards that are to be generated henceforth.         
     */
    constructor(diff: Difficulty) {

        // Assign the difficulty
        this.difficulty = diff;

        // When the game starts, the cards start with this default '????' look.
        this.currentCard = "????";

        // Reset player score
        this.totalCorrect = 0;
        this.totalWrong = 0;

        // The player's fits move (ever) is to pick the first operand
        this.playerState = PlayerState.PickingOperand1;

        // Strt a new stack of operations
        this.operationStack = new Stack<Operation>();

        // Create a new operation object
        this.currentOperation = new Operation();
    }


    /**
     * Resets the game state.
     * 
     * @remarks This procedure does 3 things:
     * 1. Starts by generating a new card.
     * 2. Then resets the current operation's state.
     * 3. And completely deletes/wipes the operations stack.
     */
    public NewCard(): void {
        // Generate a new card
        this.currentCard = CardGenerator.GenerateCard(this.difficulty);

        // Reset the operation state
        this.ResetOperationState();

        // Reset The operation stack
        this.ResetOperationStack();
    }



    /**
     * Check whether or not the expression/operation correctly equates to 24.
     * @param operationExpression The arithmetic expression to test.
     * @returns True if the specified operation's expression value equals 24. Returns false otherwise.
     */
    public CheckSolution(operationExpression: string): boolean {
        const val = evaluate(operationExpression.replaceAll("x", "*"));
        return val === 24;
    }


    /* ============================== Picking operands and operator =================================== */

    /**
     * Sets the first operand of the current operation.
     * @param operand1 The (string) value of the first operand. It's astring value because we get it from its button and we also don't care about its numerical value.
     * @param operand1BtnIndex The index of the button associated with this operand.
     * 
     * @remarks This procedure is does more than just setting the first operand. It also sets/advances the player state to {@link PlayerState.PickingOperator}.
     */
    public PickOperand1(operand1: string, operand1BtnIndex: number): void {
        // Update the current operation
        this.currentOperation.operand1 = operand1;
        this.currentOperation.operand1BtnIndex = operand1BtnIndex;

        // Advance to the next state (if we're here, it means the player now has to pick the operator)
        this.playerState = PlayerState.PickingOperator;
    }

    /**
     * Sets the operator of the current operation.
     * @param operator The string representation of the operator, i.e: '+', '-', '*', '/' .
     * @returns The most up-to-date string representation of the current arithmetic expression (includes the operator itself).
     * 
     * @remarks This function also advances the player state to {@link PlayerState.PickingOperand2}.
     */
    public PickOperator(operator: string): string {

        // Update the current operation operator
        this.currentOperation.operator = operator;

        // Go to the next state
        this.playerState = PlayerState.PickingOperand2;

        // We can also return, here, the most recent expression string.
        // If the first operand is just a single number, then we dont need a parentheses around it.
        // If it a more complex expression, then we put partentheses around it.

        if (IsNumeric(this.currentOperation.operand1))
            return `${this.currentOperation.operand1} ${operator}`;
        else
            return `(${this.currentOperation.operand1}) ${operator}`;
    }

    /**
     * Finalizes the whole process of operation construction by setting the second operand.
     * @param operand2 The second operand of the operation.
     * @param operand2Index The index of the card button associated with the second operand.
     * 
     * @returns The arithmetic expression associated with the current/completed operation.
     * 
     * @remarks This function also resets the player state. After invocation, the player state will be {@link PlayerState.PickingOperand1}
     * and the current operation {@link SingleplayerGame.currentOperation} object will be reset to a new one.
     */

    public PickOperand2(operand2: string, operand2Index: number): string {

        // Assign the second operand
        this.currentOperation.operand2 = operand2;
        this.currentOperation.operand2BtnIndex = operand2Index;

        let operationExpression;
        if (IsNumeric(this.currentOperation.operand1) && IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `${this.currentOperation.operand1}${this.currentOperation.operator}${this.currentOperation.operand2}`;
        }
        else if (IsNumeric(this.currentOperation.operand1) && !IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `${this.currentOperation.operand1}${this.currentOperation.operator}(${this.currentOperation.operand2})`;

        } else if (!IsNumeric(this.currentOperation.operand1) && IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `(${this.currentOperation.operand1})${this.currentOperation.operator}${this.currentOperation.operand2}`;
        }
        else if (!IsNumeric(this.currentOperation.operand1) && !IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `(${this.currentOperation.operand1})${this.currentOperation.operator}(${this.currentOperation.operand2})`;
        }
        else
            this.currentOperation.expression = "ERROR";

        // Save the expression we want to return
        operationExpression = this.currentOperation.expression;

        // Push the operation ot the stack
        this.operationStack.push(this.currentOperation);

        // The cycle restarts. The player now has to pick the first operand for a whole new operation.
        this.ResetOperationState();

        return operationExpression;
    }


    /* ========================== Operations and Operation Stack ====================================== */

    /**
    * Completes the current operation's construction process by pushing it to the operations stack.
    */
    public PushCurrentOperation() {
        this.operationStack.push(this.currentOperation);
    }

    /**
     * Allows inspection of the current operation.
     * @returns The current operation that is being constructed.
     * 
     * @remarks As the function name implies, we're not executing a pop() form the operations stack. 
     * This means we can peek the operation value without affecting the stack.
     */
    public PeekCurrentOperation(): Operation {
        return this.currentOperation;
    }

    /**
     * Pops the topmost operation on the stack and assigns it to the current operation.
     * @returns The new operation that now has the previous operation's values. May also return an empty/undefined object if the stack is empty.
     *      
     * @remarks This function alters the operations stack data.
     */
    public RevertToLastOperation(): Operation | undefined {
        let lastOp = this.operationStack.pop();

        if (!lastOp)
            return undefined;

        this.currentOperation = lastOp;
        return lastOp;

    }

    /**
    * Resets the operation state.
    * 
    * @remarks This procedure resets the current operation. It also sets the player state to {@link PlayerState.PickingOperand1}.
    */
    public ResetOperationState(): void {
        // Player has to pick the first operand
        this.playerState = PlayerState.PickingOperand1;
        this.currentOperation = new Operation();
    }

    /**
    * Resets/Wipes the operation stack.
    */
    ResetOperationStack(): void {
        this.operationStack = new Stack<Operation>();
    }

    /**
     * Completely resets the game state.
     * This procedure is only used when the player clicks the reset button.
     *
     * @remarks This procedure completely wipes the operation stack and resets the operation state. 
     */
    CompleteReset()
    {
        this.ResetOperationState();
        this.ResetOperationStack();
    }



    /* ============================================== Getters and Setter ============================================== */

    // Player score

    /**
     *  Increments the total amount of correct answers.
     * @returns The new total amount of times the player got a correct answer.
     */
    public IncrTotalCorrect(): number {
        this.totalCorrect += 1;
        return this.totalCorrect;
    }

    /**
     *  Increments the total amount of incorrect answers.
     * @returns The new total amount of times the player got an incorrect answer.
     */
    public IncrTotalWrong(): number {
        this.totalWrong += 1;
        return this.totalWrong;
    }

    /**
     *  Retrieves the total amount of correct answers.
     * @returns The total amount of times the player got a correct answer.
     */
    public GetTotalCorrect(): number {
        return this.totalCorrect;
    }

    /**
     *  Retrieves the total amount of incorrect answers.
     * @returns The total amount of times the player got an incorrect answer.
     */
    public GetTotalWrong(): number {
        return this.totalWrong;
    }

    // Current card 
    public GetCurrentCard(): string {
        return this.currentCard;
    }

    public SetCard(card: string): void {
        this.currentCard = card;
    }


    // Player State

    /**
     * Gets the current state of the player.
     * @returns The PlayerState of the player
     */
    public GetPlayerState(): PlayerState {
        return this.playerState;
    }

    /**
     * Assigns a new player state to the current one.
     * @param state The new player state to assign.
     */
    public SetPlayerState(state: PlayerState) {
        this.playerState = state;
    }


    // Operation stack
    /**
     * Checks if the stack of operations is empty.
     * @returns True if the operations stack is empty. Returns false otherwise.
     */
    public IsStackEmpty(): boolean {
        return this.operationStack.isEmpty();
    }





}


