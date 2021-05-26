import AssetManager from "../Managers/AssetManager";
import GameCharacter, { DIRECTION } from "./GameCharacter";
import Player from "./Player";

export default class Enemy extends GameCharacter {

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        // protected inst
        this._movementSpeed = 17;
        this._direction = DIRECTION.NULL;

        //child sets sprite/animation
    } 

    // ----- private methods
    public AttackPlayer(player:Player) {
        // if player iframes is not true, attack remove one health
    }

    public EnemyUpdate(player:Player) {
        
    }
}