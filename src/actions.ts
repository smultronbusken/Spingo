export class Action {
    letter: string;
    rowIndex: number;
    colIndex: number;
    static readonly NONE = new Action("?", 0, 0)

    constructor(letter: string, rowIndex: number, colIndex: number) {
        this.letter = letter;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
    }

    toString(): string {
        return this.letter + ", (" + this.rowIndex.toString() + ", " + this.colIndex.toString() + ")";
    }
}