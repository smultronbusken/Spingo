import { Agent } from "./agent"
import { State, ListState } from "./state";
import { Action } from "./actions";
import { RuleSet } from "./rules";


/**
 * Utility based agent. Uses iterative algorithm.
 */
export class UtilityAgent implements Agent {

    // Utility for a single row. NOT utility for a whole state.
    rowUtilityTable: Map<string, number> = new Map()
    discount: number = 0.95
    ruleSet: RuleSet;

    constructor(rules: RuleSet) {
        this.ruleSet = rules;

        // Build utility table by traversing the state space tree
        let startingState: State = new ListState(rules);
    
        let frontier: Array<State> = new Array();
        frontier.push(startingState) 
    
        while (frontier.length > 0) {
            let state: State = frontier.pop();
            this.rowUtilityTable.set(state.board[0].join(","), state.getPoints());

            this.getNeighbourStates(state.board[0], rules.symbols()).forEach((state: State) => {
                if (!this.rowUtilityTable.has(state.toString())) {
                    frontier.push(state)
                }
            })
        }
        console.log(this.rowUtilityTable.size)

        // Iterative algorithm
        for (let index = 0; index <5; index++) {

            console.log("iteration one...")

            this.rowUtilityTable.forEach((value: number, key: string) => {

                let a: Array<string> = key.split(",");
                let s: State = new ListState(rules, [a])
    
                let reward: number = 0;
                if (!s.isBoardFull()) {
                    reward = this.ruleSet.getLongestWord(s.getRows()[0]).length
                } 
                
                let sumOfDiscountedUtilities: number = 0;
                rules.distribution.forEach((prob: number, symbol: string) => {
                    sumOfDiscountedUtilities += prob * this.getMaxRowUtility(symbol, s.getRows()[0]);
                })
    
                this.rowUtilityTable.set(s.toString(), reward + this.discount * sumOfDiscountedUtilities)

            })   
        }
        //console.log(this.rowUtilityTable)

    }


    selectAction(state: State, letters: Array<string>): Action {
        //console.log(state.toString() + " HAS UTILITY " + this.getUtilityForState(state))

        return this.getBestAction(state, letters);
    }

    getMaxRowUtility(symbol: string, row: Array<string>): number {
        let best : number = 0;
        this.getNeighbourStates(row, [symbol]).forEach((state: State) => {
            if (best <= this.rowUtilityTable.get(state.toString()))
                best = this.rowUtilityTable.get(state.toString())
        })
        return best;
    }

    getBestAction(state: State, letters: Array<string>): Action {
        let a : Action = Action.NONE;
        let best : number =  0
        let bestLetter : string = ""

        letters.forEach((letter: string) => {

            state.getActions(letter).forEach(action => {
                let newState: State = state.doAction(action)
                if (best <= this.getUtilityForState(newState)) {
                    best = this.getUtilityForState(newState)
                    a = action;
                    bestLetter = letter;
                }
            });

        })

        //console.log("I chose letter " + bestLetter + " out of " + letters)

        //console.log(a)
        return a;
    }


    getUtilityForState(state: State): number {
        let sum: number = 0;

        state.getColumns().forEach((row: Array<string>) => {
            if (this.rowUtilityTable.get(row.join(","))  != undefined)
                sum += this.rowUtilityTable.get(row.join(","));
        })

        state.getRows().forEach((row: Array<string>) => {
            if (this.rowUtilityTable.get(row.join(","))  != undefined)
                sum += this.rowUtilityTable.get(row.join(","));
        })


        return sum;
    }


    
    /**
     * @param symbols The symbols that can be used. For example [a, b, c]
     */
    getNeighbourStates(row: Array<string>, symbols: Array<string>): Array<State> {
        let states: Array<State> = new Array();
        symbols.forEach((element: string)  => {

            row.forEach((value: string, index: number) => {
                
                if (value == ListState.empty) {
                    let temp: State = new ListState(this.ruleSet, [Array.from(row)])
                    temp.board[0][index] = element;
                    states.push(temp)
                }

            });
        
        
        });
        return states;
    }
    
}