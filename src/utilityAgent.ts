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

    constructor(rules: RuleSet) {

        // Build utility table by traversing the state space tree
        let startingState: State = new ListState(rules);
    
        let frontier: Array<State> = new Array();
        frontier.push(startingState) 
    
        while (frontier.length > 0) {
            let state: State = frontier.pop();
            this.rowUtilityTable.set(state.toString(), state.getPoints());

            state.getNeighbourStates(rules.symbols()).forEach((state: State) => {
                if (!this.rowUtilityTable.has(state.toString())) {
                    frontier.push(state)
                }
            })
        }
        console.log(this.rowUtilityTable.size)

        // Iterative algorithm
        for (let index = 0; index <10; index++) {
            this.rowUtilityTable.forEach((value: number, key: string) => {

                let a: Array<string> = key.split(",");
                let s: State = new ListState(rules, [a])
    
                let reward: number = s.getPoints();
                
                let sumOfDiscountedUtilities: number = 0;
                rules.distribution.forEach((prob: number, symbol: string) => {
                    sumOfDiscountedUtilities += prob * this.getMaxRowUtility(symbol, s);
                })
    
                this.rowUtilityTable.set(s.toString(), reward + this.discount * sumOfDiscountedUtilities)

            })   
        }
        console.log(this.rowUtilityTable)

    }


    selectAction(state: State, letter: string): Action {
        return this.getBestAction(state, letter);
    }

    getMaxRowUtility(symbol: string, state: State): number {
        let best : number = 0;
        state.getNeighbourStates([symbol]).forEach((state: State) => {
            if (best <= this.rowUtilityTable.get(state.toString()))
                best = this.rowUtilityTable.get(state.toString())
        })
        return best;
    }

    getBestAction(state: State, letter: string): Action {
        let a : Action = Action.NONE;
        let best : number =  0
        state.getActions(letter).forEach(action => {
            let newState: State = state.doAction(action)

            if (best <= this.rowUtilityTable.get(newState.toString())) {
                best = this.rowUtilityTable.get(newState.toString())
                a = action;
            }

        });
        return a;
    }

    
}