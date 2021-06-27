
import diffJson from './dificulty_map.json'
import { RandomInt } from './Utils'

export enum Difficulty {
    Easy = 0,
    Medium = 1,
    Hard = 2,
    Any = 3
};

export class CardGenerator {

    private static usedCards = new Set<string>();

    static GenerateCard(difficulty: Difficulty): string {

        let cardList;
        switch (difficulty) {
            case Difficulty.Easy:
                cardList = diffJson.diff_map["1"];
                break;

            case Difficulty.Medium:
                cardList = diffJson.diff_map["2"];
                break;

            case Difficulty.Hard:
                cardList = diffJson.diff_map["3"];
                break;

            case Difficulty.Any:
                cardList = diffJson.diff_map[RandomInt(1, 3)];
                break;

            default:
                break;
        }


        let chosenCard: string;
        while (true) {
            // Generate a card (pick one randomly from the json file)
            chosenCard = cardList[Math.floor(Math.random() * cardList.length)].toString();

            /*
             Check if the card was used before. 
             If it was not, then we'll add it to the usedCards set to keep track of it.
            */
            if (!CardGenerator.usedCards.has(chosenCard)) {
                // Mark the card as used (so that it doesn't appear again during this game)
                this.usedCards.add(chosenCard)

                // get out of the cycle
                return chosenCard;
            }

            // The cycle only stops when whe generate a unique card.
        }
    }
}