import AssetManager from "./AssetManager";
import GameObject from "./GameObject";

export default class Platform extends GameObject {

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        
    }
}