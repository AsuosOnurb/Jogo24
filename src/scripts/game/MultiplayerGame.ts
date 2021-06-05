import {evaluate} from 'mathjs'



import { Operation } from './Operations'
import { CardGenerator, Difficulty } from "./CardGenerator";
import { Stack } from './Stack';
import { IsNumeric } from './Utils';


export enum PlayerState {
    PickingOperand1 = 1,
    PickingOperator = 2,
    PickingOperand2 = 3
};

class Player {
    private m_Score: number;

    constructor() {
        this.m_Score = 0;
    }

    GetScore(): number {
        return this.m_Score;
    }

    AddPoint(): void {
        this.m_Score += 1;
    }

    SubtractPoint(): void {
        this.m_Score -= 1;
    }
}

export class MultiplayerGame {

    public readonly mDifficulty: Difficulty;
    private mCurrentCard: string;

    private mPlayers: Array<Player>;
    private m_CurrentPlayer: number; // numbers [0,1,2,3]
    private m_PlayerState: PlayerState;

    private mCurrentOperation: Operation;
    private mOperationStack: Stack<Operation>;




    constructor(difficulty: Difficulty) {

        this.mDifficulty = difficulty;
        this.mCurrentCard = "????";

       
        this.mPlayers = [
            new Player(),
            new Player(),
            new Player(),
            new Player(),
        ];

        this.m_CurrentPlayer = 0;

        this.m_PlayerState = PlayerState.PickingOperand1;

        this.mCurrentOperation = new Operation();
        this.mOperationStack = new Stack<Operation>();

    }

   

    NewCard(): string {
        this.mCurrentCard = CardGenerator.generateCard(this.mDifficulty);

        this.ResetOperationState();

        return this.mCurrentCard;
    }



    PushCurrentOperation() 
    {
        this.mOperationStack.push(this.mCurrentOperation);
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

    GetCurrentState(): PlayerState {
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
            default:
                return "DEFAULT_VAL"
;
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
        this.mPlayers[this.m_CurrentPlayer].AddPoint();
        return this.mPlayers[this.m_CurrentPlayer].GetScore();
    }

    IncrTotalWrong(): number {
        this.mPlayers[this.m_CurrentPlayer].SubtractPoint();
        return this.mPlayers[this.m_CurrentPlayer].GetScore();
    }


    IsStackEmpty() : boolean
    {
        return this.mOperationStack.isEmpty();
    }

    SetPickingOperand2(): void {
        this.m_PlayerState = PlayerState.PickingOperand2;
    }

    IsCardWon(): boolean {
        // return (this.mCurrentOperation.result.n === 24 && this.mCurrentOperation.result.d === 1);
        return true
    }

    AwardCurrentPlayer(): number {
        this.mPlayers[this.m_CurrentPlayer].AddPoint();
        return this.mPlayers[this.m_CurrentPlayer].GetScore();
    }

    PunishCurrentPlayer(): number {
        this.mPlayers[this.m_CurrentPlayer].SubtractPoint();
        return this.mPlayers[this.m_CurrentPlayer].GetScore();
    }


  

    // ============= Getters & Setters =============
    GetCurrentPlayer(): number {
        return this.m_CurrentPlayer;
    }

    SetCurrentPlayer(playerNum: number) {
        this.m_CurrentPlayer = playerNum;
    }

    GetmCurrentOperation(): Operation {
        return this.mCurrentOperation;
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

    SetOperator(operator: string) : string 
    {
        this.mCurrentOperation.operator = operator;
        
        // We can also return, here, the most recent expression string.
        // If the first operand is just a single number, then we dont need a parentheses around it.
        // If it a more complex expression, then we put partentheses around it.

        if (IsNumeric(this.mCurrentOperation.operand1))
            return `${this.mCurrentOperation.operand1}${operator}`;
        else
            return `(${this.mCurrentOperation.operand1})${operator}`;
    }

    SetExpression(expression:string) : void 
    {
        this.mCurrentOperation.expression = expression;
    }


    SetCard(card: string): void {
        this.mCurrentCard = card;
    }


    GetCurrentExpression() : string 
    {
        return `${this.mCurrentOperation.operand1}${this.mCurrentOperation.operator}${this.mCurrentOperation.operand2}`;
    }

    GetCurrentCard () :string 
    {
        return this.mCurrentCard;
    }

    GetCurrentPlayerScore() : number 
    {
        return this.mPlayers[this.m_CurrentPlayer].GetScore();
    }





}