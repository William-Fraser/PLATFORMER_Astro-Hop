import Spike from "../Characters/Enemies/Spike";
import Enemy from "../Characters/Enemy";
import Player from "../Characters/Player";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../Constants";
import Item from "../Objects/Item";
import { randomMe } from "../Toolkit";
import AssetManager from "./AssetManager";
import PlatformManager from "./PlatformManager";

export default class EnemyManager {
     
    //private fields
    private enemyMaker:Enemy;
    private _enemies:Array<Enemy>;
    private decideSpawned:number;

    //passed globals
    private stage:createjs.StageGL;
    private assetManager:AssetManager;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        
        //inst private fields
        this._enemies = [];

        //inst 
        this.stage = stage;
        this.assetManager = assetManager;
    }

    // ----- gets/sets
    get enemies():Array<Enemy> { return this._enemies; }
    set enemies(value:Array<Enemy>) { this._enemies = value; }

    // ----- private fields
    private Create(platformM:PlatformManager) {
        let created:boolean = true;
        if (platformM.platforms[platformM.platforms.length-1].sprite.y <= -5) {

            this.decideSpawned = randomMe(0, 100)
            if (this.decideSpawned == 1) {
                this.enemyMaker = new Spike(this.stage, this.assetManager);
                this.enemyMaker.positionMe(
                    //X
                    randomMe( // between
                        platformM.platforms[platformM.platforms.length-1].sprite.x-(platformM.platforms[platformM.platforms.length-1].sprite.getBounds().width/3), // &
                        (platformM.platforms[platformM.platforms.length-1].sprite.x+(platformM.platforms[platformM.platforms.length-1].sprite.getBounds().width/3))),
                    //Y
                    platformM.platforms[platformM.platforms.length-1].sprite.y);
            }
            else { created = false; }
            
            if (created) {
                // this.enemyMaker.positionMe(
                //     //X
                //     randomMe( // between
                //         this.enemyMaker.sprite.getBounds().width/2+100, // &
                //         (STAGE_WIDTH-(this.enemyMaker.sprite.getBounds().width/2))-100),
                //     //Y
                //     -this.enemyMaker.sprite.getBounds().height);
                this.stage.addChildAt(this.enemyMaker.sprite, 7);
                this._enemies.push(this.enemyMaker);
                console.log("spawn new enemy");
            }
        }
    }
    //#region  Screenmananger checks
    private CheckToCreate(platformM:PlatformManager) {
        if (this._enemies[this._enemies.length-1].sprite.y > 100) { 
            if (randomMe(1, 3) <= 3) {
                this.Create(platformM);
            }
            if (this._enemies[this._enemies.length-1].sprite.y > 550) {
                this.Create(platformM);
            }
        }
    }
    private CheckAndRemoveOnScrollOff() {
        for (let i = 0; i < this._enemies.length; i++) {
            if (this._enemies[i].sprite.y >= STAGE_HEIGHT+this._enemies[i].sprite.getBounds().height) {
                this.stage.removeChild(this._enemies[i].sprite);
            }
        }
    }
    //#endregion

    // ----- public methods
    public SetupStart() {
        let startingEnemy = new Spike(this.stage, this.assetManager);
        startingEnemy.positionMe(133, 360);
        this._enemies.push(startingEnemy);
    }

    public Update(player:Player, platformM:PlatformManager) {
        this.CheckToCreate(platformM);

        for(let i = 0; i < this._enemies.length; i++) {
            this._enemies[i].EnemyUpdate(player);
        }

        this.CheckAndRemoveOnScrollOff();
    }
}