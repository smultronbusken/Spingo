import { State } from "./state";
import { Action } from "./actions";

export interface Agent {
    /**
     * Returns the action this agent chooses in a state
     * @param state 
     */
    selectAction(state: State, letters: Array<string>): Action
}