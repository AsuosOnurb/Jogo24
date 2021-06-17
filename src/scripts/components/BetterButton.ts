// BetterButton.ts
/**
 * Module responsible for the implementation of the button object that is used in the whole project.
 * @module
 */



import Phaser from 'phaser'
import { BetterText } from './BetterText'


/**
 * The class that implements a custom button object.
 * 
 * A BetterButton object may have text (which can also be stylized) and an image background.
 * @remarks Some button animations were disabled due to strange tween behaviour. For now, only the 'press' animation is played.
 */
export class BetterButton extends Phaser.GameObjects.Sprite {

    /**
     * The scene where the button is placed.
     */
    private mCurrentScene: Phaser.Scene;

    /**
     * The text object that is displayed on the button.
     */
    private m_TextObject: BetterText;

    /**
     * Whether or not the button is enabled.
     */
    private m_IsEnabled: boolean;

    /**
     * The scale that the button starts with.
     * @remarks This is mainly used to control the modifications performed by the animations.
     */
    private m_OriginalScale;

    /**
     * Tween animation that triggers everytime the mouse/pointer enters/hovers the button.
     */
    private m_Tween_ButtonHover: Phaser.Tweens.Tween;

    /**
     * Tween animation that triggers everytime the mouse/pointer exits/(stops hovering) the button.
     */
    private m_Tween_ButtonOut: Phaser.Tweens.Tween;

    /**
     * Tween animation that triggers everytime the mouse/pointer presses the button.
     */
    private m_Tween_ButtonPress: Phaser.Tweens.Tween;

    /**
     *  The amplitude of the angle the button is rotated by when it is hovered.
     **/
    private m_RandomHoverAngle: number;

    /**
     * Creates a new BetterButton object.
     * @param scene The scene where the button is to be placed in.
     * @param x The x coordinate on the canvas
     * @param y The y coordinate on the canvas
     * @param xScale Horizontal scale of the button
     * @param yScale Vertical scale of the button
     * @param text The text string to display on the button
     * @param textStyle The styling that is applied to the text
     * @param texture The background texture/image of the button
     * @param optionalAngle The angle the button should rotate twoards when it is hovered
     */
    constructor(
        scene: Phaser.Scene, x: number, y: number,
        xScale: number, yScale: number,
        text: string, textStyle: any,
        texture: string,
        optionalAngle?: number | undefined) {

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
            Uncomment these line if pretty button animations are a must.

        if (!scene.game.device.input.touch)
        {
            this.SetupButtonHoverAnimation(); 
            this.SetupButtonOutAnimation();
        }

        */

        this.SetupButtonPressAnimation()

    }



    /* =============================================== Button Animations =============================================== */

    /**
     * Sets up the animation that triggers when the mouse exits out of the button.
     */
    SetupButtonOutAnimation(): void {


        this.m_Tween_ButtonOut = this.mCurrentScene.tweens.add({
            targets: this,
            props: {
                scale: this.m_OriginalScale,
                angle: 0

            },
            ease: 'Power1',
            duration: 40,
            paused: true,
            delay: 60
        });


        this.on('pointerout', () => this.m_Tween_ButtonOut.play());





    }

    /**
     * Sets up the animation that triggers when the mouse begins hovering the button.
     */
    SetupButtonHoverAnimation(): void {

        this.m_Tween_ButtonHover = this.mCurrentScene.tweens.add({
            targets: this,
            props: {
                scale: this.m_OriginalScale + 0.2,
                angle: this.m_RandomHoverAngle
            },
            ease: 'Power1',
            duration: 40,
            paused: true

        });

        this.on('pointerover', () => this.m_Tween_ButtonHover.play());

    }

    /**
     * Sets up the animation that triggers when the mouse/pointer presses the button.
     */
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
     * Plays an animation that is designed for the expression bar that holds the arithmetic expression 
     * in the singleplayer mode and tells the player that he got the answer right.
     */
    PlayCorrectExpressionTween(): void {
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

     /**
     * Plays an animation that is designed for the expression bar that holds the arithmetic expression 
     * in the singleplayer mode and tells the player that he got the answer wrong.
     */
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


    /* =============================================== Getters / Setters =============================================== */


    /**
  * Sets the text of the button.
  * @param newtext The text string to apply to the button
  */
    SetText(newtext: string): void {
        this.m_TextObject.setText(newtext);
    }

    /**
     * Sets the text of the button.
     * @param newText The text string to apply to the button.
     * @remarks This procedure is used mostly for the numbers on the cards. 
     * Because the arithemetic expression tend to grow, we need a way to make the text get smaller as the expression grows.
     */
    NumberButtonSetText(newText: string): void {

        this.m_TextObject.setText(newText);
        this.UpdateFontSize();
    }

    /**
     * Gets the text of the button.
     * @returns The string of text of the button
     */

    GetText(): string {
        return this.m_TextObject.text;
    }

    /**
     * Enables the button. This will make the button register touch/click events.
     * @param alpha The alpha value to apply to the button.
     * @remarks If the 'alpha' parameter is left unspecified, then the button's alpha defaults to 1.0.
     */
    SetEnabled(alpha: number = 1.0) {
        this.setInteractive({ cursor: 'pointer' });
        this.m_TextObject.setAlpha(alpha);

        this.setAlpha(alpha);
        this.m_IsEnabled = true;


    }

    /**
     * Disables the button. This will make the button not register touch/click events.
     * @param alpha The alpha value to apply to the button.
     * @remarks If the 'alpha' parameter is left unspecified, then the button's alpha defaults to 0.3.
     */
    SetDisabled(alpha: number = 0.3): void {
        this.disableInteractive();
        this.m_TextObject.setAlpha(alpha);
        this.setAlpha(alpha);
        this.m_IsEnabled = false;
    }

    /**
     * Rotates the button by a specified angle.
     * @param degrees The angle of the rotation
     * @returns The reference to the rotated button.
     */
    SetAngle(degrees): BetterButton {
        this.setAngle(degrees);
        this.m_TextObject.setAngle(degrees);

        return this;
    }

    /**
     * Sets the horizontal and vertical scale of the button.
     * @param x The horizontal scale to set to.
     * @param y The vertical scale to set to.
     */
    SetScale(x, y): void {
        this.setScale(x, y);
        this.m_TextObject.setScale(x, y);
    }

    /**
     * Sets whether the button is vertically flipped or not.
     * @param flip Whether to flip the button or not.
     * @remarks This procedure also flips the button in the horizontal axis. Otherwise it would not be possible to read its text.
     */
    FlipY(flip: boolean): void {
        this.setFlipY(flip);
        this.setFlipX(flip);

        this.m_TextObject.setFlipY(flip);
        this.m_TextObject.setFlipX(flip);
    }

    /**
     * Hides the button image, but keeps the text visible.
     */
    HideShape() {
        this.setVisible(false);
        this.m_TextObject.setVisible(true);
    }

    /**
     * Sets the color of the button's text.
     * @param hexcolor The hex string of the color that is to be applied to the text of the button.
     */
    SetTextColor(hexcolor: string): void {
        this.m_TextObject.setColor(hexcolor);
    }

    /**
     * Sets the size of the button's text.
     * @param size The new size of the tex.
     */
    SetFontSize(size): void {
        this.m_TextObject.setFontSize(size);

    }

    /**
     * Sets the iage background of the button.
     * @param imageName The string associated with the Phaser resource that is loaded in the preload phase. Check preload.ts for the resource name.
     */
    SetImage(imageName: string): void {
        this.setTexture(imageName);
    }

    /**
     * Manipulates the button's text size in accordance to the text's length.
     */
    private UpdateFontSize(): void {

        let calculatedSize = 0;

        if (this.m_TextObject.text.length === 1 || this.m_TextObject.text.length === 0)
            calculatedSize = 128;
        else
            calculatedSize = 128 / (this.m_TextObject.text.length * 0.4)

        if (calculatedSize < 38)
            calculatedSize = 38;


        this.m_TextObject.setFontSize(calculatedSize);
    }

}