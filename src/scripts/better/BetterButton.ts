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

    SetEnabled()
    {
        this.setInteractive();
        this.m_TextObject.setAlpha(1);

        this.setAlpha(1);
        this.m_IsEnabled = true;

      
    }

    SetDisabled(): void
    {
        this.disableInteractive();
        this.m_TextObject.setAlpha(0.3);
        this.setAlpha(0.3);
        this.m_IsEnabled = false;

       
        
    }

    IsEnabled() : boolean
    {
        return this.m_IsEnabled;
    }

   
}