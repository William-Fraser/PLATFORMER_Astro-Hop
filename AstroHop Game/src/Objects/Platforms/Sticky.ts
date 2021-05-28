import Player from "../../Characters/Player";
import { PLATFORM_STICKY_POWER as POWER, PLATFORM_STICKY_SCOREVALUE as SCOREVALUE } from "../../Constants";
import AssetManager from "../../Managers/AssetManager";
import Platform from "../Platform";

export default class Sticky extends Platform {

    //init private fields
    private _stickyPowerChange:number;
    
    //inst private fields
    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager, "Platforms/SlimeRock2");
        
        //inst protected fields
        this._scoreValue = SCOREVALUE;
        
        //inst private fields
        this._stickyPowerChange = POWER;
    }

    // ----- public methods
    public UseAbility(player:Player) {
        player.power = this._stickyPowerChange;
    }
}