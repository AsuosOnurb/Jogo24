import Phaser from 'phaser'
import BetterText from './BetterText'



export default class BetterButton extends Phaser.GameObjects.Sprite 
{
    private textObject!: BetterText;

   constructor(scene: Phaser.Scene, x: number, y:number, xScale:number, yScale:number,  text:string|undefined, textStyle:any , texture:string|Phaser.Textures.Texture)
    {
        super(scene, x * devicePixelRatio  , y * devicePixelRatio , texture);

 
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale * devicePixelRatio , yScale * devicePixelRatio );

        // Buttons are interactible by default
        this.setInteractive()
            .on("pointerout", () => this.setFrame(0))
            .on("pointerover", () => this.setFrame(1))
            .on("pointerdown", () => this.setFrame(1));

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.textObject = new BetterText(scene, x, y, text, textStyle);

        // offset the text object position
        this.textObject?.setOrigin(0.5);


    }

    setText(newText: string) : void
    {
        this.textObject.setText(newText);
    }

    setText(newText: string) : void
    {
        this.textObject.setText(newText);
    }

}