import { UI } from "./ui.mjs";

class EndGameUI extends UI {
    constructor(winner) {
        super();
        this.winner = winner;
    }

    render(context, map) {
        context.fillStyle = "#00000021"
        context.fillRect(map.position.x, map.position.y, map.size.x - map.position.x, map.size.y - map.position.y);

        context.fillStyle = "#ffffff";
        context.font = "50px Aarial";
        context.textAlign = "center";
        context.fillText("Player " + this.winner + " Won the game!!", map.canvas.size.x / 2, map.canvas.size.y * 0.3);
        context.fillText("Click to rematch!", map.canvas.size.x / 2, map.canvas.size.y / 2);
    }
}

export { EndGameUI }