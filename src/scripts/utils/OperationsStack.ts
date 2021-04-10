
export type Operation = {
    operand1: number,
    operand1BtnIndex: number,

    operand2: number,
    operand2BtnIndex: number,

    operation: string,
    
    result: number
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