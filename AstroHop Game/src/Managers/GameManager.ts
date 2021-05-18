import Player from "../Characters/Player";
import AssetManager from "./AssetManager";

export default class GameManager {
    
    // passed globals 
    protected stage:createjs.StageGL;
    protected assetManager:AssetManager;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        this.stage = stage;
        this.assetManager = assetManager;
    }
}