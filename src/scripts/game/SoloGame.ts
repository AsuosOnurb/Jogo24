import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);



import { Operation, OperationsStack } from "../operations/Operations";
import {CardGenerator,  Difficulty } from "../utils/CardGenerator";

enum PlayerState {
    PickingOperand1 = 1,
    PickingOperation = 2,
    PickingOperand2 = 3
}

export class SoloGame {

    public readonly Difficulty: Difficulty;
    private m_CurrentCard: string;

    private m_TotalCorrect: number;
    private m_TotalWrong: number;

    private m_PlayerState: PlayerState;

    private m_Numbers;
    private CurrentOperation: Operation;
    private m_OperationsStack: OperationsStack;


    /**
     * Constructs a new game state.
     * A new game state should be created everytime a new card is picked.
     * 
     * @param diff The difficulty of the cards that are to be generated
     */
    constructor(diff: Difficulty) {

        // Assign the difficulty
        this.Difficulty = diff;

        // Generate a card based on the difficulty
        this.m_CurrentCard = "????";

        this.m_TotalCorrect = 0;
        this.m_TotalWrong = 0;

        this.m_PlayerState = PlayerState.PickingOperand1;

        this.m_Numbers = {};
        this.CurrentOperation = new Operation();
        this.m_OperationsStack = new OperationsStack();

    }

    PerformCurrentOperation() {
        let operationResult = this.CurrentOperation.Calculate();

        // The operation was fully performed. Add it to the stack
        this.m_OperationsStack.Push(this.CurrentOperation);

        // The second operand button holds the result of the operation
        this.m_Numbers[this.CurrentOperation.operand2BtnIndex] = this.CurrentOperation;



        return operationResult;
    }

    NewCard(): string {
        this.m_CurrentCard = CardGenerator.generateCard(this.Difficulty);
        this.ResetState();

        /*
            A new card was generated.
            We have to store each number as a MathJS Fraction object.
        */
        for (let i = 0; i < 4; i++) {
            this.m_Numbers[i] = mathJS.fraction(parseInt(this.m_CurrentCard[i]));
        }

        return this.m_CurrentCard;
    }

    ResetOperationState(): void {
        this.CurrentOperation = new Operation();
        this.m_PlayerState = PlayerState.PickingOperand1;
    }

    ResetState(): void {
        this.m_PlayerState = PlayerState.PickingOperand1;
        this.CurrentOperation = new Operation();
        this.m_OperationsStack = new OperationsStack();

        // Reset the values stored in Numbers
        for (let i = 0; i < 4; i++)
            this.m_Numbers[i] = mathJS.fraction(parseInt(this.m_CurrentCard[i]));
    }

    NextPlayerState(): void {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperand1:
                this.m_PlayerState = PlayerState.PickingOperation;
                console.log("Player is now on PickingOperation");
                break;

            case PlayerState.PickingOperation:
                this.m_PlayerState = PlayerState.PickingOperand2;
                console.log("Player is now on PickingOperand2");

                break;

            case PlayerState.PickingOperand2:
                this.m_PlayerState = PlayerState.PickingOperand1;
                console.log("Player is now on PickingOperand1");

                break;
        }

    }

    PreviousPlayerState(): void {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperation:
                this.m_PlayerState = PlayerState.PickingOperand1;
                console.log("Player is now on PickingOperan1");

                break;

            case PlayerState.PickingOperand2:
                this.m_PlayerState = PlayerState.PickingOperation;
                console.log("Player is now on PickingOperation");

                break;
            default:
                break;
        }
    }

    SetPickingOperand2() : void 
    {
        this.m_PlayerState = PlayerState.PickingOperand2;
    }

    IsCardWon(): boolean {
        return (this.CurrentOperation.result.n === 24 && this.CurrentOperation.result.d === 1);

    }


    IncrTotalCorrect(): number {
        this.m_TotalCorrect += 1;
        return this.m_TotalCorrect;
    }

    IncrTotalWrong(): number {
        this.m_TotalWrong += 1;
        return this.m_TotalWrong;
    }

    IsPickingOperand1(): boolean {
        return this.m_PlayerState === PlayerState.PickingOperand1;
    }

    IsPickingOperator(): boolean {
        return this.m_PlayerState === PlayerState.PickingOperation;
    }

    IsPickingOperand2(): boolean {
        return this.m_PlayerState === PlayerState.PickingOperand2;
    }

    IsOperationStackEmpty(): boolean {
        return this.m_OperationsStack.IsEmpty();
    }

    RevertToLastOperation(): Operation | undefined {
        let lastOperation = this.m_OperationsStack.Pop();
        if (!lastOperation)
            return undefined;

        this.CurrentOperation = lastOperation;
        // Update Numbers to the last operation results
        this.m_Numbers[lastOperation.operand1BtnIndex] = lastOperation.operand1;
        this.m_Numbers[lastOperation.operand2BtnIndex] = lastOperation.operand2;


        return lastOperation;
    }


    // ============= Getters =============

    GetNumbers() {
        return this.m_Numbers;
    }

    GetCurrentCard(): string {
        return this.m_CurrentCard;
    }

    GetCurrentOperation(): Operation {
        return this.CurrentOperation;
    }



}