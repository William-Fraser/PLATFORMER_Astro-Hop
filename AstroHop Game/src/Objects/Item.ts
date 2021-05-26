import Player from "../Characters/Player";
import AssetManager from "../Managers/AssetManager";
import { boxHit } from "../Toolkit";
import GameObject, { STATE } from "./GameObject";

export enum TYPE {
    NULL,
    ONEUP,
    JETPACK,
    FORCEFIELD,
    FIREBALL
}
export enum FORM {
    PICKUP,
    SPRITE,
    INUSE
}
export default class Item extends GameObject {

    //init private fields
    private _beingPickedUp:boolean; // field that determines what item in an array should be added to inventory

    //init protected fields
    protected _itemForm:FORM;
    protected _itemType:TYPE;

    //init event 
    private eventPlayerPickUpItem:createjs.Event;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst private fields
        this._beingPickedUp = false;

        //inst itemform
        this._itemForm = FORM.PICKUP;

        //inst event
        this.eventPlayerPickUpItem = new createjs.Event("onPickup", true, false);

        //child creates sprite
        // this._sprite = assetManager.getSprite("assets", "spriteplaceholder", 0, 0);
        // this._sprite.play();
        // stage.addChild(this._sprite);
    }
    // ----- gets/sets
    get special():boolean { return null; }// used to pass important fields from child class'
    get beingPickedUp():boolean { return this._beingPickedUp; }
    set beingPickedUp(value:boolean) { this._beingPickedUp = value; }
    get itemForm():FORM { return this._itemForm; }
    set itemForm( value:FORM ) { this._itemForm = value; }
    get itemType():TYPE { return this._itemType }
    set itemType( value:TYPE ) { this._itemType = value; }

    // ----- private methods
    private DetectPickup(player:Player):void {
        //if hitbox dispatch event and Remove Item
        if (boxHit(player.sprite, this._sprite)) {
            this._beingPickedUp = true;
            this._state = STATE.ACTIVE
            this._sprite.dispatchEvent(this.eventPlayerPickUpItem);
            //this.RemoveItemObject();
        }
    }
    protected RemoveItemObject():void {
        this.stage.removeChild(this._sprite);
        this.positionMe(0,0);
    }

    // ----- public methods
    public UseItem(player:Player) {
        console.log("effect item/no active use") ;
        console.log(", this is the Item default message");
        this._state = STATE.GONE;
        //Overloaded method
    }

    public ItemUpdate(player:Player):void { // named due to no method overloading in JS
        super.Update(); // calls super anyways
        
        // only pickup if pickupform
        if (this._itemForm == FORM.PICKUP) {
            this.DetectPickup(player);
            //console.log("this reaches"); // debug
        }
    }
}