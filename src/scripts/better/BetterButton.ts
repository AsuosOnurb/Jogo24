import Phaser from 'phaser'
import { RandomInt } from '../game/Utils';
import { BetterText } from './BetterText'



export class BetterButton extends Phaser.GameObjects.Sprite {
    private m_TextObject: BetterText;
    private m_IsEnabled: boolean;

    private m_OriginalScaleX: number;
    private m_OriginalScaleY: number;

    private m_YoYoTween: Phaser.Tweens.Tween;

    /**
     *  We want buttons to be fun! When the mouse hovers over them, they grow with a small angle 
     **/
    private m_RandomHoverAngle: number;

    constructor(scene: Phaser.Scene, x: number, y: number, xScale: number, yScale: number, text: string | undefined, textStyle: any, texture: string | Phaser.Textures.Texture) {
        super(scene, x, y, texture);


        // add the button itself to the scene
        scene.add.existing(this);

        this.m_OriginalScaleX = xScale;
        this.m_OriginalScaleY = yScale;
        this.setScale(xScale, yScale);

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.m_TextObject = new BetterText(scene, x, y, text, textStyle);

        // offset the text object position
        this.m_TextObject?.setOrigin(0.5);

        // Buttons are interactible by default
        this.SetEnabled();

        // Define some events for when the mouse is over, out of the button for some pretty effects.
        // Also setup some effect where the button 'gets pressed' when it is clicked.
        const randomAngles = [- 6, -5, -4, 4, 5, 6];
        this.m_RandomHoverAngle = randomAngles[Math.floor(Math.random() * randomAngles.length)]// The amount of degrees the button performs when it is being hovered.
        this.SetupPointerHoverEffect();
        this.SetupPointerOutEffect();
        // this.SetupPointerPressEffect();


        // Add tween effect when user lifts the button
        this.SetUpPointerUpEffect()
        this.on('pointerup', () => this.m_YoYoTween.play());
    }


    SetText(newText: string): void {
        this.m_TextObject.setText(newText);
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

    SetupPointerHoverEffect(): void {

        this.on('pointerover', () => {

            this.angle += this.m_RandomHoverAngle;
            this.scaleX += 0.1;
            this.scaleY += 0.1;
        });
    }

    SetupPointerOutEffect(): void {
        this.on('pointerout', () => {
            this.angle -= this.m_RandomHoverAngle;
            this.scaleX -= 0.1;
            this.scaleY -= 0.1;
        });

    }

    SetupPointerPressEffect(): void {
        this.on('pointerdown', () => {
            this.scaleX -= 0.1;
            this.scaleY -= 0.1;
        });

        this.on('pointerup', () => {
            this.setScale(this.m_OriginalScaleX, this.m_OriginalScaleY);
        });
    }

    SetUpPointerUpEffect(): void {
        this.m_YoYoTween = this.scene.tweens.add({
            targets: this,
            props: {
                scale : 0.8,
            },
            ease: 'Power1',
            duration: 100,
            yoyo: true,
            paused: true,
        });
    }


}

