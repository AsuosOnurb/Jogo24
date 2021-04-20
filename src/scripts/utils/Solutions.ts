import * as solutionsJson from './solutions_map.json'

export default class Solutions  {

    constructor()
    {
    }

    static getSolution(card: string): string
    {
        return solutionsJson[card];
    }

    
}