import Phaser from 'phaser'

type GameState = {
    difficulty: string;

    currentTime: number;
    currentCard: string; // A string like "1 - 4 -5 -9"

    totalCorrect: integer;
    totalWrong: integer;

}

export default class SoloGame extends Phaser.Scene
{
    private gameState!: GameState;

    // ======= UI Objects (text objects, buttons, etc....) ====
    private cardTextObject!: Phaser.GameObjects.Text;

    constructor()
    {
        super("SoloGame");
        console.log(`Started scene 'SoloGame' .`)
    }

    init(data)
    {
        this.gameState = {
            difficulty: data.difficulty,
            currentTime: 0.0,
            currentCard: "? - ? - ? - ?",
            totalCorrect: 0,
            totalWrong: 0
        };
        console.log(this.gameState);
       
        
    }


    preload() 
    {

    }


    create()
    {
        this.cardTextObject = this.add.text(window.innerWidth/2 - 256, window.innerHeight/2,
                                    this.gameState.currentCard, {fontSize: "64px"});
    }

    update()
    {

    }
}