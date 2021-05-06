import AssetManager from "./AssetManager";
import GameObject, { STATE } from "./GameObject";

export enum DIRECTION {
    NULL,
    LEFT,
    RIGHT,
    UP,
    DOWN
}

export default class GameCharacter extends GameObject {

    //init protected fields
    protected _movementSpeed:number;
    protected _direction:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager){
        
        //super instantiaion
        super(stage, assetManager);

        // child sets movementSpeed
        // child sets directions
    }
    
    // ----- gets / sets;
    set direction(value:number) {
        this._direction = value;
    }
    get direction() {
        return this._direction;
    }
    get X(){
        return this.sprite.x;
    }get Y(){
        return this.sprite.y;
    }
    get speed(){
        return this._movementSpeed;
    }
    set speed(value:number) {
        this._movementSpeed = value;
    }

    // public methods
    public killMe():void {
        if ((this._state == STATE.DYING)||(this._state == STATE.DEAD)) {return;}

        this.idleMe();
        this._sprite.on("animationend", () => {
            this._sprite.stop();
            this.stage.removeChild(this._sprite);
            this._state = STATE.DEAD;
        });
        // NEEDS DEATH ANIMATION AFTER SUPER w\/
        //this._state = GameCharacter.STATE_DYING;
    }
    public Update(){
        // reference sprite object for cleaner code below
        let sprite:createjs.Sprite = this._sprite;
        
        if (this._state == STATE.IDLE){

        }
        else if (this._state == STATE.ACTIVE) {

            if (this._direction == DIRECTION.LEFT) {
                // move left
                sprite.x -= this._movementSpeed;
                
            } else if (this._direction == DIRECTION.RIGHT) {
                // move right
                sprite.x += this._movementSpeed;
                
            }
        }
    }   
}