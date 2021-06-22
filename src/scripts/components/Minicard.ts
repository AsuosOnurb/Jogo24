import { BetterText } from "./BetterText";

export class Minicard extends Phaser.GameObjects.Image {

    private numbers: Array<BetterText>;

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

    SetPosition(x: number, y: number): void {
        this.setPosition(x, y);

        this.numbers[0].setPosition(x - 54, y);
        this.numbers[1].setPosition(x, y - 54);
        this.numbers[2].setPosition(x + 54, y);
        this.numbers[3].setPosition(x, y + 54);
    }

    FlipForBottom(): void {
        this.setFlipY(false);
        this.numbers.forEach((t) => { t.setFlipY(false); t.setFlipX(false); });
    }

    FlipForTop(): void {
        this.setFlipY(true);
        this.numbers.forEach((t) => { t.setFlipY(true); t.setFlipX(true); });

    }

    SetCard(card: string): void {
        for (let i = 0; i < 4; i++)
            this.numbers[i].setText(card[i]);
    }

    SetVisible(flag: boolean): void {
        this.setVisible(flag);

        this.numbers.forEach((txt) => txt.setVisible(flag));
    }


}