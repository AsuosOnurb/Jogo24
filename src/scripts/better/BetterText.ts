import Phaser from 'phaser'

export  class BetterText extends Phaser.GameObjects.Text 
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
        
        this.setOrigin(0.5, 0.5);
        
        scene.add.existing(this);
    }
}