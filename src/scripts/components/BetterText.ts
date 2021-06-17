// BetterText.ts
/**
 * Module responsible for the implementation of the text object that is used in the whole project.
 * @module
 */



import Phaser from 'phaser'

/**
 * The class that implements a custom text object.
 * 
 * Initialy, some efforts were made to  support retina screens and adapt the text to screen size/resolution.
 * Turned out it was un-necessary and because of that some features ended up being removed. That's why this text class is so simple.
 * 
 * Still, it allows for further customization if it is later needed.
 */
export  class BetterText extends Phaser.GameObjects.Text 
{

    /**
     * Creates a BetterText object.
     * @param scene The scene where the text is to be placed.
     * @param x The x coordinate.
     * @param y The y coordinate.
     * @param text The text contents.
     * @param style The styling of the text.
     */
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: any )
    {

        if (!style.color)
        {
            style.color = "#292d33";
        }        

        super(scene, x  , y   , text, style);
        
        this.setOrigin(0.5, 0.5);
        
        scene.add.existing(this);
    }

    
}