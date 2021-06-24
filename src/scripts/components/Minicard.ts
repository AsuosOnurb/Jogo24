// Minicard.ts
/**
 * Module responsible for the implementation of a minicard.
 * These mini card objects are used in the multiplayer scene when we're trying to display the 2 small cards.
 * @module
 */


import { BetterText } from "./BetterText";

/**
 * A Minicard object is just an image, with some 4 numbers on top, that resembles the main card on the multiplayer game mode.
 */
export class Minicard extends Phaser.GameObjects.Image {

    /**
     * The four numbers written on the card.
     */
    private numbers: Array<BetterText>;

    /**
     * Creates a Minicard object.
     * @param scene The scene where the minicard is to be placed.
     * @param x The x coordinate of the minicard.
     * @param y The y coordinate of the minicard.
     * @param cardString The string representation of the card, i.e: something like "2159".
     */
    constructor(scene: Phaser.Scene, x: number, y: number, cardString: string) {
        super(scene, x, y, 'cardBG');
        this.setScale(0.3, 0.3);
        scene.add.existing(this)

        this.numbers = new Array<BetterText>();
        this.numbers[0] = new BetterText(scene, x - 54, y, cardString[0], { fontFamily: 'Bubblegum', fontSize: 48, fill: '#4e2400' });
        this.numbers[1] = new BetterText(scene, x, y - 54, cardString[1], { fontFamily: 'Bubblegum', fontSize: 48, fill: '#4e2400' });
        this.numbers[2] = new BetterText(scene, x + 54, y, cardString[2], { fontFamily: 'Bubblegum', fontSize: 48, fill: '#4e2400' });
        this.numbers[3] = new BetterText(scene, x, y + 54, cardString[3], { fontFamily: 'Bubblegum', fontSize: 48, fill: '#4e2400' });

        // Mini cards start flipped by default
        this.FlipForTop()

    }

    /**
     * Sets the position of the minicard.
     * @param x The new x coordinate
     * @param y The new y coordinate
     */
    SetPosition(x: number, y: number): void {
        this.setPosition(x, y);

        this.numbers[0].setPosition(x - 54, y);
        this.numbers[1].setPosition(x, y - 54);
        this.numbers[2].setPosition(x + 54, y);
        this.numbers[3].setPosition(x, y + 54);
    }

    /**
     * Flips the minicard so that it can be read by the players playing on the bottom part of the screen.
     * @remarks Used only in the multiplayer scene.
     */
    FlipForBottom(): void {
        this.setFlipY(false);
        this.numbers.forEach((t) => { t.setFlipY(false); t.setFlipX(false); });
    }

    /**
     * Flips the minicard so that it can be read by the players playing on the top part of the screen.
     *  @remarks Used only in the multiplayer scene.
     */
    FlipForTop(): void {
        this.setFlipY(true);
        this.numbers.forEach((t) => { t.setFlipY(true); t.setFlipX(true); });

    }

    /**
     * Changes the numbers on the minicard.
     * @param card The string sequence with the new card numbers
     */
    SetCard(card: string): void {
        for (let i = 0; i < 4; i++)
            this.numbers[i].setText(card[i]);
    }

    /**
     * Set the visibility of the minicard.
     * @param flag Whether or not the minicard is to be set visible.
     */
    SetVisible(flag: boolean): void {
        this.setVisible(flag);

        this.numbers.forEach((txt) => txt.setVisible(flag));
    }


}