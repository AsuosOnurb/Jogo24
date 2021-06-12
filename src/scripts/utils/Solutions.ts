import Map from './solutions_map.json'

export class Solutions  {

    static GetSolution(card: string): string
    {
        return Map.solutions[card];
    }

    
}