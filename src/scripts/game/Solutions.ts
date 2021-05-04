import Map from './solutions_map.json'

export class Solutions  {

    constructor()
    {
    }

    static getSolution(card: string): string
    {
        return Map.solutions[card];
    }

    
}