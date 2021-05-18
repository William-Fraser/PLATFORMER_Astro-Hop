import Player from "../../Characters/Player";
import AssetManager from "../../Managers/AssetManager";
import Platform from "../Platform";

export default class Deadly extends Platform {

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager, "placeholderPlatform");

        //inst protected fields
        this._scoreValue = 0; // no points for getting hurt
    } 

    // ----- public methods
    public UseAbility(player:Player) {
        player.LoseLifeGainIFrames(1); // lose 1 life
    }  
}