import AssetManager from "./AssetManager";
import { STAGE_HEIGHT, STAGE_WIDTH } from "./Constants";
import { STATE } from "./GameObject";
import GameCharacter, { DIRECTION } from "./GameCharacter";
import { debug } from "node:console";
 
export default class Player extends GameCharacter {

    private _onPlatform:boolean;// bool to find out if player is on platform, used to set jumpPower
    private _jumpPower:number;// fixed power which to propel off the ground with set before jump
    private _jumpWeight:number;// fixed rate which movement speed decreases during jump
    private _fallingGravity:number;// fixed rate which movement speed increases during fall  

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {

        super(stage, assetManager);

        // instance protected fields
        this._direction = DIRECTION.DOWN;
        // [CHANGE TO CONST \/\//\/]
        this._movementSpeed = 1;
        this._jumpPower = 17; 
        this._jumpWeight = 0.7;
        this._fallingGravity = 1.7;
        //__________________________]
        this.stage.mouseMoveOutside = true;
        
        // instance Sprite, init animation [NEEDS ANIMATION \/\/\/\/\/]
        this._sprite = assetManager.getSprite("assets", "idle", 0, 0);
        this._sprite.scaleX = 2;
        this._sprite.scaleY = 2; /// {create a scale me class you bozo}  (o:>-o   <-- its a clown
        this._sprite.play();
        stage.addChild(this._sprite);

        // add mouse controller to sprite
        this.stage.on("pressmove", () =>{
            this._sprite.x = this.stage.mouseX;
        });
        //check mouse pos                      // debug // used to 
        // this.stage.on("stagemousemove", () => {
        //     console.log("stage X/Y : "+ this.stage.mouseX +" "+this.stage.mouseY ); // debug
        // });

        this.positionMe(STAGE_WIDTH/2, STAGE_HEIGHT/2+(STAGE_HEIGHT/2)/2); // sets 
    }
    
    // ----- gets/sets

    // -----  methods
    private Jump() {
        if (this._onPlatform){
            this._movementSpeed = this._jumpPower; // set speed to 'jump'power
            this._onPlatform = false;
        }
        this._sprite.y -= this._movementSpeed;
        this._movementSpeed -= this._jumpWeight // decrease jump speed by character 'jump'weight to reach "maxheight"

        // reach the jump height
        if (this._movementSpeed <= 0){ // 0 detects the "maxheight"
            this._direction = DIRECTION.DOWN;
            //console.log();
        }
    }

    public Update() {
        
        // jumping
        if (this._direction == DIRECTION.UP){
            this.Jump();
        }

        // falling // player is expected to start on a type of platform
        if (this._direction == DIRECTION.DOWN){
            this._sprite.y += this._movementSpeed;
            this._movementSpeed += this._fallingGravity // increase fall speed by 'falling'Gravity
            
            //primitive ground detection
            if (this._sprite.y > 450){ // 450 is a magic number for a primitive method
                this._direction = DIRECTION.UP;
                console.log("this reaches the ground "+(STAGE_HEIGHT/2+(STAGE_HEIGHT/2)/2));
            }
    
        }
    }
}