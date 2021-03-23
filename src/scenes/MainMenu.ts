import Phaser from 'phaser'
import ImageButton from '~/game_objects/ImageButton';

export default class HelloWorldScene extends Phaser.Scene {

    private panelGroup!: Phaser.GameObjects.Group;
    private aboutUsPanel!: Phaser.GameObjects.Sprite;
    private backButtonImage!: Phaser.GameObjects.Sprite;
    private aboutUsButton!: Phaser.GameObjects.Sprite;
    private aboutUsTextObject!: Phaser.GameObjects.Text;


    constructor() {
        super('hello-world')

    }

    preload() {
        this.load.image('aboutUsPanel', 'assets/images/ui/panels/panel.png');
        this.load.image('btn_back', 'assets/images/ui/buttons/btn_back.png');
    }

   
    create() {

        /* ================About us button ======================== */
       this.aboutUsButton = this.add.sprite(128, window.innerHeight - 32, 'btn_back');
       this.aboutUsButton.setInteractive();
       this.aboutUsButton.on("pointerdown", () => {
           console.log("Ho");
            this.aboutUsButton.setInteractive(false);
            this.panelGroup.setVisible(true);
            
       });

    
        // ============================= About Us panel Setup ============= //
        this.panelGroup = this.add.group();
        
        // The panel image
       this.aboutUsPanel = this.add.sprite(window.innerWidth/2, window.innerHeight / 2,'aboutUsPanel');

       // The back button image
       this.backButtonImage = this.add.sprite(200 , 160, 'btn_back');
       // The back button event
       this.backButtonImage.setInteractive();
       this.backButtonImage.on("pointerdown", () => {
            console.log("Hey");
            this.panelGroup.setVisible(false);
            this.backButtonImage.setInteractive(true);
       });

       // The text
       const text: string = "Um texto muito fixe ... yey.....";
       this.aboutUsTextObject = this.add.text((window.innerWidth / 2) - 256, window.innerHeight / 2, text, {fontSize: "32px"});
       this.aboutUsTextObject.style.fontSize = "20";

       this.panelGroup.add(this.aboutUsPanel);
       this.panelGroup.add(this.backButtonImage);
       this.panelGroup.add(this.aboutUsTextObject);


       

       
    }

    
    
}
