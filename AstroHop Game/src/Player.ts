import AssetManager from "./AssetManager";
import { PLAYER_GRAVITYDEFAULT as PLAYER_GRAVITY, PLAYER_POWER, PLAYER_WEIGHTDEFAULT as PLAYER_WEIGHT, STAGE_HEIGHT, STAGE_WIDTH } from "./Constants";
import { STATE } from "./GameObject";
import GameCharacter, { DIRECTION } from "./GameCharacter";
import { debug } from "node:console";
 
export default class Player extends GameCharacter {

    private _timeToJump:boolean;// bool to find out if player is on platform, used to set jumpPower
    private _jumpPower:number;// fixed power which to propel off the ground with set before jump
    private _jumpWeight:number;// fixed rate which movement speed decreases during jump
    private _fallingGravity:number;// rate which movement speed increases during fall  

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {

        super(stage, assetManager);
        
        // instance private fields
        this._timeToJump = false;
        this._jumpPower = PLAYER_POWER; 
        this._jumpWeight = PLAYER_WEIGHT;
        this._fallingGravity = PLAYER_GRAVITY;
        
        // instance protected fields
        this._direction = DIRECTION.DOWN;
        this._movementSpeed = 1; // starts at one and almost always changes
        this.stage.mouseMoveOutside = true;
        
        // instance Sprite, init animation [NEEDS ANIMATION \/\/\/\/\/]
        this._sprite = assetManager.getSprite("assets", "idle", 0, 0);
        this._sprite.scaleX = 2;
        this._sprite.scaleY = 2; /// {create a scale me method you bozo}  (o:>-o   <-- its a clown
        this._sprite.play();
        stage.addChild(this._sprite);

        // add mouse controller to sprite // try pointer lock
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

    // ----- private methods
    private JumpOffPlatform() {
        //setup jump // only if on platform
        if (this._timeToJump){
            this._movementSpeed = this._jumpPower; // set speed to 'jump'power
            this._timeToJump = false;
        }

        //JUMP
        this._sprite.y -= this._movementSpeed;
        this._movementSpeed -= this._jumpWeight // decrease jump speed by character 'jump'weight to reach "maxheight"

        // reach the jump height
        if (this._movementSpeed <= 0){ // 0 detects the "maxheight"
            this._direction = DIRECTION.DOWN;
            //console.log();
        }
    }
    private Fall() {
        this._sprite.y += this._movementSpeed;
        this._movementSpeed += this._fallingGravity // increase fall speed by 'falling'Gravity
    }
    private detectEdges() {
        if (this._sprite.x <= this._sprite.getBounds().width) {
            this._sprite.x = this._sprite.getBounds().width;
        }
        else if (this._sprite.x >= (STAGE_WIDTH - this._sprite.getBounds().width)) {
            this._sprite.x = (STAGE_WIDTH - this._sprite.getBounds().width);
        }
    }

    //placeholder for platform
    private detectPlatform(){
        if (this._sprite.y > 450){ // 450 is a magic number that represents the 'ground'
            this._timeToJump = true;
            this._direction = DIRECTION.UP;
            console.log("this reaches the ground "+(STAGE_HEIGHT/2+(STAGE_HEIGHT/2)/2));
        }
    }

    // ----- public methods
    public Update() {

        // jumping
        if (this._direction == DIRECTION.UP){
            this.JumpOffPlatform();
        }

        // falling ----- // player is expected to start on a type of platform
        if (this._direction == DIRECTION.DOWN){
            this.Fall();
        }
        
        this.detectEdges();

        this.detectPlatform();
    }
}