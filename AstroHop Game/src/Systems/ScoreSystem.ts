import { STAGE_WIDTH } from "../Constants";
import AssetManager from "../Managers/AssetManager";

export default class ScoreSystem {

    //init private fields
    private bmpTxtScore:createjs.BitmapText;
    private _score:number;
    private _difficulty:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        
        //inst private fields
        this._score = -1;
        this.savedScore = this._score;
        this._difficulty = 0;

        //inst bmp
        this.bmpTxtScore = new createjs.BitmapText("0", assetManager.getSpriteSheet("glyphs"));
        this.bmpTxtScore.letterSpacing = 2;
        this.bmpTxtScore.x = (STAGE_WIDTH-this.bmpTxtScore.getBounds().width)-25;
        this.bmpTxtScore.y = 5;
        stage.addChild(this.bmpTxtScore);
    }

    // ----- gets/sets
    set score(value:number) { this._score = value;}
    get difficulty():number { return this._difficulty; }

    // ----- private methods
    private CheckToIncreaseDifficulty(){
        let scoreChecker:string = this._score.toString();
        if (!(scoreChecker[scoreChecker.length-1].indexOf('0'))) {
            this._difficulty += 1;
            console.log("increase difficulty" + scoreChecker[scoreChecker.length-1]);
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
            console.log("change difficultyChanger "+this._score+" was "+this.savedScore);
            this.CheckToIncreaseDifficulty();
            this.savedScore = this._score;// stops constant check if already updated
        }
    }
}