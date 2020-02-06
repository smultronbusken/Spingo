import { Agent } from "./agent"
import { State } from "./state";
import { Action } from "./actions";

/**
 * Only chooses random actions
 */
export class SimpleAgent implements Agent {
    selectAction(state: State, letter: string): Action {
        return state.getActions(letter)[0];
    }
}