// import * as diffJson from "~/scenes/dificulty_map.json"
import * as diffJson from './dificulty_map.json'
export default class CardGenerator 
{
    constructor()
    {

    }

    generateCard(difficulty: number) : string 
    {
        // Get the list of cards with difficulty level 'difficulty'
        const cardList = diffJson[difficulty];

        // Now we choose a random index on the list
        return cardList[Math.floor(Math.random() * cardList.length)].toString();
    }
}