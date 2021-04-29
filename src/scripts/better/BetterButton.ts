import Phaser from 'phaser'
import {BetterText} from './BetterText'



export  class BetterButton extends Phaser.GameObjects.Sprite 
{
    private m_TextObject: BetterText;
    private m_IsEnabled: boolean;

   constructor(scene: Phaser.Scene, x: number, y:number, xScale:number, yScale:number,  text:string|undefined, textStyle:any , texture:string|Phaser.Textures.Texture)
    {
        super(scene, x   , y  , texture);

 
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale , yScale  );

        // Buttons are interactible by default
        this.setInteractive();

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.m_TextObject = new BetterText(scene, x, y, text, textStyle);

        // offset the text object position
        this.m_TextObject?.setOrigin(0.5);


    }


    SetText(newText: string) : void
    {
        this.m_TextObject.setText(newText);
    }

    GetText(): string
    {
        return this.m_TextObject.text;
    }

    SetEnabled(alpha: number = 1.0)
    {
        this.setInteractive();
        this.m_TextObject.setAlpha(alpha);

        this.setAlpha(alpha);
        this.m_IsEnabled = true;

      
    }

    SetDisabled(alpha: number = 0.3): void
    {
        this.disableInteractive();
        this.m_TextObject.setAlpha(alpha);
        this.setAlpha(alpha);
        this.m_IsEnabled = false;
    }

    IsEnabled() : boolean
    {
        return this.m_IsEnabled;
    }

    SetAngle(degrees) : BetterButton 
    {
        this.setAngle(degrees);
        this.m_TextObject.setAngle(degrees);

        return this;
    }

    SetScale(x, y) : void 
    {
        this.setScale(x,y);
        this.m_TextObject.setScale(x, y);
    }

    FlipY(flip: boolean) : void 
    {
        this.setFlipY(flip);
        this.setFlipX(flip);

        this.m_TextObject.setFlipY(flip);
        this.m_TextObject.setFlipX(flip);
    }
   
}