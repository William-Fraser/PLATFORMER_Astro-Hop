import Platform from "../Platform";
import AssetManager from "../../Managers/AssetManager";
import Player from "../../Characters/Player";
import { DIRECTION } from "../../Characters/GameCharacter";
import { PLATFORM_MOVING_SCOREVALUE as SCOREVALUE, PLATFORM_MOVING_SPEED as SPEED, STAGE_WIDTH } from "../../Constants";

    //init speed level const
    const POWER_MAX:number    = 12;
    const POWER_STRONG:number = 8;
    const POWER_MEDIUM:number = 5.5;
    const POWER_LOW:number    = 1.7;

export default class Moving extends Platform {
    
    //init private fields
    private _direction:DIRECTION;
    private _speed:number;
    
    // fields for the speed controller
    private _speedController:number;
    private leftEnd:number;
    private rightEnd:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager, "Platforms/rocketpad2");

        //inst protected fields
        this._scoreValue = SCOREVALUE;

        //inst private fields
        this._direction = DIRECTION.LEFT; // starts left cause people read left to right, could be changed to a random eq
        this._speed = SPEED;
        this._speedController = POWER_MAX;
        this.rightEnd = 0;
        this.leftEnd = 0;
        
        //this.positionMe(0, 0); // NEEDS positionMe TO MOVE
    }
    // ----- gets/sets
    public positionMe(x:number, y:number) {
        console.log("resetting movement position");
        super.positionMe(x, y);
        this.ResetMovementPoints();
    }

    // ----- private methods
    private Move() {
        if (this._direction == DIRECTION.RIGHT) {
            // move right
            this._sprite.x += this._speed;
        }
        else if (this._direction == DIRECTION.LEFT) {
            // move left
            this._sprite.x -= this._speed;    
        } 
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
        if (this._speedController != POWER_MAX) {
            this._speedController = POWER_MAX;
        }

        //right side
        if (!(this._sprite.x < this.rightEnd-44)) {
            
            if (this._sprite.x >= this.rightEnd) {
                this._speedController = POWER_LOW;
                this._direction = DIRECTION.LEFT; // at the end of the right go left
            }
            else if (this._sprite.x >= this.rightEnd-11) {
                this._speedController = POWER_MEDIUM;
            }   
            else if (this._sprite.x >= this.rightEnd-44) {
                this._speedController = POWER_STRONG;
            }
        }
        
        //left side
        if (!(this._sprite.x > this.leftEnd+44)) {
            
            if (this._sprite.x <= this.leftEnd) {
                this._speedController = POWER_LOW;
                this._direction = DIRECTION.RIGHT; // at the end of the left go right
            }
            else if (this._sprite.x <= this.leftEnd+11) {
                this._speedController = POWER_MEDIUM;
            }   
            else if (this._sprite.x <= this.leftEnd+44) {
                this._speedController = POWER_STRONG;
            }
            
        }
        // control the speed
        if (this._speed != this._speedController) {
            //console.log(`speed set to: ${this._speedController}`);
            this._speed = this._speedController;
        }
    }
    private ResetMovementPoints() {
        this.rightEnd = (this._sprite.x + (STAGE_WIDTH/4));
        this.leftEnd = (this._sprite.x - (STAGE_WIDTH/4));
    }

    // ----- public methods

    public PlatformUpdate(player:Player) {
        super.PlatformUpdate(player);

        //movement cycle
        this.Controller();
        this.Move();
        
    }
}