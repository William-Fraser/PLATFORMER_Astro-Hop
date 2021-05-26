// game constants
export const STAGE_WIDTH:number = 400;
export const STAGE_HEIGHT:number = 600;
export const FRAME_RATE:number = 30;

//Player constants
export const PLAYER_POWERDEFAULT:number = 23; 
export const PLAYER_WEIGHTDEFAULT:number = 1.4;
export const PLAYER_GRAVITYDEFAULT:number = 0.6;

//Platform constants
//basic platform has no const other that a set score of 1 which has an honorable mention here;
export const PLATFORM_BREAKABLE_SCOREVALUE:number = 4; // this applies to all breakable platforms
export const PLATFORM_BREAKABLE_USES:number = 3;
export const PLATFORM_BREAKING_USES:number = 6; 
export const PLATFORM_STICKY_SCOREVALUE:number = 2;
export const PLATFORM_STICKY_POWER:number = 17;
export const PLATFORM_MOVING_SCOREVALUE:number = 3;
export const PLATFORM_MOVING_SPEED:number = 0;

//Enemy constants?

//Item constants
export const ITEM_JETPACK_POWER:number = 60;
export const ITEM_JETPACK_WEIGHT:number = 2.5;
export const ITEM_MOONSHOE_WEIGHT:number = 0.5;
export const ITEM_MOONSHOE_GRAVITY:number = 0.2;

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
    },
    {
        type:"json",
        src:"./lib/spritesheets/glyphs.json",
        id:"glyphs",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/glyphs.png",
        id:"glyphs",
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