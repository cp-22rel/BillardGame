import { UI } from "./ui.mjs";

class EndGameUI extends UI {
    constructor(winner) {
        super();
        this.winner = winner;
    }

    render(context, map) {
        context.fillStyle = "#00000021"
        context.fillRect(100, 100, map.size.x - 100, map.size.y - 100);

        context.fillStyle = "#ffffff";
        context.font = "50px Aarial";
        context.textAlign = "center";
        context.fillText("Player " + this.winner + " Won the game!!", map.size.x / 2, map.size.y * 0.3);
        context.fillText("Click to rematch!", map.size.x / 2, map.size.y * 0.7);
    }
}

export { EndGameUI }