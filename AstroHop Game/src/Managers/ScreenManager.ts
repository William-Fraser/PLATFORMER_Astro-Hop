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
        this.spriteMenuInfo = assetManager.getSprite("assets", "Display/Instructions/clickAnywhereToStart", STAGE_WIDTH/2, (STAGE_HEIGHT/4)*3);
        this.spriteMenuInfo.scaleX = 2.5;
        this.spriteMenuInfo.scaleY = 2;
        this.spriteMenuInfo.play();
        this._MainMenu.addChild(this.spriteMenuInfo);

        this.spritePlayGameInfo = assetManager.getSprite("assets", "Display/Instructions/clickAndHoldPlayer", STAGE_WIDTH/2+50, (STAGE_HEIGHT/4)*3-55);
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
                stage.addChild(this._GUI);
                break;

            case GAMESTATE.RETRY:
                break;
                
            case GAMESTATE.NEWGAME:    
                this._GUI.getChildAt(GUI.LIFE).visible = true;
                //this._GUI.getChildAt(GUI.INVENTORY).visible = true;
                this._GUI.getChildAt(GUI.SCORE).visible = true;
                player.GainLife(3);
                platformM.SetupStart();
                itemM.SetupStart();
                enemyM.SetupStart();
                player.sprite.visible = true;
                this.spritePlayGameInfo.visible = true;
                this._GUI.addChild(Inventory.display);
                break;
                    
            case GAMESTATE.MAINMENU:
                this._GUI.getChildAt(GUI.SCORE).visible = false;
                this._GUI.getChildAt(GUI.SCORE).x = STAGE_WIDTH-this._GUI.getChildAt(GUI.SCORE).getBounds().width*2;
                this._GUI.getChildAt(GUI.SCORE).y = 5
                this._GUI.getChildAt(GUI.SCORE).scaleX = 1;
                this._GUI.getChildAt(GUI.SCORE).scaleY = 1;
                this.MainMenu.visible = true;
                this.spriteFinalScore.visible = false;
                break;
                        
            case GAMESTATE.GAMEOVER:
                this._GUI.getChildAt(GUI.SCORE).x = STAGE_WIDTH/2-this._GUI.getChildAt(GUI.SCORE).getBounds().width;
                this._GUI.getChildAt(GUI.SCORE).y = STAGE_HEIGHT/2.5-this._GUI.getChildAt(GUI.SCORE).getBounds().height;
                this._GUI.getChildAt(GUI.SCORE).scaleX = 2.5;
                this._GUI.getChildAt(GUI.SCORE).scaleY = 2.5;
                this._GUI.getChildAt(GUI.LIFE).visible = false;
                
                //remove inventory display
                Inventory.RestartInventory();
                this._GUI.removeChild(Inventory.display);
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
                player.sprite.gotoAndPlay("Astronaught/idle-Color");
                player.sprite.visible = false;
                break;
        }
        return gameState;
    }
}