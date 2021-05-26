import Player from "../Characters/Player";
import AssetManager from "../Managers/AssetManager";
import { STATE } from "../Objects/GameObject";
import Item, { TYPE, FORM } from "../Objects/Item";
import Fireball from "../Objects/Items/Fireball";
import OneUP from "../Objects/Items/OneUP";

export default class InventorySystem {

    // init private fields
    private _activeItemHold:Item;
    private _savedItemHold:Item;
    private _savedItemDisplayOnce:Item;

    //gui sprite
    private inventorySquare:createjs.Sprite;
    private inventoryItemInUse:createjs.Sprite;

    //passed global
    stage:createjs.StageGL;
    assetManager:AssetManager;

    constructor(stage:createjs.StageGL, gui:createjs.Container, assetManager:AssetManager){
        
        //inst private fields
        this._savedItemDisplayOnce = null;
        this._savedItemHold = null;
        this._activeItemHold = null;

        //inst global
        this.stage = stage;
        this.assetManager = assetManager;

        //inst inventorySquare sprite

        //inst inventory item sprite
        this.inventoryItemInUse = assetManager.getSprite("assets", "Astronaught/Run/sideRunning", 0, 0);
        // this.inventoryItemInUse.play();
        // this.inventoryItemInUse.scaleX = 2.3;
        // this.inventoryItemInUse.scaleY = 2.3;
        // this.inventoryItemInUse.x = STAGE_WIDTH/2;
        // this.inventoryItemInUse.y =  STAGE_HEIGHT/2+this.titleRun.getBounds().height; 
         
    }

    // ----- gets/sets
    get activeItem():Item { return this._activeItemHold; }
    get savedItem():Item { return this._savedItemHold; }
    
    // ----- private methods
    private UseActiveItem(player:Player) {
        console.log("using activeItem");
        
        this.inventoryItemInUse.play();
        this._activeItemHold.UseItem(player);
    }
    private UseSavedItem() {
        //this.stage.removeChild(this._ItemHold[this._savedItemIdentity].sprite);
        this._activeItemHold = this._savedItemHold;
        this._activeItemHold.itemForm = FORM.INUSE;
        //get sprite to display for active
        this.inventoryItemInUse = this._activeItemHold.sprite;
        this._savedItemHold = null; // set saved Item to NULL
        console.log("used savedItem");
    }
    private CheckToRemoveActiveItem() {
        if (this._activeItemHold.state == STATE.GONE) {
            console.log("used up all of activeItem");
            this.RemoveActiveItem();
        }
    }
    private RemoveActiveItem() {
        this.stage.removeChild(this._activeItemHold.sprite);
        this._activeItemHold = null;
    }
    private SetInUseSprite() {
        //get sprite to display for active
        this.inventoryItemInUse = this._activeItemHold.sprite;
    }

    // ----- public methods
    public CheckToPullSavedItem() {
        if (this._activeItemHold == null && this._savedItemHold != null) {
            this.UseSavedItem();
        }
    }
    public CheckToUseActiveItem(player:Player) {
        if (this._activeItemHold != null) {
            this.UseActiveItem(player);            
        } 
    }
    public AddItemToOpenHold(item:Item) {
        if (this._savedItemHold == null) {
            this._savedItemHold = item;
            this._savedItemHold.state = STATE.IDLE;
            this._savedItemHold.itemForm = FORM.SPRITE;
            this.stage.addChildAt(this._savedItemHold.sprite, 7);
        }
        else if (this._activeItemHold == null) {
            this._activeItemHold = item;
            this._activeItemHold.state = STATE.IDLE;
            this._activeItemHold.itemForm = FORM.SPRITE;
            this.SetInUseSprite();
            this.stage.addChildAt(this._activeItemHold.sprite, 7);
        } else { 
            item.state = STATE.GONE;
            //do nothing but remove the item from the stage // handled by item
        }
    }

    public Update(player:Player) {
        
        //console.log(`active: ${this._activeItemHold}, saved: ${this._savedItemHold}`);
        if (this._activeItemHold != null) {
            //update item for use movement animation
            this._activeItemHold.ItemUpdate(player); 
            
            if (this._activeItemHold.state == STATE.IDLE) {
                this._activeItemHold.itemForm = FORM.SPRITE;
                this._activeItemHold.positionMe(player.X, player.Y-50);
            } else {
                this._activeItemHold.itemForm = FORM.INUSE;
            }

            //remove if item is state.gone
            this.CheckToRemoveActiveItem();
        }
        else {
            this.inventoryItemInUse.stop();
            this.inventoryItemInUse.x = -200;
        }

        if (this._savedItemHold != null) {
            // position sprite into inventory
            this._savedItemHold.sprite.x = 35;
            this._savedItemHold.sprite.y = 35;
        }
    }
} 