import AssetManager from "../../Managers/AssetManager";
import Player from "../../Characters/Player";
import Item, { FORM, TYPE } from "../Item";
import { STATE } from "../GameObject";
import { STAGE_HEIGHT } from "../../Constants";
import Enemy from "../../Characters/Enemy";
import { boxHit, pointHit } from "../../Toolkit";
import InventorySystem from "../../Systems/InventorySystem";

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

    // ----- private methods
    private Attack(enemy:Enemy, inventory:InventorySystem) {
        //console.log(enemy.sprite);
        if (pointHit(inventory.activeItem.sprite, enemy.sprite)) {
            enemy.killMe();
            
        }
    }

    // ----- public methods 
    public UseItem(player:Player) { // overloaded method
        if (this._readyToFire && this._ammo > 0) {
            console.log("fireball shot") ;
            this._ammo--;
            this._readyToFire = false; // fire gun and set ready to fire to false to prevent resetting bullet
            this.positionMe(player.sprite.x, player.sprite.y-50);
            console.log(this._ammo);
            
        }
    }   
    
    public ItemUpdate(player:Player, enemy:Enemy, inventory:InventorySystem):void {
        super.ItemUpdate(player, null, null);

        //reset fire to use again
        if (this._sprite.y < -this._sprite.getBounds().height) {
            
            this.idleMe();
            this._readyToFire = true;
            console.log("ready to fire");
            
            // if ammo is 0 weapon is gone
            if (this._ammo == 0) {
                this._state = STATE.GONE;
            }
        }

        if (this._itemForm == FORM.SPRITE) {
            this.idleMe();
            this.startMe();
        }
        else if (this._itemForm == FORM.INUSE && this._state != STATE.GONE) {
            
            // fire one shot // use readyToFire to stop respawning sprite
            if (!this._readyToFire) {
                this.Attack(enemy, inventory)
                this._sprite.y -= this._bulletSpeed;
            } else {
                //respawn 'idle' sprite
                this.positionMe(player.X, player.Y-50);
                this._bulletSpeed = 10;
            }
        }
    }
}