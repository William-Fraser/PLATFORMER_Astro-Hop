import { randomMe } from "../Toolkit";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../Constants";
import Player from "../Characters/Player";
import Platform from "../Objects/Platform";
import Moving from "../Objects/Platforms/Moving";
import AssetManager from "./AssetManager";
import Breaking from "../Objects/Platforms/Breaking";
import Breakable from "../Objects/Platforms/Breakable";
import Deadly from "../Objects/Platforms/Deadly";
import Sticky from "../Objects/Platforms/Sticky";

export default class PlatformManager {
    
    //private fields
    private platformMaker:Platform;
    private _platforms:Array<Platform>;
    private decideSpawned:number;

    //passed global
    private stage:createjs.StageGL;
    private assetManager:AssetManager;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {

        //inst private fields
        this._platforms = [];

        //inst passed global fields
        this.stage = stage;
        this.assetManager = assetManager;
    }
    
    // ----- gets/sets
    get platforms():Array<Platform> { return this._platforms; }
    set platforms(value:Array<Platform>) { this._platforms = value; }
    

    // ----- private methods
    private Create() {
        this.decideSpawned = randomMe(0, 30);
        // if (this.decideSpawned == 1) {
        //     this.platformMaker = new Breaking(this.stage, this.assetManager);
        // }
        // else if (this.decideSpawned == 2) {
        //     this.platformMaker = new Breakable(this.stage, this.assetManager);
        // }
        // else 
        if (this.decideSpawned == 3) {
            this.platformMaker = new Deadly(this.stage, this.assetManager);
        }
        else if (this.decideSpawned == 4) {
            this.platformMaker = new Moving(this.stage, this.assetManager);
        }
        else if (this.decideSpawned == 5) {
            this.platformMaker = new Sticky(this.stage, this.assetManager);
        }
        else {
            this.platformMaker = new Platform(this.stage, this.assetManager, "Platforms/Astroid2");
            // this.platformMaker.sprite.scaleX = 2;
            // this.platformMaker.sprite.scaleY = 1.5;
        }
        this.platformMaker.positionMe( randomMe(this.platformMaker.sprite.getBounds().width/2+20, (STAGE_WIDTH-this.platformMaker.sprite.getBounds().width/2)-20), -this.platformMaker.sprite.getBounds().height);
        this.stage.addChildAt(this.platformMaker.sprite, 2);
        this._platforms.push(this.platformMaker);
        //console.log("spawn new platform")
    }
    //#region // Screenmanager checks
    private CheckToCreate() { // works with Screen manager
        //creates a new random platform and places it randomly
        // in accordance with a few rules
        // >a platform can always be reached by a regular jump from the next heighest platform
        // regular platforms are the most prominent // test only creates regular platform
        
        if (this.platforms[this.platforms.length-1].sprite.y > 32) { // -1 because it starts from 0 but length doesnt include a count for it
            if (randomMe(0, 50) <= 10) { // randomly spawns a platform
                this.Create();
            }
            if (this.platforms[this.platforms.length-1].sprite.y > 100) {
                this.Create(); 
            }
        }
    }
    private CheckAndRemoveOnScrollOff() { 
        for (let i = 0; i< this._platforms.length; i++){
            if (this._platforms[i].sprite.y >= STAGE_HEIGHT+this._platforms[i].sprite.getBounds().height) {
                this.stage.removeChild(this._platforms[i].sprite);
                
            }
        }
    }
    //#endregion
    
    // ----- public methods
    public SetupStart() { // used in newgame state
        // sets up first screen for beginning game

        //create ground platform
        let ground = new Platform(this.stage, this.assetManager, "_600x260Grass_");
        ground.positionMe(0, 450);
        this._platforms.push(ground);

        //set up starting platforms
        for (let i:number = 0; i <= 3; i++){ // count starts at and includes 0
            
            if (i == 2) {// selects the third platform made
                this.platformMaker = new Moving(this.stage, this.assetManager);
            } else {
                this.platformMaker = new Platform(this.stage, this.assetManager, "Platforms/Astroid2");
                // this.platformMaker.sprite.scaleX = 2;
                // this.platformMaker.sprite.scaleY = 1.5;
            }
            this._platforms.push(this.platformMaker); // 0 of the maker is 1 \/
            this.stage.addChildAt(this._platforms[i].sprite, 1);

        }

        //positioning
        this._platforms[1].positionMe(133, 360); // 0 is ground
        this._platforms[2].positionMe(267, 295);
        this._platforms[3].positionMe(200, 170);
        this._platforms[4].positionMe(300, 75);
    }
    
    public Update(player:Player) {
        
        this.CheckToCreate(); // works with Screen manager

        //console.log(this.platforms[this.platforms.length-1].sprite.y);
        for(let i = 0; i< this._platforms.length; i++){
            this._platforms[i].PlatformUpdate(player);
        }

        this.CheckAndRemoveOnScrollOff(); // works with Screen manager
    }
}