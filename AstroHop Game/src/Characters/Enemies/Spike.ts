import AssetManager from "../../Managers/AssetManager";
import Enemy from "../Enemy";

export default class Spike extends Enemy {

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        // inst sprite
        this._sprite = assetManager.getSprite("assets", "Enemies/Spike/Idle")
        this._sprite.play();
        stage.addChild(this._sprite);
        this.scaleMe(1.2);

    }
    // this is the basic enemy that doesn't do anything
}