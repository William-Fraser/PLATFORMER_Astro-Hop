import Enemy from "../Characters/Enemy";
import Player from "../Characters/Player";
import AssetManager from "../Managers/AssetManager";
import EnemyManager from "../Managers/EnemyManager";
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
    private _display:createjs.Container;
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

        this._display = new createjs.Container();
        gui.addChild(this._display);

        //inst inventorySquare sprite
        this.inventorySquare = assetManager.getSprite("assets", "Display/InventoryBox", 5, 5);
        this.inventorySquare.scaleX = 1.8;
        this.inventorySquare.scaleY = 1.8;
        this._display.addChildAt(this.inventorySquare, 0);

        //inst inventory item sprite
        this.inventoryItemInUse = assetManager.getSprite("assets", "Display/InventoryBox", 0, 0);
        // this.inventoryItemInUse.play();
        // this.inventoryItemInUse.scaleX = 2.3;
        // this.inventoryItemInUse.scaleY = 2.3;
        // this.inventoryItemInUse.x = STAGE_WIDTH/2;
        // this.inventoryItemInUse.y =  STAGE_HEIGHT/2+this.titleRun.getBounds().height; 
         
    }

    // ----- gets/sets
    get activeItem():Item { return this._activeItemHold; }
    get savedItem():Item { return this._savedItemHold; }
    get display():createjs.Container { return this._display; }
    get itemInUse():createjs.Sprite { return this.inventoryItemInUse; }
    
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
        this._display.removeChild(this._activeItemHold.sprite);
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
            this._display.addChildAt(this._savedItemHold.sprite, 1);
        }
        else if (this._activeItemHold == null) {
            this._activeItemHold = item;
            this._activeItemHold.state = STATE.IDLE;
            this._activeItemHold.itemForm = FORM.SPRITE;
            this.SetInUseSprite();
            this._display.addChildAt(this._activeItemHold.sprite, 2);
        } else { 
            item.state = STATE.GONE;
            //do nothing but remove the item from the stage // handled by item
        }
    }
    public RestartInventory() {
        this._savedItemDisplayOnce = null;
        if (this._savedItemHold.sprite.isVisible() == true) {
            this._savedItemHold.sprite.visible = false;
        }
        this._savedItemHold = null;
        this._activeItemHold = null;
        console.log("nulling inventory");
    }

    public Update(player:Player) {
        
        //console.log(`active: ${this._activeItemHold}, saved: ${this._savedItemHold}`);
        if (this._activeItemHold != null) {
            
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
            this._savedItemHold.sprite.x = 34;
            this._savedItemHold.sprite.y = 34;
        }
    }
} 