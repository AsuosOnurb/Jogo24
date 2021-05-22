
import Phaser, { Game } from 'phaser'
import { RandomInt } from '../game/Utils';
import { BetterText } from './BetterText'



export class BetterButton extends Phaser.GameObjects.Sprite {

    private mCurrentScene: Phaser.Scene;

    private m_TextObject: BetterText;
    private m_IsEnabled: boolean;

    private m_OriginalScale: number;

    /**
     * Tween animation that triggers everytime the mouse/pointer enters/hovers the button.
     */
    private m_Tween_ButtonHover: Phaser.Tweens.Tween;

    /**
     * Tween animation that triggers everytime the mouse/pointer exits/(stops hovering) the button.
     */
    private m_Tween_ButtonOut: Phaser.Tweens.Tween;
    private m_Tween_ButtonPress: Phaser.Tweens.Tween;

    /**
     *  Tween animation that triggers everytime the button is pressed
     **/
    private m_RandomHoverAngle: number;

    constructor(scene: Phaser.Scene, x: number, y: number, xScale: number, yScale: number, text: string | undefined, textStyle: any, texture: string | Phaser.Textures.Texture, optionalAngle?: number | undefined) {
        super(scene, x, y, texture);

        this.mCurrentScene = scene;
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale, yScale);
        this.m_OriginalScale = this.scale;

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.m_TextObject = new BetterText(scene, x, y, text, textStyle);


        // offset the text object position
        this.m_TextObject?.setOrigin(0.5);

        // Buttons are interactible by default
        this.SetEnabled();


        // Define some events for when the mouse is over, out of the button for some pretty effects.
        // Also setup some effect where the button 'gets pressed' when it is clicked.
        if (optionalAngle === undefined) {
            const randomAngles = [- 6, -5, -4, 4, 5, 6];
            this.m_RandomHoverAngle = randomAngles[Math.floor(Math.random() * randomAngles.length)]// The amount of degrees the button performs when it is being hovered.
        }
        else {
            this.m_RandomHoverAngle = optionalAngle;
        }


        // Setup tween animations
        /*
        if (!scene.game.device.input.touch)
        {
            this.SetupButtonHoverAnimation(); 
            this.SetupButtonOutAnimation();
        }*/
        this.SetupButtonPressAnimation()


    }

    SetText(newtext: string): void {
        this.m_TextObject.setText(newtext);
    }

    NumberButtonSetText(newText: string): void {

        this.m_TextObject.setText(newText);
        this.UpdateFontSize();
    }

    GetText(): string {
        return this.m_TextObject.text;
    }

    SetEnabled(alpha: number = 1.0) {
        this.setInteractive({ cursor: 'pointer' });
        this.m_TextObject.setAlpha(alpha);

        this.setAlpha(alpha);
        this.m_IsEnabled = true;


    }

    SetDisabled(alpha: number = 0.3): void {
        this.disableInteractive();
        this.m_TextObject.setAlpha(alpha);
        this.setAlpha(alpha);
        this.m_IsEnabled = false;
    }

    IsEnabled(): boolean {
        return this.m_IsEnabled;
    }

    SetAngle(degrees): BetterButton {
        this.setAngle(degrees);
        this.m_TextObject.setAngle(degrees);

        return this;
    }

    SetScale(x, y): void {
        this.setScale(x, y);
        this.m_TextObject.setScale(x, y);
    }

    FlipY(flip: boolean): void {
        this.setFlipY(flip);
        this.setFlipX(flip);

        this.m_TextObject.setFlipY(flip);
        this.m_TextObject.setFlipX(flip);
    }


    SetupButtonOutAnimation(): void {

        this.m_Tween_ButtonOut = this.mCurrentScene.tweens.add({
            targets: this,
            props: {
                scale: this.m_OriginalScale,
                angle: 0

            },
            ease: 'Power1',
            duration: 70,
            paused: true
        });

        this.on('pointerout', () => this.m_Tween_ButtonOut.play());

    }

    SetupButtonHoverAnimation(): void {

        this.m_Tween_ButtonHover = this.mCurrentScene.tweens.add({
            targets: this,
            props: {
                scale: this.m_OriginalScale + 0.2,
                angle: this.m_RandomHoverAngle
            },
            ease: 'Power1',
            duration: 70,
            paused: true

        });

        this.on('pointerover', () => this.m_Tween_ButtonHover.play());

    }

    SetupButtonPressAnimation(): void {

        this.m_Tween_ButtonPress = this.mCurrentScene.tweens.add({
            targets: [this, this.m_TextObject],
            props: {
                scale: this.m_OriginalScale - 0.2
            },
            ease: 'Power1',
            duration: 70,
            paused: true,
            yoyo: true,
        });

        this.on('pointerup', () => {
            this.m_Tween_ButtonPress.play();
        });

    }

    /**
     * Hides the button image, but keeps the text visible.
     */
    HideShape() {
        this.setVisible(false);
        this.m_TextObject.setVisible(true);
    }

    SetTextColor(hexcolor: string): void {
        this.m_TextObject.setColor(hexcolor);
    }

    PlayCorrectExpressionTween(): void {


        /*
        this.scene.tweens.add({
            targets: this,
            props: {
                y: {value: 64, duration: 150, ease:"Bounce.easeInOut", yoyo:true}
            },
            
        });*/

        this.scene.tweens.add({
            targets: [this, this.m_TextObject],
            y: this.mCurrentScene.scale.height / 2,
            scale: 2,
            duration: 1000,
            ease: 'Elastic.InOut',
            easeParams: [1.5, 0.5],
            delay: 0,
            yoyo: true
        });
    }

    PlayIncorrectExpressionTween(): void {
        this.scene.tweens.add({
            targets: [this, this.m_TextObject],
            y: this.y + 64,
            scale: 1.4,
            duration: 250,
            ease: 'Elastic.InOut',
            easeParams: [2, 2],
            delay: 0,
            yoyo: true
        });
    }

    SetFontSize(size) : void 
    {
        this.m_TextObject.setFontSize(size);

    }


    SetImage(imageName: string) : void 
    {
        this.setTexture(imageName);
    }


    private UpdateFontSize(): void {

        let calculatedSize = 0;
        
        if (this.m_TextObject.text.length === 1 || this.m_TextObject.text.length === 0)
            calculatedSize = 128;
        else 
            calculatedSize = 128 / (this.m_TextObject.text.length * 0.4)

        if (calculatedSize < 38)
            calculatedSize = 38;

        console.log(calculatedSize);

        this.m_TextObject.setFontSize(calculatedSize);
    }

}