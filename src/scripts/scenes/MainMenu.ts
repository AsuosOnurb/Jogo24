// MainMenu.ts
/**
 * Module responsible for the implementation of the Main Menu scene.
 * @module
 */


import Phaser from 'phaser'
import { LoginData } from '../backend/LoginData';

import { BetterButton } from '../components/BetterButton'
import { BetterText } from '../components/BetterText';
import { Difficulty } from '../utils/CardGenerator';
import LoginForm from '../components/LoginForm';
import { DestroySession, Login } from '../backend/BackendConnection';


enum Panels {
    AboutGame,
    HowToPlay,
    Credits,
    Login
};


/**
 * The class that models the main menu scene.
 * This is the first scene that the player sees when he starts the game.
 * 
 * We're talking about a phaser scene, so every single method and function can be private.
 * 
 * Important: This object should not be bothered about handling player data, login things, backend things, or other logic related stuff.
 *              
 */
export class MainMenuScene extends Phaser.Scene {

    /**
     * The button that opens the 'About the game' panel.
     */
    private btnAboutGame: BetterButton;

    /**
     * The button that opens the 'How to play' panel.
     */
    private btnHowToPlay: BetterButton;

    /**
     * The button that opens the 'Credits' panel.
     */
    private btnCredits: BetterButton;

    /* ========================== Login Panel and Login Interaction ======================= */
    private btnStartLogin: BetterButton;
    private btnLogin: BetterButton;
    private btnLogout: BetterButton;
    private loginForm: LoginForm;
    private txtUserName: BetterText;
    /* ======================================================================================= */

    /**
     * The button responsible for starting the transition to the Ranking scene.
     */
    private btnLeaderboards: BetterButton;

    /**
    * The button responsible for starting the transition to the Multiplayer Game mode scene.
    */
    private btnTabletMode: BetterButton;

    /**
    * The button responsible for starting the transition to the Singleplayer Game on easy difficulty.
    */
    private btnPlaySoloEasy: BetterButton;

    /**
    * The button responsible for starting the transition to the Singleplayer Game on medium difficulty.
    */
    private btnPlaySoloMedium: BetterButton;

    /**
    * The button responsible for starting the transition to the Singleplayer Game on hard difficulty.
    */
    private btnPlaySoloHard: BetterButton;

    /**
     * The button responsible for the toggling fullscreen mode.
     */
    private btnFullscreenToggle: BetterButton;


    /* ========== "How to play" , "About the game" , "Credits" and "Login" panels =======*/
    /*
        Note: At any point in time, there is only one opened panel.
        If a panel is opened, then opening another one is not possible.
    */

    /**
     * Whether or not any kind of panel is currently opened.
     * It is true if any panel is opened.
     * It is false if no panel is opened.
     */
    private isPanelOpen: boolean;

    /**
     * The red cross button responsible for closing any of the panels or not any kind of panel is currently opened.
     * It is true if any panel is opened.
     * It is false if no panel is opened.
     */
    private btnClosePanel: BetterButton; // The "X" button that closes every panel

    /**
     * A Phaser Group object that groups(duh!?) the images and buttons that are commonly used in a panel.
     * If looking for perfomance, see Phaser containers (they dont seem to use physics) 
     */
    private groupPanel: Phaser.GameObjects.Group;

    /**
     * The image of the panel associated with the 'How to play' panel.
     */
    private imgHowToPlay: Phaser.GameObjects.Image;

    /**
     * The image of the panel associated with the 'About the game' panel.
     */
    private imgAboutTheGame: Phaser.GameObjects.Image
    /**
     * The image of the panel associated with the 'Credits' panel.
     */;
    private imgCredits: Phaser.GameObjects.Image;

    /**
     * The image of the panel associated with the 'Login' panel.
     */
    private imgLoginWindow: Phaser.GameObjects.Image;


    /**
     * Constructs a 'MainMenu' scene using phaser's API.
     * We let Phaser do his thing.
     */
    constructor() {
        super('MainMenu');

        console.warn("Final tweaks version");

    }

    /**
     * The 'create' method provided by Phaser.
     * 
     * It's in this stage that we prepare most of the images, buttons and text labels that are used in this scene.
     * Everything is setup during this procedure. Anything that happens (like click events) are setup here.
     * 
     * Ideally, this method should be mostly the setup of this things.
     * 
     */
    create() {

        // Add background image 
        const bgImg = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);

        // Insert the toon image
        this.add.sprite(this.scale.width / 2 - 720, this.scale.height - 283, 'toon');

        // Insert the title image
        const titleImg = this.add.sprite(this.scale.width / 2, 160, 'title');
        titleImg.setScale(0.7, 0.7);

        // ============================ Setup Main Menu Buttons ======================== //

        // Tablet mode button
        this.btnTabletMode = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 21 * 32, 0.8, 0.8, "", {}, 'btn_tabletMode');
        this.btnTabletMode.once('pointerup', () => this.StartMultiplayerGame());

        // Fullscreen button
        this.btnFullscreenToggle = new BetterButton(this, 128, 128, 0.8, 0.8, "", {}, this.scale.isFullscreen ? "fullscreenOff" : "fullscreenOn");
        this.btnFullscreenToggle.on('pointerup', () => this.ToggleFullscreen());

        // Top 100 button
        this.btnLeaderboards = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 11 * 32, 0.8, 0.8, "", {}, "btn_top");
        this.btnLeaderboards.on('pointerup', () => this.StartRankingScene());

        // About the game button
        this.btnAboutGame = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 6 * 32, 0.8, 0.8, "", {}, 'btn_about');
        this.btnAboutGame.on("pointerup", () => this.ShowPanel(Panels.AboutGame));

        // How to play button
        this.btnHowToPlay = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 32, 0.8, 0.8, "", {}, "btn_howToPlay");
        this.btnHowToPlay.on("pointerup", () => this.ShowPanel(Panels.HowToPlay));

        // Credits button
        this.btnCredits = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 16 * 32, 0.8, 0.8, "", {}, "btn_credits");
        this.btnCredits.on('pointerup', () => this.ShowPanel(Panels.Credits));


        // Play Solo Easy button
        this.btnPlaySoloEasy = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 64, 1.2, 1.2, "", {}, 'btn_easy', 0);
        this.btnPlaySoloEasy.on("pointerup", () => this.StartSoloGame(Difficulty.Easy));


        // Play Solo Medium button
        this.btnPlaySoloMedium = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 128, 1.2, 1.2, "", {}, 'btn_medium', 0);
        this.btnPlaySoloMedium.on("pointerup", () => this.StartSoloGame(Difficulty.Medium));

        // Play Solo Hard button
        this.btnPlaySoloHard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 320, 1.2, 1.2, "", {}, 'btn_hard', 0);
        this.btnPlaySoloHard.on("pointerup", () => this.StartSoloGame(Difficulty.Hard));


        this.SetupLoginLogoutButtons();


        // =================== Setup the panel group, their images and the close button =================
        this.imgHowToPlay = this.add.image(this.scale.width / 2, this.scale.height / 2 + 140, 'howToPlay');
        this.imgHowToPlay.setScale(0.4);
        this.imgHowToPlay.setAlpha(0);

        this.imgAboutTheGame = this.add.image(this.scale.width / 2, this.scale.height / 2 + 140, 'aboutGame');
        this.imgAboutTheGame.setScale(0.4);
        this.imgAboutTheGame.setAlpha(0);


        this.imgCredits = this.add.image(this.scale.width / 2, this.scale.height / 2 + 140, 'credits');
        this.imgCredits.setScale(0.4);
        this.imgCredits.setAlpha(0);

        this.imgLoginWindow = this.add.image(this.scale.width / 2, this.scale.height / 2 + 140, 'loginBG');
        this.imgLoginWindow.setScale(0.4);
        this.imgLoginWindow.setAlpha(0);

        this.btnLogin = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 360, 1.2, 1.2, "", {}, 'btn_login', 0);
        this.btnLogin.SetDisabled(0);
        this.btnLogin.on('pointerup', () => this.PerformLogin())


        this.btnClosePanel = new BetterButton(this, this.scale.width / 2 + 400, this.scale.height / 2 - 200, 0.8, 0.8, "", {}, 'btn_close');
        this.btnClosePanel.on('pointerup', () => this.HidePanel());
        this.btnClosePanel.setAlpha(0);

        this.groupPanel = this.add.group([this.imgAboutTheGame, this.imgHowToPlay, this.imgCredits, this.btnClosePanel, this.imgLoginWindow]);
        this.groupPanel.setAlpha(0);
        this.isPanelOpen = false;

        this.SetupLoginForm();

    }

    /**
     * Starts a new `SingleplayerScene` scene on difficulty `diff`.
     * @param diff The difficulty to start the `SoloGame` with.
     */
    private StartSoloGame(diff: Difficulty): void {
        this.scene.start("SoloGame", { difficulty: diff });
    }

    /**
     * Starts a new `MultiplayerScene` scene.
     */
    private StartMultiplayerGame(): void {
        this.scene.start("MultiplayerGame");
    }

    /**
     * Starts a new `RankingScene` scene.
     */
    private StartRankingScene(): void {
        this.scene.start("RankingScene");
    }

    /**
     * Displays the panel `panelName`.
     * This method is the primary one when it comes to showing the panels on the screen.
     * @param panelName The panel to show on the screen.
     */
    private ShowPanel(panelName: Panels): void {
        /**
         * In reality, there is onyl one panel.
         * What we're doing is always opening the same panel, while
         *      deciding what objects are shown and which ones aren't.
         * 
         * After knowing what panel we have to show, we call the procedure
         *   PlayTween_ShowPanel(panel) to acctualy play the animation of the panel opening. 
         */


        // Only open a panel if there's not another one already opened
        if (!this.isPanelOpen) {
            switch (panelName) {
                case Panels.AboutGame:
                    this.PlayTween_ShowPanel(Panels.AboutGame)
                    break;

                case Panels.HowToPlay:
                    this.PlayTween_ShowPanel(Panels.HowToPlay)
                    break

                case Panels.Credits:
                    this.PlayTween_ShowPanel(Panels.Credits)
                    break;

                case Panels.Login:
                    this.PlayTween_ShowPanel(Panels.Login);
                    break;

                default:
                    break;
            }

            // This is very important to keep the state.
            this.isPanelOpen = true;
        }

    }

    /**
     * Hides the currently opened panel.
     */
    private HidePanel(): void {
        this.isPanelOpen = false;
        this.PlayTween_HidePanel();

        // Enable some buttons
        this.EnableSoloGameButtons();

        // Disable login button
        this.btnLogin.SetDisabled(0);
        this.loginForm.DisableForm();

        this.EnableRightSideButtons();
    }


    /**
     * Given a panel `panel`, make it appear on screen with a pretty tween animation.
     * Different panels make different objects appear/disappear.
     * @param panel The panel to show on the screen.
     */
    private PlayTween_ShowPanel(panel: Panels): void {
        let targetImage: Phaser.GameObjects.Image;
        switch (panel) {
            case Panels.Login:
                targetImage = this.imgLoginWindow;
                break;
            case Panels.HowToPlay:
                targetImage = this.imgHowToPlay;
                break;
            case Panels.AboutGame:
                targetImage = this.imgAboutTheGame;
                break;
            case Panels.Credits:
                targetImage = this.imgCredits;
                break;
        }

        // Make the image appear
        this.tweens.add({
            targets: [this.groupPanel, targetImage, panel == Panels.Login ? this.btnLogin : undefined],
            alpha: 1,
            scale: panel == Panels.Login ? 1.7 : 1.5,
            ease: 'Power1',
            duration: 500,
        });

        // make the close button appear
        this.tweens.add({
            targets: this.btnClosePanel,
            alpha: 1,
            ease: 'Power1',
            duration: 300,
            delay: 400
        });

        // Disable some buttons
        this.DisableSoloGameButtons();
        this.DisableRightSideButtons();

        // Enable login button if the panel is the Login panel
        if (panel == Panels.Login) {
            this.btnLogin.SetEnabled(1);

            this.loginForm.EnableForm();
        }

    }

    /**
     * Hides the currently opened panel with a pretty tween animation,
     */
    private PlayTween_HidePanel(): void {

        this.tweens.add({
            targets: [this.imgAboutTheGame, this.imgCredits, this.imgHowToPlay, this.imgLoginWindow
                , this.btnLogin],
            alpha: 0,
            scale: 0.4,
            ease: 'Power1',
            duration: 100
        });

        // make the close button disappear
        this.tweens.add({
            targets: this.btnClosePanel,
            alpha: 0,
            ease: 'Power1',
            duration: 100
        });


    }

    /**
     * Enables the buttons at the center of the screen.
     * The buttons are visible and interactible.
     */
    private EnableSoloGameButtons(): void {
        this.btnPlaySoloEasy.SetEnabled(1);
        this.btnPlaySoloMedium.SetEnabled(1);
        this.btnPlaySoloHard.SetEnabled(1);
    }

    /**
   * Disables the buttons at the center of the screen.
   * The buttons are visible but are NOT interactible.
   */
    private DisableSoloGameButtons(): void {
        this.btnPlaySoloEasy.SetDisabled(1);
        this.btnPlaySoloMedium.SetDisabled(1);
        this.btnPlaySoloHard.SetDisabled(1);
    }


    /* ======================== Login Form/Panel and Interaction ======================= */
    /**
     * Notice how in this section we use the BackendConnection (static) object.
     * This scene should have no business handling login data and the likes.
     * 
     * The loginForm object is the intermediary in this process. It is an object we used to separate
     * the more crazy kind of code we had to do in order to display HTML elements above the game canvas.
     */


    /**
     * Starts the actual login process. 
     * If the login is successfull, then the login panel should just disappear, and the user's first name
     *    should appear on the top right corner of the screen (near the logout button).
     * 
     * Note: this is not the same as just opening the Login panel.
     */
    private PerformLogin(): void {
        /**
         * Connections to the database should ALWAYS use Promises.
         * 
         * Steps we take here:
         *  1 - Attempt connection to the database.
         *          >> connection = BackenConnection.login(..)
         *  2 - If connection was a success, then do useful things with the information we got back.
         *      
         *  3 - Pofit?
         */

       

        const username: string = this.loginForm.GetUsername();
        const password: string = this.loginForm.GetPassword();

        // Attempt connection to the database
        const connection = Login(username, password);
        connection.then((data) => {

            // Store the data we just got for later, if the login was possible. 
            const loginResult: boolean = LoginData.LoginWithData(data);

            if (loginResult) {

                // Show the logout button, and disable the login button.
                this.btnLogout.SetEnabled(1);
                this.btnStartLogin.SetDisabled(0);

                this.HidePanel();

                // Make the "Welcome user text visible"
                this.txtUserName.setVisible(true);
                this.txtUserName.setText(`Olá, ${LoginData.GetFirstName()}`)
            }
            else {
                console.log("Login failed!")
            }


        }).catch((err) => {
            console.log(err);
            console.log("Failed to connect to login");
        });
    }

    /**
     * Starts the Logout process. 
     * The login button appears. The logout one disappears.
     */
    private PerformLogout(): void {
        this.btnLogout.SetDisabled(0);
        this.btnStartLogin.SetEnabled(1);


        /* In this case, we're not worried  about the result of the connection we're attempting */
        DestroySession();

        // Hide the login name text
        this.txtUserName.setText("");
        this.txtUserName.setVisible(false);
    }

    /**
     * Sets up the login/logout buttons and the user's first name label that appears when the user is logged in.
     */
    private SetupLoginLogoutButtons(): void {


        // Setup the username text label that appears on top of the logout button
        this.txtUserName = new BetterText(this, this.scale.width - 128, 32, "Hello", { fontFamily: 'Folks-Normal', fontSize: 28, color: "#ffffff", fontStyle: "bold" })
        this.txtUserName.setVisible(false);

        /*
            Both login/logout buttons are created.
            But when this scene starts, we have to decide which one is shown, based on the login status of the user.
        */

        // Button that opens the login window/panel
        this.btnStartLogin = new BetterButton(this, this.scale.width - 128, 128, 0.85, 0.85, "", {}, 'btn_start_login', 0);
        this.btnStartLogin.on('pointerup', () => this.ShowPanel(Panels.Login));

        // The logout Button
        this.btnLogout = new BetterButton(this, this.scale.width - 128, 128, 0.85, 0.85, "", {}, 'btn_logout', 0);
        this.btnLogout.on('pointerup', () => this.PerformLogout());

        if (LoginData.IsLoggedIn()) {
            this.btnStartLogin.SetDisabled(0);
            this.txtUserName.setText(`Olá, ${LoginData.GetFirstName()}`);
            this.txtUserName.setVisible(true);

        }
        else

            this.btnLogout.SetDisabled(0);


    }

    /**
     * Creates a new LoginForm object.
     * These kind of objects are responsible for the handling of the HTML input bars that appear on the Login panel.
     * Refer to the LoginForm docs. for more info on how it works.
     */
    private SetupLoginForm() {
        this.loginForm = new LoginForm(this);
    }


    /**
     * Enables all of the button on the right side of the screen.
     */
    private EnableRightSideButtons(): void {
        this.btnTabletMode.SetEnabled(1);
        this.btnCredits.SetEnabled(1);
        this.btnLeaderboards.SetEnabled(1);
        this.btnHowToPlay.SetEnabled(1);
        this.btnAboutGame.SetEnabled(1)
    }

    /**
     * Disables all of the button on the right side of the screen.
     * They will still be visible though.
     */
    private DisableRightSideButtons(): void {
        this.btnTabletMode.SetDisabled(1);
        this.btnCredits.SetDisabled(1);
        this.btnLeaderboards.SetDisabled(1);
        this.btnHowToPlay.SetDisabled(1);
        this.btnAboutGame.SetDisabled(1)
    }

    /* ==================== Fullscreen handling  */

    /**
     * Toggles the fullscreen mode.
     */
    private ToggleFullscreen(): void {
        /**
         * The 'fulscreen' image should change in response to the screen mode change.
         */
        if (this.scale.isFullscreen) {

            this.game.scale.stopFullscreen();
            this.btnFullscreenToggle.SetImage('fullscreenOn');
        }
        else {
            this.game.scale.startFullscreen();
            this.btnFullscreenToggle.SetImage('fullscreenOff');
        }
    }




}