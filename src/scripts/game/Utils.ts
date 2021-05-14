


    

    export  function  RandomInt(lowerbound: number, upperbound: number) : number
    {
        let min = Math.ceil(lowerbound);
        let max = Math.floor(upperbound);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* Tries to trim or remove some unnecessáry things from an arithemetic expression */
    export function TrimExpression(expression: string) : string
    {
        const originalStringLen = expression.length;

        // Remove the outter '()' at the edges
        // ( (a + b) * (a / d) )  ===>  (a + b) * (a / d) 
        if (expression[0] === '(' && expression[originalStringLen - 1] === ')')
            return expression.substring(1, originalStringLen-1)

        return expression;
    }

    export function IsNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }


