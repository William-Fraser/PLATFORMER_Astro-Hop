import AssetManager from "../../Managers/AssetManager";
import { STATE } from "../../Objects/GameObject";
import { boxHit, pointHit } from "../../Toolkit";
import Enemy from "../Enemy";
import { DIRECTION } from "../GameCharacter";
import Player from "../Player";

export default class Slime extends Enemy {
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst sprite
        this._sprite = assetManager.getSprite("assets", "Enemies/Slime/Idle");
        this._sprite.play();
        this.scaleMe(1.2);
        stage.addChild(this._sprite);
    }

    // ----- private methods
    public killMe():void {
        if ((this._state == STATE.DYING)||(this._state == STATE.GONE)) {return;}

        this.idleMe();
        this._sprite.on("animationend", () => {
            this._sprite.stop();
            createjs.Tween.get(this._sprite).to({alpha:0}, 100).call( () => {
                this.stage.removeChild(this._sprite);
                this._state = STATE.GONE;
            });
        });
        this._sprite.gotoAndPlay("Enemies/Slime/Squish");
        this._state = STATE.DYING;
    }       
    private KillFromAbove(player:Player) {
        if (player.direction == DIRECTION.DOWN) {
            if (pointHit(this.sprite, player.sprite, 0, -this.sprite.getBounds().height)) {
                this.killMe();
            }
        }
    }

    // ----- public methods
    EnemyUpdate(player:Player) {
        super.EnemyUpdate(player);
        this.KillFromAbove(player);
    }
}