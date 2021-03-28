import Phaser from 'phaser'


import BetterText from '~/better/BetterText'
import BetterButton from '~/better/BetterButton'

import CardGenerator from '~/game_objects/CardGenerator'

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
    private textPlayerInput!: BetterText; // The player input 

    // Buttons
    private btnNewCard!: BetterButton;
    private btnOperationAdd!: BetterButton;
    private btnOperationSubtract!: BetterButton;
    private btnOperationMultiply!:BetterButton;
    private btnOperationDivide!: BetterButton;
    private btnLeftParent!: BetterButton;
    private btnRightParent!: BetterButton;
    
    private btnGotoMenu!: BetterButton;

    /*
     Card Buttons.
     These buttons are changed everytime we generate a new card. 
     Each button is associated with one of the 4 numbers.
    */
    private numberBtns!: Array<BetterButton>;
    


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


    preload() {

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

    }


    setupLabels() {
       

        this.textTotalCorrect = new BetterText(this, 1920 - 320, 540 + 64, "CORRECTOS: 0", {fontSize: 32, color:"#292d33", fontStyle: "bold"})
        this.textTotalWrong = new BetterText(this,  1920 - 320, 540 + 128, "INCORRECTOS: 0", {fontSize: 32, color:"#292d33", fontStyle: "bold"})

        
        this.textPlayerInput = new BetterText(this, 480 , 128, "",
        { fontSize: 96, color: "#292d33", fontFamily:"bold",backgroundColor: "#fce303", align: "center", padding: { left: 32, right: 32, top: 32, bottom: 32 } });
    }

    setupCardButtons() {
        this.btnNewCard = new BetterButton(this, 960, 540+ 128, 0.3, 0.3, "NOVA CARTA", {fontSize: 24}, "btn");
        console.log(this.btnNewCard);
        this.btnNewCard.on("pointerup", () => this.newCard());
    
        // Now we have to setup a button for each number in the card (4 buttons)
        this.numberBtns  = [
            new BetterButton(this, 640, 540, 0.3, 0.5, "?", {fontSize: 96}, "btn"),
            new BetterButton(this, 896, 540, 0.3, 0.5, "?", {fontSize: 96}, "btn"),
            new BetterButton(this, 1152, 540, 0.3, 0.5, "?", {fontSize: 96}, "btn"),
            new BetterButton(this, 1408, 540, 0.3, 0.5, "?", {fontSize: 96}, "btn"),
        ]

        for(let i = 0; i < this.numberBtns.length; i++)
            this.numberBtns[i].on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text}${this.gameState.currentCard[i]}`));

    }

    setupOperationButtons() {

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, 1920 - 320, 1080 -  200, 0.2, 0.4, "+", {fontSize: 64}, "btn");
        this.btnOperationAdd.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} + `));

        // Subtraction operation button
        this.btnOperationSubtract =  new BetterButton(this, 1920 - 128, 1080 - 200, 0.2, 0.4, "-", {fontSize: 64}, "btn");
        this.btnOperationSubtract.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} - `));

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this,1920 - 320, 1080 - 64, 0.2, 0.4, "x", {fontSize: 64}, "btn");
        this.btnOperationMultiply.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} * `));

        // Divion operation button
        this.btnOperationDivide = new BetterButton(this, 1920 - 128, 1080 - 64, 0.2, 0.4, "÷", {fontSize: 64}, "btn");
        this.btnOperationDivide.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text} / `));

        // Left parentheses
        this.btnLeftParent = new BetterButton(this, 1920 - 320, 1080 - 320, 0.2, 0.4, "(", {fontSize: 64}, "btn");
        this.btnLeftParent.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text}(`));

        // Right parentheses
        this.btnRightParent = new BetterButton(this, 1920 - 128, 1080 - 320, 0.2, 0.4, ")", {fontSize: 64}, "btn");
        this.btnRightParent.on("pointerup", () => this.textPlayerInput.setText(`${this.textPlayerInput.text})`));

    }

    setupMiscButtons() {
        this.btnGotoMenu = new BetterButton(this, 128 + 32, 1080-64, 0.4, 0.4, "MENU", {fontSize: 64}, "btn");
        this.btnGotoMenu.on("pointerup", () => this.scene.start("MainMenu"));
    }

    performAddition(): void {
        console.log("Performing Addition");
    }

    performSubtraction(): void {
        console.log("Performing Subtraction");

    }

    performMultiplication(): void {
        console.log("Performing Multiplication");

    }

    performDivision(): void {
        console.log("Performing Division");

    }

    newCard(): void {
        // const generatedCard: string = CardGenerator.GenerateCard(this.gameState.difficulty);
        const generatedCard: string = this.cardGenerator.generateCard(this.gameState.difficulty);

        this.gameState.currentCard = generatedCard;

        // Change the current card number buttons
        for(let i = 0; i < generatedCard.length; i++)
            this.numberBtns[i].setText(generatedCard[i]);
    }


}
