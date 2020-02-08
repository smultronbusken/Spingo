import * as fs from 'fs';
import * as path from 'path';
import { ListState } from './state';

export interface RuleSet {
    rowLength: number;
    colLength: number;
    distribution: Map<string, number>;

    /**
     * All valid symbols
     */
    symbols(): Array<string>
    
    /**
     * Simulate a dice roll. Returns a symbol
     */
    rollDice(): Array<string>

    /**
     * Returns true if a string is a valid word
     */
    isWord(s: string): boolean

    getLongestWord(combination: Array<string>): string

    rollOpponentDice(): string


}


export class SwedishRuleSet implements RuleSet{
    static readonly symbols: Array<string> = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z", "å", "ä", "ö"]
    //distribution: Array<number> = [4/44, 1/44, 1/44, 2/44, 3/44, 1/44, 1/44, 1/44, 3/44, 1/44, 2/44, 2/44, 1/44, 2/44, 2/44, 1/44, 1/44, 3/44, 2/44, 2/44, 1/44, 1/44, 1/44, 1/44, 1/44, 1/44, 1/44, 1/44]
    //static readonly symbols: Array<string> = ["a", "b"]
    distribution: Map<string, number> = new Map();
    
    rowLength: number;
    colLength: number;
    words: Set<string> = new Set();


    diceSides: Array<Array<string>> = [
        ["c", "a", "h", "i"],
        ["r", "e", "d", "n"],
        ["z", "a", "b", "m"],
        ["d", "e", "s", "o"],
        ["l", "a", "t", "å"],
        ["k", "i", "e", "r"],
        ["g", "e", "j", "ö"],
        ["k", "a", "v", "q"],
        ["l", "y", "o", "s"],
        ["n", "ä", "f", "i"],
        ["t", "x", "u", "p"],
        SwedishRuleSet.symbols, // SPINGO

    ]

    constructor(rowLength: number, colLength: number) {
        //this.distribution.set("a", 3/4);
        //this.distribution.set("b", 1/4);
        //this.distribution.set("c", 1/4);
        //if(SwedishRuleSet.symbols.length != this.distribution.size)
        //    throw new Error("Length of symbol and distribution array is not equal.")
        

        
        this.rowLength = rowLength;
        this.colLength = colLength;
        
        
        let data = fs.readFileSync(path.join(__dirname, '../words/se_5.txt'), "latin1")


        data = data.toLowerCase();
        SwedishRuleSet.symbols.map((value: string, index: number) => {
            this.distribution.set(value, data.split(value).length / (data.length * 0.69))
        }) 
        
        this.words = new Set(data.split("\r\n"));
        

        //this.words = new Set(["a", "ab", "abb", "bab"])
        console.log("Created rule set. Words: " + this.words.size)
        //console.log(this.distribution)
    }

    rollDice(): Array<string> {
        return this.diceSides[Math.floor(Math.random() * this.diceSides.length)]
    }

    rollOpponentDice(): string {
        let symbolIndex: number = SwedishRuleSet.sample(Array.from(this.distribution.values()))
        return SwedishRuleSet.symbols[symbolIndex]
    }

    isWord(s: string): boolean {
        return this.words.has(s)
    }

    symbols(): Array<string> {
        return SwedishRuleSet.symbols
    }

    /**
     * Draws a random variable from a distribution
     * @param probs the distribution
     */
    static sample(probs: any): number {
        const sum = probs.reduce((a: number, b: number) => a + b, 0)
        if (sum <= 0) throw Error('probs must sum to a value greater than zero')
        const normalized = probs.map((prob: number) => prob / sum)
        const sample = Math.random()
        let total = 0
        for (let i = 0; i < normalized.length; i++) {
            total += normalized[i]
            if (sample < total) return i
        }
        return 0;
    }


        /**
     * Returns longest word 
     * @param combination A combination of symbols
     */
    getLongestWord(combination: Array<string>): string {
        function getAllSubstrings(str: string): Array<string> {
            var i, j, result = [];
            for (i = 0; i < str.length; i++) {
                for (j = i + 1; j < str.length + 1; j++) {
                    if (str.slice(i, j).indexOf(ListState.empty) <= -1)
                        result.push(str.slice(i, j));
                }
            }
            return result;
        }

        // Stringify the state and get all substrings
        let combinationAsString: string = combination.join("");
        let substrings: Array<string> = getAllSubstrings(combinationAsString);

        // Sort the substring by decreasing length
        substrings.sort((a: string, b: string) => (b.length - a.length));

        // Find the longest word.
        for (let i = 0; i < substrings.length; i++) {
            const s = substrings[i];
            if (this.isWord(s)) {
                return s;
            }
        }
        return "";
    }
}

