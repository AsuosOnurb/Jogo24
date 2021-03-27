import Phaser from 'phaser'
import solutions_map from './solutions_map.json'
import dificulty_map from './dificulty_map.json'

import BetterText from '~/better/BetterText'
import BetterButton from '~/better/BetterButton'

type GameState = {
    difficulty: string;

    currentTime: number;
    currentCard: string; // A string like "1459"

    totalCorrect: integer;
    totalWrong: integer;

}

export default class SoloGame extends Phaser.Scene {
    private gameState!: GameState;

    // ===================== UI Objects (text objects, buttons, etc....) ==================
    private textCurrentCard!: BetterText;

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
    private btnGotoMenu!: BetterButton;

    constructor() {
        super("SoloGame");
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
        this.textCurrentCard = new BetterText(this, window.innerWidth / 2 - 320, window.innerHeight / 2,
            this.gameState.currentCard, { fontSize: 96, color: "#292d33", fontStyle: "bold" } );

        this.textTotalCorrect = new BetterText(this, window.innerWidth - 300, window.innerHeight - 448, "CORRECTOS: 0", {fontSize: 32, color:"#292d33", fontStyle: "bold"})
        this.textTotalWrong = new BetterText(this, window.innerWidth - 300, window.innerHeight - 384, "INCORRECTOS: 0", {fontSize: 32, color:"#292d33", fontStyle: "bold"})

        
        this.textPlayerInput = new BetterText(this, window.innerWidth / 2 - 512, 128, "PLAYER INPUT HERE",
        { fontSize: 96, color: "#292d33", fontFamily:"bold",backgroundColor: "#fce303", align: "center", padding: { left: 32, right: 32, top: 32, bottom: 32 } });
    }

    setupCardButtons() {
        this.btnNewCard = new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2 + 128, 0.3, 0.3, "NOVA CARTA", {fontSize: 24}, "btn");
        console.log(this.btnNewCard);
        this.btnNewCard.on("pointerup", () => this.newCard());
    
        // Now we have to setup a button for each number in the card (4 buttons)

    }

    setupOperationButtons() {

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, window.innerWidth - 384, window.innerHeight - 256, 0.2, 0.4, "+", {fontSize: 64}, "btn");
        this.btnOperationAdd.on("pointerup", () => this.performAddition());

        // Subtraction operation button
        this.btnOperationSubtract =  new BetterButton(this, window.innerWidth - 128, window.innerHeight - 256, 0.2, 0.4, "-", {fontSize: 64}, "btn");
        this.btnOperationSubtract.on("pointerup", () => this.performSubtraction());

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, window.innerWidth - 384, window.innerHeight - 128, 0.2, 0.4, "x", {fontSize: 64}, "btn");
        this.btnOperationMultiply.on("pointerup", () => this.performMultiplication());

        // Divion operation button
        this.btnOperationDivide = new BetterButton(this, window.innerWidth - 128, window.innerHeight - 128, 0.2, 0.4, "÷", {fontSize: 64}, "btn");
        this.btnOperationDivide.on("pointerup", () => this.performDivision());
    }

    setupMiscButtons() {
        this.btnGotoMenu = new BetterButton(this, 128 + 32, window.innerHeight - 64, 0.4, 0.4, "MENU", {fontSize: 64}, "btn");
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
        const generatedCard: string = "1  7  9  9";
        this.gameState.currentCard = generatedCard;
        this.textCurrentCard.text = generatedCard;
    }


}
