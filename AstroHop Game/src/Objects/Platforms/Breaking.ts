import AssetManager from "../../Managers/AssetManager";
import Breakable from "./Breakable";
import { PLATFORM_BREAKABLE_SCOREVALUE as SCOREVALUE, PLATFORM_BREAKING_USES as USES } from "../../Constants";

export default class Breaking extends Breakable {

    // basically a stronger breakable

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);
        
        //inst protected fields
        this._uses = USES;
        this._scoreValue = SCOREVALUE;
    }
}