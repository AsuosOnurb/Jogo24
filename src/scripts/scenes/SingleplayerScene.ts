import Phaser from 'phaser'

import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);


import { BetterText } from '../better/BetterText'
import { BetterButton } from '../better/BetterButton'
import { Solutions } from '../game/Solutions'
import { CountdownTimer } from '../game/CountdownTimer'
import {SingleplayerGame} from '../game/SingleplayerGame'
import { LoginData } from '../game/backend/LoginData';


export class SingleplayerScene extends Phaser.Scene {

    private isInstanced: boolean = false;

    private m_Data; // The data object that comes from the main menu
    private m_GameState: SingleplayerGame;
    private countdownTimer: CountdownTimer;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text
    private textTotalWrong!: BetterText // Total wrong counter label 
    private textTotalCorrect!: BetterText; // Total correct counter label
    private textExpression!: BetterText; // Displays on the top bar the whole arithmetic expression made by the player
    private textSolution!: BetterText; // debug only

    // Buttons
    private m_BtnNewCard!: BetterButton;              // Resets player input and gives player a new card / new numbers
    private m_BtnReset!: BetterButton;           // Resets player input. Lets him try again the current card.
    private m_BtnUndo!: BetterButton;           // Lets the user delete the last inserted character.

    private btnOperationAdd!: BetterButton;         // Performs Addition
    private btnOperationSubtract!: BetterButton;    // Performs Subtraction
    private btnOperationMultiply!: BetterButton;    // Performs Multiplication
    private btnOperationDivide!: BetterButton;      // Perfroms Division

    private btnGotoMenu!: BetterButton;             // Redirects player to the main menu

    /*
     Card Buttons.
     These buttons are changed everytime we generate a new card. 
     Each button is associated with one of the 4 numbers.
    */
    private m_CardButtons: Array<BetterButton>;
    private m_BtnUsed: Array<Boolean>;
    constructor() {
        super("SoloGame");
    }

    preload() {
        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Insert the title image
        const titleImg = this.add.sprite(256, 96, 'smallTitle');
        titleImg.setScale(1, 1);

        // Add card background image
        const cardBG = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'cardBG');

        // Add the corect/incorrect label backgrounds
        const correctBG = this.add.sprite(this.scale.width / 2 + 680, 128, 'correctCounter')
        const wrongBG = this.add.sprite(this.scale.width / 2 + 680, 288, 'wrongCounter')

        // Add the player input bar ::: TODO: We should probably just delete this? (Because we aren't gonna use it?)
        const inputBG = this.add.sprite(this.scale.width / 2, 128, 'inputBar');

        // We might as well, for now, use the input bar as a place for player messages
        this.textExpression = new BetterText(this, this.scale.width / 2, 128, "",
            { fontSize: 48, color: "#ffffff", fontStyle: "bold", align: "center" });
        this.textExpression.setOrigin(0.5, 0.5);

        // Setup labels 
        this.Setup_Labels();

        // Setup ALL the buttons
        this.Setup_Buttons();

        // Add the timer background
        this.add.sprite(this.scale.width / 2 - 640, this.scale.height / 2 - 64, 'clockBG2');
        // Setup the timer with a callback function that disables all buttons once the timer runs out.
        this.countdownTimer =
            new CountdownTimer(this, 90, this.NoTimeLeft.bind(this), 320, this.scale.height / 2 + 20, 64);

        this.textSolution =
            new BetterText(this, 32, 256, "", { fontSize: 32 });
    }

    init(data) {

        this.m_Data = data;
        this.m_GameState = new SingleplayerGame(this.m_Data.difficulty);

        /**
         * Register event handlers/listeners onyl if the scene hasn't been started before.
         */
        if (!this.isInstanced) {

            this.events.on('NumberButtonClick', this.HandleButtonClick_Number, this);
            this.events.on('OperationButtonClick', this.HandleButtonClick_Operation, this);

            this.events.on('ResetButtonClick', this.HandleButtonClick_Reset, this);
            this.events.on('UndoButtonClick', this.HandleButtonClick_Undo, this);


            // This flag is important. Prevents duplication of event listeners!!
            this.isInstanced = true;

        }
    }



    Setup_Labels() {


        this.textTotalCorrect = new BetterText(this, this.scale.width / 2 + 740, 128, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalCorrect.setOrigin(0.5, 0.5);
        this.textTotalWrong = new BetterText(this, this.scale.width / 2 + 740, 288, "0", { fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalWrong.setOrigin(0.5, 0.5);

    }

    Setup_Buttons() {


        // Setup a button for each number in the card (4 buttons)
        this.m_CardButtons = [
            new BetterButton(this, this.scale.width / 2 - 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 196, this.scale.height / 2,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 196,
                1, 1, "?", { fontSize: 75, fontStyle: "bold", color: "#05b8ff" }, "btn_numberBG"),

        ]

        this.m_BtnUsed = new Array<Boolean>();
        for (let i = 0; i < this.m_CardButtons.length; i++) {
            // Each button starts disabled
            this.m_CardButtons[i].SetDisabled();
            this.m_CardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i));
            this.m_BtnUsed[i] = false;
        }

        // This button lets the user reset his attempt at the current card.
        this.m_BtnReset = new BetterButton(this, this.scale.width / 2 - 196, this.scale.height - 96, 1, 1, "", { fontSize: 64 }, "btn_reset");
        this.m_BtnReset.on("pointerup", () => this.events.emit('ResetButtonClick'));
        this.m_BtnReset.SetDisabled();

        // 'Backspace' button
        this.m_BtnUndo = new BetterButton(this, this.scale.width / 2 + 196, this.scale.height - 96, 1, 1, "", { fontSize: 32 }, "btn_undo");
        this.m_BtnUndo.on("pointerup", () => this.events.emit('UndoButtonClick'));
        this.m_BtnUndo.SetDisabled();

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "+"));

        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "-"));

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "*"));

        // Division operation button
        this.btnOperationDivide = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_division");
        this.btnOperationDivide.on("pointerup", () => this.events.emit('OperationButtonClick', "/"));

        // 'New Card' button
        this.m_BtnNewCard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 0.6, 0.6, "", { fontSize: 32 }, "btn_playCard");
        this.m_BtnNewCard.on("pointerup", () => this.NewCard());

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, 96, this.scale.height - 96, 0.8, 0.8, "", { fontSize: 64 }, 'btn_gotoMenu');
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

    }

    NewCard(): void {

        let generatedCard = this.m_GameState.NewCard();


        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < generatedCard.length; i++) {

            // Set the text of the number button
            this.m_CardButtons[i].SetText(generatedCard[i]);

            // Enable the button
            this.m_CardButtons[i].SetEnabled();
        }

        // Disable 'Reset' button
        this.m_BtnReset.SetDisabled();

        // Disable 'Backspace' button
        this.m_BtnUndo.SetDisabled();



    
        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.getSolution(generatedCard)}`);

        // Clear the expression text
        this.textExpression.setText("");

        // Start the timer
        this.countdownTimer.StartCountdown();
    }

    CheckSolution(): void {
        
        const isSolutionCorrect: boolean = true;

        if (isSolutionCorrect)
            this.SavePlayerData(true); // Register a win
        else 
            this.SavePlayerData(false); // Register a loss
    }

    /**
     * Activated when the countdown timer rings (reaches zero).
     * Activates only once during the whole game.
     */
    NoTimeLeft() {
        for (let i = 0; i < 4; i++)
            this.m_CardButtons[i].SetDisabled();

        this.m_BtnReset.SetDisabled();
        this.m_BtnUndo.SetDisabled();
        
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        

        this.m_BtnNewCard.SetDisabled();

        // Save player data
        this.SavePlayerData(false); // Register another loss
    }

    // Reset the calculations to the original state (happens when the 'Reset' button is clicked)
    HandleButtonClick_Reset(): void {

    }

    HandleButtonClick_Number(clickedButtonIndex: number): void {
        console.log(`Cicked number ${this.m_CardButtons[clickedButtonIndex].GetText()}`);

        this.m_CardButtons[clickedButtonIndex].SetDisabled();
        // Register new number on the current operation
       const stringRep =  this.m_GameState.NewNumber(this.m_CardButtons[clickedButtonIndex].GetText());
       this.textExpression.setText(stringRep)
       console.log(this.m_GameState.GetPlayerState());

       // Mark button as used
       this.m_BtnUsed[clickedButtonIndex] = true;

       // DIsable number buttons if player is selecting an operator
       if (this.m_GameState.IsPickingOperator())
        this.DisableNumberButtons();
       
    }

    HandleButtonClick_Operation(operation: string) {

      const stringRep =  this.m_GameState.NewOperation(operation);
      this.textExpression.setText(stringRep);
      console.log(this.m_GameState.GetPlayerState());

      // Enable card buttons
      this.EnableNumberButtons();

    }

    /**
     * Undo the last performed operation.
     * 
     * Currently, we're using a stack made of Operation objects.
     */
    HandleButtonClick_Undo(): void {


    }

    EnableNumberButtons() 
    {
        for(let i = 0; i < 4; i++)
        {
            if (this.m_BtnUsed[i] === false)
                this.m_CardButtons[i].SetEnabled();
        }
    }

    DisableNumberButtons()
    {
        for(let i = 0; i < 4; i++)
        {
            this.m_CardButtons[i].SetDisabled();
        }
    }

    SavePlayerData(playerWon: boolean) : void 
    {
        if (playerWon)
            // UserInfo.IncrementWins();
            console.log("save win")
        else 
            // UserInfo.IncrementLosses();
            console.log("save loss")

       //  UserInfo.SaveLocalData();
    }
}
