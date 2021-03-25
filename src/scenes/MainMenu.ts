import Phaser from 'phaser'
import ImageButton from '~/game_objects/ImageButton';

export default class HelloWorldScene extends Phaser.Scene {

    private mainMenuButtonsGroup!: Phaser.GameObjects.Group; // Contains all the buttons in the main menu
    private aboutUsButton!: Phaser.GameObjects.Sprite;
    private howToPlayButton!: Phaser.GameObjects.Sprite;
    
    private panelGroup!: Phaser.GameObjects.Group;
    private panelRectangle!: Phaser.GameObjects.Shape;
    private panelBackButton!: Phaser.GameObjects.Sprite;
    private panelText!: Phaser.GameObjects.Text;

    private readonly ABOUT_GAME: string = "Things about the game";
    private readonly HOW_TO_PLAY: string = "This is how to play the game";


    constructor() {
        super('MainMenu');

    }

    preload() {
        this.load.image('btn_base', 'assets/images/ui/buttons/btn_base.png');
        this.load.image('btn_base_outline', 'assets/images/ui/buttons/btn_base.png_outline');


        this.load.image('btn_back2', 'assets/images/ui/buttons/btn_close.png');
     
    }


    create() {

        // ============================ Setup Main Menu Buttons ======================== //
        // The group
        this.mainMenuButtonsGroup = this.add.group();

        // About the game button
        this.aboutUsButton = this.add.sprite(512, window.innerHeight-96, 'btn_base');
        this.aboutUsButton.setScale(0.4, 0.4);
        this.aboutUsButton.setInteractive();
        this.aboutUsButton.on("pointerdown", () => {
            console.log("Clicked About Gamea btn");
            
            this.mainMenuButtonsGroup.setVisible(false);
            this.panelGroup.setVisible(true)
            this.panelText.text = this.ABOUT_GAME;
        });

        // How to play button
        this.howToPlayButton = this.add.sprite(1024, window.innerHeight-96, 'btn_base');
        this.howToPlayButton.setScale(0.4, 0.4);
        this.howToPlayButton.setInteractive();
        this.howToPlayButton.on('pointerdown', () => {
            console.log("clicked how to play btn");

            this.mainMenuButtonsGroup.setVisible(false);
            this.panelGroup.setVisible(true)
            this.panelText.text = this.HOW_TO_PLAY;

        });
        // Add buttons into the group
        this.mainMenuButtonsGroup.add(this.aboutUsButton);
        this.mainMenuButtonsGroup.add(this.howToPlayButton);

        // ================ Panel setup ====================================================

        // The panel group
        this.panelGroup = this.add.group();

        // The panel image
        // this.panelImage = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'panel');
        this.panelRectangle = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2, 
                window.innerWidth - 256, window.innerHeight - 256, 0xfce303);


        // The back button image
        this.panelBackButton = this.add.sprite(0, 0, 'btn_back2');
        this.panelBackButton.setScale(0.3, 0.3);
        this.panelBackButton.setInteractive();
        // The back button event
        this.panelBackButton.on("pointerdown", () => {
            console.log("Clicked to go back from about game panel");
            this.panelGroup.setVisible(false);
            this.mainMenuButtonsGroup.setVisible(true);
        });

        // Put back button and panel image into the panel group
        this.panelGroup.add(this.panelBackButton);
        this.panelGroup.add(this.panelRectangle);

        // The panel group starts invisible
        this.panelGroup.setVisible(false);

        // ============================= "About the game" and "How to play" texts ======================//
        this.panelText = this.add.text(0, 0, "DEFAULT_TEXT", {color: "0xffff", fontSize: "32px"});
        this.panelText.setVisible(false);
        
        this.panelGroup.add(this.panelText);


        // Position everyting
        //this.resizeField(this.sys.game.config.width, this.sys.game.config.height);

    }

    update(){
        const gameId = document.getElementById("game");
        if(gameId){
            gameId.style.width = '100%';
            gameId.style.height = '100%';
        }
    }

    /** 
    resizeField(w, h)
    {
        console.log("Called");
        
        this.aboutUsButton.setPosition(512 , h - 96, 0, 0);
        this.howToPlayButton.setPosition(512 + 512, h - 96, 0, 0);

        this.panelRectangle.setPosition(w / 2, h/2);

        this.panelBackButton.setPosition(w/2 + 820  , 128, 0, 0);

        this.panelText.setPosition(w/2, h/2);
    }
    */

}
