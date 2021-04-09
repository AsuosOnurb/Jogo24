import Phaser from 'phaser'

import BetterText from '../better/BetterText'
import BetterButton from '../better/BetterButton'
import CardGenerator from '../utils/CardGenerator'
import Solutions from '../utils/Solutions'
import ExprEval from 'expr-eval'
import Utils from '../utils/Utils'


enum State {
    PickingOperand1,
    PickingOperation,
    PickingOperand2
}

type GameState = {
    difficulty: number;

    currentCard: string; // A string like "1459"
    totalCorrect: integer;
    totalWrong: integer;

    // operand1 operation operand2 = result
    state: State;
    operand1: integer;
    operation: string;
    operand2: integer;
    result: integer;


}


export default class SoloGame extends Phaser.Scene {
    private isInstanced: boolean = false;
    private gameState!: GameState;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textMessage!: BetterText; // Displays on the top bar
    private textSolution!: BetterText; // debug only

    // Buttons
    private btnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private btnResetInput!: BetterButton;           // Resets player input. Lets him try again the current card.
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
        super("SoloGame");

    }




    init(data) {


        this.gameState = {
            difficulty: data.difficulty,
            currentCard: "?  ?  ?  ?",
            totalCorrect: 0,
            totalWrong: 0,

            operand1: 0,
            operation: "?",
            operand2: 0,
            result: 0,
            state: State.PickingOperand1


        };

        if (!this.isInstanced) {

            // this.events.on('BackspaceButtonClick', this.Handle_Backspace, this);
            this.events.on('NumberButtonClick', this.Handle_NumberButtonClick, this);
            this.events.on('OperationButtonClick', this.Handle_OperationButtonClick, this);


        }

        // Add background image 
        const bgImg = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'blueBackground');
        bgImg.setScale(1.44, 1.37);

        // Insert the title image
        const titleImg = this.add.sprite(256, 96, 'smallTitle');
        titleImg.setScale(1, 1);

        // Add card background image
        const cardBG = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'cardBG');

        // Add the corect/incorrect label backgrounds
        const correctBG = this.add.sprite(window.innerWidth - 192, window.innerHeight - 400 - 196, 'correctCounter')
        const wrongBG = this.add.sprite(window.innerWidth - 192, window.innerHeight - 450, 'wrongCounter')

        // Add the player input bar ::: TODO: We should probably just delete this? (Because we aren't gonna use it?)
        const inputBG = this.add.sprite(window.innerWidth / 2, 128, 'inputBar');

        // We might as well, for now, use the input bar as a place for player messages
        this.textMessage = new BetterText(this, window.innerWidth / 2, 128, "", { fontSize: 48, color: "#ffffff", fontStyle: "bold", align: "center" });
        this.textMessage.setOrigin(0.5, 0.5);

        // Setup labels 
        this.SetupLabels();

        // Setup ALL the buttons
        this.SetupButtons();

        this.events.emit("Start");


        this.textSolution = new BetterText(this, 960, 1080 - 128, "", { fontSize: 32 });

        this.isInstanced = true;

    }



    // =============================== Game Setup (Button events/callbacks, labels/texts) ===================

    SetupLabels() {


        this.textTotalCorrect = new BetterText(this, window.innerWidth - 128, window.innerHeight - 600, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalCorrect.setOrigin(0.5, 0.5);
        this.textTotalWrong = new BetterText(this, window.innerWidth - 128, window.innerHeight - 452, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalWrong.setOrigin(0.5, 0.5);

        //this.textPlayerInput = new BetterText(this, window.innerWidth / 2, 128, "",
        //  { fontSize: 96, color: "#292d33", backgroundColor: "#fce303", align: "center", padding: { left: 32, right: 32, top: 32, bottom: 32 }, fixedWidth: 1024 * devicePixelRatio });
        //this.textPlayerInput.setOrigin(0.5, 0.5);
        //this.textSolution = new BetterText(this, 960, 1080 - 128, "", { fontSize: 32 });

    }

    SetupButtons() {


        // Setup a button for each number in the card (4 buttons)
        this.numberBtns = [
            new BetterButton(this, window.innerWidth / 2 - 196, window.innerHeight / 2, 0.3, 0.3, "?", { fontSize: 96 }, "cardBG"),
            new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2 - 196, 0.3, 0.3, "?", { fontSize: 96 }, "cardBG"),
            new BetterButton(this, window.innerWidth / 2 + 196, window.innerHeight / 2, 0.3, 0.3, "?", { fontSize: 96 }, "cardBG"),
            new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2 + 196, 0.3, 0.3, "?", { fontSize: 96 }, "cardBG"),

        ]

        for (let i = 0; i < this.numberBtns.length; i++) {
            // Each button starts disabled
            this.numberBtns[i].SetDisabled();
            this.numberBtns[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, parseInt(this.numberBtns[i].GetText())));
        }

        // This button lets the user reset his attempt at the current card.
        this.btnResetInput = new BetterButton(this, window.innerWidth / 2 - 320, 512, 0.3, 0.3, "↺", { fontSize: 64 }, "btn");
        // this.btnResetInput.on("pointerup", () => this.ResetInput());
        this.btnResetInput.SetDisabled();


        // 'Backspace' button
        this.btnBackspace = new BetterButton(this, window.innerWidth / 2 + 320, 512, 0.3, 0.3, '🠔', { fontSize: 32 }, "btn");
        this.btnBackspace.on("pointerup", () => this.events.emit('BackspaceButtonClick'));
        this.btnBackspace.SetDisabled();



        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, window.innerWidth - 256, window.innerHeight - 256, 0.8, 0.8, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "addition"));
        this.btnOperationAdd.SetDisabled();


        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, window.innerWidth - 96, window.innerHeight - 256, 0.8, 0.8, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "subtraction"));
        this.btnOperationSubtract.SetDisabled();



        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, window.innerWidth - 256, window.innerHeight - 96, 0.8, 0.8, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "multiplication"));
        this.btnOperationMultiply.SetDisabled();



        // Division operation button
        this.btnOperationDivide = new BetterButton(this, window.innerWidth - 96, window.innerHeight - 96, 0.8, 0.8, "", { fontSize: 64 }, "btn_division");
        this.btnOperationDivide.on("pointerup", () => this.events.emit('OperationButtonClick', "division"));
        this.btnOperationDivide.SetDisabled();



        // 'New Card' button
        this.btnNewCard = new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2, 0.3, 0.3, "", { fontSize: 32 }, "btn_playCard");
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
        this.gameState.operand1 = -1;
        this.gameState.operand2 = -1;
        this.gameState.result = -1;
        this.gameState.operation = "none";
        this.gameState.state = State.PickingOperand1;

        // Delete the top bar message
        this.textMessage.setText("");

        const generatedCard: string = CardGenerator.generateCard(this.gameState.difficulty);

        this.gameState.currentCard = generatedCard;

        // Change the current card number buttons
        for (let i = 0; i < generatedCard.length; i++) {
            // Set the text of the number button
            this.numberBtns[i].SetText(generatedCard[i]);

            // Enable the button
            this.numberBtns[i].SetEnabled();

        }

        // DIsable 'Reset' button
        this.btnResetInput.SetDisabled();

        // Disable 'Backspace' button
        this.btnBackspace.SetDisabled();

        // Disable Operation buttons
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(this.gameState.currentCard)}`);

        console.log(this.gameState);

    }


    CheckSolution(): void {
        // Check if we have 3 disabled/picked cards
        let disabledCardCount = 0;
        for (let i = 0; i < 4; i++) {
            if (!this.numberBtns[i].IsEnabled())
                disabledCardCount += 1;
        }

        if (disabledCardCount === 3) {

            if (this.gameState.result === 24)
            {
                console.log(" !!!! PLAYER WON !!!!");
                this.textMessage.setText("CORRECTO !");
                // Update game state
                this.gameState.totalCorrect += 1;
                this.textTotalCorrect.setText(this.gameState.totalCorrect.toString());

            }
            else
            {
                console.log(" WRONG ANSWER ");
                this.textMessage.setText("INCORRECTO !");

                this.gameState.totalWrong += 1;
                this.textTotalWrong.setText(this.gameState.totalWrong.toString());

            }

        }


    }



    Handle_NumberButtonClick(clickedButtonIndex: number, num: number): void {

        // We decide what happens next based on the current state
        if (this.gameState.state == State.PickingOperand1) {
            // User is picking the first operand
            this.gameState.operand1 = num;

            // Disable the number button
            this.numberBtns[clickedButtonIndex].SetDisabled();

            console.log("Clicked number " + num + " as first operand.");

            // Then he has to pick an operation
            this.gameState.state = State.PickingOperation;

            // We have to enable the operation buttons 
            // Operation buttons can be disabled
            this.btnOperationAdd.SetEnabled();
            this.btnOperationSubtract.SetEnabled();
            this.btnOperationMultiply.SetEnabled();
            this.btnOperationDivide.SetEnabled();

        } else if (this.gameState.state == State.PickingOperand2) {
            // User is picking the second operand. 
            this.gameState.operand2 = num;

            console.log("Clicked number " + num + " as second operand.");

            // If user is on this state, it means he already picked a first operand and an operation.
            // Apply the operation to operand 1 and operand 2.
            switch (this.gameState.operation) {
                case "addition":
                    {
                        this.gameState.result = this.gameState.operand1 + this.gameState.operand2;
                        break;
                    }

                case "subtraction":
                    {
                        this.gameState.result = this.gameState.operand1 - this.gameState.operand2;
                        break;
                    }

                case "multiplication":
                    {
                        this.gameState.result = this.gameState.operand1 * this.gameState.operand2;
                        break;
                    }

                case "division":
                    {
                        this.gameState.result = this.gameState.operand1 / this.gameState.operand2;
                        break;
                    }
            }

            // The result is stored/shown in the last picked number button (operand 2 button)
            this.numberBtns[clickedButtonIndex].SetText(this.gameState.result.toString());
            console.log("Operation resulted in: " + this.gameState.result.toString() + "\n\n=======================================");



            // Here is where we check for the solution
            // If 3 cards are picked/disable and the the result is 24, then the player won.
            this.CheckSolution();


            console.log("PLayer now has to chose the first operand again.");

            // The operation was completed. Now the player has to pick a new first operand again.
            this.gameState.state = State.PickingOperand1;

            // Operation buttons can be disabled
            this.btnOperationAdd.SetDisabled();
            this.btnOperationSubtract.SetDisabled();
            this.btnOperationMultiply.SetDisabled();
            this.btnOperationDivide.SetDisabled();
        }

        // Enable 'Backspace' button
        this.btnBackspace.SetEnabled();

        // Enable 'Reset' button
        this.btnResetInput.SetEnabled();

    }

    Handle_OperationButtonClick(operation: string) {
        console.log("Operation: " + operation);
        this.gameState.operation = operation;

        // Player chose the operation. Now he has to pick the second operan
        this.gameState.state = State.PickingOperand2;
    }



}
