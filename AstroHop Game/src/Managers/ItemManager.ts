import Enemy from "../Characters/Enemy";
import Player from "../Characters/Player";
import { STAGE_HEIGHT } from "../Constants";
import { STATE } from "../Objects/GameObject";
import Item, { TYPE } from "../Objects/Item";
import Fireball from "../Objects/Items/Fireball";
import ForceField from "../Objects/Items/ForceField";
import Jetpack from "../Objects/Items/Jetpack";
import OneUP from "../Objects/Items/OneUP";
import InventorySystem from "../Systems/InventorySystem";
import ScoreSystem from "../Systems/ScoreSystem";
import { randomMe } from "../Toolkit";
import AssetManager from "./AssetManager";
import EnemyManager from "./EnemyManager";

export default class ItemManager {
    
    //private fields
    private itemMaker:Item;
    private _items:Array<Item>;
    private decideSpawned:number;

    //passed globals
    private stage:createjs.StageGL;
    private assetManager:AssetManager;

    constructor (stage:createjs.StageGL, assetManager:AssetManager) {

        //inst private fields
        this._items = [];

        //inst passed global fields
        this.stage = stage;
        this.assetManager = assetManager;
    }

    // ----- gets/sets
    get items():Array<Item> { return this._items; }
    set items(value:Array<Item>) { this._items = value; }

    // ----- private fields
    private Create() { 
        let created:boolean = true;
        this.decideSpawned = randomMe(0, 70);
        if (this.decideSpawned == 1) {
            this.itemMaker = new OneUP(this.stage, this.assetManager);
        }
        else if (this.decideSpawned == 2) {
            this.itemMaker = new Fireball(this.stage, this.assetManager);
        }
        else if (this.decideSpawned == 3) {
            this.itemMaker = new ForceField(this.stage, this.assetManager);   
        }
        else if (this.decideSpawned == 4) {
            this.itemMaker = new Jetpack(this.stage, this.assetManager);
        }
        else { created = false;}

        if (created) {
            this.itemMaker.positionMe(
                randomMe(
                    this.itemMaker.sprite.getBounds().width/2+100, 
                    (STAGE_HEIGHT-(this.itemMaker.sprite.getBounds().width/2))-100), 
                -this.itemMaker.sprite.getBounds().height);
            this.stage.addChildAt(this.itemMaker.sprite, 7);
            this._items.push(this.itemMaker);
            console.log("spawn new item");
        }
    }
    //#region Screenmanager checks
    private CheckToCreate() { 
        if (this._items[this._items.length-1].sprite.y > 30) { // -1 because it starts from 0 but length doesnt include a count for it
            if (randomMe(0, 40) <= 2) { // randomly spawns an item
                this.Create();
            }
            if (this._items[this._items.length-1].sprite.y > 500) {
                this.Create(); 
            }
        }
    }
    private CheckAndRemoveOnScrollOff() {
        for (let i = 0; i< this._items.length; i++){
            if (this._items[i].sprite.y >= STAGE_HEIGHT+this._items[i].sprite.getBounds().height) {
                this.stage.removeChild(this._items[i].sprite);
            }
        }
    }
    //#endregion

    // ----- public fields
    public SetupStart() {
        
        let startingItem = new Jetpack(this.stage, this.assetManager);
        startingItem.positionMe(300, 200);
        this._items.push(startingItem);

        let testingItem = new Fireball(this.stage, this.assetManager);
        testingItem.positionMe(200, 300);
        this._items.push(testingItem);
    }

    public Update(player:Player, score:ScoreSystem, enemyM:EnemyManager, item:InventorySystem) {
        this.CheckToCreate();

        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].itemType == TYPE.FIREBALL) {
                for (let j = 0; j < enemyM.enemies.length; j++) {
                    this._items[i].ItemUpdate(player, enemyM.enemies[j], item);
                }
            } else {
                this._items[i].ItemUpdate(player, null, null);
            }
            
            if (this._items[i].itemType == TYPE.JETPACK && this._items[i].special && this._items[i].state != STATE.GONE) {
                score.Add(player.gainedPoints);
            }
        }

        this.CheckAndRemoveOnScrollOff();
    }
}