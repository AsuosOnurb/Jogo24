import Phaser from 'phaser'
import ImageButton from '~/game_objects/ImageButton';

export default class HelloWorldScene extends Phaser.Scene {

    private mainMenuButtonsGroup!: Phaser.GameObjects.Group; // Contains all the buttons in the main menu
    private aboutUsButton!: Phaser.GameObjects.Sprite;
    private howToPlayButton!: Phaser.GameObjects.Sprite;

    private btnPlaySoloEasy!: Phaser.GameObjects.Sprite;
    private btnPlaySoloEasyText!: Phaser.GameObjects.Text;

    private btnPlaySoloMedium!: Phaser.GameObjects.Sprite;
    private btnPlaySoloMediumText!: Phaser.GameObjects.Text;

    private btnPlaySoloHard!: Phaser.GameObjects.Sprite;
    private btnPlaySoloHardText!: Phaser.GameObjects.Text;


    private panelGroup!: Phaser.GameObjects.Group;
    private panelRectangle!: Phaser.GameObjects.Graphics;
    private panelBackButton!: Phaser.GameObjects.Sprite;
    private panelText!: Phaser.GameObjects.Text;

    private readonly ABOUT_GAME: string = `  The 24 game was invented by Robert Sun, who is from Shangai and earned his degree\nin Electronic Engineering in the United States. Sun created this game, in 1988 with\nthe intention of getting students to explore the relationships between numbers. He wanted to show how Math can be powergul, attractive and fascinating. 
                                            This author supports the idea that patterns are the essence of Math, and emphasizes that it is important to discover different ways to relate numbers.\n\n
                                            Nowadays, there are many different versions of the 24 game.\n\n
                                            This version of the game uses cards with numbers from 1 to 9.`;
    private readonly HOW_TO_PLAY: string = "This is how to play the game";


    constructor() {
        super('MainMenu');

    }

    preload() {
        this.load.spritesheet('btn_close', 'assets/images/ui/buttons/btn_close.png', { frameWidth: 550, frameHeight: 550 });

        this.load.spritesheet('btn', 'assets/images/ui/buttons/btns_base.png', { frameWidth: 724, frameHeight: 180 })

    }


    create() {

        // ================ Panel setup ====================================================
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
        this.panelBackButton = this.add.sprite(window.innerWidth / 2 + 512 + 128, 128, 'btn_close');
        this.panelBackButton.setScale(0.3, 0.3);
        this.panelBackButton.setInteractive()
            .on("pointerdown", () => { this.closePanel(); })
            .on("pointerup", () => this.panelBackButton.setFrame(0))
            .on("pointerover", () => this.panelBackButton.setFrame(1))
            .on("pointerout", () => this.panelBackButton.setFrame(0))




        // Put back button and panel image into the panel group
        this.panelGroup.add(this.panelBackButton);
        this.panelGroup.add(this.panelRectangle);

        // The panel group starts invisible
        this.panelGroup.setVisible(false);

        // ============================= "About the game" and "How to play" texts ======================//
        this.panelText = this.add.text(128 + 16, 128 + 16, "DEFAULT_TEXT", { color: "0xffff", fontSize: "32px" });
        this.panelText.setVisible(false);

        this.panelGroup.add(this.panelText);

        // ============================ Setup Main Menu Buttons ======================== //
        // The group
        this.mainMenuButtonsGroup = this.add.group();

        // About the game button
        this.aboutUsButton = this.add.sprite(512, window.innerHeight - 96, 'btn');
        this.aboutUsButton.setScale(0.3, 0.3);
        this.aboutUsButton.setInteractive()
            .on("pointerup", () => this.showAboutUsPanel())
            .on("pointerover", () => { console.log("Over"); this.aboutUsButton.setFrame(1) })
            .on("pointerout", () => this.aboutUsButton.setFrame(0));


        // How to play button
        this.howToPlayButton = this.add.sprite(1024, window.innerHeight - 96, 'btn');
        this.howToPlayButton.setScale(0.3, 0.3);
        this.howToPlayButton.setInteractive()
            .on("pointerup", () => this.showHowToPlayPanel())
            .on("pointerover", () => { console.log("Over"); this.howToPlayButton.setFrame(1) })
            .on("pointerout", () => this.howToPlayButton.setFrame(0));

        // Play Solo Easy button
        this.btnPlaySoloEasy = this.add.sprite(window.innerWidth / 2 - 512, window.innerHeight / 2, 'btn');
        this.btnPlaySoloEasy.setScale(0.5, 0.5);
        this.btnPlaySoloEasy.setInteractive()
            .on("pointerover", () => this.btnPlaySoloEasy.setFrame(1))
            .on("pointerout", () => this.btnPlaySoloEasy.setFrame(0))
            .on("pointerup", () => this.startSoloGame("Easy")); // Starts solo game on easy diff. 
        this.btnPlaySoloEasyText = this.add.text(window.innerWidth / 2 - 512 - 96, window.innerHeight / 2 - 32, "FÁCIL", { fontSize: "64px" });

        // Play Solo Medium button
        this.btnPlaySoloMedium = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'btn');
        this.btnPlaySoloMedium.setScale(0.5, 0.5);
        this.btnPlaySoloMedium.setInteractive()
            .on("pointerover", () => this.btnPlaySoloMedium.setFrame(1))
            .on("pointerout", () => this.btnPlaySoloMedium.setFrame(0))
            .on("pointerup", () => this.startSoloGame("Medium")); // Starts solo game on medium diff. 
        this.btnPlaySoloMediumText = this.add.text(window.innerWidth / 2 - 96, window.innerHeight / 2 - 32, "MÉDIO", { fontSize: "64px" });

        // Play Solo Hard button
        this.btnPlaySoloHard = this.add.sprite(window.innerWidth / 2 + 512, window.innerHeight / 2, 'btn');
        this.btnPlaySoloHard.setScale(0.5, 0.5);
        this.btnPlaySoloHard.setInteractive()
            .on("pointerover", () => this.btnPlaySoloHard.setFrame(1))
            .on("pointerout", () => this.btnPlaySoloHard.setFrame(0))
            .on("pointerup", () => this.startSoloGame("Hard")); // Starts solo game on medium diff. 
        this.btnPlaySoloHardText = this.add.text(window.innerWidth / 2 + 512 - 128, window.innerHeight / 2 - 32, "DIFÍCIL", { fontSize: "64px" });


        this.mainMenuButtonsGroup.setVisible(true);
        this.panelGroup.setVisible(false)
        this.panelText.text = this.HOW_TO_PLAY;


        // Add buttons and texts into the main menu group
        this.mainMenuButtonsGroup.add(this.aboutUsButton);
        this.mainMenuButtonsGroup.add(this.howToPlayButton);

        this.mainMenuButtonsGroup.add(this.btnPlaySoloEasy); // Add solo easy btn
        this.mainMenuButtonsGroup.add(this.btnPlaySoloEasyText); // Add solo easy btn text

        this.mainMenuButtonsGroup.add(this.btnPlaySoloMedium); // Add solo medium btn
        this.mainMenuButtonsGroup.add(this.btnPlaySoloMediumText); // Add solo medium btn text

        this.mainMenuButtonsGroup.add(this.btnPlaySoloHard); // Add solo hard btn
        this.mainMenuButtonsGroup.add(this.btnPlaySoloHardText); // Add solo hard btn text




        // Position everyting
        //this.resizeField(this.sys.game.config.width, this.sys.game.config.height);

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
            this.scene.start("SoloGame", { difficulty: "Easy" });
        }
        else if (difficulty === "Medium") {
            this.scene.start("SoloGame", { difficulty: "Medium" });
        }
        else if (difficulty === "Hard") {
            this.scene.start("SoloGame", { difficulty: "Hard" });
        }
    }


}