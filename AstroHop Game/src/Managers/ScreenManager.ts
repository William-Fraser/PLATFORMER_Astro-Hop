import { DIRECTION } from "../Characters/GameCharacter";
import { GAMESTATE } from "../Game";
import Player from "../Characters/Player";
import PlatformManager from "./PlatformManager";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../Constants";
import AssetManager from "./AssetManager";

export enum GUI {
    LIFE,
    SCORE,
    INVENTORY
}

export default class ScreenManager {

    //init private fields
    private spriteMenuInfo:createjs.Sprite;
    private spritePlayGameInfo:createjs.Sprite;
    private spriteFinalScore:createjs.Sprite;

    //init containers
    private _GUI:createjs.Container;
    private _MainMenu:createjs.Container;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        
        // inst containers
        this._GUI = new createjs.Container();
        this._MainMenu = new createjs.Container();
        stage.addChild(this._MainMenu);
    
        //inst private fields
        this.spriteMenuInfo = assetManager.getSprite("assets", "Instructions/clickAnywhereToStart", STAGE_WIDTH/2, (STAGE_HEIGHT/4)*3);
        this.spriteMenuInfo.scaleX = 2.5;
        this.spriteMenuInfo.scaleY = 2;
        this.spriteMenuInfo.play();
        this._MainMenu.addChild(this.spriteMenuInfo);

        this.spritePlayGameInfo = assetManager.getSprite("assets", "Instructions/clickAndHoldPlayer", STAGE_WIDTH/2+50, (STAGE_HEIGHT/4)*3-55);
        this.spritePlayGameInfo.scaleX = 2;
        this.spritePlayGameInfo.scaleY = 2;
        this.spritePlayGameInfo.visible = false;
        stage.addChild(this.spritePlayGameInfo);

        this.spriteFinalScore= assetManager.getSprite("assets", "your Final Score was...", STAGE_WIDTH/2, (STAGE_HEIGHT/4+40));
        this.spriteFinalScore.scaleX = 3;
        this.spriteFinalScore.scaleY = 3;
        this.spriteFinalScore.visible = false;
        stage.addChild(this.spriteFinalScore);
    }
    
    // ----- gets/sets
    get GUI():createjs.Container { return this._GUI; }
    get MainMenu():createjs.Container { return this._MainMenu; }
    get SpritePlayGameInfo():createjs.Sprite { return this.spritePlayGameInfo; }

    // ----- private Methods
    private CheckAndScaleStageFromPlayer(player:Player, platformM:PlatformManager) {
        
        if (player.Y <= 270 && player.direction == DIRECTION.UP) {
            player.scrollHeight = true;

            //scroll platforms
            for (let i = 0; i < platformM.platforms.length; i++) {
                platformM.platforms[i].sprite.y += player.speed;
            }
        }
    }

    // ----- public methods

    public Update(player:Player, platformM:PlatformManager, stage:createjs.StageGL, gameState:GAMESTATE):GAMESTATE {
        
        // this gameState switch controls visual/screen elements
        switch(gameState) {
            
            case GAMESTATE.GAMEPLAY:
                this.CheckAndScaleStageFromPlayer(player, platformM);
                stage.addChild(this._GUI);
                break;

            case GAMESTATE.RETRY:
                break;
                
            case GAMESTATE.NEWGAME:    
                player.GainLife(3);
                platformM.SetupStart();
                player.sprite.visible = true;
                this._GUI.getChildAt(GUI.LIFE).visible = true;
                //this._GUI.getChildAt(GUI.INVENTORY).visible = true;
                this._GUI.getChildAt(GUI.SCORE).visible = true;
                this.spritePlayGameInfo.visible = true;
                break;
                    
            case GAMESTATE.MAINMENU:
                this.MainMenu.visible = true;
                this.spriteFinalScore.visible = false;
                this._GUI.getChildAt(GUI.SCORE).visible = false;
                this._GUI.getChildAt(GUI.SCORE).x = STAGE_WIDTH-this._GUI.getChildAt(GUI.SCORE).getBounds().width*2;
                this._GUI.getChildAt(GUI.SCORE).y = 5
                this._GUI.getChildAt(GUI.SCORE).scaleX = 1;
                this._GUI.getChildAt(GUI.SCORE).scaleY = 1;
                break;
                        
            case GAMESTATE.GAMEOVER:
                for (let i = 0; i < platformM.platforms.length; i++) {
                    stage.removeChild(platformM.platforms[i].sprite);
                }
                this.spriteFinalScore.visible = true;
                this._GUI.getChildAt(GUI.SCORE).x = STAGE_WIDTH/2-this._GUI.getChildAt(GUI.SCORE).getBounds().width;
                this._GUI.getChildAt(GUI.SCORE).y = STAGE_HEIGHT/2.5-this._GUI.getChildAt(GUI.SCORE).getBounds().height;
                this._GUI.getChildAt(GUI.SCORE).scaleX = 2.5;
                this._GUI.getChildAt(GUI.SCORE).scaleY = 2.5;
                this._GUI.getChildAt(GUI.LIFE).visible = false;
                //this._GUI.getChildAt(GUI.INVENTORY).visible = false;
                player.sprite.visible = false;
                break;
        }
        return gameState;
    }
}