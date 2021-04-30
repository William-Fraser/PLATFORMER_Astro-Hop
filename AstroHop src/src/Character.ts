import AssetManager from "./AssetManager";
import Object from "./Object";

export default class Character extends Object {

    //direction constants
    public static LEFT:number = 2;
    public static RIGHT:number = 3;

    //state constants, continues STATE count
    public static STATE_DYING:number = 4;
    public static STATE_HIT:number = 5;// used to transition from alive to dying

    constructor(stage:createjs.StageGL, assetManager:AssetManager){
        
        //super instantiaion
        super(stage, assetManager);
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

    // public methods
    public attackForMe():void{
        if (this._state == Object.STATE_MOVING||this._state == Object.STATE_IDLE){
            this._state = Character.STATE_ATTACKING
        }
    }
    public killMe():void {
        if ((this._state == Character.STATE_DYING)||(this._state == Character.STATE_DEAD)) {return;}

        this.idleMe();
        this._sprite.on("animationend", () => {
            this._sprite.stop();
            this.stage.removeChild(this._sprite);
            this._state = Character.STATE_DEAD;
        });
        // NEEDS DEATH ANIMATION AFTER SUPER w\/
        //this._state = GameCharacter.STATE_DYING;
    }
    public update():void {
        // reference sprite object for cleaner code below
        let sprite:createjs.Sprite = this._sprite;
        if (this._state == Character.STATE_IDLE){
        }
        else if (this._state == Character.STATE_ATTACKING){  
        }
        else if (this._state == Character.STATE_MOVING) {
            
            if (this._direction == Character.LEFT) {
                // move left
                sprite.x = sprite.x - this._movementSpeed;
                
            } else if (this._direction == Character.RIGHT) {
                // move right

                sprite.x = sprite.x + this._movementSpeed;
                
            }
        }
    }   
}