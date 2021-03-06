import GameObject, { STATE } from "../Objects/GameObject";
import AssetManager from "../Managers/AssetManager";

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
    protected _acceleration:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager){
        
        //super instantiaion
        super(stage, assetManager);

        // child sets movementSpeed
        // child sets directions
        // child sets acceleration / it useually changes in accordance to the distance to a static or changing point
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
    }
    get Y(){
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
        if ((this._state == STATE.DYING)||(this._state == STATE.GONE)) {return;}

        this.idleMe();
        createjs.Tween.get(this._sprite).to({alpha:0}, 300).call( () => {
            this._sprite.stop();
            this.stage.removeChild(this._sprite);
            this._state = STATE.GONE;

        });
        // NEEDS DEATH ANIMATION AFTER SUPER w\/
        this._state = STATE.DYING;
    }
    public Update(){
        // reference sprite object for cleaner code below
        let sprite:createjs.Sprite = this._sprite;
        
        if (this._state == STATE.IDLE){

        }
        else if (this._state == STATE.ACTIVE || this._state == STATE.HURT) {// only player will be hurt

            if (this._direction == DIRECTION.LEFT) {
                // move left
                sprite.x -= this._movementSpeed;
                
            } else if (this._direction == DIRECTION.RIGHT) {
                // move right
                sprite.x += this._movementSpeed;
                
            }else if (this._direction == DIRECTION.UP) {
                // move up
                sprite.y -= this._movementSpeed;
                
            }else if (this._direction == DIRECTION.DOWN) {
                // move down
                sprite.y += this._movementSpeed;
                
            }
        }
    }   
}