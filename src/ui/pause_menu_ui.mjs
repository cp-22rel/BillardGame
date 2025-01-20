import { UI } from "./ui.mjs";

class PauseMenuUI extends UI {
    constructor() {
        super();
    }

    render(context, map) {
        context.fillStyle = "#33333377";
        context.fillRect(map.position.x, map.position.y, map.size.x - map.position.x, map.size.y - map.position.y);
        context.fillStyle = "#ffffff";

        context.font = "50px Aarial";
        context.textAlign = "center";
        context.fillText("Paused Game", map.canvas.size.x / 2, 200);
    }
}

export { PauseMenuUI }