import * as solutionsJson from "~/scenes/solutions_map.json"

export default class Solutions  {

    constructor()
    {
    }

    static getSolution(card: string): string
    {
        return solutionsJson[card];
    }
}