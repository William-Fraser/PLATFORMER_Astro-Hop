import { DIRECTION } from "../../Characters/GameCharacter";
import Player from "../../Characters/Player";
import { ITEM_JETPACK_POWER as POWER, ITEM_JETPACK_WEIGHT as WEIGHT } from "../../Constants";
import AssetManager from "../../Managers/AssetManager";
import { STATE } from "../GameObject";
import Item, { FORM, TYPE } from "../Item";

export default class Jetpack extends Item {

    //init private fields
    private _power:number;
    private _weight:number;
    private launched:boolean;

    constructor (stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager); 

        // isnt protected fields
        this._itemType = TYPE.JETPACK;

        //inst private fields
        this._power = POWER;
        this._weight = WEIGHT;
        this.launched = false;

        //isnt animation
        this._sprite = assetManager.getSprite("assets", "fireball/attack", 0, 0);
        this.scaleMe(5);
        stage.addChild(this._sprite);
    }

    // ----- gets/sets
    get special():boolean { return this.launched; }

    // ----- public methods
    public UseItem(player:Player) { 
        if (!this.launched) {
            this.launched = true;
            player.Jumping = true;
            player.power = this._power;
            player.weight = this._weight;
            player.direction = DIRECTION.UP;
            this._state = STATE.ACTIVE;
        }
    }

    public ItemUpdate(player:Player) {

        super.ItemUpdate(player);

        
        // if (this._itemForm == FORM.PICKUP) {
            
            // }
            
            // else if (this._itemForm == FORM.SPRITE) {
                
                // }
                

        // else 
        //console.log(this._itemForm);
        if (this._itemForm == FORM.INUSE) {
            this.positionMe(player.X, player.Y+50);
            player.gainedPoints = 1;
            if (player.direction == DIRECTION.DOWN) {
                this.state = STATE.GONE;
                player.gainedPoints = 0;
            }
        }
    }
}