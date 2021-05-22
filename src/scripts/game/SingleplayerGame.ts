

import { Operation } from "./Operations";
import { CardGenerator, Difficulty } from "./CardGenerator";
import { evaluate } from 'mathjs'
import { IsNumeric } from "./Utils";
import { Stack } from '../game/Stack'



export enum PlayerState {
    PickingOperand1,
    PickingOperator,
    PickingOperand2,
}

export class SingleplayerGame {

    public readonly mDifficulty: Difficulty;
    private mCurrentCard: string;

    private mTotalCorrect: number;
    private mTotalWrong: number;

    private m_PlayerState: PlayerState;

   
     private mOperationStack: Stack<Operation>;
     private mCurrentOperation: Operation;



    /**
     * Constructs a new game state.
     * A new game state should be created everytime a new card is picked.
     * 
     * @param diff The difficulty of the cards that are to be generated
     */
    constructor(diff: Difficulty) {

        // Assign the difficulty
        this.mDifficulty = diff;

        // Generate a card based on the difficulty
        this.mCurrentCard = "????";

        this.mTotalCorrect = 0;
        this.mTotalWrong = 0;

        this.m_PlayerState = PlayerState.PickingOperand1;

        this.mOperationStack = new Stack<Operation>();
        this.mCurrentOperation = new Operation();


    }


    NewCard(): string {
        this.mCurrentCard = CardGenerator.generateCard(this.mDifficulty);
        this.ResetOperationState();

        

        return this.mCurrentCard;
    }

 
    PushCurrentOperation() 
    {
        console.log("Pushing new operation");
        console.log(this.mCurrentOperation);
        this.mOperationStack.push(this.mCurrentOperation);
    }

    PeekCurrentOperation() : Operation
    {
        return this.mCurrentOperation;
    }

    RevertToLastOperation() : Operation | undefined
    {
        let lastOp = this.mOperationStack.pop();

        if (!lastOp)
            return undefined;
        
        this.mCurrentOperation = lastOp;
        return lastOp;

    }


    CompleteOperation(): string {
        if (IsNumeric(this.mCurrentOperation.operand1) && IsNumeric(this.mCurrentOperation.operand2)) {
            this.mCurrentOperation.expression = `${this.mCurrentOperation.operand1}${this.mCurrentOperation.operator}${this.mCurrentOperation.operand2}`;
        }
        else if (IsNumeric(this.mCurrentOperation.operand1) && !IsNumeric(this.mCurrentOperation.operand2)) {
            this.mCurrentOperation.expression = `${this.mCurrentOperation.operand1}${this.mCurrentOperation.operator}(${this.mCurrentOperation.operand2})`;

        } else if (!IsNumeric(this.mCurrentOperation.operand1) && IsNumeric(this.mCurrentOperation.operand2)) {
            this.mCurrentOperation.expression = `(${this.mCurrentOperation.operand1})${this.mCurrentOperation.operator}${this.mCurrentOperation.operand2}`;
        }
        else if (!IsNumeric(this.mCurrentOperation.operand1) && !IsNumeric(this.mCurrentOperation.operand2)) {
            this.mCurrentOperation.expression = `(${this.mCurrentOperation.operand1})${this.mCurrentOperation.operator}(${this.mCurrentOperation.operand2})`;
        }
        else 
        this.mCurrentOperation.expression = "ERROR";

        return this.mCurrentOperation.expression;
    }

    CheckSolution(expression: string): boolean {
        const val = evaluate(expression.replaceAll("x", "*"));
        return val === 24;
    }

    GetCurrentPlayerState(): PlayerState {
        return this.m_PlayerState;
    }

    NextState(): void {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperand1:
                this.m_PlayerState = PlayerState.PickingOperator;
                break;
            case PlayerState.PickingOperand2:
                this.ResetOperationState();
                break;
            case PlayerState.PickingOperator:
                this.m_PlayerState = PlayerState.PickingOperand2;
                break;
            default:
                break;
        }

        console.log(`We are now on state ${this.StateToString()}`);
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
        this.m_PlayerState = PlayerState.PickingOperand1;
        this.mCurrentOperation = new Operation();
        //this.mCurrentOperation.operand1 = this.mCurrentOperation.operand2 = this.mCurrentOperation.operator = "";
    }

    ResetOperationStack() : void 
    {
        this.mOperationStack = new Stack<Operation>();
    }


    StateToString(): string {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperand1:
                return "Picking operand 1";

            case PlayerState.PickingOperand2:
                return "Picking operand 2";

            case PlayerState.PickingOperator:
                return "Picking operator ";

        }
    }

    IsPickingOperator(): boolean {
        return this.m_PlayerState === PlayerState.PickingOperator;
    }
    
    IsPickingOperand1() : boolean 
    {
        return this.m_PlayerState === PlayerState.PickingOperand1;
    }

    IsPickingOperand2() : boolean 
    {
        return this.m_PlayerState === PlayerState.PickingOperand2;
    }

    IncrTotalCorrect(): number {
        this.mTotalCorrect += 1;
        return this.mTotalCorrect;
    }

    IncrTotalWrong(): number {
        this.mTotalWrong += 1;
        return this.mTotalWrong;
    }

    SetCard(card: string): void {
        this.mCurrentCard = card;
    }

    GetTotalCorrect() : number 
    {
        return this.mTotalCorrect;
    }

    GetTotalWrong() : number 
    {
        return this.mTotalWrong;
    }

    GetCurrentExpression() : string 
    {
        return `${this.mCurrentOperation.operand1}${this.mCurrentOperation.operator}${this.mCurrentOperation.operand2}`;
    }

    GetCurrentCard () :string 
    {
        return this.mCurrentCard;
    }

    SetOperand1(operand, index) : void 
    {
        this.mCurrentOperation.operand1 = operand;
        this.mCurrentOperation.operand1BtnIndex = index;
    }

    SetOperand2(operand, index) : void 
    {
        this.mCurrentOperation.operand2 = operand;
        this.mCurrentOperation.operand2BtnIndex = index;
    }

    SetOperator(operator: string) : void 
    {
        this.mCurrentOperation.operator = operator;
    }

    SetExpression(expression:string) : void 
    {
        this.mCurrentOperation.expression = expression;
    }

    IsStackEmpty() : boolean
    {
        return this.mOperationStack.isEmpty();
    }

    SetPlayerState(state: PlayerState)
    {
        this.m_PlayerState = state;
    }


}


