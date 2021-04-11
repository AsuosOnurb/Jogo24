import Phaser from 'phaser'

export default class BetterText extends Phaser.GameObjects.Text 
{
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: any )
    {


        if (!style.color)
        {
            style.color = "#292d33";
        }

        style.fontFamily= "Vertiky";
        style.fontStyle = "bold";

        

        super(scene, x  , y   , text, style);

        
        
        scene.add.existing(this);
    }
}