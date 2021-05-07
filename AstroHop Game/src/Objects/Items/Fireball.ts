import AssetManager from "../../Managers/AssetManager";
import Item from "../Item";

export default class Fireball extends Item {

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //child creates sprite
        this._sprite = assetManager.getSprite("assets", "spriteplaceholder", 0, 0);
        this._sprite.play();
        stage.addChild(this._sprite);
    }
}