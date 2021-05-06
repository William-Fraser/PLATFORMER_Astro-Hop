import AssetManager from "../Managers/AssetManager";
import GameObject from "./GameObject";
import Player from "../Characters/Player";
import { pointHit } from "../Managers/Toolkit";

export default class Platform extends GameObject {

    // ----- event
    private eventPlayerOnPlatform:createjs.Event;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, spriteOrAnimation:string, PosX:number, PosY:number) {
        super(stage, assetManager);

        //init event
        this.eventPlayerOnPlatform = new createjs.Event("onPlatform", true, false);

        //create sprite
        this._sprite = assetManager.getSprite("assets", spriteOrAnimation, PosX, PosY);
        this._sprite.play();
        stage.addChild(this._sprite);
    }    

    // ----- private methods
    private DetectPlayerLanding(player:Player):void {

        if (pointHit(player.sprite, this._sprite, -6, 14 )||
            pointHit(player.sprite, this._sprite, 6, 14 ) ||
            pointHit(player.sprite, this._sprite, 0, 11 ) ||
            pointHit(player.sprite, this._sprite, 0, 14 )) {
                this.stage.dispatchEvent(this.eventPlayerOnPlatform);
        }
    }

    // ----- public methods
    public PlatformUpdate(player:Player):void { // named due to no method overloading in JS
        super.Update(); // calls super anyways
        
        // only activate if player is not already jumping
        if (!player.Jumping) {
            //console.log("this reaches"); // debug
            this.DetectPlayerLanding(player);
        }
    }
}