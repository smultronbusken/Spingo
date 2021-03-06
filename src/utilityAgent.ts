import { Agent } from "./agent"
import { State, ListState } from "./state";
import { Action } from "./actions";
import { RuleSet } from "./rules";
import * as fs from 'fs';
import * as path from 'path';


/**
 * Utility based agent. Uses iterative algorithm.
 */
export class UtilityAgent implements Agent {

    // Utility for a single row. NOT utility for a whole state.
    rowUtilityTable: Map<string, number> = new Map()
    discount: number = 0.99
    ruleSet: RuleSet;

    constructor(rules: RuleSet) {
        this.ruleSet = rules;

        let pathName: string = path.join(__dirname,  "../utilityTables/" + this.ruleSet.rowLength + "swedish.json");

        try {
            console.log("Trying to read the utility table file...")
            let data = fs.readFileSync(pathName, "latin1")
            this.rowUtilityTable = new Map(JSON.parse(data))
            console.log("Successfully loaded utility table!")
        } catch (e) {
            console.log("No such file found. Starting to create one...")

            // Build utility table by traversing the state space tree
            let startingState: State = new ListState(rules);
            let frontier: Array<State> = new Array();
            frontier.push(startingState);
            while (frontier.length > 0) {
                let state: State = frontier.pop();
                this.rowUtilityTable.set(state.board[0].join(","), state.getPoints());
                this.getNeighbourStates(state.board[0], rules.symbols()).forEach((state: State) => {
                    if (!this.rowUtilityTable.has(state.toString())) {
                        if (state.getActions("a").length != 0)
                            frontier.push(state)
                    }
                })
            }
            console.log("Number of states: " + this.rowUtilityTable.size)

            // Iterative algorithm
            for (let index = 0; index <5; index++) {

                console.log("Running the iterative algorithm, iteration: " + index)

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


            fs.writeFileSync(pathName, JSON.stringify(Array.from(this.rowUtilityTable.entries())));
        }





    
    }


    selectAction(state: State, letters: Array<string>): Action {
        //console.log(state.toString() + " HAS UTILITY " + this.getUtilityForState(state))

        return this.getBestAction(state, letters);
    }

    getMaxRowUtility(symbol: string, row: Array<string>): number {
        let best : number = 0;
        this.getNeighbourStates(row, [symbol]).forEach((state: State) => {
            if (this.rowUtilityTable.get(state.toString()) == undefined){
                let reward: number = this.ruleSet.getLongestWord(state.getRows()[0]).length;
                if (best <= reward)
                    best = reward
            }
            else if (best <= this.rowUtilityTable.get(state.toString()))
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

        if (letters.length != 1)
            console.log("I chose letter " + bestLetter + " out of " + letters)

        //console.log(a)
        return a;
    }


    getUtilityForState(state: State): number {
        let sum: number = 0;

        state.getColumns().forEach((row: Array<string>) => {
            if (this.rowUtilityTable.get(row.join(","))  != undefined)
                sum += this.rowUtilityTable.get(row.join(","));
            else {
                sum += this.ruleSet.getLongestWord(row).length;
            }
        })

        state.getRows().forEach((row: Array<string>) => {
            if (this.rowUtilityTable.get(row.join(","))  != undefined)
                sum += this.rowUtilityTable.get(row.join(","));
            else {
                sum += this.ruleSet.getLongestWord(row).length;
            }
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