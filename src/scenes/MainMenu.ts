import Phaser from 'phaser'
import ImageButton from '~/game_objects/ImageButton';

export default class HelloWorldScene extends Phaser.Scene {

    private mainMenuButtonsGroup!: Phaser.GameObjects.Group; // Contains all the buttons in the main menu
    private aboutUsButton!: Phaser.GameObjects.Sprite;
    private howToPlayButton!: Phaser.GameObjects.Sprite;

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
        this.load.spritesheet('btn_close', 'assets/images/ui/buttons/btn_close.png', {frameWidth: 550, frameHeight: 550});

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
        this.panelRectangle = graphics.fillRoundedRect(128, 128 ,window.innerWidth - 256, window.innerHeight - 512, 13);


        // The back button image
        this.panelBackButton = this.add.sprite(window.innerWidth/2 + 512 + 128, 128, 'btn_close');
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
        this.panelText = this.add.text(128 + 16, 128+16, "DEFAULT_TEXT", { color: "0xffff", fontSize: "32px" });
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
            .on("pointerdown", () => this.aboutUsButton.setFrame(1))
            .on("pointerover", () => { console.log("Over"); this.aboutUsButton.setFrame(1) })
            .on("pointerout", () => this.aboutUsButton.setFrame(0))




        // How to play button
        this.howToPlayButton = this.add.sprite(1024, window.innerHeight - 96, 'btn');
        this.howToPlayButton.setScale(0.3, 0.3);
        this.howToPlayButton.setInteractive()
            .on("pointerup", () => this.showHowToPlayPanel())
            .on("pointerdown", () => this.howToPlayButton.setFrame(1))
            .on("pointerover", () => { console.log("Over"); this.howToPlayButton.setFrame(1) })
            .on("pointerout", () => this.howToPlayButton.setFrame(0));


        this.mainMenuButtonsGroup.setVisible(true);
        this.panelGroup.setVisible(false)
        this.panelText.text = this.HOW_TO_PLAY;


        // Add buttons into the group
        this.mainMenuButtonsGroup.add(this.aboutUsButton);
        this.mainMenuButtonsGroup.add(this.howToPlayButton);

        


        // Position everyting
        //this.resizeField(this.sys.game.config.width, this.sys.game.config.height);

    }

    closePanel()
    {
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


}