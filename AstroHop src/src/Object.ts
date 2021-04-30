import AssetManager from "./AssetManager";

export default class Object {

    //direction constants
    public static UP:number = 0;
    public static DOWN:number = 1;

    //state constants
    public static STATE_IDLE:number = 0;
    public static STATE_MOVING:number = 1;
    public static STATE_DEAD:number = 2;
    public static STATE_ATTACKING:number = 3;

    //private property variables
    protected _movementSpeed:number;
    protected _state:number;

    //create sprite variable
    protected _sprite:createjs.Sprite;

    protected _direction:number;

    //other globals
    protected stage:createjs.StageGL;
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager){
        //initialiazation of properties
        this._state = Object.STATE_IDLE;
        this.stage = stage;
        //needs speed set movement speed

        //init of properties
        this._direction = 999;

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
    set speed(value:number) {
        this._movementSpeed = value;
    }
    get speed() {
        return this._movementSpeed;
    }

    // ----- public methods
    public startMe():void {
        if (this._state == Object.STATE_IDLE){
            this._state = Object.STATE_MOVING;
        }
    }
    public idleMe():void { 
        if (this._state == Object.STATE_MOVING||this._state == Object.STATE_ATTACKING){
            this._state = Object.STATE_IDLE;
        }
    }
    public positionMe(x:number, y:number):void {
        this._sprite.x = x;
        this._sprite.y = y;
    }
    public update(){
        // reference sprite object for cleaner code below
        let sprite:createjs.Sprite = this._sprite;
        
        if (this._state == Object.STATE_IDLE){

        }
        if (this._state == Object.STATE_MOVING) {
            let sprite:createjs.Sprite = this._sprite;
            if (this._direction == Object.UP) {
                // move left
                sprite.y = sprite.y - this._movementSpeed;
                
            } else if (this._direction == Object.DOWN) {
                // move right

                sprite.y = sprite.y + this._movementSpeed;
                
            }
        }
    }
}

