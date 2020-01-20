import { Agent } from "./agent"
import { SimpleAgent } from "./simpleAgent"
import { RuleSet, SwedishRuleSet } from "./rules"
import { Action } from "./actions"
import { State, ListState } from "./state";
import { QLearningAgent } from "./qLearningAgent";


class Game {
    agent: Agent = new QLearningAgent();
    ruleSet: RuleSet = new SwedishRuleSet(3, 3);
    state: State = new ListState(this.ruleSet);
    prevState: State = new ListState(this.ruleSet);
    prevAction: Action = Action.NONE;


    run(): boolean {       

        // The game ends when there are no actions left 
        if (this.state.getActions().length == 0) {
            console.log("End of game: " + this.state.toString() + "points: " + this.state.getPoints())
            console.log("Words found: " + this.state.getWords())
            return false;
        }

        // Choosing action
        const a: Action = this.agent.selectAction(this.state, this.prevState, this.prevAction);
        this.prevAction = a;
        //console.log("Choosing action: " + a.toString());
    

        // Updating states
        this.prevState = this.state
        this.state = this.state.doAction(a);
        //console.log("New state: " + this.state + ", reward: " + this.state.getReward(this.prevState));

        return true;
    }

}

let game: Game = new Game();
while(game.run()) {
    
}
