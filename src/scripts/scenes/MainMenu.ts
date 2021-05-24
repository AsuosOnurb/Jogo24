import Phaser, { Display, Scale } from 'phaser'
import { BackendConnection } from '../backend/BackendConnection';
import { LoginData } from '../backend/LoginData';

import { BetterButton } from '../better/BetterButton'
import { BetterText } from '../better/BetterText';
import { Difficulty } from '../game/CardGenerator';

enum Panels {
    AboutGame,
    HowToPlay,
    Credits,
    Login
};

export class MainMenuScene extends Phaser.Scene {

    private mainMenuButtonsGroup!: Phaser.GameObjects.Group; // Contains all the buttons in the main menu
    private btnAboutGame!: BetterButton;
    private howToPlayButton!: BetterButton;
    private btnLeaderboards!: BetterButton;
    private btnTabletMode!: BetterButton;
    private btnCredits!: BetterButton;

    private btnPlaySoloEasy!: BetterButton;
    private btnPlaySoloMedium!: BetterButton;
    private btnPlaySoloHard!: BetterButton;

    private btnOpenLoginWindow: BetterButton;
    private btnLogin: BetterButton;
    private btnLogout: BetterButton;

    private btnFullscreenToggle: BetterButton;


    /* ========== "How to play" , "About the game" , "Credits" and "Login" panels =======*/
    private isPanelOpen: boolean;   // Is any panel open or not
    private btnClosePanel: BetterButton; // The "X" button that closes every panel
    private groupPanel: Phaser.GameObjects.Group;
    private imgHowToPlay: Phaser.GameObjects.Image;
    private imgAboutTheGame: Phaser.GameObjects.Image;
    private imgCredits: Phaser.GameObjects.Image;
    private imgLoginWindow: Phaser.GameObjects.Image;




    constructor() {
        super('MainMenu');

    }


    preload() {

        // Add background image 
        const bgImg = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);



        // Insert the toon image
        const toonImg = this.add.sprite(this.scale.width / 2 - 720, this.scale.height - 283, 'toon');

        // Insert the title image
        const titleImg = this.add.sprite(this.scale.width / 2, 160, 'title');
        titleImg.setScale(0.7, 0.7);

        // ============================ Setup Main Menu Buttons ======================== //

        // Tablet mode button
        this.btnTabletMode = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 21 * 32, 0.8, 0.8, "", {}, 'btn_tabletMode');
        this.btnTabletMode.once('pointerup', () => this.StartMultiplayerGame());

        // Fullscreen button
        this.btnFullscreenToggle = new BetterButton(this, this.scale.width - 128, 128, 0.8, 0.8, "", {}, this.scale.isFullscreen ? "fullscreenOff" : "fullscreenOn");
        this.btnFullscreenToggle.on('pointerup', () => this.ToggleFullscreen());

        // Top 100 button
        this.btnLeaderboards = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 11 * 32, 0.8, 0.8, "", {}, "btn_top");
        this.btnLeaderboards.on('pointerup', () => this.StartRankingScene());

        // About the game button
        this.btnAboutGame = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 6 * 32, 0.8, 0.8, "", {}, 'btn_about');
        this.btnAboutGame.on("pointerup", () => this.ShowPanel(Panels.AboutGame));

        // How to play button
        this.howToPlayButton = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 32, 0.8, 0.8, "", {}, "btn_howToPlay");
        this.howToPlayButton.on("pointerup", () => this.ShowPanel(Panels.HowToPlay));

        // Credits button
        this.btnCredits = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 16 * 32, 0.8, 0.8, "", {}, "btn_credits");
        this.btnCredits.on('pointerup', () => this.ShowPanel(Panels.Credits));


        // Play Solo Easy button
        this.btnPlaySoloEasy = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 16, 1.2, 1.2, "", {}, 'btn_easy', 0);
        this.btnPlaySoloEasy.on("pointerup", () => this.StartSoloGame(Difficulty.Easy));


        // Play Solo Medium button
        this.btnPlaySoloMedium = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 192, 1.2, 1.2, "", {}, 'btn_medium', 0);
        this.btnPlaySoloMedium.on("pointerup", () => this.StartSoloGame(Difficulty.Medium));

        // Play Solo Hard button
        this.btnPlaySoloHard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 384, 1.2, 1.2, "", {}, 'btn_hard', 0);
        this.btnPlaySoloHard.on("pointerup", () => this.StartSoloGame(Difficulty.Hard));

        // Button that opens the login window/panel
        this.btnOpenLoginWindow = new BetterButton(this, this.scale.width - 384, 128, 1, 1, "", {}, 'btn_login', 0);
        this.btnOpenLoginWindow.on('pointerup', () => this.ShowPanel(Panels.Login));

        // The logout Button
        this.btnLogout = new BetterButton(this, 128, 128, 1, 1, "", {}, 'btn_login', 0);
        this.btnLogout.on('pointerup', () => this.Logout());

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

        this.btnLogin = new BetterButton(this, this.scale.width/2, this.scale.height / 2 + 360  , 1, 1, "", {}, 'btn_login', 0);
        this.btnLogin.SetDisabled(0);


        this.btnClosePanel = new BetterButton(this, this.scale.width / 2 + 400, this.scale.height / 2 - 200, 0.8, 0.8, "", {}, 'btn_close');
        this.btnClosePanel.on('pointerup', () => this.HidePanel());
        this.btnClosePanel.setAlpha(0);

        this.groupPanel = this.add.group([this.imgAboutTheGame, this.imgHowToPlay, this.imgCredits, this.btnClosePanel, this.imgLoginWindow]);
        this.groupPanel.setAlpha(0);
        this.isPanelOpen = false;
    }



    update() {
        /*
        const gameId = document.getElementById("game");
        if (gameId) {
            gameId.style.width = '100%';
            gameId.style.height = '100%';
        }

        this.scale.refresh();
        */

    }

    StartSoloGame(diff: Difficulty): void {
        console.log(`Starting solo game on ${diff} difficulty.`);
        this.scene.start("SoloGame", { difficulty: diff });
    }

    StartMultiplayerGame(): void {
        this.scene.start("MultiplayerGame");
    }

    StartRankingScene(): void {
        this.scene.start("RankingScene");
    }


    ShowPanel(panelName: Panels): void {
        // Only open a panel if there's not another one already opened
        console.log("Show panels: ")
        console.log(panelName);
        if (!this.isPanelOpen) {
            switch (panelName) {
                case Panels.AboutGame:
                    //this.groupPanel.setVisible(true);
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

            this.isPanelOpen = true;
        }

    }

    HidePanel(): void {
        this.isPanelOpen = false;
        this.PlayTween_HidePanel();


    }


    private ToggleFullscreen(): void {
        if (this.scale.isFullscreen) {

            this.scale.stopFullscreen();
            this.btnFullscreenToggle.SetImage('fullscreenOn');
        }
        else {
            this.scale.startFullscreen();
            this.btnFullscreenToggle.SetImage('fullscreenOff');
        }
    }

    private PlayTween_ShowPanel(panel: Panels): void {
        console.log("Opening panel: ")
        console.log(panel);
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

        console.log("Target image:")
        console.log(targetImage)


        // Make the image appear
        this.tweens.add({
            targets: [this.groupPanel, targetImage, panel == Panels.Login ? this.btnLogin : undefined],
            alpha: 1,
            scale: 1.5,
            ease: 'Power1',
            duration: 500
        });

        // make the close button appear
        this.tweens.add({
            targets: this.btnClosePanel,
            alpha: 1,
            ease: 'Power1',
            duration: 500
        });

        // Disable some buttons
        this.DisableSoloGameButtons();

        // Enable login button if the panel is the Login panel
        if (panel == Panels.Login)
            this.btnLogin.SetEnabled(1);
    }

    private PlayTween_HidePanel(): void {

        this.tweens.add({
            targets: [this.imgAboutTheGame, this.imgCredits, this.imgHowToPlay, this.imgLoginWindow
                , this.btnClosePanel, this.btnLogin],
            alpha: 0,
            scale: 0.4,
            ease: 'Power1',
            duration: 100
        });

        // Enable some buttons
        this.EnableSoloGameButtons();

        // Disable login button
        this.btnLogin.SetDisabled(0);
    }

    private EnableSoloGameButtons(): void 
    {
        this.btnPlaySoloEasy.SetEnabled(1);
        this.btnPlaySoloMedium.SetEnabled(1);
        this.btnPlaySoloHard.SetEnabled(1);
    }
    private DisableSoloGameButtons() : void 
    {
        this.btnPlaySoloEasy.SetDisabled(1);
        this.btnPlaySoloMedium.SetDisabled(1);
        this.btnPlaySoloHard.SetDisabled(1);
    }

    private Logout() : void 
    {
        this.btnLogout.SetDisabled(0);
        this.btnLogin.SetEnabled(1);

        // BackendConnection.DestroySession(); Keep this for later
    }


}