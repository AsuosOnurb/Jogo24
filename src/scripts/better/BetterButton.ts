import Phaser from 'phaser'
import BetterText from './BetterText'



export default class BetterButton extends Phaser.GameObjects.Sprite 
{
    private textObject!: BetterText;
    private isEnabled: boolean;

   constructor(scene: Phaser.Scene, x: number, y:number, xScale:number, yScale:number,  text:string|undefined, textStyle:any , texture:string|Phaser.Textures.Texture)
    {
        super(scene, x * devicePixelRatio  , y * devicePixelRatio , texture);

 
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale * devicePixelRatio , yScale * devicePixelRatio );

        // Buttons are interactible by default
        this.setInteractive();

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.textObject = new BetterText(scene, x, y, text, textStyle);

        // offset the text object position
        this.textObject?.setOrigin(0.5);


    }

    SetText(newText: string) : void
    {
        this.textObject.setText(newText);
    }

    GetText(): string
    {
        return this.textObject.text;
    }

    SetEnabled()
    {
        this.setInteractive();
        this.textObject.setAlpha(1);
        this.setAlpha(1);
        this.isEnabled = true;
    }

    SetDisabled(): void
    {
        this.disableInteractive();
        this.textObject.setAlpha(0.3);
        this.setAlpha(0.3);
        this.isEnabled = false;

        
    }

    IsEnabled() : boolean
    {
        return this.isEnabled;
    }

   
}