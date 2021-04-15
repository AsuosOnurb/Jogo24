
import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);

export type Operation = {
    operand1 ,
    operand1BtnIndex: number,
    operand2,
    operand2BtnIndex: number,
    operation: string,
    result,
}

export class OperationsStack  {

   private  _Store: Operation[] = [];

    Push(val: Operation): void
    {
        this._Store.push(val);
    }

    Pop(): Operation | undefined 
    {
        return this._Store.pop()
    }


    IsEmpty(): boolean
    {
        return this._Store.length === 0;
    }
    
}

export function PerformOperation(operationgStr: string, operand1, operand2)
{
    let operationResult;
    switch (operationgStr) {
        case "addition":
            {
                operationResult = mathJS.add(
                    mathJS.fraction(operand1),
                    mathJS.fraction(operand2)
                );
                break;
            }

        case "subtraction":
            {
                operationResult = mathJS.subtract(
                    mathJS.fraction(operand1),
                    mathJS.fraction(operand2)
                );

                break;
            }

        case "multiplication":
            {
                operationResult = mathJS.multiply(
                    mathJS.fraction(operand1),
                    mathJS.fraction(operand2)
                );


                break;
            }

        case "division":
            {
                operationResult = mathJS.divide(
                    mathJS.fraction(operand1),
                    mathJS.fraction(operand2)
                );
                break;
            }
    }

    return operationResult;
} 

export function FractionToString(fraction)
{
    if (fraction.d === 1)
    {
        return fraction.n.toString();
    }else 
    {
        return  `${fraction.n.toString()} / ${fraction.d.toString()}`;
    }
}