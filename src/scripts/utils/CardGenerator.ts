// import * as diffJson from "~/scenes/dificulty_map.json"
import * as diffJson from './dificulty_map.json'
import {RandomInt} from '../utils/Utils'

export enum Difficulty {
    Easy,
    Medium,
    Hard,
    Any
};

export default class CardGenerator {
    constructor() {

    }

    static generateCard(difficulty: Difficulty): string {
        let cardList;
        switch (difficulty) {
            case Difficulty.Easy:
                cardList = diffJson[1];
                console.log("Generated a Easy card");

                break;
            case Difficulty.Medium:
                cardList = diffJson[2];
                console.log("Generated a Medium card");

                break;
            case Difficulty.Hard:
                cardList = diffJson[3];
                console.log("Generated a Hard card");
                break;
            case Difficulty.Any:
                cardList = diffJson[RandomInt(1,3)];
            default:
                break;
        }
        // Get the list of cards with difficulty level 'difficulty'
        // const cardList = diffJson[difficulty];


        // Now we choose a random index on the list
        return cardList[Math.floor(Math.random() * cardList.length)].toString();
    }
}