import Player from "../Characters/Player";
import PlatformManager from "./PlatformManager";

export default class ScreenManager {

    // ----- private Methods
    private ScaleStageFromPlayer(player:Player, platformM:PlatformManager) {
        
        if (player.Y <= 150) {
            player.scrollHeight = true;

            //scroll platforms
            for (let i = 0; i < platformM.platforms.length; i++) {
                platformM.platforms[i].sprite.y += player.speed;
            }
        }
    }

    // ----- public methods

    public Update(player:Player, platformM:PlatformManager) {
        this.ScaleStageFromPlayer(player, platformM);
    }
}