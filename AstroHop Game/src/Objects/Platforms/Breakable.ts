import AssetManager from "../../Managers/AssetManager";
import Platform from "../Platform";
import Player from "../../Characters/Player";
import { STATE } from "../GameObject";
import { PLATFORM_BREAKABLE_SCOREVALUE as SCOREVALUE, PLATFORM_BREAKABLE_USES as USES } from "../../Constants";

export default class Breakable extends Platform {
    
    //init protected fields
    protected _uses:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager, "placeholderPlatform");
        
        //inst protected fields
        this._uses = USES; 
        this._scoreValue = SCOREVALUE;
    }
    
    //public methods
    public UseAbility() { 
        this._uses--;
    }
    public killMe():void { // charater method given to a platformObject for animation/removability
        if ((this._state == STATE.DYING)||(this._state == STATE.GONE)) {return;} //blocker

        // sprite animation
        // this.idleMe();
        // this._sprite.on("animationend", () => {
        //     this._sprite.stop();
        //     this.stage.removeChild(this._sprite);
        //     this._state = STATE.GONE;
        // });
        // this._sprite.gotoAndPlay("spriteanimation");
        
        this._state = STATE.DYING;

        // tween animation
        createjs.Tween.get(this._sprite).to({alpha:0}, 1000).call( () => {
            this._sprite.stop();
            this.stage.removeChild(this._sprite);
            this._state = STATE.GONE;
        });
    }
    
    public PlatformUpdate(player:Player) {
        super.PlatformUpdate(player);

        if (this._uses == 0) {
            this.killMe();
        }
    }
}