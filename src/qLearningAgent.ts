import { Agent } from "./agent"
import { State } from "./state";
import { Action } from "./actions";

export class QLearningAgent implements Agent {

    qTable: Map<string, number> = new Map()
    epsilon: number = 0.4
    learningRate: number = 0.9
    gamma: number = 0.4
    tick: number = 0;

    selectAction(state: State, prevState: State, prevAction: Action): Action {

        //console.log(this.qTable.keys.length);
        const prevStateString: string = prevState.toString()
        const prevActionString: string = prevAction.toString()
        const stateString: string = state.toString();


        if (this.tick == 1000000) {
            this.epsilon = 0;
            console.log("TURNED OFF EXPLORATION")
            console.log(this.qTable)
        }

    
        // Exploration
        if (Math.random() < this.epsilon){
            const numberOfActions: number = state.getActions().length;
            const randomIndex: number = Math.floor(Math.random()*numberOfActions)
            if(state.getActions()[randomIndex] != undefined)
                return state.getActions()[randomIndex];
        }

        const key: string = prevStateString + prevActionString;
        
        let oldValue: number | undefined = this.qTable.get(key);
        if (oldValue != undefined) {


            if (state.getActions().length == 0) {
                this.qTable.set(stateString + prevActionString, state.getPoints())
                return state.getActions()[0];
            }
            let learningValue = this.learningRate * ((state.getPoints() + this.gamma * this.getMaxReward(state)) - oldValue)
            this.qTable.set(key, oldValue + learningValue)
        } else {
            this.qTable.set(key, 0)
        }

        
        this.tick++;
        return this.getBestAction(state);
    }

    getMaxReward(state: State): number {
        let r : number = 0;

        state.getActions().forEach(action => {

            const key: string = state.toString() + action.toString();

            let currReward: number | undefined = this.qTable.get(key);
            if (currReward == undefined) {
                this.qTable.set(key, 0)
                currReward = 0
            } 

            if (r < currReward)
                r = currReward
        });

        return r;
    }

    getBestAction(state: State): Action {
        let a : Action = Action.NONE;
        let r : number =  0

        state.getActions().forEach(action => {
            const key: string = state.toString() + action.toString();

            let currReward: number | undefined = this.qTable.get(key);
            if (currReward == undefined) {
                this.qTable.set(key, 0)
                currReward = 0
            } 

            if (r < currReward || a == Action.NONE) {
                r = currReward
                a = action
            }
        });

        return a;
    }
}