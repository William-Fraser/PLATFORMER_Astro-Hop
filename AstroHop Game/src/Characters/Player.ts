import AssetManager from "../Managers/AssetManager";
import { PLAYER_GRAVITYDEFAULT as PLAYER_GRAVITY, PLAYER_POWER, PLAYER_WEIGHTDEFAULT as PLAYER_WEIGHT, STAGE_HEIGHT, STAGE_WIDTH } from "../Managers/Constants";
import GameCharacter, { DIRECTION } from "./GameCharacter";
 
export default class Player extends GameCharacter {

    private _timeToJump:boolean;// bool to find out if player is on platform, used to set jumpPower
    private _jumpPower:number;// power which to propel off the ground with set before jump
    private _jumpWeight:number;// rate which movement speed decreases during jump
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
        this.stage.mouseMoveOutside = true;
        this._movementSpeed = 1; // starts at one and almost always changes
        
        // instance Sprite, init animation [NEEDS ANIMATION \/\/\/\/\/]
        this._sprite = assetManager.getSprite("assets", "Astronaught/AstronaughtColor", 0, 0);
        this._sprite.scaleX = 2;
        this._sprite.scaleY = 2; /// {create a scale me method you bozo}  (o:>-o   <-- its a clown
        this._sprite.play();
        stage.addChild(this._sprite);

        // add mouse controller to sprite // try pointer lock
        this.stage.on("pressmove", () =>{

            this._sprite.x = this.stage.mouseX; 
        });
        //check mouse pos                                                               // debug
        // this.stage.on("stagemousemove", () => {
        //     console.log("stage X/Y : "+ this.stage.mouseX +" "+this.stage.mouseY );  // debug
        // });

        this.positionMe(STAGE_WIDTH/2, STAGE_HEIGHT/2+(STAGE_HEIGHT/2)/2); // sets 
    }
    //#region // ----- gets/sets 
    get Jumping():boolean { return this._timeToJump; }//         [ used in various Platforms ]
    set Jumping(value:boolean) { this._timeToJump = value;}
    get power():number { return this._jumpPower; }
    set power(value:number) { this._jumpPower = value; }//          [___________________________]
    get weight():number { return this._jumpWeight; } //             [ used in moonshoe item ]
    set weight(value:number) { this._jumpWeight = value; }
    get gravity():number { return this._fallingGravity; }
    set gravity(value:number) { this._fallingGravity = value; }//   [_______________________]
    //#endregion ----- (all private fields are accessed, in different areas)

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

    // ----- public methods
    public Update() {

        this.detectEdges();

        // jumping
        if (this._direction == DIRECTION.UP){
            this.JumpOffPlatform();
        }

        // falling ----- // player is expected to start on a type of platform
        if (this._direction == DIRECTION.DOWN){
            this.Fall();
        }
    }
}