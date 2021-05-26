import Player from "../../Characters/Player";
import AssetManager from "../../Managers/AssetManager";
import { STATE } from "../GameObject";
import Item, { FORM, TYPE } from "../Item";

export default class ForceField extends Item {

    //init private fields
    private _started:boolean //tells player if 
    private _duration:number //in milliseconds // used in tween

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //inst protected fields
        this._itemType = TYPE.FORCEFIELD;

        //inst private fields
        this._started = false;
        this._duration = 500;

        //inst sprite
        this._sprite = assetManager.getSprite("assets", "AstroHopShieldPlaceHolder", 0, 0);
        this._sprite.play();
        this.scaleMe(2);
        stage.addChildAt(this._sprite, 2);
    }

    // ----- public methods
    public UseItem(player:Player) {
        if (!this._started) {
            console.log("effect item/no active use") ;
            this._started = true;
            player.iFrames = true;
            this._state = STATE.ACTIVE;
            createjs.Tween.get(this._sprite).to({alpha:.3}, this._duration).call( () => {
                createjs.Tween.get(this._sprite).to({alpha:1}, this._duration).call( () => {
                    createjs.Tween.get(this._sprite).to({alpha:.3}, this._duration).call( () => {
                        createjs.Tween.get(this._sprite).to({alpha:1}, this._duration).call( () => {
                            createjs.Tween.get(this._sprite).to({alpha:.3}, this._duration).call( () => {
                                createjs.Tween.get(this._sprite).to({alpha:1}, this._duration).call( () => {
                                    player.iFrames = false;
                                    this._state = STATE.GONE;
                                });
                            });
                        });
                    });
                });
            });
        }
    }

    public ItemUpdate(player:Player) {
        super.ItemUpdate(player);

        if (this._itemForm == FORM.PICKUP) {
            this.scaleMe(1.5);
        }

        else if (this._itemForm == FORM.SPRITE) {
            this.scaleMe(1);
        }

        else if (this._itemForm == FORM.INUSE) {
            this.positionMe(player.X, player.Y);
            this.UseItem(player);
            this.scaleMe(2.5);
        } 

    }
}