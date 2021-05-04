
import { create, all } from 'mathjs'
const config = {
    number: 'Fraction'
};
const mathJS = create(all, config);

export class Operation {
    public operand1: Operation | any;
    public operand1BtnIndex: number;
    public operand2: Operation | any;
    public operand2BtnIndex: number;

    public operation: string;
    public result;

    public stringExpression: string;


    constructor ()
    {
        this.operation = "IDENTITY";
    }


    Calculate() {


        if (IsFraction(this.operand1) && IsFraction(this.operand2)) {
            // op1 fraction,   op2 fraction

            this.result = Operate_Fractions(this.operand1, this.operation, this.operand2);
        }
        else if (IsFraction(this.operand1) && !IsFraction(this.operand2))
        {
            // op1 fraction,    op2 operation
            this.result = Operate_FractionOperation(this.operand1, this.operation, this.operand2);
        }

        else if (!IsFraction(this.operand1) && !IsFraction(this.operand2))
        {
             // op1 operation,   op2 operation
            this.result = Operate_Operations(this.operand1, this.operation, this.operand2);

        } 
        else if (!IsFraction(this.operand1) && IsFraction(this.operand2))
        {
            // op1 operation,   op2 fraction
            this.result = Operate_OperationFraction(this.operand1, this.operation, this.operand2);

        } 

        return this.result;
    }

    ToString() : string {


        let operand1Str;
        let operand2Str;

        if (IsFraction(this.operand1)) {
            operand1Str = this.operand1.toString();
        }
        else if (this.operand1 instanceof Operation) {
            operand1Str = this.operand1.ToString();
        }

        if (IsFraction(this.operand2)) {
            operand2Str = this.operand2.toString();
        }
        else {
            operand2Str = this.operand2.ToString();
        }

        switch (this.operation) {
            case "addition":
                return `(${operand1Str} + ${operand2Str})`; 
            case "subtraction":
                return `(${operand1Str} - ${operand2Str})`;
            case "multiplication":
                return `${operand1Str}x${operand2Str}`; // Multiplication doesnt need Parentheses
            case "division":
                return `${operand1Str}/${operand2Str}`; // division doesnt need Parentheses
            default:
                return "";
        }
    }

    SetOperand1(operand1, operand1Index: number) : void
    {
        this.operand1 = operand1;
        this.operand1BtnIndex = operand1Index;
    }

    SetOperand2(operand2, operand2Index: number) : void
    {
        this.operand2 = operand2;
        this.operand2BtnIndex = operand2Index;
    }

    SetOperator(operator: string)
    {
        this.operation = operator;
    }

   
};

export function OperandToString(operand) : string
{
    return OperationToString(operand);
}

export function OperationToString(operation)
{

    if (IsFraction(operation))
    {
        return FractionToString(operation);

    }
    
    else 
    {
        if (operation.result.d != 1)
            return `${operation.result.n}/${operation.result.d}`;
        else
            return `${operation.result.n}`;

    }
}

export function FractionToString(fraction) {
    if (fraction.d === 1) {
        return fraction.n.toString();
    } else {
        return `${fraction.n.toString()} / ${fraction.d.toString()}`;
    }
}

export class OperationsStack {

    private _Store: Operation[] = [];

    Push(val: Operation): void {
        this._Store.push(val);
    }

    Pop(): Operation | undefined {
        return this._Store.pop()
    }


    IsEmpty(): boolean {
        return this._Store.length === 0;
    }

}

function IsFraction(obj): boolean {
    return obj.n != undefined && obj.d != undefined;
}

function Operate_Fractions(op1, operation, op2)
{
    let res;
    switch (operation) {
        case "addition":
            {
                res = mathJS.add(
                    mathJS.fraction(op1),
                    mathJS.fraction(op2)
                );
                break;
            }

        case "subtraction":
            {
                res = mathJS.subtract(
                    mathJS.fraction(op1),
                    mathJS.fraction(op2)
                );

                break;
            }

        case "multiplication":
            {
                res = mathJS.multiply(
                    mathJS.fraction(op1),
                    mathJS.fraction(op2)
                );


                break;
            }

        case "division":
            {
                res = mathJS.divide(
                    mathJS.fraction(op1),
                    mathJS.fraction(op2)
                );
                break;
            }
    }

    return res;
}

function Operate_Operations(op1: Operation, operation: string, op2:Operation) 
{
    return Operate_Fractions(op1.result, operation, op2.result);
}

function Operate_OperationFraction(op1: Operation, operation: string, op2)
{
    return Operate_Fractions(op1.result, operation, op2);
}

function Operate_FractionOperation(op1, operation: string, op2: Operation)
{
    return Operate_Fractions(op1, operation, op2.result);

}



