import { EndGameUI } from "./ui/end_game_ui.mjs";
import { InformationPanelUI } from "./ui/information_panel_ui.mjs";
import { PauseMenuUI } from "./ui/pause_menu_ui.mjs";

class UIManager {
    constructor() { };

    static manager = new UIManager();

    showUI(ui, param, map) {
        map.currentGameState = "paused";
        switch (ui) {
            case "endGameUI":
                this.ui = new EndGameUI(param);
                break;
            case "informationPanelUI": this.ui = new InformationPanelUI(param); break;
            case "pauseMenuUI": this.ui = new PauseMenuUI(param); break;
            default: break;
        }
    }

    closeUI(map) {
        map.currentGameState = "running";
        this.ui = null;
    }

    getCurrentUI() {
        return this.ui;
    }

    update(context, map) {
        this.ui.update();
        this.ui.render(context, map);
    }
}
export { UIManager };