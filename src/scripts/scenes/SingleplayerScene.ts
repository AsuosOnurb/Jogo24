// SingleplayerScene.ts
/**
 * Module responsible for the implementation of the Singleplayer scene.
 * @module
 */



import Phaser from 'phaser'

import { BetterText } from '../components/BetterText'
import { BetterButton } from '../components/BetterButton'
import { Solutions } from '../utils/Solutions'
import { CountdownTimer } from '../components/CountdownTimer'
import { PlayerState, SingleplayerGame } from '../game/SingleplayerGame'
import { ValueOfExpression } from '../utils/Utils'
import { LoginData } from '../backend/LoginData'
import { Operation } from '../utils/Operations'
import { GetPreviousScores, UpdateScore, GetUpdatedScores } from '../backend/BackendConnection'


/**
 * Models the screen/scene where the singleplayer game takes place.
 * This class/file is only responsible for the visual/interaction side of things.
 * The game data/logics is handled in the {@link SingleplayerGame}.
 */
export class SingleplayerScene extends Phaser.Scene {

    private isInstanced: boolean = false;

    private playerScores: any;

    private gameState: SingleplayerGame;
    private countdownTimer: CountdownTimer;


    // ===================== UI Objects (text objects, buttons, etc....) ==================

    // Text

    /**
     * Total wrong counter label.
     */
    private textTotalWrong: BetterText

    /**
     * Total correct counter label.
     */
    private textTotalCorrect: BetterText;

    /**
     * The bar on the top of the screen that holds the arith. expression.
     */
    private expressionBar: BetterButton;

    private textSolution: BetterText; // debug only

    // Buttons
    /**
     * The green button at the center of the card that gives/generates a new card.
     */
    private btnNewCard: BetterButton;

    /**
     * The button that resets the game state and lets the player retry the card from the beginning.
     */
    private btnReset!: BetterButton;

    /**
     * The button that allows the player to backtrack on his/her moves.
     */
    private btnUndo!: BetterButton;

    /**
     * The button that performs the addition operation.
     */
    private btnOperationAdd!: BetterButton;

    /**
     * The button that performs the subtraction operation.
     */
    private btnOperationSubtract!: BetterButton;

    /**
     * The button that performs the multiplication operation.
     */
    private btnOperationMultiply!: BetterButton;

    /**
     * The button that performs the division operation.
     */
    private btnOperationDivide!: BetterButton;

    /**
     * The button that allows the player to go back to the main menu.
     */
    private btnGotoMenu!: BetterButton;

    /**
     *  The final image and information that appears everytime the timer runs out
     */
    private imgEndGame: Phaser.GameObjects.Image;

    /**
     *  The text that warns the player that he should login if he wants to save his score on the TOP.
     */
    private txtLoginWarning: BetterText;

    /**
      *  The text that shows the player his/her results.
      */
    private txtGameResults: BetterText;


    /**
     The 4 buttons on the card.

     These buttons are changed everytime we generate a new card. 
     Each button is associated with one of the 4 numbers.
    */
    private cardButtons: Array<BetterButton>;

    /**
     * The array that marks the (card) buttons thar are used.
     * 
     * @remarks This array is very important because it allows us to know which buttons were picked/used and which ones should be enabled.
     */
    private usedButtons: Array<boolean>;


    private constructor() {
        super("SoloGame");
    }

    /* ============================================ Scene Setup ============================================

    /**
     * Preloads the scene's resources and sets up their buttons/images/text.
     *
     * @remarks
     * This method is ran before the init() method.
     *
     * 
     */
    private preload() {

        // Add background image window
        const bgImg = this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Insert the title image
        const titleImg = this.add.sprite(256, 96, 'smallTitle');
        titleImg.setScale(1, 1);

        // Add card background image
        const cardBG = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'cardBG');
        cardBG.setScale(1.15);

        // Add the corect/incorrect label backgrounds
        this.add.sprite(this.scale.width / 2 + 680, 128, 'correctCounter')
        this.add.sprite(this.scale.width / 2 + 680, 288, 'wrongCounter')


        // Setup labels 
        this.Setup_Labels();

        // Setup ALL the buttons
        this.Setup_Buttons();

        // Add the timer background
        this.add.sprite(this.scale.width / 2 - 640, this.scale.height / 2 - 64, 'clockBG2');
        // Setup the timer with a callback function that disables all buttons once the timer runs out.
        this.countdownTimer = // 180
            new CountdownTimer(this, 180, this.NoTimeLeft.bind(this), 320, this.scale.height / 2 + 20, 64, "");

        this.textSolution =
            new BetterText(this, 256, 256, "", { fontFamily: 'Vertiky', fontSize: 32 });

        // Add the player input bar :
        this.expressionBar = new BetterButton(this, this.scale.width / 2, 128 - 32, 1, 0.9, '', { fontFamily: 'Bubblegum', fontSize: 48, fill: '#FFFFFF' }, 'inputBar');
        this.expressionBar.SetDisabled(1);


        // Login warning
        this.imgEndGame = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "gameEndBGg");
        this.imgEndGame.setScale(1.5)
        this.imgEndGame.setAlpha(0);

    }


    /**
     * Scene initialization procedure. 
     * Executes right after preload() and just before create().
     * @param data The data object that is sent from the main menu. For now, the data object contains only the difficulty property of the game.
     */
    private init(data) {

        this.gameState = new SingleplayerGame(data.difficulty);

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

        // Get the player scores from the DB
        if (LoginData.IsLoggedIn()) {

            let connection = GetPreviousScores(this.gameState.difficulty + 1);
            connection.then((parsedData) => {

                this.playerScores = parsedData;

            }).catch(function (err) {
                console.log(err);
            });

        }



    }

    /**
     * Sets up the labels/texts.
     */
    private Setup_Labels() {

        this.textTotalCorrect = new BetterText(this, this.scale.width / 2 + 740, 128, "0", { fontFamily: 'Vertiky', fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalCorrect.setOrigin(0.5, 0.5);
        this.textTotalWrong = new BetterText(this, this.scale.width / 2 + 740, 288, "0", { fontFamily: 'Vertiky', fontSize: 40, color: "#ffffff", fontStyle: "bold" })
        this.textTotalWrong.setOrigin(0.5, 0.5);

    }

    /**
     * Sets up all of the buttons.
     * This is runs once at the start of the game.
     */
    private Setup_Buttons() {

        // 'New Card' button
        this.btnNewCard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2, 0.6, 0.6, "", {}, "btn_playCard");
        this.btnNewCard.on("pointerup", () => this.NewCard());

        // Main Menu button
        this.btnGotoMenu = new BetterButton(this, 128, this.scale.height - 128, 1, 1, "", {}, 'btn_gotoMenu');
        this.btnGotoMenu.on("pointerup", () => {
            this.scene.start("MainMenu");
        });

        // Setup a button for each number in the card (4 buttons)
        this.cardButtons = [
            new BetterButton(this, this.scale.width / 2 - 204, this.scale.height / 2,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, color: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, color: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2 + 204, this.scale.height / 2,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, color: "#FFFFFF" }, "btn_numberBG"),

            new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 204,
                1.4, 1.4, "?", { fontFamily: 'Bubblegum', fontSize: 128, color: "#FFFFFF" }, "btn_numberBG"),

        ]

        this.usedButtons = new Array<boolean>();
        for (let i = 0; i < this.cardButtons.length; i++) {
            this.cardButtons[i].SetTextColor("#ffffff")

            // Each button starts disabled
            this.cardButtons[i].SetDisabled();
            this.cardButtons[i].on("pointerup", () => this.events.emit('NumberButtonClick', i));
            this.usedButtons[i] = false;
        }

        // This button lets the user reset his attempt at the current card.
        this.btnReset = new BetterButton(this, this.scale.width / 2 - 196, this.scale.height - 84, 0.9, 0.9, "", { fontSize: 64 }, "btn_reset");
        this.btnReset.on("pointerup", () => this.events.emit('ResetButtonClick'));
        this.btnReset.SetDisabled();

        // 'Backspace' button
        this.btnUndo = new BetterButton(this, this.scale.width / 2 + 196, this.scale.height - 84, 0.9, 0.9, "", { fontSize: 32 }, "btn_undo");
        this.btnUndo.on("pointerup", () => this.events.emit('UndoButtonClick'));
        this.btnUndo.SetDisabled();

        // Addition operation button
        this.btnOperationAdd = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_addition");
        this.btnOperationAdd.on("pointerup", () => this.events.emit('OperationButtonClick', "+"));

        // Subtraction operation button
        this.btnOperationSubtract = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 - 64, 1, 1, "", { fontSize: 64 }, "btn_subtraction");
        this.btnOperationSubtract.on("pointerup", () => this.events.emit('OperationButtonClick', "-"));

        // Multiplication operation button
        this.btnOperationMultiply = new BetterButton(this, this.scale.width / 2 + 580, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_multiplication");
        this.btnOperationMultiply.on("pointerup", () => this.events.emit('OperationButtonClick', "x"));

        // Division operation button
        this.btnOperationDivide = new BetterButton(this, this.scale.width / 2 + 800, this.scale.height / 2 + 160, 1, 1, "", { fontSize: 64 }, "btn_division");
        this.btnOperationDivide.on("pointerup", () => this.events.emit('OperationButtonClick', "/"));

        // Operation buttons start disabled
        this.DisableOperationButtons();

    }


    /* ============================================ Functionality ============================================ */

    /**
     * Handles the functionality of the New Card button.
     * 
     * Internally, we're generating a new card and the countdown timer starts ticking.
     */
    private NewCard(): void {

        // Disable the 'New Card' button
        this.btnNewCard.SetDisabled();

        // Tell the single player game that we're going to be playing a new card.
        this.gameState.NewCard();

        // Change the current card number buttons and store the card numbers
        for (let i = 0; i < this.gameState.GetCurrentCard().length; i++) {

            // Set the text of the number button
            this.cardButtons[i].SetText(this.gameState.GetCurrentCard()[i]);

            // Enable the button
            this.cardButtons[i].SetEnabled();

            // Mark all number buttons as "un-used"
            this.usedButtons[i] = false;

            // Reset number buttons font size
            this.cardButtons[i].SetFontSize(128);

        }

        // Disable 'Reset' button
        this.btnReset.SetDisabled();

        // Disable 'Backspace' button
        this.btnUndo.SetDisabled();

        // Update the solution debug text
        this.textSolution.setText(`[DEBUG] Solução: ${Solutions.GetSolution(this.gameState.GetCurrentCard())}`);

        // Clear the expression text
        this.expressionBar.SetText("");

        // Reset expression bar text color
        this.expressionBar.SetTextColor("#FFFFFF");

        // Start the timer
        this.countdownTimer.StartCountdown();
    }


    /**
     * Handles the functionality of the number buttons on the card.
     * @param clickedButtonIndex The index of the button that was clicked.
     * 
     * @remarks The notion of button index is very important in this game mode due to the Undo feature.
     * In order to know what buttons need to change, each operation has 2 button indexes: 
     * 1. The index for the first operand button
     * 2. A second index for the second operand button
     * 
     * Because each card has 4 button, the index range is [0,1,2,3].
     * Index 0 relates to the left-most button.
     * Index 1 relates to the top-most button.
     * Index 2 relates to the right-most button.
     * Index 3 relates to the bottom-most button.
    */
    private HandleButtonClick_Number(clickedButtonIndex: number): void {

        const pickedNumber = this.cardButtons[clickedButtonIndex].GetText();

        // Enable reset btn
        this.btnReset.SetEnabled();

        // Enable undo btn
        this.btnUndo.SetEnabled();

        if (this.gameState.GetPlayerState() === PlayerState.PickingOperand1) {

            // Mark it as used, so that it doesnt get enabled again.
            this.usedButtons[clickedButtonIndex] = true;

            // Also enable the operation buttons
            this.EnableOperationButtons();

            // Update current operation. This also sends the player to the next state (now he has to pick the operator)
            this.gameState.PickOperand1(pickedNumber, clickedButtonIndex);

            // Update the expression text
            this.expressionBar.SetText(pickedNumber);

            // Disable the number buttons
            this.DisableNumberButtons();

        } else if (this.gameState.GetPlayerState() === PlayerState.PickingOperand2) {

            // Complete the current operation and get its expression 
            const expression = this.gameState.PickOperand2(pickedNumber, clickedButtonIndex);

            // Assigne the operation expression to the button we just clicked
            this.cardButtons[clickedButtonIndex].NumberButtonSetText(expression);

            // Also insert the expression on the expression bar
            this.expressionBar.SetText(expression);

            /*
                This is where we check if the player got the answer right.
                First, we must check the answer only if all the card buttons have been picked (no number can be left untouched).

                If all numbers have been used, then we check the solution.
            */

            const usedCount = this.usedButtons.filter((b) => b == true).length;

            if (usedCount === 3) {
                // All numbers were used. Proceed to checking the solution


                const won: boolean = this.gameState.CheckSolution(expression);

                if (won) {
                    this.gameState.IncrTotalCorrect();
                    this.ShowPlayerWon(expression);
                }
                else {
                    this.gameState.IncrTotalWrong();
                    this.ShowPlayerLost(expression);
                }

                // Disable all numbers and operations
                this.DisableNumberButtons();
                this.DisableOperationButtons()
                this.btnReset.SetDisabled();
                this.btnUndo.SetDisabled();
                this.btnNewCard.SetEnabled();
            }
        }
    }

    /**
     * Handles the functionality of the operator buttons.
     * @param operator The string representation of the operator that was clicked, i.e: '+', '-', '*', '/' .
     */
    private HandleButtonClick_Operation(operator: string) {

        // Pick the operator and get the most updated expression string. 
        //Also, this call sendds us to the next state (picking operand 2)
        const mostRecentExpression: string = this.gameState.PickOperator(operator);

        // Enable card buttons
        this.EnableNumberButtons();

        // Disable operation buttons
        this.DisableOperationButtons();

        // Update the expression text bar
        this.expressionBar.SetText(mostRecentExpression);
    }

    /**
     * Handles the functionality of the Undo Button.
     */
    private HandleButtonClick_Undo(): void {

        if (this.gameState.GetPlayerState() === PlayerState.PickingOperand1) {
            /* 
               The user has not yet picked the first operand.
               The fact that he pressed 'Undo' means that he wants to go back to the previous operation. 
               We pop the top-most operation on the stack to revert to those values.
           */

            let lastOperation = this.gameState.RevertToLastOperation();
            if (lastOperation === undefined)
                return;

            // We have to change the buttons to the previous numbers and enable them
            this.cardButtons[lastOperation.operand1BtnIndex].NumberButtonSetText(lastOperation.operand1);
            this.cardButtons[lastOperation.operand1BtnIndex].SetEnabled();
            this.usedButtons[lastOperation.operand1BtnIndex] = false;

            this.cardButtons[lastOperation.operand2BtnIndex].NumberButtonSetText(lastOperation.operand2);
            this.cardButtons[lastOperation.operand2BtnIndex].SetEnabled();
            this.usedButtons[lastOperation.operand2BtnIndex] = false;

            // Update the text expression bar
            this.expressionBar.SetText("");

        } else if (this.gameState.GetPlayerState() === PlayerState.PickingOperator) {
            /*
                Player picked the first operand, and now he is supposed to be picking the operator.
                But he wants to go back, so he can re-select the first operand.

                This means we have to:
                1 - Re-enable the number buttons
                2 - Also mark the button of the number as being un-used
                2 - Disable the operator buttons
                3 - Erase the number/text from the expression bar (make it empty)
                4 - Set the current state to be PickingOperand1
            */

            // Enable number buttons
            let currentOperation: Operation = this.gameState.PeekCurrentOperation();
            this.usedButtons[currentOperation.operand1BtnIndex] = false;

            this.EnableNumberButtons();

            // Disable operation buttons
            this.DisableOperationButtons()

            // Erase number from expression bar
            this.expressionBar.SetText("");

            // Set the new state to PickingOperand1
            this.gameState.SetPlayerState(PlayerState.PickingOperand1);
        }
        else if (this.gameState.GetPlayerState() === PlayerState.PickingOperand2) {
            /*
                Player picked the operator, but now we wants to go back and select a different one.

                This means we have to:
                1 - Disable the number buttons
                2 - Enable the operator buttons
                3 - Change the expression bar text (remove the current operator)
                4 - Set the current player state as being PickingOperator
            */

            // Disable the numbers
            this.DisableNumberButtons()

            // Enable operators
            this.EnableOperationButtons();

            // Change the expression on the bar (remove the last character, which corresponds to the operator symbol)
            const currentText = this.expressionBar.GetText();
            const substring = currentText.substring(0, currentText.length - 1);
            this.expressionBar.SetText(substring);

            // Change the current state
            this.gameState.SetPlayerState(PlayerState.PickingOperator);

        }

        // Disable the undo button if the operation stac is empty
        if (this.gameState.IsStackEmpty()) {
            this.btnUndo.SetDisabled();
            console.log("Stack is empty. Disabling undo button");

            //////// handle undo after btn reset!!!
        }

    }

    /**
     * Handles the functionality of the Reset Button.
     */
    private HandleButtonClick_Reset(): void {

        // Completely reset game (while keeping the scores of course)
        this.gameState.CompleteReset();

        this.DisableOperationButtons();
        this.btnReset.SetDisabled();
        this.btnUndo.SetDisabled();

        this.EnableNumberButtons();
        this.ResetNumberButtons();

        // Clean expression bar
        this.expressionBar.SetText("");


    }


    /* ============================================ Endgame Screens ============================================ */


    /**
     * Activates when the countdown timer rings (reaches zero).
     * @remarks Activates only once during the whole game.
     */
    private NoTimeLeft() {
        for (let i = 0; i < 4; i++)
            this.cardButtons[i].SetDisabled();

        this.btnReset.SetDisabled();
        this.btnUndo.SetDisabled();

        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
        this.btnOperationDivide.SetDisabled();

        this.btnNewCard.SetDisabled();

        const playerScore = this.gameState.GetTotalCorrect();
        // Check the most updated scores from the DB
        let verifConnection = GetUpdatedScores(playerScore, this.gameState.difficulty + 1);
        verifConnection.then((scores) => {
            this.playerScores = scores;

            if (LoginData.IsLoggedIn()) {

                // Show the final card telling the player the result of the game.
                this.ShowEndgameMessageLoggedIn(playerScore);

                // Send the data to the database
                this.SendScoreToDB(playerScore);

            } else
                this.ShowEndgameMessageNotLoggedIn(playerScore);

        }).catch((err) => {
            /* 
                Connection through internet was not possible.
                We'll have to display a simple message congratulating the player. 
            */
            this.ShowEndgameMessageNotConnected(playerScore);
        });
    }

    /** 
     * Shows some information to the player about his score, saying if he got a new record, if he got a global record (top100), a school or class record.
     * @remarks Gets called only if the player is logged in AND a connection to the DB is possible.
    */
    private ShowEndgameMessageLoggedIn(playerScore: number): void {

        const playerName: string = LoginData.GetFirstName();
        let winMessage: string;

        let personalBest = this.playerScores['personalBest'];
        let classBest = this.playerScores['classBest'];
        let schoolBest = this.playerScores['schoolBest'];
        let top100GlobalBest = this.playerScores['top100GlobalBest']



        if (playerScore > personalBest) {
            if (playerScore > top100GlobalBest) {
                // Player got a top100 record
                winMessage = `${playerName}, conseguiste um\nnovo recorde ABSOLUTO!\nCom ${playerScore} pontos.\n\nVê o teu resultado no TOP 100 absoluto.`;

            } else if (playerScore > schoolBest) {
                // Player got a school record
                winMessage = `${playerName}, conseguiste um novo\nrecorde na tua escola!\nCom ${playerScore} pontos.\n\n\nVê o teu resultado no TOP 100\nda tua escola.`;

            } else if (playerScore > classBest) {
                // Player got a class record
                winMessage = `${playerName}, conseguiste um\nnovo recorde na tua turma!\nCom ${playerScore} pontos.\n\n\nVê o teu resultado no TOP 100\nda tua turma.`;

            } else
                // Player got  a new personal best.
                winMessage = `${playerName}, conseguiste melhorar o teu\nresultado anterior.\n\nNo entanto, ainda não conseguiste \nentrar no TOP 100.\n\nTenta outra vez.`;

        } else {
            // Nohing new happened
            winMessage = `Obtiveste ${playerScore} pontos.\n\nNão conseguiste melhorar o teu\nresultado anterior\n(o teu melhor resultado é ${personalBest} pontos)\n\n\nTenta outra vez!`;

        }

        // Prepare the text that will be shown
        this.txtGameResults = new BetterText(this, this.scale.width / 2, this.scale.height / 2, "", { fontFamily: 'Vertiky', align: 'center', fontSize: 34 });
        this.txtGameResults.setText(winMessage)
        this.txtGameResults.setColor("#4e2400");
        this.txtGameResults.setAlpha(0);

        // Make the results panel appear
        this.tweens.add(
            {
                targets: [this.imgEndGame, this.txtGameResults],
                alpha: 1.0,
                scale: 1.6,

                duration: 500,
                ease: 'Power1'
            }
        );

        // Clear the artithmetic expression text
        this.expressionBar.SetText("");

        // Hide the other buttons
        this.tweens.add(
            {
                targets: [this.btnOperationAdd,
                this.btnOperationSubtract,
                this.btnOperationMultiply,
                this.btnOperationDivide,
                this.btnReset,
                this.btnUndo,
                this.expressionBar],
                alpha: 0.0,

                duration: 500,
                ease: 'Power1'
            }
        );





    }


    /**
     * Makes a warning appear, telling the user to login if he wants to save his score.
     *
     *   @remarks Gets called only if the player is NOT logged in AND a connection to the DB is possible.
     */
    private ShowEndgameMessageNotLoggedIn(playerScore: number): void {

        let message: string;


        let top100GlobalBest = this.playerScores['top100GlobalBest']

        if (playerScore > top100GlobalBest) {
            message = `Se estivesses registado o teu\nnome figuraria no TOP 100 absoluto\ncom ${playerScore} pontos.\n\nRegista-te em\nwww.hypatiamat.com `;
        } else {
            message = `Obtiveste ${playerScore} pontos!\n\n\n Para que o teu nome figure nos TOPs \n tens de estar registado.\n\n\n\nRegista-te em www.hypatiamat.com`;

        }

        // Prepare the text thal will be shown
        this.txtLoginWarning = new BetterText(this, this.scale.width / 2, this.scale.height / 2, "", { fontFamily: 'Vertiky', align: 'center', fontSize: 34 });
        this.txtLoginWarning.setText(message)
        this.txtLoginWarning.setColor("#4e2400");
        this.txtLoginWarning.setAlpha(0);

        this.tweens.add(
            {
                targets: [this.imgEndGame, this.txtLoginWarning],
                alpha: 1.0,
                scale: 1.6,

                duration: 500,
                ease: 'Power1'
            }
        );

        // Clear the artithmetic expression text
        this.expressionBar.SetText("");

        // Hide the other buttons
        this.tweens.add(
            {
                targets: [this.btnOperationAdd,
                this.btnOperationSubtract,
                this.btnOperationMultiply,
                this.btnOperationDivide,
                this.btnReset,
                this.btnUndo,
                this.expressionBar],
                alpha: 0.0,

                duration: 500,
                ease: 'Power1'
            }
        );



    }

    /**
     * Makes a message appear with the player score.
     * @param playerScore The score of the player
     * @remarks Gets called only when connection to the DB is NOT possible (therefore login is not possible either)
     */
    private ShowEndgameMessageNotConnected(playerScore) {

        // Prepare the text thal will be shown
        let message: string;
        if (playerScore == 1)
            message = `Parabéns!\nObtiveste 1 ponto!`
        else
            message = `Parabéns!\nObtiveste ${playerScore} pontos!`

        let congratsText = new BetterText(this, this.scale.width / 2, this.scale.height / 2, message, { color: '#4e2400', fontFamily: 'Vertiky', align: 'center', fontSize: 54 });
        //this.txtLoginWarning.setColor("#4e2400");
        congratsText.setAlpha(0);

        this.tweens.add(
            {
                targets: [this.imgEndGame, congratsText],
                alpha: 1.0,
                scale: 1.6,

                duration: 500,
                ease: 'Power1'
            }
        );

        // Clear the artithmetic expression text
        this.expressionBar.SetText("");

        // Hide the other buttons
        this.tweens.add(
            {
                targets: [this.btnOperationAdd,
                this.btnOperationSubtract,
                this.btnOperationMultiply,
                this.btnOperationDivide,
                this.btnReset,
                this.btnUndo,
                this.expressionBar],
                alpha: 0.0,

                duration: 500,
                ease: 'Power1'
            }
        );
    }



    /* ============================================ Utilities ============================================ */
    private SendScoreToDB(playerScore: number): void {

        const diff = this.gameState.difficulty + 1;
        let connection = UpdateScore(playerScore, diff);
        connection.then((data) => {
        }).catch((err) => {
            alert("Não foi possível enviar a pontuação. Verifique a ligação à internet.");
        });
    }

    private ShowPlayerWon(expression: string): void {
        this.expressionBar.SetText(expression + ` = ${24}`);
        this.expressionBar.SetTextColor("#00ff1a");
        this.textTotalCorrect.setText(this.gameState.GetTotalCorrect().toString());
        this.expressionBar.PlayCorrectExpressionTween();

    }

    private ShowPlayerLost(expression: string): void {
        this.expressionBar.SetText(expression + ` = ${ValueOfExpression(expression)}`);
        this.expressionBar.SetTextColor("#ff2600");
        this.textTotalWrong.setText(this.gameState.GetTotalWrong().toString());
        this.expressionBar.PlayIncorrectExpressionTween();


    }

    private EnableNumberButtons() {
        for (let i = 0; i < 4; i++) {
            if (this.usedButtons[i] === false)
                this.cardButtons[i].SetEnabled();
        }
    }

    private DisableNumberButtons() {
        for (let i = 0; i < 4; i++) {
            this.cardButtons[i].SetDisabled();
        }
    }

    private EnableOperationButtons(): void {
        this.btnOperationAdd.SetEnabled();
        this.btnOperationSubtract.SetEnabled();
        this.btnOperationDivide.SetEnabled();
        this.btnOperationMultiply.SetEnabled();
    }

    private DisableOperationButtons(): void {
        this.btnOperationAdd.SetDisabled();
        this.btnOperationSubtract.SetDisabled();
        this.btnOperationDivide.SetDisabled();
        this.btnOperationMultiply.SetDisabled();
    }

    private ResetNumberButtons(): void {
        for (let i = 0; i < 4; i++) {
            this.cardButtons[i].SetText(this.gameState.GetCurrentCard()[i])
            this.cardButtons[i].SetFontSize(128);
            this.cardButtons[i].SetEnabled();
            this.usedButtons[i] = false;
        }


    }

}
