import * as solutionsJson from "~/scenes/solutions_map.json"
import ExprEval, { Parser } from 'expr-eval'

export default class Solutions  {

    constructor()
    {
    }

    static getSolution(card: string): string
    {
        return solutionsJson[card];
    }

    static debugTest()
    {
        for (var key in solutionsJson)
        {
            

            const expression:string = solutionsJson[key];

            /*
            if (ExprEval.Parser.evaluate(expression) !=  24 )
                console.log(`${key} -> ${solutionsJson[key]} does not equate 24`);
            */
           console.log("=======" + expression + "============");
           let p = new Parser();
           const expr = p.parse(expression);
            console.log(expr);

           const val = expr.evaluate();

           if (val != 24)
            console.error(`${key} -> ${expression} doesnt equate to 24`);

           console.log(val);


        }
    }
}