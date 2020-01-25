import { Agent } from "./agent"
import { State } from "./state";
import { Action } from "./actions";

export class TestAgent implements Agent {

    stateValueTable: Map<string, number> = new Map()
    epsilon: number = 0.8
    learningRate: number = 0.9
    gamma: number = 0.4
    tick: number = 0;

    selectAction(state: State, prevState: State, prevAction: Action): Action {

        
        const key: string = prevState.toString()
        console.log(key);
         
        
        let oldValue: number | undefined = this.stateValueTable.get(key);
        if (oldValue != undefined) {

        } else {

        }

        this.tick++;
        
        // Exploration
        if (Math.random() < this.epsilon || true){
            const numberOfActions: number = state.getActions().length;
            const randomIndex: number = Math.floor(Math.random()*numberOfActions)
            if(state.getActions()[randomIndex] != undefined) {
                

                return state.getActions()[randomIndex];

            }
        }
        
        return this.getBestAction(state);
    }

    getMaxReward(state: State): number {
        let r : number = 0;

        return r;
    }

    getBestAction(state: State): Action {
        let a : Action = Action.NONE;

        return a;
    }
}