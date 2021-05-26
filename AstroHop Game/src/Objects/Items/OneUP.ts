import Player from "../../Characters/Player";
import AssetManager from "../../Managers/AssetManager";
import { boxHit } from "../../Toolkit";
import Item, { FORM, TYPE } from "../Item";

export default class OneUP extends Item {
    
    //init private fields
    private _lifeUp:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst protected fields
        this._itemType = TYPE.ONEUP;
        
        //inst private fields
        this._lifeUp = 1;

        //inst animation
        this._sprite = assetManager.getSprite("assets", "Astronaught/idle-nocolor", 0, 0);
        stage.addChild(this._sprite);
    }

    // ----- private methods
    private LifeDetectPickup(player:Player):void {
        //if hitbox dispatch event and Remove Item
        if (boxHit(player.sprite, this._sprite)) {
            this.UseItem(player);
            this.RemoveItemObject();
        }
    }
    // ----- public methods
    public UseItem(player:Player) {
        player.GainLife(this._lifeUp);
    }

    public ItemUpdate(player:Player):void { // identical to Item.ItemUpdate however this calls the new DetectPickup for adding the life immediately
        super.Update(); // calls super anyways
        
        // only pickup if pickupform
        if (this._itemForm == FORM.PICKUP) {
            this.LifeDetectPickup(player);
            //console.log("this reaches"); // debug
        }
    }
}