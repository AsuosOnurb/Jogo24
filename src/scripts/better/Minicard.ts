import { BetterButton } from "./BetterButton";

export class Minicard extends Phaser.GameObjects.Group
{
    private mScene: Phaser.Scene;
    private mBackground: Phaser.GameObjects.Image;
    private mButtons: Array<BetterButton>;

    constructor(scene: Phaser.Scene, x: number, y:number, cardString: string) 
    {
        super(scene);
        this.mScene = scene;
        this.mBackground = scene.add.image(x, y, 'cardBG');
        this.mBackground.setScale(0.3);

        this.mButtons = new Array<BetterButton>();
        this.mButtons[0] = new BetterButton(scene, x - 54, y, 0.3, 0.3, cardString[0], {fontSize: 48}, 'btn_numberBG', 0);
        this.mButtons[0].SetDisabled(1);
        this.mButtons[0].HideShape();

        
        this.mButtons[1] = new BetterButton(scene, x, y - 54, 0.3, 0.3, cardString[1], {fontSize: 48}, 'btn_numberBG', 0);
        this.mButtons[1].SetDisabled(1);
        this.mButtons[1].HideShape();


        this.mButtons[2] = new BetterButton(scene, x + 54, y, 0.3, 0.3, cardString[2], {fontSize: 48}, 'btn_numberBG', 0);
        this.mButtons[2].SetDisabled(1);
        this.mButtons[2].HideShape();


        this.mButtons[3] = new BetterButton(scene, x , y +54, 0.3, 0.3, cardString[3], {fontSize: 48}, 'btn_numberBG', 0);
        this.mButtons[3].SetDisabled(1);
        this.mButtons[3].HideShape();

       
    }
}