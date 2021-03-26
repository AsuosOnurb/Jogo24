import Phaser from 'phaser'
import solutions_map from './solutions_map.json';

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
    private textCurrentCard!: Phaser.GameObjects.Text;

    // Text
    private textTotalWrong!: Phaser.GameObjects.Text; // Total wrong counter label
    private textTotalCorrect!: Phaser.GameObjects.Text; // Total correct counter label
    private textPlayerInput!: Phaser.GameObjects.Text; // The player input 

    // Buttons
    private btnNewCard!: Phaser.GameObjects.Sprite;
    private btnNewCardText!: Phaser.GameObjects.Text;

    private btnOperationAdd!: Phaser.GameObjects.Sprite;
    private btnOperationAddText!: Phaser.GameObjects.Text;

    private btnOperationSubtract!: Phaser.GameObjects.Sprite;
    private btnOperationSubtractText!: Phaser.GameObjects.Text;

    private btnOperationMultiply!: Phaser.GameObjects.Sprite;
    private btnOperationMultiplyText!: Phaser.GameObjects.Text;

    private btnOperationDivide!: Phaser.GameObjects.Sprite;
    private btnOperationDivideText!: Phaser.GameObjects.Text;

    private btnGotoMenu!: Phaser.GameObjects.Sprite;

    constructor() {
        super("SoloGame");
        console.log(`Started scene 'SoloGame' .`)
    }

    init(data) {
        this.gameState = {
            difficulty: data.difficulty,
            currentTime: 0.0,
            currentCard: "?  ?  ?  ?",
            totalCorrect: 0,
            totalWrong: 0
        };
        console.log(this.gameState);


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
        this.textCurrentCard = this.add.text(window.innerWidth / 2 - 320, window.innerHeight / 2,
            this.gameState.currentCard, { fontSize: "96px", color: "#292d33", fontStyle: "bold" });

        this.textTotalCorrect = this.add.text(16, 16, "Correctos: 0", { fontSize: "32px", color: "#292d33", fontStyle: "bold" });
        this.textTotalWrong = this.add.text(16, 64, "Incorrectos: 0", { fontSize: "32px", color: "#292d33", fontStyle: "bold" });


        this.textPlayerInput = this.add.text(window.innerWidth / 2 - 512, 128, "PLAYER INPUT HERE",
            { fontSize: "96px", color: "#292d33", backgroundColor: "#fce303", align: "center", padding: { left: 32, right: 32, top: 32, bottom: 32 } });
    }

    setupCardButtons() {
        // Setup the "New Card" button and its text
        this.btnNewCard = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2 + 128, "btn");
        this.btnNewCard.setScale(0.3, 0.3);
        this.btnNewCard.setInteractive()
            .on("pointerover", () => this.btnNewCard.setFrame(1))
            .on("pointerout", () => this.btnNewCard.setFrame(0))
            .on("pointerup", () => this.newCard());
        this.btnNewCardText = this.add.text(window.innerWidth / 2 - 96, window.innerHeight / 2 + 112,
            "Nova Carta", { fontSize: "32px" });

        // Now we have to setup a button for each number in the card (4 buttons)

    }

    setupOperationButtons() {

        // Addition operation button
        this.btnOperationAdd = this.add.sprite(window.innerWidth - 384, window.innerHeight - 256, "btn");
        this.btnOperationAdd.setScale(0.2, 0.4);
        this.btnOperationAdd.setInteractive()
            .on("pointerover", () => this.btnOperationAdd.setFrame(1))
            .on("pointerout", () => this.btnOperationAdd.setFrame(0))
            .on("pointerup", () => this.performAddition());

        this.btnOperationAddText = this.add.text(this.btnOperationAdd.x - 20, this.btnOperationAdd.y - 30, "+", { fontSize: "64px" });

        // Subtraction operation button
        this.btnOperationSubtract = this.add.sprite(window.innerWidth - 128, window.innerHeight - 256, "btn");
        this.btnOperationSubtract.setScale(0.2, 0.4);
        this.btnOperationSubtract.setInteractive()
            .on("pointerover", () => this.btnOperationSubtract.setFrame(1))
            .on("pointerout", () => this.btnOperationSubtract.setFrame(0))
            .on("pointerup", () => this.performSubtraction());

        this.btnOperationSubtractText = this.add.text(this.btnOperationSubtract.x - 20, this.btnOperationSubtract.y - 30, "-", { fontSize: "64px" });


        // Multiplication operation button
        this.btnOperationMultiply = this.add.sprite(window.innerWidth - 384, window.innerHeight - 128, "btn");
        this.btnOperationMultiply.setScale(0.2, 0.4);
        this.btnOperationMultiply.setInteractive()
            .on("pointerover", () => this.btnOperationMultiply.setFrame(1))
            .on("pointerout", () => this.btnOperationMultiply.setFrame(0))
            .on("pointerup", () => this.performMultiplication());

        this.btnOperationMultiplyText = this.add.text(this.btnOperationMultiply.x - 20, this.btnOperationMultiply.y - 30, "x", { fontSize: "64px" });

        // Divion operation button
        this.btnOperationDivide = this.add.sprite(window.innerWidth - 128, window.innerHeight - 128, "btn");
        this.btnOperationDivide.setScale(0.2, 0.4);
        this.btnOperationDivide.setInteractive()
            .on("pointerover", () => this.btnOperationDivide.setFrame(1))
            .on("pointerout", () => this.btnOperationDivide.setFrame(0))
            .on("pointerup", () => this.performDivision());

        this.btnOperationDivideText = this.add.text(this.btnOperationDivide.x - 20, this.btnOperationDivide.y - 30, "÷", { fontSize: "64px" });
    }

    setupMiscButtons() {
        this.btnGotoMenu = this.add.sprite(128 + 32, window.innerHeight - 64, "btn");
        this.btnGotoMenu.setScale(0.4, 0.4);
        this.btnGotoMenu.setInteractive()
            .on("pointerover", () => this.btnGotoMenu.setFrame(1))
            .on("poiterout", () => this.btnGotoMenu.setFrame(0))
            .on("pointerup", () => this.scene.start("MainMenu"));
        this.add.text(this.btnGotoMenu.x - 80, this.btnGotoMenu.y -32 , "MENU", {fontSize: "64px"});
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
        console.log(`Generating a new ${this.gameState.difficulty} card`);
        const generatedCard: string = "1  7  9  9";
        this.gameState.currentCard = generatedCard;
        this.textCurrentCard.text = generatedCard;
    }


}
