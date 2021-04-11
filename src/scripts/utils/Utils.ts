
export default class Utils  {

    constructor()
    {
    }

    static IsNumeric(str: string): boolean
    {
        return /^\d+$/.test(str);
    }


    
}