// game constants
export const STAGE_WIDTH:number = 400;
export const STAGE_HEIGHT:number = 600;
export const FRAME_RATE:number = 30;

//Player constants
export const PLAYER_POWER:number = 17; // always constant
// switchable constants
export const PLAYER_WEIGHTDEFAULT:number = 1.7; // changes if item is in use
export const PLAYER_GRAVITYDEFAULT:number = 0.9;// ^

//Enemy constants?

//Item constants
export const ITEM_MOONSHOE_WEIGHT:number = 0.2;
export const ITEM_MOONSHOE_GRAVITY:number = 0.5;

export const ASSET_MANIFEST:Object[] = [
    {
        type:"json",
        src:"./lib/spritesheets/assets.json",
        id:"assets",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/assets.png",
        id:"assets",
        data:0
    }
    /*{
        type:"sound",
        src:"./lib/sounds/beep.ogg",
        id:"beep",
        data:4
    }  
    */   
];