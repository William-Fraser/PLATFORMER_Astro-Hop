import Player from "../Characters/Player";
import AssetManager from "../Managers/AssetManager";
import { boxHit } from "../Managers/Toolkit";
import GameObject from "./GameObject";

export default class Item extends GameObject {

    // ----- event 
    private eventPlayerPickUpItem:createjs.Event;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //init event
        this.eventPlayerPickUpItem = new createjs.Event("onPickup", true, false);

        //child creates sprite
        // this._sprite = assetManager.getSprite("assets", "spriteplaceholder", 0, 0);
        // this._sprite.play();
        // stage.addChild(this._sprite);
    }

    // ----- private methods
    private DetectPickup(player:Player):void {
        //if hitbox dispatch event and Remove Item
        if (boxHit(player.sprite, this._sprite)) {
            this.stage.dispatchEvent(this.eventPlayerPickUpItem);
            this.RemoveItemObject();
        }
    }
    private RemoveItemObject():void {
        this.idleMe();
        this.stage.removeChild(this._sprite);
    }

    // ----- public methods
    public ItemUpdate(player:Player):void { // named due to no method overloading in JS
        super.Update(); // calls super anyways
        
        // only activate if player is not already jumping
        if (!player.Jumping) {
            //console.log("this reaches"); // debug
            this.DetectPickup(player);
        }
    }
}