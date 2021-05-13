import AssetManager from "../../Managers/AssetManager";
import Platform from "../Platform";
import Player from "../../Characters/Player";
import { STATE } from "../GameObject";
import Breakable from "./Breakable";

export default class Breaking extends Breakable {

    constructor(stage:createjs.StageGL, assetManager:AssetManager, spriteOrAnimation:string, PosX:number, PosY:number) {
        super(stage, assetManager, spriteOrAnimation, PosX, PosY);
        
        //inst protected fields
        this._uses = 7;
        this._scoreValue = 1;
    }
}