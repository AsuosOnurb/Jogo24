import Phaser, { Display, Scale } from 'phaser'

import BetterButton from '../better/BetterButton'
import BetterText from '../better/BetterText';

export default class HelloWorldScene extends Phaser.Scene {

    private mainMenuButtonsGroup!: Phaser.GameObjects.Group; // Contains all the buttons in the main menu
    private aboutUsButton!: BetterButton;
    private howToPlayButton!: BetterButton;
    private btnLeaderboards!: BetterButton;
    private btnTabletMode!: BetterButton;
    private btnCredits!: BetterButton;

    private btnPlaySoloEasy!: BetterButton;
    private btnPlaySoloMedium!: BetterButton;
    private btnPlaySoloHard!: BetterButton;


    private panelGroup!: Phaser.GameObjects.Group;
    private panelRectangle!: Phaser.GameObjects.Graphics;
    private panelBackButton!: BetterButton;
    private panelText!: BetterText;

    private readonly ABOUT_GAME: string = `  The 24 game was invented by Robert Sun, who is from Shangai and earned his degree\nin Electronic Engineering in the United States. Sun created this game, in 1988 with\nthe intention of getting students to explore the relationships between numbers. He wanted to show how Math can be powergul, attractive and fascinating. 
                                            This author supports the idea that patterns are the essence of Math, and emphasizes that it is important to discover different ways to relate numbers.\n\n
                                            Nowadays, there are many different versions of the 24 game.\n\n
                                            This version of the game uses cards with numbers from 1 to 9.`;
    private readonly HOW_TO_PLAY: string = "This is how to play the game";


    constructor() {
        super('MainMenu');

    }


    create() {

        // Add background image 
        const bgImg = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'blueBackground');
        bgImg.setScale(1.44, 1.37);

        // Insert the toon image
        const toonImg = this.add.sprite(256, window.innerHeight - 283, 'toon');

        // Insert the title image
        const titleImg = this.add.sprite(window.innerWidth / 2, 160, 'title');
        titleImg.setScale(0.7, 0.7);

        // ============================= Panel setup ====================================================
        var graphics = this.add.graphics();
        // The panel group
        this.panelGroup = this.add.group();

        // The panel image
        // this.panelImage = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'panel');
        //this.panelRectangle = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2,
        //  window.innerWidth - 256, window.innerHeight - 256, 0xfce303);
        graphics.fillStyle(0xfce303, 1);
        this.panelRectangle = graphics.fillRoundedRect(128, 128, window.innerWidth - 256, window.innerHeight - 512, 13);


        // The back button image
        this.panelBackButton = new BetterButton(this, innerWidth / 2, innerHeight / 2, 0.3, 0.3, undefined, undefined, 'btn_close');
        this.panelBackButton.on("pointerdown", () => this.closePanel());

        // Put back button and panel image into the panel group
        this.panelGroup.add(this.panelBackButton);
        this.panelGroup.add(this.panelRectangle);

        // The panel group starts invisible
        this.panelGroup.setVisible(false);

        // ============================= "About the game" and "How to play" texts ======================//
        this.panelText = new BetterText(this, 128 + 16, 128 + 16, "DEFAULT_TEXT", { color: "0xffff", fontSize: 32 });
        this.panelText.setVisible(false);

        this.panelGroup.add(this.panelText);

        // ============================ Setup Main Menu Buttons ======================== //
        // The group
        this.mainMenuButtonsGroup = this.add.group();

        // Tablet mode button
        this.btnTabletMode =            new BetterButton(this, window.innerWidth - 128, window.innerHeight - 64 - 21 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, 'btn_tabletMode');

        // Credits button
        this.btnCredits =               new BetterButton(this, window.innerWidth - 128, window.innerHeight - 64 - 16 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, "btn_credits");

        // Top 100 button
        this.btnLeaderboards =          new BetterButton(this, window.innerWidth - 128, window.innerHeight - 64 - 11 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, "btn_top");

        // About the game button
        this.aboutUsButton =            new BetterButton(this, window.innerWidth - 128, window.innerHeight - 64 - 6 * 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, 'btn_about');
        this.aboutUsButton.on("pointerup", () => this.showAboutUsPanel());

        // How to play button
        this.howToPlayButton =          new BetterButton(this, window.innerWidth - 128, window.innerHeight - 64 - 32, 0.8, 0.8, "", { fontSize: 16, fontFamily: "bold" }, "btn_howToPlay");
        this.howToPlayButton.on("pointerup", () => this.showHowToPlayPanel());



        // Play Solo Easy button
        this.btnPlaySoloEasy =          new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2 - 16, 1.2, 1.2, "", { fontSize: 32, fontFamily: "bold" }, 'btn_easy');
        this.btnPlaySoloEasy.on("pointerup", () => this.startSoloGame("Easy"));


        // Play Solo Medium button
        this.btnPlaySoloMedium =        new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2 + 192, 1.2, 1.2, "", { fontSize: 32, fontFamily: "bold" }, 'btn_medium');
        this.btnPlaySoloMedium.on("pointerup", () => this.startSoloGame("Medium"));

        // Play Solo Hard button
        this.btnPlaySoloHard =          new BetterButton(this, window.innerWidth / 2, window.innerHeight / 2 + 384, 1.2, 1.2, "", { fontSize: 32, fontFamily: "bold" }, 'btn_hard');
        this.btnPlaySoloHard.on("pointerup", () => this.startSoloGame("Hard"));


        this.mainMenuButtonsGroup.setVisible(true);
        this.panelGroup.setVisible(false)
        this.panelText.text = this.HOW_TO_PLAY;


        // Add buttons and texts into the main menu group
        this.mainMenuButtonsGroup.add(this.aboutUsButton);
        this.mainMenuButtonsGroup.add(this.howToPlayButton);

        this.mainMenuButtonsGroup.add(this.btnPlaySoloEasy); // Add solo easy btn
        this.mainMenuButtonsGroup.add(this.btnPlaySoloMedium); // Add solo medium btn
        this.mainMenuButtonsGroup.add(this.btnPlaySoloHard); // Add solo hard btn

        




    }

    closePanel() {
        this.panelGroup.setVisible(false);
        this.mainMenuButtonsGroup.setVisible(true);
    }
    showAboutUsPanel() {
        this.mainMenuButtonsGroup.setVisible(false);
        this.panelGroup.setVisible(true)
        this.panelText.text = this.ABOUT_GAME;
    }

    showHowToPlayPanel() {
        this.mainMenuButtonsGroup.setVisible(false);
        this.panelGroup.setVisible(true)
        this.panelText.text = this.HOW_TO_PLAY;
    }

    update() {
        const gameId = document.getElementById("game");
        if (gameId) {
            gameId.style.width = '100%';
            gameId.style.height = '100%';
        }
    }

    startSoloGame(difficulty: string): void {
        console.log(`Starting solo game on ${difficulty} difficulty.`);

        if (difficulty === "Easy") {
            this.scene.start("SoloGame", { difficulty: 1 })
        }
        else if (difficulty === "Medium") {
            this.scene.start("SoloGame", { difficulty: 2 });
        }
        else if (difficulty === "Hard") {
            this.scene.start("SoloGame", { difficulty: 3 });
        }
    }



}