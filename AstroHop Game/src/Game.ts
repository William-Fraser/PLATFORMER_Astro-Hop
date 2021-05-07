// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// importing createjs framework
import "createjs";
// importing game constants
import { STAGE_WIDTH, STAGE_HEIGHT, FRAME_RATE, ASSET_MANIFEST } from "./Managers/Constants";
import { DIRECTION } from "./Characters/GameCharacter"
import AssetManager from "./Managers/AssetManager";
import Player from "./Characters/Player";
import Platform from "./Objects/Platform";
import Item from "./Objects/Item";
import Fireball from "./Objects/Items/Fireball";
import InventorySystem from "./Systems/InventorySystem";

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;

// assetmanager object
let assetManager:AssetManager;

// game objects
let background:createjs.Sprite;
let spaceMan:Player;
let ground:Platform;
let placeholderItem:Fireball;
let placeholderPlatforms:Platform[];

let inventory:InventorySystem;

// --------------------------------------------------- event handlers
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");
    
    // construct game object sprites
    background = assetManager.getSprite("assets", "_600x260Grass__600x2602DGrass&amp;NightSky", 0, 0);
    background.scaleY = 3;
    stage.addChild(background);

    //#region // init Stage Objects
    spaceMan = new Player(stage, assetManager);
    
    ground = new Platform(stage, assetManager, "_600x260Grass_", 0, 450);
    
    
    placeholderPlatforms = new Array(3);
    
    placeholderItem = new Fireball(stage, assetManager);
    placeholderItem.positionMe(135, 100);
    placeholderItem.scaleMe(2);
    
    for (let i:number = 0; i < 3; i++){
        let platformMaker:Platform;
        platformMaker = new Platform(stage, assetManager, "placeholderPlatform", 100, 170);
        placeholderPlatforms[i] = platformMaker;
    }
    placeholderPlatforms[1].positionMe(250, 295);
    placeholderPlatforms[2].positionMe(100, 360);
    
    
    stage.addChild(spaceMan.sprite);
    
    inventory = new InventorySystem(stage, assetManager, placeholderItem);
    
    //key event listener
    document.onkeyup = SpacebarPressed;
    //#endregion
    
    //events
    this.stage.on("onPlatform", onPlatform);
    this.stage.on("onPickup", onPickup);
    this.stage.on("onUseItem", onUseItem);

    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}
//#region // Game Events
function onPlatform(e:createjs.Event):void {
    spaceMan.Jumping = true;
    spaceMan.direction = DIRECTION.UP;
    console.log(spaceMan.sprite.currentAnimation.toString+" hit a platform at;  X: "+spaceMan.sprite.x+", Y: "+spaceMan.sprite.y);
}
function onPickup(e:createjs.Event) {
    inventory.savedItem = placeholderItem.itemType; // placeholder will change to an item manager for picked up items
    console.log("Item Picked up");
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
    inventory.Update(spaceMan);
    ground.PlatformUpdate(spaceMan);
    placeholderItem.ItemUpdate(spaceMan);

    for (let i:number = 0; i < 3; i++){
        placeholderPlatforms[i].PlatformUpdate(spaceMan);
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