import { FractionToString, Operation } from "../operations/Operations";

export class TextStack {

    private m_Store: string[] = [];

    Push(operation: Operation) {
        
       //  this.m_Store.push(OperationToString(operation));
    }

    /*
    Push(val: string): void
    {
        this._Store.push(val);
    }
    */
    Pop(): string | undefined {
        return this.m_Store.pop()
    }


    IsEmpty(): boolean {
        return this.m_Store.length === 0;
    }



}