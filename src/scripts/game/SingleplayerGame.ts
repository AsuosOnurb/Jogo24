

import { Operation } from "./Operations";
import { CardGenerator, Difficulty } from "./CardGenerator";
import { OperationsStack } from "./OperationStack";
import { evaluate } from 'mathjs'
import { IsNumeric } from "./Utils";


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

    private mOperand1: string;
    private mOperand2: string;
    private mOperator: string;



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

    }


    NewCard(): string {
        this.mCurrentCard = CardGenerator.generateCard(this.mDifficulty);
        this.ResetState();

        return this.mCurrentCard;
    }

    AddOperand(operand: string): void {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperand1:
                this.mOperand1 = operand;
                break;
            case PlayerState.PickingOperand2:
                this.mOperand2 = operand;
                break
        }
    }

    AddOperator(operator: string): void {
        this.mOperator = operator;
    }

    CompleteOperation(): string {

        if (IsNumeric(this.mOperand1) && IsNumeric(this.mOperand2)) {
            return `${this.mOperand1} ${this.mOperator} ${this.mOperand2}`;
        }
        else if (IsNumeric(this.mOperand1) && !IsNumeric(this.mOperand2)) {
            return `${this.mOperand1} ${this.mOperator} (${this.mOperand2})`;

        } else if (!IsNumeric(this.mOperand1) && IsNumeric(this.mOperand2)) {
            return `(${this.mOperand1}) ${this.mOperator} ${this.mOperand2}`;
        }
        else if (!IsNumeric(this.mOperand1) && !IsNumeric(this.mOperand2)) {
            return `(${this.mOperand1}) ${this.mOperator} (${this.mOperand2})`;
        }

        return "ERROR";
    }

    CheckSolution(expression: string): boolean {
        const val = evaluate(expression);
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
                this.m_PlayerState = PlayerState.PickingOperand1;
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
    ResetState(): void {
        // Player has to pick the first operand
        this.m_PlayerState = PlayerState.PickingOperand1;
        this.mOperand1 = this.mOperand2 = this.mOperator = "";
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

}


