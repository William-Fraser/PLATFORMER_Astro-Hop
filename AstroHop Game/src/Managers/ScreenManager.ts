import { STAGE_HEIGHT, STAGE_WIDTH } from "../Constants";
import { DIRECTION } from "../Characters/GameCharacter";
import { GAMESTATE } from "../Game";
import Player from "../Characters/Player";
import PlatformManager from "./PlatformManager";
import AssetManager from "./AssetManager";
import ItemManager from "./ItemManager";
import InventorySystem from "../Systems/InventorySystem";
import EnemyManager from "./EnemyManager";

export enum GUI {
    LIFE,
    SCORE,
    INVENTORY
}

export default class ScreenManager {

    //init private fields
    private spriteTitle:createjs.Sprite;
    private spriteMenuInfo:createjs.Sprite;
    private spritePauseGameInfo:createjs.Sprite
    private spritePlayGameInfo:createjs.Sprite;
    private spriteFinalScore:createjs.Sprite;
    private spriteGameOver:createjs.Sprite;
    private spritePauseScrn:createjs.Sprite;

    //init containers
    private _gUI:createjs.Container;
    private _mainMenu:createjs.Container;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        
        // inst containers
        this._gUI = new createjs.Container();
        this._mainMenu = new createjs.Container();
        stage.addChild(this._mainMenu);
    
        //inst private fields
        this.spriteTitle = assetManager.getSprite("assets", "Display/Title", STAGE_WIDTH/2, (STAGE_HEIGHT/4));
        this.spriteTitle.scaleX = 1.7;
        this.spriteTitle.scaleY = 1.5;
        this.spriteTitle.play();
        this._mainMenu.addChild(this.spriteTitle);

        this.spriteMenuInfo = assetManager.getSprite("assets", "Display/ClickToStart", STAGE_WIDTH/2, (STAGE_HEIGHT/4)*3);
        this.spriteMenuInfo.scaleX = 2;
        this.spriteMenuInfo.scaleY = 2;
        this.spriteMenuInfo.play();
        this._mainMenu.addChild(this.spriteMenuInfo);

        this.spritePauseGameInfo = assetManager.getSprite("assets", "Display/Instructions/Press P", (STAGE_WIDTH/3-18), (STAGE_HEIGHT/4)*3-40);
        this.spritePauseGameInfo.scaleX = 2;
        this.spritePauseGameInfo.scaleY = 2;
        this.spritePauseGameInfo.visible = false;
        stage.addChild(this.spritePauseGameInfo);

        this.spritePlayGameInfo = assetManager.getSprite("assets", "Display/Instructions/clickAndHold", STAGE_WIDTH/2+60, (STAGE_HEIGHT/4)*3-50);
        this.spritePlayGameInfo.scaleX = 2;
        this.spritePlayGameInfo.scaleY = 2;
        this.spritePlayGameInfo.visible = false;
        stage.addChild(this.spritePlayGameInfo);

        this.spriteFinalScore= assetManager.getSprite("assets", "your Final Score was...", STAGE_WIDTH/2, (STAGE_HEIGHT/4+40));
        this.spriteFinalScore.scaleX = 3;
        this.spriteFinalScore.scaleY = 3;
        this.spriteFinalScore.visible = false;
        stage.addChild(this.spriteFinalScore);

        this.spriteGameOver = assetManager.getSprite("assets", "Display/GameOver",  STAGE_WIDTH/2, (STAGE_HEIGHT/4)*3);
        this.spriteGameOver.scaleX = 3;
        this.spriteGameOver.scaleY = 3;
        this.spriteGameOver.play();
        this.spriteGameOver.visible = false;
        stage.addChild(this.spriteGameOver);

        this.spritePauseScrn = assetManager.getSprite("assets", "Display/Paused");
        this.spritePauseScrn.scaleX = 16;
        this.spritePauseScrn.scaleY = 15;
        this.spritePauseScrn.alpha = .5;
        this.spritePauseScrn.play();
        this.spritePauseScrn.visible = false;
        stage.addChild(this.spritePauseScrn);
    }
    
    // ----- gets/sets
    get GUI():createjs.Container { return this._gUI; }
    get MainMenu():createjs.Container { return this._mainMenu; }
    get SpritePlayGameInfo():createjs.Sprite { return this.spritePlayGameInfo; }
    get SpritePauseGameInfo():createjs.Sprite { return this.spritePauseGameInfo }

    // ----- private Methods
    private CheckAndScaleStageFromPlayer(player:Player, platformM:PlatformManager, itemM:ItemManager, enemyM:EnemyManager) {
        
        if (player.Y <= 270 && player.direction == DIRECTION.UP) {
            player.scrollHeight = true;

            //scroll platforms
            for (let i = 0; i < platformM.platforms.length; i++) {
                platformM.platforms[i].sprite.y += player.speed;
            }

            //scroll items
            for (let i = 0; i < itemM.items.length; i++) {
                itemM.items[i].sprite.y += player.speed;
            }

            //scroll enemies
            for (let i = 0; i < enemyM.enemies.length; i++) {
                enemyM.enemies[i].sprite.y += player.speed;
            }
        }
    }

    // ----- public methods

    public Update(player:Player, platformM:PlatformManager, itemM:ItemManager, enemyM:EnemyManager, Inventory:InventorySystem, stage:createjs.StageGL, gameState:GAMESTATE):GAMESTATE {
        
        // this gameState switch controls visual/screen elements
        switch(gameState) {
            
            case GAMESTATE.GAMEPLAY:
                this.CheckAndScaleStageFromPlayer(player, platformM, itemM, enemyM);
                stage.addChild(this._gUI);
                this.spritePauseScrn.visible = false;
                break;

            case GAMESTATE.RETRY:
                break;
                
            case GAMESTATE.NEWGAME:    
                this._gUI.getChildAt(GUI.LIFE).visible = true;
                //this._GUI.getChildAt(GUI.INVENTORY).visible = true;
                this._gUI.getChildAt(GUI.SCORE).visible = true;
                player.GainLife(3);
                platformM.SetupStart();
                itemM.SetupStart();
                enemyM.SetupStart();
                player.sprite.visible = true;
                this.spritePlayGameInfo.visible = true;
                this.spritePauseGameInfo.visible = true;
                this._gUI.addChild(Inventory.display);
                break;

            case GAMESTATE.PAUSED:   
                this.spritePauseScrn.visible = true;
                break;
                    
            case GAMESTATE.MAINMENU:
                this._gUI.getChildAt(GUI.SCORE).visible = false;
                this._gUI.getChildAt(GUI.SCORE).x = STAGE_WIDTH-this._gUI.getChildAt(GUI.SCORE).getBounds().width*2;
                this._gUI.getChildAt(GUI.SCORE).y = 5
                this._gUI.getChildAt(GUI.SCORE).scaleX = 1;
                this._gUI.getChildAt(GUI.SCORE).scaleY = 1;
                this.MainMenu.visible = true;
                this.spriteFinalScore.visible = false;
                this.spriteGameOver.visible = false;
                break;
                        
            case GAMESTATE.GAMEOVER:
                this._gUI.getChildAt(GUI.SCORE).x = STAGE_WIDTH/2-this._gUI.getChildAt(GUI.SCORE).getBounds().width;
                this._gUI.getChildAt(GUI.SCORE).y = STAGE_HEIGHT/2.5-this._gUI.getChildAt(GUI.SCORE).getBounds().height;
                this._gUI.getChildAt(GUI.SCORE).scaleX = 2.5;
                this._gUI.getChildAt(GUI.SCORE).scaleY = 2.5;
                this._gUI.getChildAt(GUI.LIFE).visible = false;
                
                //remove inventory display
                Inventory.RestartInventory();
                this._gUI.removeChild(Inventory.display);
                //this._GUI.getChildAt(GUI.INVENTORY).visible = false;
                
                //remove platforms
                for (let i = 0; i < platformM.platforms.length; i++) {
                    stage.removeChild(platformM.platforms[i].sprite);
                }

                //remove pick up items
                for (let i = 0; i < itemM.items.length; i++) {
                    stage.removeChild(itemM.items[i].sprite);
                }

                //remove enemies
                for (let i = 0; i < enemyM.enemies.length; i++) {
                    stage.removeChild(enemyM.enemies[i].sprite);
                }
                
                this.spriteFinalScore.visible = true;
                this.spriteGameOver.visible = true;
                player.sprite.gotoAndPlay("Astronaught/idle-Color");
                player.sprite.visible = false;
                break;
        }
        return gameState;
    }
}