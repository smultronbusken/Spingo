import { Agent } from "./agent"
import { State } from "./state";
import { Action } from "./actions";

export class SimpleAgent implements Agent {
    qTable: Map<string, number> = new Map()
    selectAction(state: State, prevState: State, prevAction: Action): Action {
        return state.getActions()[0];
    }
}