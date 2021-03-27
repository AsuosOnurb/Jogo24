import Phaser from 'phaser'
import {DPR} from './dpr'

export default class BetterText extends Phaser.GameObjects.Text 
{
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: any )
    {
        if (style.fontSize)
        {
            style.fontSize *= 1;
        }

        super(scene, x , y , text, style);
    
        scene.add.existing(this);
    }
}