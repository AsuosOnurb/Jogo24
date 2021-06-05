// import * as diffJson from "~/scenes/dificulty_map.json"
import Map from './dificulty_map.json'
import {RandomInt} from './Utils'

export enum Difficulty {
    Easy = 0,
    Medium = 1,
    Hard = 2,
    Any = 3
};

export  class CardGenerator {
    
    static generateCard(difficulty: Difficulty): string {
        let cardList;
        switch (difficulty) {
            case Difficulty.Easy:
                cardList = Map.diff_map["1"];

                break;
            case Difficulty.Medium:
                cardList = Map.diff_map["2"];

                break;
            case Difficulty.Hard:
                cardList = Map.diff_map["3"];
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