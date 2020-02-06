import * as fs from 'fs';
import * as path from 'path';

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
    rollDice(): string

    /**
     * Returns true if a string is a valid word
     */
    isWord(s: string): boolean
}


export class SwedishRuleSet implements RuleSet{
    //static readonly symbols: Array<string> = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z", "å", "ä", "ö"]
    //distribution: Array<number> = [4/44, 1/44, 1/44, 2/44, 3/44, 1/44, 1/44, 1/44, 3/44, 1/44, 2/44, 2/44, 1/44, 2/44, 2/44, 1/44, 1/44, 3/44, 2/44, 2/44, 1/44, 1/44, 1/44, 1/44, 1/44, 1/44, 1/44, 1/44]
    static readonly symbols: Array<string> = ["a", "b"]
    distribution: Map<string, number> = new Map();
    
    rowLength: number;
    colLength: number;
    words: Set<string> = new Set();

    constructor(rowLength: number, colLength: number) {
        this.distribution.set("a", 3/4);
        this.distribution.set("b", 1/4);
        //this.distribution.set("c", 1/4);
        if(SwedishRuleSet.symbols.length != this.distribution.size)
            throw new Error("Length of symbol and distribution array is not equal.")
        

        
        this.rowLength = rowLength;
        this.colLength = colLength;
        
        /*
        let data = fs.readFileSync(path.join(__dirname, '../words/se_5.txt'), "latin1")


        data = data.toLowerCase();
        SwedishRuleSet.symbols.map((value: string, index: number) => {
            this.distribution.set(value, data.split(value).length / (data.length * 0.69))
        }) 
        
        this.words = new Set(data.split("\r\n"));
        */

        this.words = new Set(["a", "ab"])
        console.log("Created rule set. Words: " + this.words.size)
        console.log(this.distribution)
    }

    rollDice(): string {
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
}

