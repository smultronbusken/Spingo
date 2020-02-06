import { Action } from "./actions";
import { RuleSet } from "./rules";

export interface State {

    board: any;

    /**
     * Returns all applicable actions in this state
     */
    getActions(symbol: string): Array<Action>

    /**
     * Returns a deep copy of this state with an action executed
     * @param action The action to be executed
     */
    doAction(action: Action): State

    /**
     * Returns the difference of points between  this state and another.
     * @param previousState The state to be compared to
     */
    getReward(previousState: State): number

    
    /**
     * The sum of this states columns' and rows' getPointsForCombination() value
     */
    getPoints(): number

    getWords(): Array<string>

    getRows(): Array<Array<string>>

    getColumns(): Array<Array<string>> 

    isBoardFull(): boolean
}

export class ListState implements State {
    static readonly empty: string = "?"
    public board: Array<Array<string>>;
    ruleSet: RuleSet;

    columns: number;
    rows: number;
    

    /**
     * 
     * @param ruleSet The ruleset this state should abide to
     * @param state If undefined, the state will be filled with ListState.empty
     */
    constructor(ruleSet: RuleSet, state?: Array<Array<string>>) {
        this.columns = ruleSet.colLength;
        this.rows = ruleSet.rowLength;

        this.ruleSet = ruleSet;

        if (state != undefined) {
            this.board = state;
        } else {
            // Generate an empty board
            this.board = [];
            for (let index = 0; index < this.ruleSet.colLength; index++) {
                let row: Array<string> = []
                for (let index = 0; index < this.ruleSet.rowLength; index++) {
                    row.push(ListState.empty)
                }
                this.board.push(row)            
            }
        }

    }

    getActions(symbol: string): Array<Action> {
        let actions: Array<Action> = new Array<Action>();
        this.board.map((row: Array<string>, rowIndex: number) => {
            row.map((letter: string, colIndex: number) => {
                if (letter == ListState.empty)
                    actions.push(new Action(symbol, rowIndex, colIndex))
            })
        });
        return actions;
    }    

    doAction(action: Action): State {
        let copy: Array<Array<string>> = new Array()
        this.board.forEach((row: Array<string>) => {
            copy.push(Array.from(row))
        });
        copy[action.rowIndex][action.colIndex] = action.letter;
        return new ListState(this.ruleSet, copy);
    }


    isBoardFull(): boolean {
        let isFull: boolean = true;
        this.board.forEach((row: Array<string>) => {
            if (row.find((s: string) => s == ListState.empty) == undefined) {
                isFull = false;
            }
        });
        return isFull;
    }

    getReward(previousState: State): number {
        if (this.isBoardFull()) {
            return this.getPoints() - previousState.getPoints();
        }
        else
            return 0
    }

    getPoints(): number {
        // Only get points for full states
        if (this.isBoardFull())
            return 0;

        let total: number = 0;
        this.getRows().map((combination: Array<string>) => {
            total += this.ruleSet.getLongestWord(combination).length;
        })

        
        for (let col = 0; col < this.ruleSet.colLength + 1; col++) {
            let columnCombination: Array<string> = []
            this.board.map((row: Array<string>) =>  {
                columnCombination.push(row[col]);
            })
            total += this.ruleSet.getLongestWord(columnCombination).length
        }
        return total;
    }

    getWords(): Array<string> {
        let words: Array<string> = new Array()
        this.board.map((combination: Array<string>) => {
            words.push(this.ruleSet.getLongestWord(combination));
        })
        for (let col = 0; col < this.ruleSet.colLength + 1; col++) {
            let columnCombination: Array<string> = []
            this.board.map((row: Array<string>) =>  {
                columnCombination.push(row[col]);
            })
            words.push(this.ruleSet.getLongestWord(columnCombination));
        }
        return words;
    }


    toString(): string {
        let s: string = "";
        for (let i = 0; i < this.board.length; i++) {
            s += this.board[i].toString()
        }
        return s;
    }


    getColumns(): Array<Array<string>> {
        
        let cols: Array<Array<string>> = new Array()

        for (let col = 0; col < this.ruleSet.colLength + 1; col++) {
            let columnCombination: Array<string> = []
            this.board.map((row: Array<string>) =>  {
                columnCombination.push(row[col]);
            })
            cols.push(columnCombination);
        }

        return cols
    }


    getRows(): Array<Array<string>> {
    
        let rows: Array<Array<string>> = new Array()
        this.board.map((combination: Array<string>) => {
            rows.push(combination);
        })
        return rows
    }
}



