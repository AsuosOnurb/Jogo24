import Phaser from 'phaser'


import BetterText from '~/better/BetterText'
import BetterButton from '~/better/BetterButton'

import CardGenerator from '~/game_objects/CardGenerator'

import ExprEval from 'expr-eval'
import Solutions from '~/game_objects/Solutions'

type GameState = {
    difficulty: number;

    currentTime: number;
    currentCard: string; // A string like "1459"

    totalCorrect: integer;
    totalWrong: integer;

}


export default class SoloGame extends Phaser.Scene {
    private gameState!: GameState;
    private cardGenerator!: CardGenerator;

    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textPlayerInput!: BetterText; // The player input / arithmetic expression
    private textSolution!: BetterText; // debug only

    // Buttons
    private btnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private btnResetInput!: BetterButton;           // Restes player input. Lets him try again the current card.

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

    private initialTime;
    private timedEvent;
    private timerText;

    constructor() {
        super("SoloGame");

        this.cardGenerator = new CardGenerator();
    }

    init(data) {
        this.gameState = {
            difficulty: data.difficulty,
            currentTime: 0.0,
            currentCard: "?  ?  ?  ?",
            totalCorrect: 0,
            totalWrong: 0
        };


    }

    create() {
        // Setup labels 
        this.setupLabels();

        // Setup the number buttons and the "New Card" button
        this.setupCardButtons();

        // Setup the operation button: "Add", "Multiply", etc..
        this.setupOperationButtons();

        // Setup buttons like "Go to Menu" and things like that...
        this.setupMiscButtons();
    }

    update() {
        //this.updateTimer();
    }


    setupLabels() {


        this.textTotalCorrect = new BetterText(this, 1920 - 320, 540 + 64, "Correctos: 0", { fontSize: 32, color: "#292d33", fontStyle: "bold" })
        this.textTotalWrong = new BetterText(this, 1920 - 320, 540 + 128, "Incorrectos: 0", { fontSize: 32, color: "#292d33", fontStyle: "bold" })


        this.textPlayerInput = new BetterText(this, 480, 128, "",
            { fontSize: 96, color: "#292d33", backgroundColor: "#fce303", align: "center", padding: { left: 32, right: 32, top: 32, bottom: 32 }, fixedWidth: 1024 * devicePixelRatio });

        this.textSolution = new BetterText(this, 960, 1080 - 128, "", { fontSize: 32 });

    }

    setupCardButtons() {
        this.btnNewCard = new BetterButton(this, 960, 540 + 128, 0.3, 0.3, "NOVA CARTA", { fontSize: 32 }, "btn");
        this.btnNewCard.on("pointerup", () => this.newCard());

        // Now we have to setup a button for each number in the card (4 buttons)
        this.numberBtns = [
            new BetterButton(this, 640, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
            new BetterButton(this, 896, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
            new BetterButton(this, 1152, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
            new BetterButton(this, 1408, 540, 0.3, 0.5, "?", { fontSize: 96 }, "btn"),
        ]

        for (let i = 0; i < this.numberBtns.length; i++) {
            // Each button starts disabled
            this.numberBtns[i].disableInteractive();
            this.numberBtns[i].setAlpha(0.3);


            this.numberBtns[i].on("pointerup", () => {
                // Once a number button is clicked, it has to be disabled
                this.numberBtns[i].disableInteractive();
                this.numberBtns[i].setAlpha(0.3);

                // Add the number to the user input box
                this.textPlayerInput.setText(`${this.textPlayerInput.text}${this.gameState.currentCard[i]}`);

            });
        }

        // This button lets the user reset his attempt at the current card.
        this.btnResetInput = new BetterButton(this, 960, this.textPlayerInput.y + 48, 0.3, 0.3, "↺", { fontSize: 64 }, "btn");
        this.btnResetInput.on("pointerup", () => 
        {
            // Reset the input box
            this.textPlayerInput.setText(""); 
            this.textPlayerInput.setBackgroundColor("#fce303");

            // Enable each of the card buttons
            for (let i = 0; i < this.numberBtns.length; i++) {
                // Each button starts disabled
                this.numberBtns[i].setInteractive();
                this.numberBtns[i].setAlpha(1);
    
            }

        });



    }

    setupOperationButtons() {

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, 1920 - 320, 1080 - 200, 0.2, 0.4, "+", { fontSize: 64 }, "btn");
        this.btnOperationAdd.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} + `));

        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, 1920 - 128, 1080 - 200, 0.2, 0.4, "-", { fontSize: 64 }, "btn");
        this.btnOperationSubtract.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} - `));

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, 1920 - 320, 1080 - 64, 0.2, 0.4, "x", { fontSize: 64 }, "btn");
        this.btnOperationMultiply.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} x `));

        // Divion operation button
        this.btnOperationDivide = new BetterButton(this, 1920 - 128, 1080 - 64, 0.2, 0.4, "÷", { fontSize: 64 }, "btn");
        this.btnOperationDivide.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} / `));

        // Left parentheses
        this.btnLeftParent = new BetterButton(this, 1920 - 320, 1080 - 320, 0.2, 0.4, "(", { fontSize: 64 }, "btn");
        this.btnLeftParent.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text}(`));

        // Right parentheses
        this.btnRightParent = new BetterButton(this, 1920 - 128, 1080 - 320, 0.2, 0.4, ")", { fontSize: 64 }, "btn");
        this.btnRightParent.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text})`));

        // Check solution button
        this.btnCheckSolution = new BetterButton(this, 960, 540 + 256, 0.3, 0.3, "CHECK", { fontSize: 32 }, "btn");
        this.btnCheckSolution.on("pointerup", () => this.checkSolution());

    }

    setupMiscButtons() {
        this.btnGotoMenu = new BetterButton(this, 128 + 32, 1080 - 64, 0.4, 0.4, "MENU", { fontSize: 64 }, "btn");
        this.btnGotoMenu.on("pointerup", () => this.scene.start("MainMenu"));
    }


    newCard(): void {
        // const generatedCard: string = CardGenerator.GenerateCard(this.gameState.difficulty);
        const generatedCard: string = this.cardGenerator.generateCard(this.gameState.difficulty);

        this.gameState.currentCard = generatedCard;

        // Change the current card number buttons
        for (let i = 0; i < generatedCard.length; i++) {
            // Set the text of the number button
            this.numberBtns[i].setText(generatedCard[i]);

            // Make te button interactive
            this.numberBtns[i].setInteractive();

            // Remove transparency
            this.numberBtns[i].setAlpha(1);


        }

        // Make the 'reset' and 'check' buttons enabled again
        this.btnResetInput.setInteractive();
        this.btnResetInput.setAlpha(1);
        this.btnCheckSolution.setInteractive();
        this.btnCheckSolution.setAlpha(1);

        // We can also reset the player input text box
        this.textPlayerInput.setText("");
        this.textPlayerInput.setBackgroundColor("#fce303");

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(this.gameState.currentCard)}`);

        this.timer_function();
    }


    checkSolution(): void {

        // Solutions.debugTest();
        
        // Get the player input text
        const arithExprText: string = this.textPlayerInput.text.replace(/x/g, ' * '); // We have to replace 'x's with '*' because the parser prefers '*' to denote multiplication.
        console.log("=> Input: " + arithExprText);
        
        /* 
            Here, we use 'epx-val' library's Parser that can parse arithmetic expressions.
            Because we can't trust the user to input a correct expression, we must be prepared to catch an exception.
        */
        
        let result = -1;
        try 
        {
            result = ExprEval.Parser.evaluate(arithExprText); // The (winning) resul should be 24
        } catch (e)
        {
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
        this.btnResetInput.disableInteractive();
        this.btnResetInput.setAlpha(0.3);

        // Also disable the 'check' button
        this.btnCheckSolution.disableInteractive();
        this.btnCheckSolution.setAlpha(0.3);



    }
    
    timer_function(): void {
        console.log('create');
        // 1 minute in seconds
        this.initialTime = 60;

        this.timerText = new BetterText(this,256 , window.innerHeight / 2,"00:"+ this.initialTime,{font: "100px Arial", fill: "#fff"});

        // Each 1000 ms call onEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
    }

    formatTime(seconds): string{
        // Returns formated time
        if (seconds < 10)
            return `00:0${seconds}`;
        return `00:${seconds}`;
    }

    onEvent(): void{
    this.initialTime -= 1; // One second
    this.timerText.setText(this.formatTime(this.initialTime));
    }

}
