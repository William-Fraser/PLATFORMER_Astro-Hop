import Player from "../Characters/Player";
import AssetManager from "../Managers/AssetManager";
import { boxHit } from "../Toolkit";
import GameObject from "./GameObject";

export enum TYPE {
    NULL,
    FIREBALL,
    TOTALNUMBER// TOTALNUM like NULL has no actual value it only holds the total number of arguments due to it being at the end of the enum
}
export enum FORM {
    SPRITE,
    INUSE
}
export default class Item extends GameObject {

    //init protected fields
    protected _itemForm:FORM;
    protected _itemType:TYPE;

    //init event 
    private eventPlayerPickUpItem:createjs.Event;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //init itemform

        //init event
        this.eventPlayerPickUpItem = new createjs.Event("onPickup", true, false);

        //child creates sprite
        // this._sprite = assetManager.getSprite("assets", "spriteplaceholder", 0, 0);
        // this._sprite.play();
        // stage.addChild(this._sprite);
    }
    // ----- gets/sets
    get itemForm():FORM { return this._itemForm; }
    set itemForm( value:FORM ) { this._itemForm = value; }
    get itemType():TYPE { return this._itemType }
    set itemType( value:TYPE ) { this._itemType = value; }

    // ----- private methods
    private DetectPickup(player:Player):void {
        //if hitbox dispatch event and Remove Item
        if (boxHit(player.sprite, this._sprite)) {
            this._sprite.dispatchEvent(this.eventPlayerPickUpItem);
            this.RemoveItemObject();
        }
    }
    private RemoveItemObject():void {
        this.stage.removeChild(this._sprite);
        this.positionMe(0,0);
    }

    // ----- public methods
    public UseItem(player:Player) {
        console.log("effect item/no active use") ;
        //Overloaded method
    }

    public ItemUpdate(player:Player):void { // named due to no method overloading in JS
        super.Update(); // calls super anyways
        
        // only pickup if not in use, player cant reach item if displayed in inventory
        if (this._itemForm != FORM.INUSE) {
            this.DetectPickup(player);
            //console.log("this reaches"); // debug
        }
    }
}