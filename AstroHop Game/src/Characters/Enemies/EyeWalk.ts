import AssetManager from "../../Managers/AssetManager";
import Enemy from "../Enemy";

export default class EyeWalk extends Enemy {
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst sprite
        this._sprite = assetManager.getSprite("assets", "Enemies/Slime/Idle");
        this._sprite.play();
        this.scaleMe(1.2);
    }