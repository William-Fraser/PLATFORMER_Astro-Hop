import AssetManager from "../Managers/AssetManager";
import GameObject, { STATE } from "./GameObject";
import Player from "../Characters/Player";
import { pointHit } from "../Toolkit";

export default class Platform extends GameObject {

    // private fields
    private _landOnce:boolean; // used to add platform to score
    
    // protected fields
    protected _scoreValue:number; // the worth of a platform defaults to 1

    // events
    public eventPlayerOnPlatform:createjs.Event; // platform event called in player class on hit
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager, spriteOrAnimation:string, PosX:number, PosY:number) {
        super(stage, assetManager);

        //inst private var
        this._landOnce = false;

        //inst protected field
        this._scoreValue = 1; // default/ child can reinst

        //inst event
        this.eventPlayerOnPlatform = new createjs.Event("onPlatform", true, false);
        
        //create sprite // move to individual classes
        this._sprite = assetManager.getSprite("assets", spriteOrAnimation, PosX, PosY);
        this._sprite.play();
        stage.addChild(this._sprite);
    }   

    // ----- gets/sets
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
        player.PlatformHit(this);
    }

    // ----- public methods
    public UseAbility() {
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