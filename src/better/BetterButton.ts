import Phaser from 'phaser'
import BetterText from './BetterText'
import {DPR} from './dpr'

export default class BetterButton extends Phaser.GameObjects.Sprite 
{
    private textObject!: BetterText;

   constructor(scene: Phaser.Scene, x: number, y:number, xScale:number, yScale:number,  text:string|undefined, textStyle:any , texture:string|Phaser.Textures.Texture)
    {
        super(scene, x , y , texture);

 
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale  , yScale  );

        // Buttons are interactible by default
        this.setInteractive()
            .on("pointerout", () => this.setFrame(0))
            .on("pointerover", () => this.setFrame(1))
            .on("pointerdown", () => this.setFrame(1));

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.textObject = new BetterText(scene, x, y, text, textStyle);


    }

}