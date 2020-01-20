import { Agent } from "./agent"
import { State } from "./state";
import { Action } from "./actions";

export class QLearningAgent implements Agent {

    qTable: Map<string, string> = new Map()

    selectAction(state: State, prevState: State, prevAction: Action): Action {

        console.log(state.toString() == prevState.toString())

        return Action.NONE;
    }
}