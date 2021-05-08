

import { Operation } from "./Operations";
import { CardGenerator, Difficulty } from "./CardGenerator";
import { OperationsStack } from "./OperationStack";

enum PlayerState {
    PickingOperand1,
    PickingOperator1,
    PickingOperand2,

    CrossRoads,
    PickingMiddleOperator,

    PickingOtherExpressionOperand1,
    PickingOtherExpressionOperand2,
    PickingOtherExpressionOperator,


    PickingLastOperator,
    PickingLastOperand,

    Done



}

export class SingleplayerGame {

    public readonly Difficulty: Difficulty;
    private m_CurrentCard: string;

    private m_TotalCorrect: number;
    private m_TotalWrong: number;

    private m_PlayerState: PlayerState;

    private CurrentString: string;


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

        this.CurrentString = ""

    }



    NewCard(): string {
        this.m_CurrentCard = CardGenerator.generateCard(this.Difficulty);
        this.ResetState();

        return this.m_CurrentCard;
    }

    /*
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
    */

    /*
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
    */


    IncrTotalCorrect(): number {
        this.m_TotalCorrect += 1;
        return this.m_TotalCorrect;
    }

    IncrTotalWrong(): number {
        this.m_TotalWrong += 1;
        return this.m_TotalWrong;
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

        this.CurrentString = "";


    }

    NewNumber(num: string): string {

        switch (this.m_PlayerState) {
            case PlayerState.PickingOperand1:
                this.m_PlayerState = PlayerState.PickingOperator1;
                return (this.CurrentString += num);

            case PlayerState.PickingOperand2:
                this.m_PlayerState = PlayerState.CrossRoads;
                return (this.CurrentString += num);

            case PlayerState.CrossRoads:
                this.m_PlayerState = PlayerState.PickingOtherExpressionOperator;
                return (this.CurrentString = ` (${this.CurrentString}) ? (${num}`);

            case PlayerState.PickingOtherExpressionOperand2:
                this.m_PlayerState = PlayerState.PickingMiddleOperator;
                return (this.CurrentString += `${num})`);

            case PlayerState.PickingOtherExpressionOperand1:
                this.m_PlayerState = PlayerState.PickingLastOperator;
                this.CurrentString = `(${this.CurrentString} ${num})`;
                return this.CurrentString;

            case PlayerState.PickingLastOperand:
                this.m_PlayerState = PlayerState.Done;
                return (this.CurrentString += num);
            default:
                break;
        }

        return "";

    }

    NewOperation(op: string): string {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperator1:
                this.m_PlayerState = PlayerState.PickingOperand2;
                return (this.CurrentString += ` ${op} `);

            case PlayerState.PickingOtherExpressionOperator:
                this.m_PlayerState = PlayerState.PickingOtherExpressionOperand2;
                return (this.CurrentString += ` ${op} `);

            case PlayerState.PickingMiddleOperator:
                this.m_PlayerState = PlayerState.Done;

                const splits = this.CurrentString.split('?')
                console.log(splits);
                this.CurrentString = splits[0] + op + splits[1];
                return this.CurrentString;

            case PlayerState.CrossRoads:
                this.m_PlayerState = PlayerState.PickingOtherExpressionOperand1;
                this.CurrentString = `(${this.CurrentString}) ${op}`;
                return this.CurrentString;

            case PlayerState.PickingLastOperator:
                this.m_PlayerState = PlayerState.PickingLastOperand;
                return (this.CurrentString += op);



        }

        return this.CurrentString;
    }

    GetPlayerState(): string {
        switch (this.m_PlayerState) {
            case PlayerState.PickingOperand1:
                return "Picking operand 1";

            case PlayerState.PickingOperand2:
                return "Picking operand 2";

            case PlayerState.PickingOperator1:
                return "Picking operator 1";

            case PlayerState.PickingOtherExpressionOperand1:
                return "Picking other operand 1";

            case PlayerState.PickingOtherExpressionOperand2:
                return "Picking other operand 2";

            case PlayerState.PickingOtherExpressionOperator:
                return "Picking other operator";

            case PlayerState.PickingMiddleOperator:
                return "Picking middle operator";

            case PlayerState.CrossRoads:
                return "At crossroads";

            case PlayerState.PickingLastOperand:
                return "Picking last operand";

                case PlayerState.PickingLastOperator:
                    return "Picking last operator";

            case PlayerState.Done:
                return "Done";
            default:
                return ""

        }
    }
}


