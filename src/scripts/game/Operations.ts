

enum Operator {
    Addition, Subtraction, Multiplication, Division, None
};

export class Operation {
    private operand1: Operation | any;
    private operand2: Operation | any;
    private operator: Operator;

    private middleOperator: Operator;

    private otherExpressionOperand1: Operation | any;
    private otherExpressionOperand2: Operation | any;
    private otherExpressionOperator: Operator;

    public stringExpression: string;

    constructor() {
        this.operand1 = undefined;
        this.operator = Operator.None,
            this.operand2 = undefined;


        this.middleOperator = Operator.None,

            this.otherExpressionOperand1 = undefined;
        this.otherExpressionOperator = Operator.None;
        this.otherExpressionOperand2 = undefined;

        this.stringExpression = "NONE";
    }

    ToString(): string {


        let operand1Str;
        let operand2Str;
        let operatorStr;

        if (this.operand1 instanceof Operation)
            operand1Str = this.operand1.ToString();
        else
            operand1Str = this.operand1.toString();


        if (this.operand2 instanceof Operation)
            operand2Str = this.operand2.ToString();
        else
            operand2Str = this.operand2.toString();


        switch (this.operator) {
            case Operator.Addition:
                operatorStr = "+";
                break;

            case Operator.Subtraction:
                operatorStr = "-";
                break;

            case Operator.Multiplication:
                operatorStr = "*";
                break;

            case Operator.Division:
                operatorStr = "/";
                break;
        }

        //// Second part of the expression
        let otherExpressionOperand1Str;
        let otherExpressionOperand2Str;
        let otherExpressionOperatorStr;

        if (this.otherExpressionOperand1 instanceof Operation)
            otherExpressionOperand1Str = this.otherExpressionOperand1.ToString();
        else
            otherExpressionOperand1Str = this.otherExpressionOperand1.toString();


        if (this.otherExpressionOperand2 instanceof Operation)
            otherExpressionOperand2Str = this.otherExpressionOperand2.ToString();
        else
            otherExpressionOperand2Str = this.otherExpressionOperand2.toString();

        switch (this.otherExpressionOperator) {
            case Operator.Addition:
                otherExpressionOperatorStr = "+";
                break;

            case Operator.Subtraction:
                otherExpressionOperatorStr = "-";
                break;

            case Operator.Multiplication:
                otherExpressionOperatorStr = "*";
                break;

            case Operator.Division:
                otherExpressionOperatorStr = "/";
                break;
        }

        let middleOperatorStr;
        // Finaly, the middle operator
        switch (this.middleOperator) {
            case Operator.Addition:
                middleOperatorStr = "+";
                break;

            case Operator.Subtraction:
                middleOperatorStr = "-";
                break;

            case Operator.Multiplication:
                middleOperatorStr = "*";
                break;

            case Operator.Division:
                middleOperatorStr = "/";
                break;
        }

        /// Return the final string representation of the arithmetic expression


        if (otherExpressionOperand1Str === undefined)
            return `${operand1Str} ${operatorStr} ${operand2Str}`;

        else if (this.otherExpressionOperator == undefined)
            return `(${operand1Str} ${operatorStr} ${operand2Str}) ? (${otherExpressionOperand1Str}`;

        else if (this.otherExpressionOperand2 == undefined)
            return `(${operand1Str} ${operatorStr} ${operand2Str}) ? (${otherExpressionOperand1Str} ${otherExpressionOperatorStr}`;
        
        else if (this.middleOperator == undefined)
            return `(${operand1Str} ${operatorStr} ${operand2Str}) ? (${otherExpressionOperand1Str} ${otherExpressionOperatorStr})`;
        
        else 
            return `(${operand1Str} ${operatorStr} ${operand2Str}) ${middleOperatorStr} (${otherExpressionOperand1Str} ${otherExpressionOperatorStr})`;
    }   

    SetOperand1(operand1): void {
        this.operand1 = operand1;
    }

    SetOperand2(operand2): void {
        this.operand2 = operand2;
    }

    SetOperator(operator: string) {
        switch (operator) {
            case "addition":
                this.operator = Operator.Addition;
                break;
            case "subtraction":
                this.operator = Operator.Subtraction;
                break;
            case "multiplication":
                this.operator = Operator.Multiplication;
                break;
            case "division":
                this.operator = Operator.Division;
                break;
            default:
                break;
        }
    }

    SetOtherExpressionOperand1(operand1): void {
        this.otherExpressionOperand1 = operand1;
    }

    SetOtherExpressionOperand2(operand2): void {
        this.otherExpressionOperand2 = operand2;
    }

    SetOtherExpressionOperator(operator: string) {
        switch (operator) {
            case "addition":
                this.otherExpressionOperator = Operator.Addition;
                break;
            case "subtraction":
                this.otherExpressionOperator = Operator.Subtraction;
                break;
            case "multiplication":
                this.otherExpressionOperator = Operator.Multiplication;
                break;
            case "division":
                this.otherExpressionOperator = Operator.Division;
                break;
            default:
                break;
        }
    }

    SetMiddleOperator(operator: string) {
        switch (operator) {
            case "addition":
                this.middleOperator = Operator.Addition;
                break;
            case "subtraction":
                this.middleOperator = Operator.Subtraction;
                break;
            case "multiplication":
                this.middleOperator = Operator.Multiplication;
                break;
            case "division":
                this.middleOperator = Operator.Division;
                break;
            default:
                break;
        }
    }

    AppendToString(str: string) : string 
    {
        this.stringExpression = `${this.stringExpression}${str}`;
        return this.stringExpression;
    }


};
