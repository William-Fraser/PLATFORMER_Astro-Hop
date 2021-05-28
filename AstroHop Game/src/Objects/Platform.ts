import AssetManager from "../Managers/AssetManager";
import GameObject, { STATE } from "./GameObject";
import Player from "../Characters/Player";
import { DIRECTION } from "../Characters/GameCharacter";

export default class Platform extends GameObject {

    // private fields
    private _landOnce:boolean; // used to add platform to score
    
    // protected fields
    protected _scoreValue:number; // the worth of a platform defaults to 1
    protected _enemyFree:boolean // enemies wont spawn on this platform 

    // events
    public eventPlayerOnPlatform:createjs.Event; // platform event called in player class on hit
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager, spriteOrAnimation:string) {
        super(stage, assetManager);

        //inst private var
        this._landOnce = false;

        //inst protected field
        this._scoreValue = 1; // default/ child can reinst

        //inst event
        this.eventPlayerOnPlatform = new createjs.Event("onPlatform", true, false);
        
        //create sprite // move to individual classes
        this._sprite = assetManager.getSprite("assets", spriteOrAnimation, 0, 0);
        this._sprite.play();
        stage.addChild(this._sprite);
    }   

    // ----- gets/sets
    get enemyFree():boolean { return this._enemyFree; }
    get landOnce():boolean {
        return this._landOnce;
    }
    set landOnce(value:boolean) {
        this._landOnce = value;
    }
    get scoreValue():number {
        return this._scoreValue;
    }

    // ----- private methods
    private DetectPlayerLanding(player:Player):void {   
        if (player.direction == DIRECTION.DOWN) {
        
            player.HitPlatform(this);
        }
    }

    // ----- public methods
    public GivePoints():number {
        // if this is the first time hitting the platform add points // could be its own method?
        if (!this.landOnce) {
            //console.debug("landOnce");
            //score.Add(1);
            this.landOnce = true;
            
            return this.scoreValue;
        }
        return 0;
    }
    public UseAbility(player:Player) {
        //overloaded method
    }

    public PlatformUpdate(player:Player):void { // named due to no method overloading in JS
        if (this._state == STATE.GONE) {return};
        super.Update(); // calls super anyways
        
        // only activate if player is not already jumping
        if (!player.Jumping) {
            //console.log("this reaches"); // debug
            this.DetectPlayerLanding(player);
        }
    }
}