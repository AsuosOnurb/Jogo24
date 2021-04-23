// import * as diffJson from "~/scenes/dificulty_map.json"
import Map from './dificulty_map.json'
import {RandomInt} from '../utils/Utils'

export enum Difficulty {
    Easy,
    Medium,
    Hard,
    Any
};

export  class CardGenerator {
    constructor() {
        console.log(Map.diff_map);
    }

    static generateCard(difficulty: Difficulty): string {
        let cardList;
        switch (difficulty) {
            case Difficulty.Easy:
                cardList = Map.diff_map["1"];
                console.log("Generated an Easy card");

                break;
            case Difficulty.Medium:
                cardList = Map.diff_map["2"];
                console.log("Generated a Medium card");

                break;
            case Difficulty.Hard:
                cardList = Map.diff_map["3"];
                console.log("Generated a Hard card");
                break;
            case Difficulty.Any:
                cardList = Map.diff_map[RandomInt(1,3)];
            default:
                break;
        }
        // Get the list of cards with difficulty level 'difficulty'
        // const cardList = diffJson[difficulty];


        // Now we choose a random index on the list
        return cardList[Math.floor(Math.random() * cardList.length)].toString();
    }
}