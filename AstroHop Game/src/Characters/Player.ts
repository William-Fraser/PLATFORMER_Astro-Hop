import AssetManager from "../Managers/AssetManager";
import { PLAYER_GRAVITYDEFAULT as PLAYER_GRAVITY, PLAYER_POWERDEFAULT as PLAYER_POWER, PLAYER_WEIGHTDEFAULT as PLAYER_WEIGHT, STAGE_HEIGHT, STAGE_WIDTH } from "../Constants";
import { pointHit } from "../Toolkit";
import Platform from "../Objects/Platform";
import GameCharacter, { DIRECTION } from "./GameCharacter";
import { STATE } from "../Objects/GameObject";
import { GAMESTATE } from "../Game";
import { GUI } from "../Managers/ScreenManager";
 
export default class Player extends GameCharacter {

    //init private fields
    private _timeToJump:boolean;// bool to find out if player is on platform, used to set jumpPower
    private _jumpPower:number;// power which to propel off the ground with set before jump
    private _jumpWeight:number;// rate which movement speed decreases during jump
    private _fallingGravity:number;// rate which movement speed increases during fall  
    private _scrollHeight:boolean;// state at which player shouldn't climb but 'push' platforms down
    private _life:number;// points left before death
    private _iFrames:boolean; // state of invincibility;
    private lifeStatus:createjs.Container; //holds entierty of status display for easier parsing in screenmanagers hud
    private range:number = 15;
    private _mouseX:number;
    private _mouseY:number;
    private _readyToSpawn:boolean;
    private _timeToFall:boolean; // bool used to start falling animation
    
    //bmp and life sprite
    private bmpTxtScore:createjs.BitmapText;
    private lifeSprite:createjs.Sprite;

    //title sprite
    private titleRun:createjs.Sprite;

    //init public fields
    public gainedPoints:number; // number that updates to a value of points gained the score system will add them and reset this value to 0

    //spacebar bool
    private _spacebarIsPressed:boolean;

    // Item Use Event
    private eventSpacebarUseItem:createjs.Event;// detects if the spacebar is being pressed

    constructor(stage:createjs.StageGL, hud:createjs.Container, mainMenu:createjs.Container, assetManager:AssetManager) {

        super(stage, assetManager);
        
        // instance private fields
        this._timeToJump = false;
        this._jumpPower = PLAYER_POWER; 
        this._jumpWeight = PLAYER_WEIGHT;
        this._fallingGravity = PLAYER_GRAVITY;
        this._scrollHeight = false;
        this._spacebarIsPressed = false;
        this._life = 0;
        this.lifeStatus = new createjs.Container();
        this._readyToSpawn = false;
        this._timeToFall = false;

        // inst public fields
        this.gainedPoints = 0;
        
        // instance protected fields
        this._state = STATE.ACTIVE;
        this._direction = DIRECTION.DOWN;
        this.stage.mouseMoveOutside = true;
        this._movementSpeed = 1; // starts at one and almost always changes
        
        // instance Sprite, init animation [NEEDS ANIMATION \/\/\/\/\/]
        this._sprite = assetManager.getSprite("assets", "Astronaught/idle-Color", 0, 0);
        this._sprite.play();
        this.scaleMe(2);
        stage.addChild(this._sprite);

        //#region // create life status for hud

        //inst life point sprite
        this.lifeSprite = assetManager.getSprite("assets", "Astronaught/idle-nocolor", 20, 87);
        this.scaleMe(2);
        this.lifeStatus.addChild(this.lifeSprite);
        
        //inst bmp
        this.bmpTxtScore = new createjs.BitmapText("0", assetManager.getSpriteSheet("glyphs"));
        this.bmpTxtScore.letterSpacing = 2;
        this.bmpTxtScore.scaleX = .7;
        this.bmpTxtScore.scaleY = .7;
        this.bmpTxtScore.x = 40;
        this.bmpTxtScore.y = 65;
        this.lifeStatus.addChild(this.bmpTxtScore);

        hud.addChildAt(this.lifeStatus, GUI.LIFE); // add container to container
        //#endregion
        //#region Create Sprite for run animation
        this.titleRun = assetManager.getSprite("assets", "Astronaught/Run/sideRunning", 0, 0);
        this.titleRun.play();
        this.titleRun.scaleX = 2.3;
        this.titleRun.scaleY = 2.3;
        this.titleRun.x = STAGE_WIDTH/2;
        this.titleRun.y =  STAGE_HEIGHT/2+this.titleRun.getBounds().height; 
                
        mainMenu.addChild(this.titleRun);
        //#endregion
        
        //event
        this.eventSpacebarUseItem = new createjs.Event("onUseItem", true, false);

        this.sprite.visible = false;
    }
    
    //#region // ----- gets/sets
    get Jumping():boolean { return this._timeToJump; }//        [ used in various Platforms ]
    set Jumping(value:boolean) { this._timeToJump = value;}
    get power():number { return this._jumpPower; }
    set power(value:number) { this._jumpPower = value; }//      [___________________________]
    get weight():number { return this._jumpWeight; } //             [ used in various items ]
    set weight(value:number) { this._jumpWeight = value; }
    get gravity():number { return this._fallingGravity; }
    set gravity(value:number) { this._fallingGravity = value; }//   [_______________________]
    set scrollHeight(value:boolean) {this._scrollHeight = value;}
    set spacebarIsPressed(value:boolean) { this._spacebarIsPressed = value; }
    set mouseX(value:number) { this._mouseX = value; }
    set mouseY(value:number) { this._mouseY = value; }
    get readyToSpawn():boolean { return this._readyToSpawn; }
    //#endregion ----- (all private fields are accessed, in different areas)

    // ----- private methods
    private MoveWithMouse(e:createjs.Event) {
        e.target.x = this.stage.mouseX;
    }
    private JumpOnPlatform() {
        //setup jump // only if on platform
        if (this._timeToJump){
            this._movementSpeed = this._jumpPower; // set speed to 'jump'power
            this._timeToJump = false;
            
            //set to animation when it's time to jump so it starts once
            this._sprite.gotoAndPlay("Astronaught/Jump/Jump");

            //
            this._sprite.on("animationend", (e:createjs.Event) => {
                this._sprite.stop();
                e.remove();
            });

            //refresh jump power
            if (this._jumpPower != PLAYER_POWER ) {
                this._jumpPower = PLAYER_POWER; 
            }
        }

        //JUMP // only accelerate up if not at scrollheight
        if (!this._scrollHeight) {
            this._sprite.y -= this._movementSpeed;
        }
        this._movementSpeed -= this._jumpWeight; // decrease jump speed by character 'jump'weight to reach "maxheight"

        // reach the jump height
        if (this._movementSpeed <= 0){ // 0 detects the "maxheight"
            this._direction = DIRECTION.DOWN;
            this._timeToFall = true;
            //console.log();
        }
    }
    private Fall() {
        if (this._timeToFall) {
            this._sprite.gotoAndPlay("Astronaught/Falling/fallingGhost");
            this._timeToFall = false;
        }
        this._sprite.y += this._movementSpeed;
        this._movementSpeed += this._fallingGravity; // increase fall speed by 'falling'Gravity
        this._scrollHeight = false;
        // set animation to normal from iframe []
    }
    private detectEdges() {
        if (this._sprite.x <= this._sprite.getBounds().width) {
            this._sprite.x = this._sprite.getBounds().width;
        }
        else if (this._sprite.x >= (STAGE_WIDTH - this._sprite.getBounds().width)) {
            this._sprite.x = (STAGE_WIDTH - this._sprite.getBounds().width);
        }
    }
    private StartIFrames() { // uses tween to create timer for invincibility
        //set animation
        this._iFrames = true;
        createjs.Tween.get(this._sprite).to({alpha:.3}, 200).call( () => {
            createjs.Tween.get(this._sprite).to({alpha:1}, 900).call( () => {
                createjs.Tween.get(this._sprite).to({alpha:.3}, 400).call( () => {
                    createjs.Tween.get(this._sprite).to({alpha:1}, 600).call( () => {
                        this._iFrames = false;
                    });
                });
            });
        });
    }
    private CheckForRetry() { // checks to set game state
        if (this._life > 0) {
            this._state = STATE.HURT;
            this._direction = DIRECTION.NULL;
        }
    }
    private CheckForGameOver() {
        if (this._life == 0) {
            console.log("Call GAMEOVER");
            this._state = STATE.DYING;
        }
    }
    private MoveTowardsMouse() { //used in retryAnimation
        
        // use basic XY follow AI

        let moveOnY:boolean; // if /true = y/ else /false = x/
        this._movementSpeed = 7

        //dont move
        if (this._sprite.x >= this._mouseX-this.range && this._sprite.x <= this._mouseX+this.range && this._sprite.y >= this._mouseY-this.range && this._sprite.y <= this._mouseY+this.range)
        {
            this._direction = DIRECTION.NULL;
        }
        else
        {
            //#region// the idea of this code is that it creates a x & y axis,
            // with players.x/y at the origin and checks which quadrent of the
            // new grid the mouse is in, then depending on wheither it's closer
            // to the horizontal plane or vertical plane it moves accordingly
            if (this._sprite.y == this._mouseY) {
                moveOnY = false;
            }
            else if (this._sprite.x == this._mouseX) {
                moveOnY = true;
            }
            else {
                // creates a grid with player.sprite location at 0,0 
                // x,-y = 0 // x, y = 1 // -x, -y = 2 // -x, y = 3 //
                let quadrent:number = 0; //0 <NW compass orientation to help explain

                // finding the quadrent with the player
                if (this._mouseX > this._sprite.x) {
                    quadrent = 1; // <NE
                    if (this._mouseY > this._sprite.y)
                    {
                        quadrent = 3; // <SE
                    }

                }
                else if (this._mouseY > this._sprite.y) {
                    quadrent = 2; // <SW
                }
                
                //check quadrents for which direction to move
                if (quadrent == 0)
                {
                    if ((this._sprite.x - this._mouseX) <= (this._sprite.y - this._mouseY))
                    {
                        moveOnY = true;
                    }
                    else { moveOnY = false; }
                }
                else if (quadrent == 1)
                {
                    if ((this._mouseX - this._sprite.x) <= (this._sprite.y - this._mouseY))
                    {
                        moveOnY = true;
                    }
                    else { moveOnY = false; }
                }
                else if (quadrent == 2)
                {
                    if ((this._sprite.x - this._mouseX) <= (this._mouseY - this._sprite.y))
                    {
                        moveOnY = true;
                    }
                    else { moveOnY = false; }
                }
                else if (quadrent == 3)
                {
                    if ((this._mouseX - this._sprite.x) <= (this._mouseY - this._sprite.y))
                    {
                        moveOnY = true;
                    }
                    else { moveOnY = false; }
                }
            }
            //#endregion

            // check direction in which to move axis
            if (moveOnY == false)
            {
                if (this._mouseX > this._sprite.x)
                {
                    this._direction = DIRECTION.RIGHT;
                }
                else
                {
                    this._direction = DIRECTION.LEFT;
                }
            }
            else
            {
                if (this._mouseY > this._sprite.y)
                {
                    this._direction = DIRECTION.DOWN;
                }
                else
                {
                    this._direction = DIRECTION.UP;
                }
            }

        }
    }
    private AdjustRetryMovementSpeed() { // child of MoveTowardsMouse

    }

    // ----- public methods
    public AddMouseMovementController() {
        
        // add mouse controller to sprite // try pointer lock
        this._sprite.on("pressmove", this.MoveWithMouse);
        //check mouse pos                                                               // debug
        // this.stage.on("stagemousemove", () => {
        //     console.log("stage X/Y : "+ this.stage.mouseX +" "+this.stage.mouseY );  // debug
        // });

    }
    public HitPlatform(platform:Platform) {
        if ( //  to edit; remove player.update from game loop & add ", this.stage" to the end of every parameter of point hit
        pointHit(this._sprite, platform.sprite, -6, 14)||
        pointHit(this._sprite, platform.sprite, 6, 14 )||
        pointHit(this._sprite, platform.sprite, 0, 9  )||
        pointHit(this._sprite, platform.sprite, 0, 14 )){
            
            this.gainedPoints = platform.GivePoints();
            
            platform.UseAbility(this);
            
            platform.sprite.dispatchEvent(platform.eventPlayerOnPlatform);
        }
    }
    public GainLife(value:number) { // used in 1up type items
        if (value < 0) { // check for negative
            value * -1;//change to +
        }
        this._life += value;
    }
    public LoseLifeGainIFrames(livesLost:number) {
        
        if (!this._iFrames) { // only lose lives if iframes arent active
            if (livesLost < 0) { // check for negative
                livesLost * -1;//change to +
            }
            this._life -= livesLost; // remove value from life
            this.StartIFrames();
        }
        //console.log("checking GAMEOVER");
        this.CheckForGameOver();
    }
    public LoseLifeRetry(livesLost:number) {
        if (this._state != STATE.HURT && this._state != STATE.DYING) {
            if (livesLost < 0) { // check for negative
                livesLost * -1;//change to +
            }
            this._life -= livesLost; // remove value from life
            this.CheckForRetry();
            this.CheckForGameOver();
        }
    }
    public RetryStateAnimation() { 

        let animating:boolean;

        this._sprite.stop();
        this.MoveTowardsMouse();
        
        if (!animating) {
            // play animation
            animating = true;
            createjs.Tween.get(this._sprite).to({alpha:.3}, 200).call( () => {
                createjs.Tween.get(this._sprite).to({alpha:1}, 900).call( () => {
                    createjs.Tween.get(this._sprite).to({alpha:.3}, 400).call( () => {
                        createjs.Tween.get(this._sprite).to({alpha:1}, 600).call( () => {
                            animating = false;      
                        });
                    });
                });
            });
        }
        else if (animating != true) {
            animating = false;
        } 
    }
    
    
    public Update() { // named due to passed field
        
        this.detectEdges();
        
        //update life count
        if (this._life >= 0) { // only show 0 and above
            this.bmpTxtScore.text = this._life.toString();
        }

        if (this._state == STATE.ACTIVE) {
            
            // press space // used to use item
            if (this._spacebarIsPressed) {
                this.stage.dispatchEvent(this.eventSpacebarUseItem);
                this._spacebarIsPressed = false;
            }
                
            // jumping
            if (this._direction == DIRECTION.UP){
                this.JumpOnPlatform();
            }
            
            // falling ----- // player is expected to start on a type of platform calling jump immediately
            if (this._direction == DIRECTION.DOWN){
                this.Fall();
            }
            
            // Bottom Death Box
            if (this._sprite.y > STAGE_HEIGHT+(this._sprite.getBounds().height/2)) {
                this.LoseLifeRetry(1);
            }
            
            this.CheckForGameOver();
        }
        else if (this._state == STATE.HURT) { // fallen
            this.RetryStateAnimation();
            super.Update();
        }
    }
}