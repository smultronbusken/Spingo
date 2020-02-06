import { Agent } from "./agent"
import { State } from "./state";
import { Action } from "./actions";

/**
 * Only chooses random actions
 */
export class SimpleAgent implements Agent {
    selectAction(state: State, letters: Array<string>): Action {
        return state.getActions(letters[0])[0];
    }
}