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

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;

// assetmanager object
let assetManager:AssetManager;

// game objects
let background:createjs.Sprite;
let spaceMan:Player;
let ground:Platform;
let placeholderPlatforms:Platform[];

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

    for (let i:number = 0; i < 3; i++){
        let platformMaker:Platform;
        platformMaker = new Platform(stage, assetManager, "placeholderPlatform", 100, 170);
        placeholderPlatforms[i] = platformMaker;
    }
    placeholderPlatforms[1].positionMe(250, 295);
    placeholderPlatforms[2].positionMe(100, 360);

    stage.addChild(spaceMan.sprite);
    //#endregion

    //events
    this.stage.on("onPlatform", onPlatform);

    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}
function onPlatform(e:createjs.Event):void {
    spaceMan.Jumping = true;
    spaceMan.direction = DIRECTION.UP;
    console.log(spaceMan.sprite.currentAnimation.toString+" hit a platform at;  X: "+spaceMan.sprite.x+", Y: "+spaceMan.sprite.y);
    
}

function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // This is your game loop :)
    spaceMan.Update();
    ground.PlatformUpdate(spaceMan);

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