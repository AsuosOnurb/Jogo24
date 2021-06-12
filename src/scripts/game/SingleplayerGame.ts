

import { Operation } from "../utils/Operations";
import { CardGenerator, Difficulty } from "../utils/CardGenerator";
import { evaluate } from 'mathjs'
import { IsNumeric } from "../utils/Utils";
import { Stack } from '../utils/Stack'


/**
 * Defines the states that the player can be in.
 * A player can either be:
 * 1 - Picking the first operand of an operation;
 * 2 - Picking the operator of the operation.
 * 3 - Picking the second (and last) operand of the operation.
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
     * Generates a new card (string representation) based on the game's difficulty.
     * 
     * @returns The string representation of the generated card.
     * 
     * @remarks This function also modifies the {@link SingleplayerGame.currentCard} member variable with the new generated card string.
     */
    NewCard(): string {
        this.currentCard = CardGenerator.GenerateCard(this.difficulty);
        return this.currentCard;
    }


    PushCurrentOperation() {
        this.operationStack.push(this.currentOperation);
    }

    PeekCurrentOperation(): Operation {
        return this.currentOperation;
    }

    RevertToLastOperation(): Operation | undefined {
        let lastOp = this.operationStack.pop();

        if (!lastOp)
            return undefined;

        this.currentOperation = lastOp;
        return lastOp;

    }


    CompleteOperation(): string {
        if (IsNumeric(this.currentOperation.operand1) && IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `${this.currentOperation.operand1}${this.currentOperation.operator}${this.currentOperation.operand2}`;
        }
        else if (IsNumeric(this.currentOperation.operand1) && !IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `${this.currentOperation.operand1}${this.currentOperation.operator}(${this.currentOperation.operand2})`;

        } else if (!IsNumeric(this.currentOperation.operand1) && IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `(${this.currentOperation.operand1})${this.currentOperation.operator }${this.currentOperation.operand2}`;
        }
        else if (!IsNumeric(this.currentOperation.operand1) && !IsNumeric(this.currentOperation.operand2)) {
            this.currentOperation.expression = `(${this.currentOperation.operand1})${this.currentOperation.operator}(${this.currentOperation.operand2})`;
        }
        else
            this.currentOperation.expression = "ERROR";

        return this.currentOperation.expression;
    }

    CheckSolution(expression: string): boolean {
        const val = evaluate(expression.replaceAll("x", "*"));
        return val === 24;
    }

    GetCurrentPlayerState(): PlayerState {
        return this.playerState;
    }

    NextState(): void {
        switch (this.playerState) {
            case PlayerState.PickingOperand1:
                this.playerState = PlayerState.PickingOperator;
                break;
            case PlayerState.PickingOperand2:
                this.ResetOperationState();
                break;
            case PlayerState.PickingOperator:
                this.playerState = PlayerState.PickingOperand2;
                break;
            default:
                break;
        }

    }

    /**
     * Resets the game state to one where the player is:
     * 1 - Picking the first operand.
     * 2 - All card buttons are enabled again. (This is done in the scene class!!!)
     * 3 - A whole new stack of operations is created (previous one is reset).
     * 4 - A new arithmetic expression is created.
     */
    ResetOperationState(): void {
        // Player has to pick the first operand
        this.playerState = PlayerState.PickingOperand1;
        this.currentOperation = new Operation();
        //this.mCurrentOperation.operand1 = this.mCurrentOperation.operand2 = this.mCurrentOperation.operator = "";
    }

    ResetOperationStack(): void {
        this.operationStack = new Stack<Operation>();
    }


    StateToString(): string {
        switch (this.playerState) {
            case PlayerState.PickingOperand1:
                return "Picking operand 1";

            case PlayerState.PickingOperand2:
                return "Picking operand 2";

            case PlayerState.PickingOperator:
                return "Picking operator ";

        }
    }

    IsPickingOperator(): boolean {
        return this.playerState === PlayerState.PickingOperator;
    }

    IsPickingOperand1(): boolean {
        return this.playerState === PlayerState.PickingOperand1;
    }

    IsPickingOperand2(): boolean {
        return this.playerState === PlayerState.PickingOperand2;
    }

    IncrTotalCorrect(): number {
        this.totalCorrect += 1;
        return this.totalCorrect;
    }

    IncrTotalWrong(): number {
        this.totalWrong += 1;
        return this.totalWrong;
    }

    SetCard(card: string): void {
        this.currentCard = card;
    }

    GetTotalCorrect(): number {
        return this.totalCorrect;
    }

    GetTotalWrong(): number {
        return this.totalWrong;
    }

    GetCurrentExpression(): string {
        return `${this.currentOperation.operand1}${this.currentOperation.operator}${this.currentOperation.operand2}`;
    }

    GetCurrentCard(): string {
        return this.currentCard;
    }

    SetOperand1(operand, index): void {
        this.currentOperation.operand1 = operand;
        this.currentOperation.operand1BtnIndex = index;
    }

    SetOperand2(operand, index): void {
        this.currentOperation.operand2 = operand;
        this.currentOperation.operand2BtnIndex = index;
    }

    SetOperator(operator: string): string {
        this.currentOperation.operator = operator;

        // We can also return, here, the most recent expression string.
        // If the first operand is just a single number, then we dont need a parentheses around it.
        // If it a more complex expression, then we put partentheses around it.

        if (IsNumeric(this.currentOperation.operand1))
            return `${this.currentOperation.operand1} ${operator}`;
        else
            return `(${this.currentOperation.operand1}) ${operator}`;
    }

    SetExpression(expression: string): void {
        this.currentOperation.expression = expression;
    }

    IsStackEmpty(): boolean {
        return this.operationStack.isEmpty();
    }

    SetPlayerState(state: PlayerState) {
        this.playerState = state;
    }


}


