import Player from "../Characters/Player";
import Platform from "../Objects/Platform";
import Moving from "../Objects/Platforms/Moving";
import AssetManager from "./AssetManager";
import GameManager from "./GameManager";
import { randomMe } from "../Toolkit";
import { STAGE_WIDTH } from "../Constants";

export default class PlatformManager extends GameManager {

    //private fields
    private platformMaker:Platform;
    private _platforms:Array<Platform>;
    private spawnable:boolean;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);
        //inst private fields
        this._platforms = new Array<Platform>();
    }

    // ----- gets/sets
    get platforms():Array<Platform> { return this._platforms; }


    // ----- private methods
    private CheckToCreate() {
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
    private Create() {
        
        this.platformMaker = new Platform(this.stage, this.assetManager, "placeholderPlatform");
        this.platformMaker.positionMe( randomMe(this.platformMaker.sprite.getBounds().width/2+20, (STAGE_WIDTH-this.platformMaker.sprite.getBounds().width/2)-20), -this.platformMaker.sprite.getBounds().height);
        this.stage.addChild(this.platformMaker.sprite);
        this._platforms.push(this.platformMaker);
        console.log("spawn new platform")
    }
    
    // ----- public methods
    public SetupStart() { // used in newgame state
        // sets up first screen for beginning game

        //starting platform
        let ground = new Platform(this.stage, this.assetManager, "_600x260Grass_");
        ground.positionMe(0, 450);
        this.stage.addChild(ground.sprite);
        this._platforms.push(ground);

        for (let i:number = 0; i <= 3; i++){ // count starts at and includes 0
            let platformMaker:Platform;
            if (i == 2) {// selects the third platform made
                platformMaker = new Moving(this.stage, this.assetManager);
            } else {
                platformMaker = new Platform(this.stage, this.assetManager, "placeholderPlatform");
            }
            this.stage.addChild(platformMaker.sprite);
            this._platforms.push(platformMaker); // 0 of the maker is 1 \/

        }
        this._platforms[1].positionMe(133, 360); // 0 is ground
        this._platforms[2].positionMe(267, 295);
        this._platforms[3].positionMe(200, 170);
        this._platforms[4].positionMe(300, 90);
    }
    public RemoveOnScrollOff() {

    }
    
    public Update(player:Player) {
        
        console.log(this.platforms[this.platforms.length-1].sprite.y);
        for(let i = 0; i< this._platforms.length; i++){
            this._platforms[i].PlatformUpdate(player);
        }

        this.CheckToCreate();
    }
}