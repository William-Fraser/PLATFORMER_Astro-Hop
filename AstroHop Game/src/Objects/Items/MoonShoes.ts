import { DIRECTION } from "../../Characters/GameCharacter";
import Player from "../../Characters/Player";
import { ITEM_MOONSHOE_GRAVITY, ITEM_MOONSHOE_WEIGHT, PLAYER_GRAVITYDEFAULT, PLAYER_WEIGHTDEFAULT } from "../../Constants";
import AssetManager from "../../Managers/AssetManager";
import { STATE } from "../GameObject";
import Item, { FORM, TYPE } from "../Item";

export default class MoonShoes extends Item {

    //init private fields
    private _weight:number;
    private _gravity:number;
    private _started:boolean;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager);

        //isnt protected fields
        this._itemForm = FORM.PICKUP;
        this._itemType = TYPE.MOONSHOES;

        //isnt private fields
        this._weight = ITEM_MOONSHOE_WEIGHT;
        this._gravity = ITEM_MOONSHOE_GRAVITY;
        this._started = false;

        //inst animation
        this._sprite = assetManager.getSprite("assets", "Items/MoonShoes");
        stage.addChild(this._sprite);
    }

    // ----- public methods
    public UseItem(player:Player) {
        if (!this._started) {
            player.sprite.on("animationend", () => {
                player.activeItem = TYPE.MOONSHOES;
                player.weight = this._weight;
                player.gravity = this._gravity;
                createjs.Tween.get(this._sprite).to({alpha:.3}, 1000).call( () => {
                    createjs.Tween.get(this._sprite).to({alpha:.6}, 1000).call( () => {
                        createjs.Tween.get(this._sprite).to({alpha:.3}, 1000).call( () => {
                            createjs.Tween.get(this._sprite).to({alpha:.6}, 1000).call( () => {
                                createjs.Tween.get(this._sprite).to({alpha:.3}, 1000).call( () => {
                                    createjs.Tween.get(this._sprite).to({alpha:.6}, 1000).call( () => {
                                        player.activeItem = TYPE.NULL;
                                        this._state = STATE.GONE;  
                                        player.weight = PLAYER_WEIGHTDEFAULT;
                                        player.gravity = PLAYER_GRAVITYDEFAULT;
                                    }); 
                                });
                            }); 
                        });
                    }); 
                });
            });
            this._started = true;
        }
    }

    public ItemUpdate(player:Player) {
        super.ItemUpdate(player, null, null);

        if (this._itemForm == FORM.SPRITE) {
            
        }   
        else if (this._itemForm == FORM.INUSE) {

        }
    }
}