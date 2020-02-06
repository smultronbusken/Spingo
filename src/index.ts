import { Agent } from "./agent"
import { SimpleAgent } from "./simpleAgent"
import { RuleSet, SwedishRuleSet } from "./rules"
import { Action } from "./actions"
import { State, ListState } from "./state";
import { access } from "fs";
import { UtilityAgent } from "./utilityAgent";

/*
   TODO: Idea: To minimize state space -> count "abi", "aci", "adi" as the same 
*/

class Game {
    ruleSet: RuleSet = new SwedishRuleSet(4,4);
    agent: UtilityAgent = new UtilityAgent(this.ruleSet);
    state: State = new ListState(this.ruleSet);
    prevState: State = new ListState(this.ruleSet);
    prevAction: Action = Action.NONE;

    players: number = 2;
    playerTurn: number = 1;

    lastTenGames: Array<number> = []
    total: number = 0
    games: number = 0

    run(): boolean {      
        

        let letters: Array<string> = new Array()
        if ((this.playerTurn % this.players) == 0) {
            this.playerTurn = 1
            letters = this.ruleSet.rollDice(); 
        } else {
            this.playerTurn++;
            letters = [this.ruleSet.rollOpponentDice()]; 
        }
        // The game ends when there are no actions left 
        if (this.state.getActions("a").length == 0) {
            //console.log("End of game: " + this.state.toString() + "points: " + this.state.getPoints())
            //console.log("Words found: " + this.state.getWords())
            this.agent.selectAction(this.state, letters);
            
            this.total += this.state.getPoints()
            this.games++;
            this.lastTenGames[(this.games % 30)] = this.state.getPoints();
            if (this.games % 10000 == 0)
                console.log((this.lastTenGames.reduce((a: number, b: number) => a + b, 0) / 30) + ", " + this.games)
            
            this.state = new ListState(this.ruleSet);
            this.prevState = new ListState(this.ruleSet); 
            this.prevAction = Action.NONE
            return true;
        }

        // Choosing action
        const a: Action = this.agent.selectAction(this.state, letters);
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
