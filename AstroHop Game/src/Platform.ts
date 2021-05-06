import AssetManager from "./AssetManager";
import GameObject from "./GameObject";
import Player from "./Player";
import { DIRECTION } from "./GameCharacter";
import { boxHit } from "./Toolkit";

export default class Platform extends GameObject {

    private eventPlayerOnPlatform:createjs.Event;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, player:Player) {
        super(stage, assetManager);

        //init event
        this.eventPlayerOnPlatform = new createjs.Event("onPlatform", true, false);
        this.stage.on("onPlatform", () => { // switch arrow statements out for method 
            player.Jumping = true;
            player.direction = DIRECTION.UP;
            console.log(player.sprite.currentAnimation.toString+" hit a platform at;  X: "+player.sprite.x+", Y: "+player.sprite.y);
        
        });

        //create sprite
        this._sprite = assetManager.getSprite("assets", "_600x260Grass_", 0, 450);
        this._sprite.play();
        stage.addChild(this._sprite);
    }

    // ----- event handlers
    private onPlatform(player:Player):void {
        player.Jumping = true;
        player.direction = DIRECTION.UP;
        console.log(player.sprite.currentAnimation.toString+" hit a platform at;  X: "+player.sprite.x+", Y: "+player.sprite.y);
        
    }

    // ----- public methods
    public PlatformUpdate(player:Player):void { // named due to no method overloading in JS
        super.Update(); // calls super anyways
        
        //console.log("this reaches");
        // only activate if player is not already jumping
        if (!player.Jumping) {
            //detect if player is on platform
            if (boxHit(player.sprite, this._sprite)) {
                this.stage.dispatchEvent(this.eventPlayerOnPlatform);
            }
        }
    }
}