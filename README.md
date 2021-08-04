# Spingo
This was a program created to crush my parents in the boardgame [Spingo](https://www.spelexperten.com/sallskapsspel/familjespel/spingo.html).

Each turn a player throw a dice containg 4 letters. The player must the choose a letter. Each player much write this letter down on a 5x5 grid to form words. This goes on until there is no empty slots left. A word with 5 letters is 5 points, 4 letters is 4 points, etc. 

Internally the game is modeled as a [Markovian Decision Process](https://en.wikipedia.org/wiki/Markov_decision_process) which we then solve using a variation of the  Value iteration algorithm reffered to in the wikipedia article.

To run:
`npm install`
`ts-node src/index.ts`

