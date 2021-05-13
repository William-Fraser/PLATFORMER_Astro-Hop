import AssetManager from "../../Managers/AssetManager";
import Platform from "../Platform";
import Player from "../../Characters/Player";
import { STATE } from "../GameObject";

export default class Breakable extends Platform {
    
    //init protected fields
    protected _uses:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, spriteOrAnimation:string, PosX:number, PosY:number) {
        super(stage, assetManager, spriteOrAnimation, PosX, PosY);
        
        //inst protected fields
        this._uses = 1;
        this._scoreValue = 2;
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