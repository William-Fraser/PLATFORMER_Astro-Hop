import Player from "../Characters/Player";
import AssetManager from "../Managers/AssetManager";
import { STATE } from "../Objects/GameObject";
import Item, { TYPE, FORM } from "../Objects/Item";
import Fireball from "../Objects/Items/Fireball";

export default class InventorySystem {

    private _ItemHold:Item[];
    private _activeItemIdentity:TYPE;
    private _savedItemIdentity:TYPE; 
    private savedItemDisplayOnce:TYPE;

    //passed global
    stage:createjs.StageGL;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, placeHolderParameter:Fireball) { // replace with array of items
        
        //init private fields
        this._ItemHold = new Array(TYPE.TOTALNUMBER);
        this._activeItemIdentity = TYPE.NULL;
        this._savedItemIdentity = TYPE.NULL;
        this.savedItemDisplayOnce = TYPE.NULL;

        //init global
        this.stage = stage;

        //init inventorySquare sprite


        //init itemHold Items
        this._ItemHold[TYPE.FIREBALL] = placeHolderParameter;
    }
    // ----- gets/sets
    set savedItem(value:TYPE) { this._savedItemIdentity = value; }
    
    // ----- private methods
    private UseActiveItem(player:Player) {
        if (this._activeItemIdentity != TYPE.NULL){
            console.log("used activeItem") ;
            this._ItemHold[this._activeItemIdentity].UseItem(player);
        }
    }
    private UseSavedItem() {
        //this.stage.removeChild(this._ItemHold[this._savedItemIdentity].sprite);
        this._activeItemIdentity = this._savedItemIdentity;
        this._savedItemIdentity = TYPE.NULL; // set saved Item to NULL
        console.log("used savedItem");
    }
    private CheckToRemoveActiveItem() {
        if (this._ItemHold[this._activeItemIdentity].state == STATE.GONE) {
            this.RemoveActiveItem();
        }
    }
    private RemoveActiveItem() {
        this.stage.removeChild(this._ItemHold[this._activeItemIdentity].sprite);
        this._activeItemIdentity = TYPE.NULL
        console.log("used up all of activeItem");
    }

    // ----- public methods
    public CheckToPullSavedItem() {
        if (this._activeItemIdentity == TYPE.NULL && this._savedItemIdentity != TYPE.NULL) {
            this.UseSavedItem();
        }
    }
    public CheckToUseActiveItem(player:Player) {
        if (this._activeItemIdentity != TYPE.NULL) {
            this.UseActiveItem(player);
        } 
    }

    public Update(player:Player) {

        if (this._activeItemIdentity != TYPE.NULL) {
            //update item for movement animations
            this._ItemHold[this._activeItemIdentity].ItemUpdate(player); 
            //remove if item is state.gone
            this.CheckToRemoveActiveItem();       
        }
        //display active Item on PlayerSprite, if Item is not NULL
        if (this._activeItemIdentity != TYPE.NULL) {
            
            //update item for movement animations
            this._ItemHold[this._activeItemIdentity].ItemUpdate(player);
            // change form to InUse
            this._ItemHold[this._activeItemIdentity].itemForm = FORM.INUSE;
        }

        //display saved Item in 'inventoryBox', if Item is not NULL
        if (this._savedItemIdentity != this.savedItemDisplayOnce && this._savedItemIdentity != TYPE.NULL) {
            // change form to sprite and add it to the stage
            this._ItemHold[this._savedItemIdentity].itemForm = FORM.SPRITE;
            this.stage.addChild(this._ItemHold[this._savedItemIdentity].sprite);
            // position sprite into inventory
            this._ItemHold[this._savedItemIdentity].positionMe(20, 20);
            this.savedItemDisplayOnce = this._savedItemIdentity;
        }
    }
} 