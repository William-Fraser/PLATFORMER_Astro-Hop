import AssetManager from "./AssetManager";

export enum STATE {
    IDLE,
    ACTIVE,
    HURT,
    DYING,
    DEAD,
} 

export default class GameObject {

    //private property variables
    protected _state:number;
    
    //create sprite variable
    protected _sprite:createjs.Sprite;

    //passed globals
    protected stage:createjs.StageGL;
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager){
        //initialiazation of properties
        this._state = STATE.IDLE;
        this.stage = stage;

        // needs sprite initialization
        // this._sprite = assetManager.getSprite("assets", "sprite/animation", 0, 0);
        // this._sprite.play();
        // stage.addChild(this._sprite);
    }

    // ----- gets/sets
    get state() {
        return this._state;
    }
    set state(value:number){
        this._state = value;
    }
    get sprite() {
        return this._sprite;
    }

    // ----- public methods
    public startMe():void {
        if (this._state == STATE.IDLE){
            this._state = STATE.ACTIVE;
        }
    }
    public idleMe():void { 
        if (this._state == STATE.ACTIVE) {
            this._state = STATE.IDLE;
        }
    }
    public positionMe(x:number, y:number):void {
        this._sprite.x = x;
        this._sprite.y = y;
    }
    public Update() {
        switch(this._state) {
            case STATE.IDLE:
                this._sprite.stop();
                break;
            case STATE.ACTIVE:
                this._sprite.play();
                break;
        }
    }
}

