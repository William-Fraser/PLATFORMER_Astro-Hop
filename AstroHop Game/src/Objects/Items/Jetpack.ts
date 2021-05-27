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
    private fire:boolean; // bool decides if sprite should be fire/ comes after launch

    constructor (stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager); 

        // isnt protected fields
        this._itemForm = FORM.PICKUP;
        this._itemType = TYPE.JETPACK;

        //inst private fields
        this._power = POWER;
        this._weight = WEIGHT;
        this.launched = false;
        this.fire = false;

        //isnt animation
        this._sprite = assetManager.getSprite("assets", "Items/JetPack", 0, 0);
        this.startMe();
        this.scaleMe(2.5);
        stage.addChildAt(this._sprite, 3);
    }

    // ----- gets/sets
    get special():boolean { return this.launched; }

    // ----- public methods
    public UseItem(player:Player) { 
        if (!this.launched) {
            this.launched = true;
            player.Jumping = true;
            player.iFrames = true;
            player.activeItem = TYPE.JETPACK;
            player.power = this._power;
            player.weight = this._weight;
            player.direction = DIRECTION.UP;
            this._state = STATE.ACTIVE;
        }
    }

    public ItemUpdate(player:Player) {

        super.ItemUpdate(player, null, null);
 
        if (this._itemForm == FORM.SPRITE) {
            this._sprite.gotoAndStop("Items/JetPack");
        }   
        else if (this._itemForm == FORM.INUSE) {
            if (!this.fire) {
                this._sprite.gotoAndPlay("fireball/attack");
                this.scaleMe(5);
                this.fire = true;
            }
            this.positionMe(player.X, player.Y+53);
            player.gainedPoints = 1;

            // after pack is done return to normal
            if (player.direction == DIRECTION.DOWN) {
                this.state = STATE.GONE;
                player.gainedPoints = 0;
                player.activeItem = TYPE.NULL;
                player.iFrames = false;
            }
        }
    }
}