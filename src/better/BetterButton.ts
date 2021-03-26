import Phaser from 'phaser'
import BetterText from './BetterText';

export default class BetterButton extends Phaser.GameObjects.Sprite 
{
    private textObject!: BetterText;

   constructor(scene: Phaser.Scene, x: number, y:number, xScale:number, yScale:number,  text:string|undefined, textStyle:any , texture:string|Phaser.Textures.Texture)
    {
        super(scene, x * devicePixelRatio, y * devicePixelRatio, texture, 0);

        console.log(this.texture)
 
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale * devicePixelRatio, yScale * devicePixelRatio);

        // Buttons are interactible by default
        this.setInteractive();

        // We can also set the animation frames for the different button states.
        // For now, there are 2 animation states for buttons: On pointer hover/over, and on pointer out
        this.on("pointerout", () => this.setFrame(0));
        this.on("pointerover", () => this.setFrame(1));

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.textObject = new BetterText(scene, x, y, text, textStyle);

        console.log(this.textObject);

    }

}