import AssetManager from "../../Managers/AssetManager";
import Player from "../../Characters/Player";
import Item, { FORM, TYPE } from "../Item";
import { STATE } from "../GameObject";
import { STAGE_HEIGHT } from "../../Constants";

export default class Fireball extends Item {

    //init private fields
    private _readyToFire:boolean;
    private _bulletSpeed:number;
    private _ammo:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst protected fields
        this._itemType = TYPE.FIREBALL;
        
        //inst private fields
        this._readyToFire = true;
        // set up with constants when changed into blaster
        this._bulletSpeed = 10;
        this._ammo = 3;

        //inst sprite/animation
        this._sprite = assetManager.getSprite("assets", "fireball/attack", 0, 0);
        this.scaleMe(2);
        stage.addChild(this._sprite);
    }

    // ----- public methods 
    public UseItem(player:Player) { // overloaded method
        if (this._readyToFire && this._ammo > 0) {
            console.log("fireball shot") ;
            this._readyToFire = false; // fire gun and set ready to fire to false to prevent resetting bullet
            this.positionMe(player.sprite.x, player.sprite.y-50);
            this._ammo--;
            console.log(this._ammo);
        }
    }   
    
    public ItemUpdate(player:Player):void {
        super.ItemUpdate(player);

        //reset fire to use again
        if (this._sprite.y < -this._sprite.getBounds().height) {
            this.idleMe();
            this._readyToFire = true;
            console.log("ready to fire");
            this._sprite.y = 700; // spawn shot below registry point so it doesn't call code constantly
            
            // if ammo is 0 weapon is gone
            if (this._ammo == 0) {
                this._state = STATE.GONE;
            }
        }

        if (this._itemForm == FORM.SPRITE) {
            this.idleMe();
            this.startMe();
        }
        else if (this._itemForm == FORM.INUSE) {
            // fire one shot // use readyToFire to stop respawning sprite
            if (!this._readyToFire) {
                this._sprite.y -= this._bulletSpeed;
            } else {
                this.positionMe(player.X, player.Y-50);
            }
        }
    }
}