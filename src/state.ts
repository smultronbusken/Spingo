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

    getNeighbourStates(symbols: Array<string>): Array<State>

    getWords(): Array<string>

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
        this.board.forEach((element: Array<string>) => {
            if (element.find((s: string) => s == ListState.empty) == undefined) {
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
        this.board.map((combination: Array<string>) => {
            total += this.getLongestWord(combination).length;
        })

        /*
        for (let col = 0; col < this.ruleSet.colLength; col++) {
            let columnCombination: Array<string> = []
            this.state.map((row: Array<string>) =>  {
                columnCombination.push(row[col]);
            })
            total += this.getLongestWord(columnCombination).length
        }*/
        return total;
    }

    getWords(): Array<string> {
        let words: Array<string> = new Array()
        this.board.map((combination: Array<string>) => {
            words.push(this.getLongestWord(combination));
        })
        for (let col = 0; col < this.ruleSet.colLength; col++) {
            let columnCombination: Array<string> = []
            this.board.map((row: Array<string>) =>  {
                columnCombination.push(row[col]);
            })
            words.push(this.getLongestWord(columnCombination));
        }
        return words;
    }

    /**
     * Returns longest word 
     * @param combination A combination of symbols
     */
    getLongestWord(combination: Array<string>): string {
        function getAllSubstrings(str: string): Array<string> {
            var i, j, result = [];
            for (i = 0; i < str.length; i++) {
                for (j = i + 1; j < str.length + 1; j++) {
                    if (str.slice(i, j).indexOf(ListState.empty) <= -1)
                        result.push(str.slice(i, j));
                }
            }
            return result;
        }

        // Stringify the state and get all substrings
        let combinationAsString: string = combination.join("");
        let substrings: Array<string> = getAllSubstrings(combinationAsString);

        // Sort the substring by decreasing length
        substrings.sort((a: string, b: string) => (b.length - a.length));

        // Find the longest word.
        for (let i = 0; i < substrings.length; i++) {
            const s = substrings[i];
            if (this.ruleSet.isWord(s)) {
                return s;
            }
        }
        return "";
    }

    toString(): string {
        let s: string = "";
        for (let i = 0; i < this.board.length; i++) {
            s += this.board[i].toString()
        }
        return s;
    }

    /**
     * @param symbols The symbols that can be used. For example [a, b, c]
     */
    getNeighbourStates(symbols: Array<string>): Array<State> {
        let states: Array<State> = new Array();
        symbols.forEach((element: string)  => {

            this.board[0].forEach((value: string, index: number) => {
                
                if (value == ListState.empty) {
                    let temp: State = new ListState(this.ruleSet, [Array.from(this.board[0])])
                    temp.board[0][index] = element;
                    states.push(temp)
                }

            });
        
        
        });
        return states;
    }


    
}



