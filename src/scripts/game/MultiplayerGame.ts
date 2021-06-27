// MultiplayerGame.ts
/**
 * Module responsible for the implementation of the Multiplayer's backend (the logics side of things).
 * @module
 */


import { evaluate, format} from 'mathjs'
import { Operation } from '../utils/Operations'
import { CardGenerator, Difficulty } from "../utils/CardGenerator";
import { IsNumeric } from '../utils/Utils';


export enum PlayerState {
    PickingOperand1 = 1,
    PickingOperator = 2,
    PickingOperand2 = 3
};

class Player {
    private score: number;

    constructor() {
        this.score = 0;
    }

    GetScore(): number {
        return this.score;
    }

    AddPoint(): void {
        this.score += 1;
    }

    SubtractPoint(): void {
        this.score -= 1;
    }
}

export class MultiplayerGame {

    public readonly difficulty: Difficulty;
    private currentCard: string;

    public readonly MAX_CARD_TOTAL: number = 12;
    private cardTotal: number;

    private players: Array<Player>;
    private currentPlayer: number; // numbers [0,1,2,3]
    private playerState: PlayerState;

    private currentOperation: Operation;




    constructor(difficulty: Difficulty) {

        // Assign the difficulty
        this.difficulty = difficulty;

        // When the game starts, the cards start with this default '????' look.
        this.currentCard = "????";

        // Initialize the card counter
        this.cardTotal = 0;

        // We're going to have four players
        this.players = [
            new Player(),
            new Player(),
            new Player(),
            new Player(),
        ];

        // Initialize the player state
        this.playerState = PlayerState.PickingOperand1;

        this.currentOperation = new Operation();
    }


    /**
     * Resets the game state.
     * 
     * @remarks This procedure does 2 things:
     * 1. Starts by generating a new card.
     * 2. Then resets the current operation's state.
     */
    NewCard(): void {
        this.currentCard = CardGenerator.GenerateCard(this.difficulty);

        this.ResetOperationState();
    }

    /* ============================== Picking operands and operator =================================== */

    PickOperand1(operand, index): void {
        this.currentOperation.operand1 = operand;
        this.currentOperation.operand1BtnIndex = index;

        this.playerState = PlayerState.PickingOperator;
    }

    PickOperand2(operand, index): string {

        // Assign the second operand
        this.currentOperation.operand2 = operand;
        this.currentOperation.operand2BtnIndex = index;

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
        let operationExpression = this.currentOperation.expression;

        // The cycle restarts. The player now has to pick the first operand for a whole new operation.
        this.ResetOperationState();

        return operationExpression;
    }

    PickOperator(operator: string): string {

        // Update the current operator
        this.currentOperation.operator = operator;

        // Advance to the next state
        this.playerState = PlayerState.PickingOperand2;


        // We can also return, here, the most recent expression string.
        // If the first operand is just a single number, then we dont need a parentheses around it.
        // If it a more complex expression, then we put partentheses around it.

        if (IsNumeric(this.currentOperation.operand1))
            return `${this.currentOperation.operand1}${operator}`;
        else
            return `(${this.currentOperation.operand1})${operator}`;
    }


    CheckSolution(expression: string): boolean {
        const val = evaluate(expression.replaceAll("x", "*"));
        const newVal = format(val, {precision: 14})

        return newVal === "24";
    }


    /* ============================================== Getters and Setter ============================================== */

    /* ========================= Player Score =========================== */
    IncrTotalCorrect(): number {
        this.players[this.currentPlayer].AddPoint();
        return this.players[this.currentPlayer].GetScore();
    }

    IncrTotalWrong(): number {
        this.players[this.currentPlayer].SubtractPoint();
        return this.players[this.currentPlayer].GetScore();
    }

    GetCurrentPlayerScore(): number {
        return this.players[this.currentPlayer].GetScore();
    }

    IsGameTied() : boolean
    {
        return this.players[0].GetScore() === this.players[1].GetScore() &&
                this.players[1].GetScore() === this.players[2].GetScore() && 
                this.players[2].GetScore() === this.players[3].GetScore();
    }

    GetWinningPlayersIndexes() : Array<number>
    {
        let scoresArray = new Array<number>();
        this.players.forEach((p) => scoresArray.push(p.GetScore()));

        // Get the max score on the scores array
        const maxScore = Math.max.apply(null, scoresArray);

        // Find the indexes that have this max score
        let winningIndexes = new Array<number>();
        for(let i = 0; i < scoresArray.length; i++)
        {
            if (scoresArray[i] === maxScore)
                winningIndexes.push(i);
        }

        return winningIndexes;

    }

    GetWinningScore() : number 
    {
        let indexes = this.GetWinningPlayersIndexes();
        return this.players[indexes[0]].GetScore();
    }


    /* ==================== Player State ============= */

    GetPlayerState(): PlayerState {
        return this.playerState;
    }

    /**
   * Resets the operation state.
   * 
   * @remarks This procedure resets the current operation. It also sets the player state to {@link PlayerState.PickingOperand1}.
   */
    ResetOperationState(): void {
        // Player has to pick the first operand
        this.playerState = PlayerState.PickingOperand1;
        this.currentOperation = new Operation();
    }


    /* ================== Cards ===================== */

    GetCurrentCard(): string {
        return this.currentCard;
    }

    IncrementTotalCardsUsed(): number {
        this.cardTotal += 1;
        return this.cardTotal;
    }

    IsMaxCardCountReached() : boolean
    {
        return this.cardTotal === this.MAX_CARD_TOTAL
    }

    /* ============= Player Order/Turn Management ================== */
    GetCurrentPlayer(): number {
        return this.currentPlayer;
    }

    SetCurrentPlayer(playerNum: number) {
        this.currentPlayer = playerNum;
    }








}