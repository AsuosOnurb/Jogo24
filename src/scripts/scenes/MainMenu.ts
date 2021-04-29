import Phaser, { Display, Scale } from 'phaser'

import {BetterButton} from '../better/BetterButton'
import {BetterText} from '../better/BetterText';
import { Difficulty } from '../utils/CardGenerator';

enum Panels {
    AboutGame,
    HowToPlay,
    AboutUs
};

export  class MainMenuScene extends Phaser.Scene {

    private mainMenuButtonsGroup!: Phaser.GameObjects.Group; // Contains all the buttons in the main menu
    private btnAboutGame!: BetterButton;
    private howToPlayButton!: BetterButton;
    private btnLeaderboards!: BetterButton;
    private btnTabletMode!: BetterButton;
    private btnCredits!: BetterButton;

    private btnPlaySoloEasy!: BetterButton;
    private btnPlaySoloMedium!: BetterButton;
    private btnPlaySoloHard!: BetterButton;


    /* ========== "How to play" and "About the game" panels =======*/
    private isPanelOpen: boolean;   // Is any panel open or not
    private btnClosePanel: BetterButton;
    private groupPanel: Phaser.GameObjects.Group;
    private imgHowToPlay: Phaser.GameObjects.Image;
    private imgAboutTheGame: Phaser.GameObjects.Image;




    constructor() {
        super('MainMenu');

    }


    preload() {

        // Add background image 
        const bgImg = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'blueBackground');
        bgImg.setDisplaySize(this.scale.width, this.scale.height);


        // Add fullscreen toggle icon
        const fullScreenIcon = this.add.sprite(this.scale.width - 128, 128, 'fullscreenToggle');
        fullScreenIcon.setScale(0.1, 0.1);
        fullScreenIcon.setInteractive().on("pointerup", () => {

            if (this.scale.isFullscreen)
                this.scale.stopFullscreen();
            else
                this.scale.startFullscreen();

        })

        // Insert the toon image
        const toonImg = this.add.sprite(this.scale.width / 2 - 720, this.scale.height - 283, 'toon');

        // Insert the title image
        const titleImg = this.add.sprite(this.scale.width / 2, 160, 'title');
        titleImg.setScale(0.7, 0.7);

        // ============================ Setup Main Menu Buttons ======================== //

        // Tablet mode button
        this.btnTabletMode = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 21 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, 'btn_tabletMode');
        this.btnTabletMode.once('pointerup', () => this.StartMultiplayerGame());

        // Credits button
        this.btnCredits = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 16 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, "btn_credits");

        // Top 100 button
        this.btnLeaderboards = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 11 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, "btn_top");

        // About the game button
        this.btnAboutGame = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 6 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, 'btn_about');
        this.btnAboutGame.on("pointerup", () => this.ShowPanel(Panels.AboutGame));

        // How to play button
        this.howToPlayButton = new BetterButton(this, this.scale.width - 128, this.scale.height - 64 - 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, "btn_howToPlay");
        this.howToPlayButton.on("pointerup", () => this.ShowPanel(Panels.HowToPlay));



        // Play Solo Easy button
        this.btnPlaySoloEasy = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 - 16, 1.2, 1.2, "", { fontSize: 32, fontFamily: "bold" }, 'btn_easy');
        this.btnPlaySoloEasy.on("pointerup", () => this.StartSoloGame(Difficulty.Easy));


        // Play Solo Medium button
        this.btnPlaySoloMedium = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 192, 1.2, 1.2, "", { fontSize: 32, fontFamily: "bold" }, 'btn_medium');
        this.btnPlaySoloMedium.on("pointerup", () => this.StartSoloGame(Difficulty.Medium));

        // Play Solo Hard button
        this.btnPlaySoloHard = new BetterButton(this, this.scale.width / 2, this.scale.height / 2 + 384, 1.2, 1.2, "", { fontSize: 32, fontFamily: "bold" }, 'btn_hard');
        this.btnPlaySoloHard.on("pointerup", () => this.StartSoloGame(Difficulty.Hard));


        // =================== Setup the panel group, their images and the close button =================
        // How to play Group
        this.imgHowToPlay = this.add.image(this.scale.width / 2, this.scale.height / 2 + 140, 'howToPlay');
        this.imgHowToPlay.setScale(1.5);
        this.imgAboutTheGame = this.add.image(this.scale.width / 2, this.scale.height / 2 + 140, 'aboutGame');
        this.imgAboutTheGame.setScale(1.5);

        this.btnClosePanel = new BetterButton(this, this.scale.width / 2 + 400, this.scale.height / 2 - 200, 0.8, 0.8, "", undefined, 'btn_close');
        this.btnClosePanel.on('pointerup', () => this.HidePanel());
        
        this.groupPanel = this.add.group([this.imgAboutTheGame, this.imgHowToPlay, this.btnClosePanel]);
        this.groupPanel.setVisible(false); // Group starts invisible
        this.isPanelOpen = false;
    }



    update() {
        const gameId = document.getElementById("game");
        if (gameId) {
            gameId.style.width = '100%';
            gameId.style.height = '100%';
        }

        this.scale.refresh();

    }

    StartSoloGame(diff: Difficulty): void {
        console.log(`Starting solo game on ${diff} difficulty.`);
        this.scene.start("SoloGame", {difficulty: diff});
    }

    StartMultiplayerGame() : void
    {
        this.scene.start("MultiplayerGame");
    }


    ShowPanel(panelName: Panels): void {
        // Only open a panel if there's not another one already opened
        if (!this.isPanelOpen)
        {
            switch (panelName) {
                case Panels.AboutGame:
                    this.groupPanel.setVisible(true);
                    this.imgHowToPlay.setVisible(false);
                    break;
                case Panels.HowToPlay:
                    this.groupPanel.setVisible(true);
                    this.imgAboutTheGame.setVisible(false);
                    break
                default:
                    break;
            }

            this.isPanelOpen = true;
        }
        
    }

    HidePanel(): void {
        this.isPanelOpen = false;
        this.groupPanel.setVisible(false);
    }


}