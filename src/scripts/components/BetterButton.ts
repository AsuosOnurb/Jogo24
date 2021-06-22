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
    private textObject: BetterText;

    /**
     * The scale that the button starts with.
     * @remarks This is mainly used to control the modifications performed by the animations.
     */
    private originalScale;

    /**
     * Tween animation that triggers everytime the mouse/pointer enters/hovers the button.
     */
    private tweenButtonHover: Phaser.Tweens.Tween;

    /**
     * Tween animation that triggers everytime the mouse/pointer exits/(stops hovering) the button.
     */
    private tweenButtonOut: Phaser.Tweens.Tween;

    /**
     * Tween animation that triggers everytime the mouse/pointer presses the button.
     */
    private tweenButtonPress: Phaser.Tweens.Tween;


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
     */
    constructor(
        scene: Phaser.Scene, x: number, y: number,
        xScale: number, yScale: number,
        text: string, textStyle: any,
        texture: string) {

        super(scene, x, y, texture);

        this.mCurrentScene = scene;
        // add the button itself to the scene
        scene.add.existing(this);

        this.setScale(xScale, yScale);
        this.originalScale = this.scale;

        // Set the text
        if (!(text === undefined || textStyle === undefined))
            this.textObject = new BetterText(scene, x, y, text, textStyle);


        // offset the text object position
        this.textObject?.setOrigin(0.5);

        // Buttons are interactible by default
        this.SetEnabled();

        // For now, we'll just add a discrete size increment when the button is hovered, and a size decrement when the mouse exits the hover state
        this.SetupButtonHoverAnimation();
        this.SetupButtonOutAnimation();
        this.SetupButtonPressAnimation()

    }



    /* =============================================== Button Animations =============================================== */

    /**
     * Sets up the animation that triggers when the mouse exits out of the button.
     */
    SetupButtonOutAnimation(): void {

        /*

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
        */

        this.on('pointerout', () => {this.scale -= 0.1; this.textObject.scale -= 0.1;});

    }


    /**
     * Sets up the animation that triggers when the mouse begins hovering the button.
     */
    SetupButtonHoverAnimation(): void {

        /*
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
        */

        this.on('pointerover', () => {this.scale += 0.1; this.textObject.scale += 0.1});

    }

    /**
     * Sets up the animation that triggers when the mouse/pointer presses the button.
     */
    private SetupButtonPressAnimation(): void {

        this.tweenButtonPress = this.mCurrentScene.tweens.add({
            targets: [this, this.textObject],
            props: {
                scale: this.originalScale - 0.2
            },
            ease: 'Power1',
            duration: 70,
            paused: true,
            yoyo: true,
        });

        this.on('pointerup', () => {
            this.tweenButtonPress.play();
        });

    }

    /**
     * Plays an animation that is designed for the expression bar that holds the arithmetic expression 
     * in the singleplayer mode and tells the player that he got the answer right.
     */
    PlayCorrectExpressionTween(): void {
        this.scene.tweens.add({
            targets: [this, this.textObject],
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
            targets: [this, this.textObject],
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
        this.textObject.setText(newtext);
    }

    /**
     * Sets the text of the button.
     * @param newText The text string to apply to the button.
     * @remarks This procedure is used mostly for the numbers on the cards. 
     * Because the arithemetic expression tend to grow, we need a way to make the text get smaller as the expression grows.
     */
    NumberButtonSetText(newText: string): void {

        this.textObject.setText(newText);
        this.UpdateFontSize();
    }

    /**
     * Gets the text of the button.
     * @returns The string of text of the button
     */

    GetText(): string {
        return this.textObject.text;
    }

    /**
     * Enables the button. This will make the button register touch/click events.
     * @param alpha The alpha value to apply to the button.
     * @remarks If the 'alpha' parameter is left unspecified, then the button's alpha defaults to 1.0.
     */
    SetEnabled(alpha: number = 1.0) {
        this.setInteractive({ cursor: 'pointer' });
        this.textObject.setAlpha(alpha);

        this.setAlpha(alpha);


    }

    /**
     * Disables the button. This will make the button not register touch/click events.
     * @param alpha The alpha value to apply to the button.
     * @remarks If the 'alpha' parameter is left unspecified, then the button's alpha defaults to 0.3.
     */
    SetDisabled(alpha: number = 0.3): void {
        this.disableInteractive();
        this.textObject.setAlpha(alpha);
        this.setAlpha(alpha);
    }

    /**
     * Rotates the button by a specified angle.
     * @param degrees The angle of the rotation
     * @returns The reference to the rotated button.
     */
    SetAngle(degrees): BetterButton {
        this.setAngle(degrees);
        this.textObject.setAngle(degrees);

        return this;
    }

    /**
     * Sets the horizontal and vertical scale of the button.
     * @param x The horizontal scale to set to.
     * @param y The vertical scale to set to.
     */
    SetScale(x, y): void {
        this.setScale(x, y);
        this.textObject.setScale(x, y);
    }

    /**
     * Sets whether the button is vertically flipped or not.
     * @param flip Whether to flip the button or not.
     * @remarks This procedure also flips the button in the horizontal axis. Otherwise it would not be possible to read its text.
     */
    FlipY(flip: boolean): void {
        this.setFlipY(flip);
        this.setFlipX(flip);

        this.textObject.setFlipY(flip);
        this.textObject.setFlipX(flip);
    }

    /**
     * Hides the button image, but keeps the text visible.
     */
    HideShape() {
        this.setVisible(false);
        this.textObject.setVisible(true);
    }

    /**
     * Sets the color of the button's text.
     * @param hexcolor The hex string of the color that is to be applied to the text of the button.
     */
    SetTextColor(hexcolor: string): void {
        this.textObject.setColor(hexcolor);
    }

    /**
     * Sets the size of the button's text.
     * @param size The new size of the tex.
     */
    SetFontSize(size): void {
        this.textObject.setFontSize(size);

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

        if (this.textObject.text.length === 1 || this.textObject.text.length === 0)
            calculatedSize = 128;
        else
            calculatedSize = 128 / (this.textObject.text.length * 0.4)

        if (calculatedSize < 38)
            calculatedSize = 38;


        this.textObject.setFontSize(calculatedSize);
    }

}