import { DIRECTION } from "../GameCharacter";
import AssetManager from "../../Managers/AssetManager";
import Enemy from "../Enemy";
import Player from "../Player";

const POWER_MAX:number = 12;
const POWER_STRONG:number = 8;
const POWER_MEDIUM:number = 5.5;
const POWER_LOW:number = 1.7;

export default class EyeWalker extends Enemy {
    
    //private fields
    private rightEnd:number;
    private leftEnd:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst private fields
        this.rightEnd = 0;
        this.leftEnd = 0;

        //inst protected fields
        this._direction = DIRECTION.RIGHT; 

        //inst sprite
        this._sprite = assetManager.getSprite("assets", "Enemies/EyeballWalk/Right");
        this._sprite.play();
        this.scaleMe(1.2);
        this.stage.addChild(this._sprite);
        this.ResetMovementPoints();
    }

    private Controller() { // changes the direction inside this method // add animation changes here
    //#region How it works
        // as platform moves closer to it's position
        // -- or ++ to the controller gradually until 
        // changing directions, 
        // in the middle of the movement arc, 
        // swap the +- of the controller, so the speed 
        // slows down again for the other direciton
    //#endregion
    
        // control speed according to position from fields // naturally increases to the right
        if (this._acceleration != POWER_MAX) {
            this._acceleration = POWER_MAX;
        }
    
        //right side
        if (!(this._sprite.x < this.rightEnd-44)) {
            
            if (this._sprite.x >= this.rightEnd) {
                
                //set up animations for the other direction
                this._sprite.on("animationend", () => {
                    this._sprite.gotoAndPlay("Enemies/EyeballWalk/Left");
                });
                this._sprite.gotoAndPlay("Enemies/EyeballWalk/Left-TurnAround");

                this._acceleration = POWER_LOW;
                this._direction = DIRECTION.LEFT; // at the end of the right go left
            }
            else if (this._sprite.x >= this.rightEnd-11) {
                this._acceleration = POWER_MEDIUM;
            }   
            else if (this._sprite.x >= this.rightEnd-44) {
                this._acceleration = POWER_STRONG;
            }
        }
        
        //left side
        if (!(this._sprite.x > this.leftEnd+44)) {
            
            if (this._sprite.x <= this.leftEnd) {

                //set up animations for the other direction
                this._sprite.on("animationend", () => {
                    this._sprite.gotoAndPlay("Enemies/EyeballWalk/Right");
                });
                this._sprite.gotoAndPlay("Enemies/EyeballWalk/Right-TurnAround");
                
                this._acceleration = POWER_LOW;
                this._direction = DIRECTION.RIGHT; // at the end of the left go right
            }
            else if (this._sprite.x <= this.leftEnd+11) {
                this._acceleration = POWER_MEDIUM;
            }   
            else if (this._sprite.x <= this.leftEnd+44) {
                this._acceleration = POWER_STRONG;
            }
            
        }
        // control the speed
        if (this.speed != this._acceleration) {
            //console.log(`speed set to: ${this._speedController}`);
            this.speed = this._acceleration;
        }
    }
    private ResetMovementPoints() {
        let platformRadius = 40;
        this.rightEnd = (this._sprite.x + platformRadius);
        this.leftEnd = (this._sprite.x - platformRadius);
    }

    // ----- public methods
    public Special() {
        this.ResetMovementPoints();
    }

    public EnemyUpdate(player:Player) {
        this.Controller();
        super.Update();
        super.EnemyUpdate(player);
    }
}