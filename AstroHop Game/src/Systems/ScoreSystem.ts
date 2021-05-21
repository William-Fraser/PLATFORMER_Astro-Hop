import { STAGE_WIDTH } from "../Constants";
import AssetManager from "../Managers/AssetManager";
import { GUI } from "../Managers/ScreenManager";

export default class ScoreSystem {

    //init private fields
    private bmpTxtScore:createjs.BitmapText;
    private _score:number;
    private _difficulty:number;
    private _savedLength:number;
    private _glyphWidth:number;

    constructor(gui:createjs.Container, assetManager:AssetManager) {
        
        //inst private fields // starting numbers from starting on a platform that adds 1 to score setting the whole game into motion
        this._score = -1;
        this.savedScore = this._score;
        this._difficulty = 0;
        
        //inst bmp
        this.bmpTxtScore = new createjs.BitmapText("0", assetManager.getSpriteSheet("glyphs"));
        this.bmpTxtScore.letterSpacing = 2;
        this.bmpTxtScore.x = (STAGE_WIDTH);
        this.bmpTxtScore.y = 5;
        gui.addChildAt(this.bmpTxtScore, GUI.SCORE);
        
        //private fields derived from bmp
        this._savedLength = this.bmpTxtScore.text.length;
        this._glyphWidth = this.bmpTxtScore.getBounds().width;
    }
    
    // ----- gets/sets
    set score(value:number) { this._score = value;}
    get difficulty():number { return this._difficulty; }
    set difficulty(value:number) {this._difficulty = value;}
    
    // ----- private methods
    private CheckToIncreaseDifficulty(){
        let scoreChecker:string = this._score.toString();
        if (
        !(scoreChecker[scoreChecker.length-1].indexOf('0')) ||
        !(scoreChecker[scoreChecker.length-1].indexOf('7')) ||
        !(scoreChecker[scoreChecker.length-1].indexOf('9')) ){ // magic numbers chosen from my list of favourite numbers in order to make difficulty change 'magically'
            this._difficulty += 1;
            console.log("increase difficulty to: " + this._difficulty +", because score hit: "+ scoreChecker[scoreChecker.length-1]);
        }
    }
    private UpdateLength() {
        if (this.bmpTxtScore.text.length != this._savedLength) {
            this.bmpTxtScore.x = STAGE_WIDTH - (this.bmpTxtScore.getBounds().width+this._glyphWidth);
            this._savedLength = this.bmpTxtScore.text.length
        }
    }

    // ----- public methods
    public Add(value:number) {
        if (value < 0) { // check for negative
            value * -1;//change to +
        }
        this._score += value;
    }

    private savedScore:number;
    public Update() {
        this.bmpTxtScore.text = this._score.toString();

        if (this._score != this.savedScore) { // statement for code that updates after a scoreincrease
            console.log("adding "+(this._score - this.savedScore)+" point to current score, set to "+this._score+" was "+this.savedScore);
            this.CheckToIncreaseDifficulty();
            this.savedScore = this._score;// stops constant check if already updated
        }

        this.UpdateLength();
    }
}