import Phaser from 'phaser'

import BetterText from '../better/BetterText'
import BetterButton from '../better/BetterButton'
import CardGenerator from '../utils/CardGenerator'
import Solutions from '../utils/Solutions'
import ExprEval from 'expr-eval'
import Utils from '../utils/Utils'

enum ExpressionState {
    FirstOperand,
    Operator,       // (firstOp OPERATOR ?)
    SecondOperand, // (firstOp OPERATOR secondOp)

    ThirdOperand, // (firstOp OPERATOR secondOp) ? thirdOp
}

enum GameStage {
    Init, // The first moment after the main menu. 'New Card' still wasn't pressed.
    Start, // The first time the player presses the 'New card' button. Time starts ticking here (2 mins)
    Play, // 'New card' was pressed (doesn't matter when). The timer is ticking.
    End, // The timer ran out of time. Now the player can only click the 'Retry' button or the 'Menu' button
}


type GameState = {
    difficulty: number;

    currentCard: string; // A string like "1459"

    totalCorrect: integer;
    totalWrong: integer;

    stage: GameStage;

    expressionState: ExpressionState;


}


export default class SoloGame extends Phaser.Scene {
    private gameState!: GameState;

    // ====================== GROUPS ============================
    private group_cardButtons!: Phaser.GameObjects.Group;
    private group_operationButtons!: Phaser.GameObjects.Group;
    private group_allButtons!: Phaser.GameObjects.Group;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textPlayerInput!: BetterText; // The player input / arithmetic expression
    private textSolution!: BetterText; // debug only

    // Buttons
    private btnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private btnResetInput!: BetterButton;           // Resets player input. Lets him try again the current card.
    private btnBackspace!: BetterButton;           // Lets the user delete the last inserted character.

    private btnOperationAdd!: BetterButton;         // Perdorms Addition
    private btnOperationSubtract!: BetterButton;    // Performs Subtraction
    private btnOperationMultiply!: BetterButton;    // Performs Multiplication
    private btnOperationDivide!: BetterButton;      // Perfroms Division
    private btnLeftParent!: BetterButton;           // Adds a left parentheses
    private btnRightParent!: BetterButton;          // Adds a right parentheses
    private btnCheckSolution!: BetterButton;        // Checks if the user input's expression equates to 24

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

            stage: GameStage.Init,
            expressionState: ExpressionState.FirstOperand,

        };


        // Setup the events and their listeners
        this.events.on('Init', this.Handle_Init, this);
        this.events.on('Start', this.Handle_Start, this);
        this.events.on('Play', this.Handle_Play, this);
        this.events.on('End', this.Handle_End, this);

        this.events.on('BackspaceButtonClick', this.Handle_Backspace, this);

        this.events.on('NumberButtonClick', this.Handle_NumberButtonClick, this);

        // Game starts on 'Init' state
        this.events.emit('Init');
    }





    SetupLabels() {


        this.textTotalCorrect = new BetterText(this, 1920 - 320, 540 + 64, "Correctos: 0", { fontSize: 32, color: "#292d33", fontStyle: "bold" })
        this.textTotalWrong = new BetterText(this, 1920 - 320, 540 + 128, "Incorrectos: 0", { fontSize: 32, color: "#292d33", fontStyle: "bold" })


        this.textPlayerInput = new BetterText(this, window.innerWidth / 2, 128, "",
            { fontSize: 96, color: "#292d33", backgroundColor: "#fce303", align: "center", padding: { left: 32, right: 32, top: 32, bottom: 32 }, fixedWidth: 1024 * devicePixelRatio });
        this.textPlayerInput.setOrigin(0.5, 0.5);
        this.textSolution = new BetterText(this, 960, 1080 - 128, "", { fontSize: 32 });

    }

    SetupButtons() {


        // Setup a button for each number in the card (4 buttons)
        this.numberBtns = [
            new BetterButton(this, 640, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
            new BetterButton(this, 896, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
            new BetterButton(this, 1152, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
            new BetterButton(this, 1408, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
        ]

        for (let i = 0; i < this.numberBtns.length; i++) {
            // Each button starts disabled
            this.numberBtns[i].SetDisabled();


            this.numberBtns[i].on("pointerup", () => this.events.emit('NumberButtonClick', i, this.gameState.currentCard[i]));
           
            
        }

        // This button lets the user reset his attempt at the current card.
        this.btnResetInput = new BetterButton(this, window.innerWidth / 2 - 320, this.textPlayerInput.y + 128, 0.3, 0.3, "↺", { fontSize: 64 }, "btn");
        this.btnResetInput.on("pointerup", () => this.ResetInput());
        this.btnResetInput.SetDisabled();

       
        // 'Backspace' button
        this.btnBackspace = new BetterButton(this, window.innerWidth / 2 + 320, this.textPlayerInput.y + 128, 0.3, 0.3, '🠔', { fontSize: 32 }, "btn");
        this.btnBackspace.on("pointerup", () => this.events.emit('BackspaceButtonClick'));
        this.btnBackspace.SetDisabled();


        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, 1920 - 320, 1080 - 200, 0.2, 0.4, "+", { fontSize: 64 }, "btn");
        this.btnOperationAdd.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} + `));
        this.btnOperationAdd.SetDisabled();


        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, 1920 - 128, 1080 - 200, 0.2, 0.4, "-", { fontSize: 64 }, "btn");
        this.btnOperationSubtract.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} - `));
        this.btnOperationSubtract.SetDisabled();


        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, 1920 - 320, 1080 - 64, 0.2, 0.4, "x", { fontSize: 64 }, "btn");
        this.btnOperationMultiply.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} x `));
        this.btnOperationMultiply.SetDisabled();


        // Divion operation button
        this.btnOperationDivide = new BetterButton(this, 1920 - 128, 1080 - 64, 0.2, 0.4, "÷", { fontSize: 64 }, "btn");
        this.btnOperationDivide.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} / `));
        this.btnOperationDivide.SetDisabled();


        // Left parentheses
        this.btnLeftParent = new BetterButton(this, 1920 - 320, 1080 - 320, 0.2, 0.4, "(", { fontSize: 64 }, "btn");
        this.btnLeftParent.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text}(`));
        this.btnLeftParent.SetDisabled();

        // Right parentheses
        this.btnRightParent = new BetterButton(this, 1920 - 128, 1080 - 320, 0.2, 0.4, ")", { fontSize: 64 }, "btn");
        this.btnRightParent.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text})`));
        this.btnRightParent.SetDisabled();

        // Check solution button
        this.btnCheckSolution = new BetterButton(this, 960, 540 + 256, 0.3, 0.3, "CHECK", { fontSize: 32 }, "btn");
        this.btnCheckSolution.on("pointerup", () => this.CheckSolution());
        this.btnCheckSolution.SetDisabled();


        // 'New Card' button
        this.btnNewCard = new BetterButton(this, window.innerWidth / 2, 540 + 128, 0.3, 0.3, "NOVA CARTA", { fontSize: 32 }, "btn");
        this.btnNewCard.on("pointerup", () => this.NewCard());



        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, 128 + 32, 1080 - 64, 0.4, 0.4, "MENU", { fontSize: 64 }, "btn");
        this.btnGotoMenu.on("pointerup", () => this.scene.start("MainMenu"));

    }



    NewCard(): void {


        // const generatedCard: string = CardGenerator.GenerateCard(this.gameState.difficulty);
        //const generatedCard: string = this.cardGenerator.generateCard(this.gameState.difficulty);
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

        // We also reset the player input text box
        this.textPlayerInput.setText("");
        this.textPlayerInput.setBackgroundColor("#fce303");

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(this.gameState.currentCard)}`);

        console.log(this.gameState);

    }


    CheckSolution(): void {

        // Solutions.debugTest();

        // Get the player input text
        const arithExprText: string = this.textPlayerInput.text.replace(/x/g, ' * '); // We have to replace 'x's with '*' because the parser prefers '*' to denote multiplication.
        console.log("=> Input: " + arithExprText);

        /* 
            Here, we use 'epx-val' library's Parser that can parse arithmetic expressions.
            Because we can't trust the user to input a correct expression, we must be prepared to catch an exception.
        */

        let result = -1;
        try {
            result = ExprEval.Parser.evaluate(arithExprText); // The (winning) resul should be 24
        } catch (e) {
            console.log(e);
        }

        console.log("=> Result: " + result);


        // Check what happened
        if (result === 24) {
            console.log("=========== Correct!! YEY! ============");
            this.textPlayerInput.setBackgroundColor("#69f200")

            this.gameState.totalCorrect += 1;
            this.textTotalCorrect.setText(`Correctos: ${this.gameState.totalCorrect}`);

        }

        else {
            console.log("========== EHHHRRRRRRR!!!!! =============");
            this.textPlayerInput.setBackgroundColor("#eb310c")

            this.gameState.totalWrong += 1;
            this.textTotalWrong.setText(`Incorrectos: ${this.gameState.totalWrong}`);

        }

        // From this point, the player can only ask for a new card. He cannot try again.
        // So we disable the 'reset' button
        this.btnResetInput.SetDisabled();
        

        // Also disable the 'check' button
        this.btnCheckSolution.SetDisabled();

        
    }



    ResetInput() {
        // Reset the input box
        this.textPlayerInput.setText("");
        this.textPlayerInput.setBackgroundColor("#fce303");

        // Enable each of the card buttons
        for (let i = 0; i < this.numberBtns.length; i++) {
            // Each button starts disabled
            this.numberBtns[i].setInteractive();
            this.numberBtns[i].setAlpha(1);
        }

        // Disable the 'check' button
        this.btnCheckSolution.SetDisabled();
    }


    Handle_Init(): void {
        console.log("Init")
        // Setup labels 
        this.SetupLabels();

        // Setup ALL the buttons
        this.SetupButtons();

        this.events.emit("Start");
    }

    Handle_Start(): void {
        console.log("Start")

        this.events.emit("Play");
    }

    Handle_Play(): void {
        console.log("Play");


    }

    Handle_End(): void {
        console.log("End");

    }

    Handle_Backspace(): void
    {
        // If this backspace left the input blank, then disable the some buttons 
        if (this.textPlayerInput.text.length === 1)
        {
            // Empty input field. Disable the 'Check' button
            this.btnCheckSolution.SetDisabled();

            // Disable reset button
            this.btnResetInput.SetDisabled();

            // Also disable the 'backspace' button
            this.btnBackspace.SetDisabled();
        }
            
        
        
        const lastInsertedChar = this.textPlayerInput.text[this.textPlayerInput.text.length-1];
        if (Utils.IsNumeric(lastInsertedChar))
        {
            /*
                 We are trying to delete a number.
                 We go through all the buttons, 
                        and enable the first one with the same numbers
            */
            for (let i = 0; i < this.gameState.currentCard.length; i++)
            {
                if (this.gameState.currentCard[i] === lastInsertedChar && !this.numberBtns[i].IsEnabled())
                {
                    this.numberBtns[i].SetEnabled();
                    break; // We just want to enable one button
                }
            }


        } else 
        {
            
        }

        console.log(lastInsertedChar);
        const subtractedString = this.textPlayerInput.text.substr(0, this.textPlayerInput.text.length - 1);
        console.log("New input: " + subtractedString);

        // Set the new text
        this.textPlayerInput.setText(subtractedString);

        // Re-enable the corresponding number button
    }

    Handle_NumberButtonClick(clickedButtonIndex: number, num: number): void 
    {
        console.log("Clicked " + num);

        // Once a number button is clicked, it has to be disabled
        this.numberBtns[clickedButtonIndex].SetDisabled();

        // Add the number to the user input box
        this.textPlayerInput.setText(`${this.textPlayerInput.text}${num}`);

        // Enable the 'Check' button
        this.btnCheckSolution.SetEnabled();

        // Enable 'Backspace' button
        this.btnBackspace.SetEnabled();

        // Enable 'Reset' button
        this.btnResetInput.SetEnabled();

    }


}
