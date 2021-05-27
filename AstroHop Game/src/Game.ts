// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// importing createjs framework
import "createjs";
// importing game constants
import { STAGE_WIDTH, STAGE_HEIGHT, FRAME_RATE, ASSET_MANIFEST } from "./Constants";
import { DIRECTION } from "./Characters/GameCharacter"
import AssetManager from "./Managers/AssetManager";
import Player from "./Characters/Player";
import ScoreSystem from "./Systems/ScoreSystem";
import InventorySystem from "./Systems/InventorySystem";
import ScreenManager from "./Managers/ScreenManager";
import PlatformManager from "./Managers/PlatformManager";
import Fireball from "./Objects/Items/Fireball";
import { STATE } from "./Objects/GameObject";
import OneUP from "./Objects/Items/OneUP";
import Item from "./Objects/Item";
import ItemManager from "./Managers/ItemManager";
import Spike from "./Characters/Enemies/Spike";
import Enemy from "./Characters/Enemy";
import EnemyManager from "./Managers/EnemyManager";

export enum GAMESTATE {
    GAMEPLAY, // game
    RETRY, // can continue current game with lives
    NEWGAME, // game setup
    MAINMENU, // initiates new game
    GAMEOVER // no more lives remaining return to mainmenu or start anew?
}

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;
let gameState:GAMESTATE;

// assetmanager object
let assetManager:AssetManager;

// game objects
let background:createjs.Sprite;
let spaceMan:Player;
let screenM:ScreenManager;
let itemM:ItemManager;
let platformM:PlatformManager;
let enemyM:EnemyManager;
let inventory:InventorySystem;
let score:ScoreSystem;

// --------------------------------------------------- event handlers
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");
    
    // construct game object sprites
    background = assetManager.getSprite("assets", "Display/Space Background", 0, 0);
    stage.addChild(background);

    //#region // init Stage Objects

    gameState = GAMESTATE.MAINMENU;

    screenM = new ScreenManager(stage, assetManager);
    
    spaceMan = new Player(stage, screenM.GUI, screenM.MainMenu, assetManager);
    
    platformM = new PlatformManager(stage, assetManager);
    
    itemM = new ItemManager(stage, assetManager);

    enemyM = new EnemyManager(stage, assetManager);
    
    inventory = new InventorySystem(stage, screenM.GUI, assetManager);

    score = new ScoreSystem(screenM.GUI, assetManager);
    
    //events
    this.stage.on("onPlatform", onPlatform);
    this.stage.on("onPickup", onPickup);
    this.stage.on("onUseItem", onUseItem);
    
    //key event listener
    document.onkeyup = SpacebarPressed;
    //#endregion 
    
    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}
//#region // Game Events
function onPlatform(e:createjs.Event):void {
    spaceMan.Jumping = true;
    spaceMan.direction = DIRECTION.UP;
    if (spaceMan.gainedPoints != 0) { // only calculate if gained points isnt 0  
        //console.debug("add platform points");
        score.Add(spaceMan.gainedPoints);
        spaceMan.gainedPoints = 0;
    }
    //console.debug("player hit a platform at;  X: "+spaceMan.sprite.x+", Y: "+spaceMan.sprite.y); // debug
}
function onPickup(e:createjs.Event) {
    for (let i = 0; i < itemM.items.length; i++) {
        if (itemM.items[i].beingPickedUp) {
            console.log("Item Picked up");
            itemM.items[i].beingPickedUp = false;
            inventory.AddItemToOpenHold(itemM.items[i]); // placeholder will change to an item manager for picked up items
        }
    }
}
function onUseItem(e:createjs.Event) {
    inventory.CheckToPullSavedItem();
    inventory.CheckToUseActiveItem(spaceMan);
}

//keyboardevents
function SpacebarPressed(e:KeyboardEvent) {
    if (e.key == " ") {
        console.log("Spacebar Pressed ");
        spaceMan.spacebarIsPressed = true;
    }
}
//#endregion

function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // This is your game loop :)
    
    spaceMan.Update();
    score.Update();
    gameState = screenM.Update(spaceMan, platformM, itemM, enemyM, inventory, stage, gameState);
    
    //screenM.Update holds a similar swtich statement
    //this gameState switch controls gameplay elements
    switch(gameState) {
            
        case GAMESTATE.GAMEPLAY:
            inventory.Update(spaceMan);
            platformM.Update(spaceMan);
            itemM.Update(spaceMan, score, enemyM, inventory);
            enemyM.Update(spaceMan, platformM);

            //Handle starting the game and purposefully losing a life
            spaceMan.sprite.on("mousedown", (e:createjs.Event) => { 
                screenM.SpritePlayGameInfo.visible = false;
                spaceMan.state = STATE.ACTIVE;
                e.remove();
            });
            spaceMan.sprite.on("pressup", (e:createjs.Event) => { 
                spaceMan.LoseLifeRetry(1);
                e.remove();
            });

            //change state depending on character status
            if (spaceMan.state == STATE.HURT) {
                gameState = GAMESTATE.RETRY;
            }
            else if (spaceMan.state == STATE.DYING) {
                gameState = GAMESTATE.GAMEOVER;
            }
            break;
            

        case GAMESTATE.RETRY:
            stage.on("stagemousemove", () => { // event that controls pos of retry mode player
                spaceMan.mouseX = stage.mouseX;
                spaceMan.mouseY = stage.mouseY;
            });
            
            // on mouse down check to start gameplay
            spaceMan.sprite.on("mousedown", (e:createjs.Event) => {
            
                //move to end of player tween
                // or check if ready to spawn and do this
                spaceMan.state = STATE.ACTIVE;    
                spaceMan.direction = DIRECTION.DOWN;
                gameState = GAMESTATE.GAMEPLAY;
                e.remove();
                
            });
            break;

        case GAMESTATE.NEWGAME:
            score.score = 0;
            score.score = -1; // fixes glitch where score starts at 0
            spaceMan.AddMouseMovementController();
            spaceMan.state = STATE.IDLE;
            spaceMan.positionMe(STAGE_WIDTH/2, STAGE_HEIGHT/2+(STAGE_HEIGHT/2)/2);// set spawn
            gameState = GAMESTATE.GAMEPLAY;
            break;

        case GAMESTATE.MAINMENU:
            stage.on("pressup", (e:createjs.Event) => {
                screenM.MainMenu.visible = false;
                gameState = GAMESTATE.NEWGAME;
                e.remove();
            })
            break;

        case GAMESTATE.GAMEOVER:
            //console.log("GAMEOVER");
            platformM.platforms = []; // set platforms array to 0;
            stage.on("click", (e:createjs.Event) => {
                
                score.difficulty = 0;
                gameState = GAMESTATE.MAINMENU;
                e.remove();
            })
            break;
    }
    
    // update the stage!
    stage.update();
}

// --------------------------------------------------- main method
function main():void {
    console.log(">> initializing");

    // get reference to canvas
    canvas = <HTMLCanvasElement> document.getElementById("game-canvas");
    // set canvas width and height - this will be the stage size
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;

    // create stage object
    stage = new createjs.StageGL(canvas, { antialias: true });
    stage.enableMouseOver(10);

    // AssetManager setup
    assetManager = new AssetManager(stage);
    stage.on("allAssetsLoaded", onReady, null, true);

    // load the assets
    assetManager.loadAssets(ASSET_MANIFEST);    
}

main();