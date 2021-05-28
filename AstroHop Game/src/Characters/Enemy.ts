import AssetManager from "../Managers/AssetManager";
import { STATE } from "../Objects/GameObject";
import { boxHit } from "../Toolkit";
import GameCharacter, { DIRECTION } from "./GameCharacter";
import Player from "./Player";

export default class Enemy extends GameCharacter {

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        // protected inst
        this._movementSpeed = 7;
        this._direction = DIRECTION.NULL;
        this._state = STATE.ACTIVE;
        this._acceleration = 0;

        //child sets sprite/animation
    } 

    // ----- private methods
    private Attack(player:Player) {
        player.LoseLifeGainIFrames(1);
    }

    // ----- public methods
    public Special() {} // overloaded

    public EnemyUpdate(player:Player) {
        switch(this._state) {

            case STATE.ACTIVE:

                if (boxHit(player.sprite, this._sprite)) {
                   this.Attack(player);
                }
                break;
                
            default: break;
        }
        
    }
}