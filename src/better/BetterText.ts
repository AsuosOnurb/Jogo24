import Phaser from 'phaser'

export default class BetterText extends Phaser.GameObjects.Text 
{
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: any )
    {
        if (style.fontSize)
        {
            style.fontSize *= devicePixelRatio;
        }

        super(scene, x * devicePixelRatio, y * devicePixelRatio, text, style);
    
        scene.add.existing(this);
    }
}