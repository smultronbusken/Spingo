import { Action } from "./actions";
import { RuleSet } from "./rules";

export interface State {
    state: Array<Array<string>>;
    getActions(): Array<Action>
    doAction(action: Action): State
    getReward(previousState: State): number
    getPoints(): number
    getWords(): Array<string>

}



export class ListState implements State {
    static readonly empty: string = "?"
    public state: Array<Array<string>>;
    ruleSet: RuleSet;
    letter: string;

    /**
     * 
     * @param ruleSet The ruleset this state should abide to
     * @param state If undefined, the state will be filled with ListState.empty
     */
    constructor(ruleSet: RuleSet, state?: Array<Array<string>>) {
        this.ruleSet = ruleSet;
        this.letter = this.ruleSet.rollDice()
        if (state != undefined) {
            this.state = state;
        } else {
            this.state = [];
            for (let index = 0; index < this.ruleSet.colLength; index++) {
                let row: Array<string> = []
                for (let index = 0; index < this.ruleSet.rowLength; index++) {
                    row.push(ListState.empty)
                }
                this.state.push(row)            
            }
        }
    }

    /**
     * Returns all applicable actions in this state
     */
    getActions(): Array<Action> {
        let actions: Array<Action> = new Array<Action>();
        this.state.map((row: Array<string>, rowIndex: number) => {
            row.map((letter: string, colIndex: number) => {
                if (letter == ListState.empty)
                    actions.push(new Action(this.letter, rowIndex, colIndex))
            })
        });
        return actions;
    }    
    
    /**
     * Returns a deep copy of this state with an action executed
     * @param action The action to be executed
     */
    doAction(action: Action): State {
        let copy: Array<Array<string>> = Array.from(this.state)
        copy[action.rowIndex][action.colIndex] = action.letter;
        return new ListState(this.ruleSet, copy);
    }

    /**
     * Returns the difference of points between  this state and another.
     * @param previousState The state to be compared to
     */
    getReward(previousState: State): number {
        return this.getPoints() - previousState.getPoints();
    }

    /**
     * The sum of this states columns' and rows' getPointsForCombination() value
     */
    getPoints(): number {
        let total: number = 0;
        this.state.map((combination: Array<string>) => {
            total += this.getLongestWord(combination).length;
        })
        for (let col = 0; col < this.ruleSet.colLength; col++) {
            let columnCombination: Array<string> = []
            this.state.map((row: Array<string>) =>  {
                columnCombination.push(row[col]);
            })
            total += this.getLongestWord(columnCombination).length
        }
        return total;
    }


    /**
     * The sum of this states columns' and rows' getPointsForCombination() value
     */
    getWords(): Array<string> {
        let words: Array<string> = new Array()
        this.state.map((combination: Array<string>) => {
            words.push(this.getLongestWord(combination));
        })
        for (let col = 0; col < this.ruleSet.colLength; col++) {
            let columnCombination: Array<string> = []
            this.state.map((row: Array<string>) =>  {
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
        let s: string = "\n";
        for (let i = 0; i < this.state.length; i++) {
            s += this.state[i].toString() + "\n"

        }
        return s + ((this.getActions().length != 0 ) ? (", letter to play is:" + this.letter) : "");
    }


}