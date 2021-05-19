export class Stack<T> {
    private stack: T[];
    private length: number;

    public constructor() {
        this.length = 0;
        this.stack = new Array<T>();
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }


    public push(newItem: T): void {
        this.stack[this.length++] = newItem;
    }

    public pop(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const retval = this.stack[--this.length];
        return retval;
    }

    public top(): T | undefined {
        if (this.isEmpty()) {
           return undefined;
        }

        return this.stack[this.length - 1];
    }

    public stackContents(): void {
        console.log('Stack Contents');
        for (let i = 0; i < this.length; ++i) {
            console.log(`stack[${i}]: ${this.stack[i]}`);
        }
    }
}