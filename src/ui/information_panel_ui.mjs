import { UI } from "./ui.mjs";

class InformationPanelUI extends UI {
    constructor(information) {
        super();
        this.information = information;
        this.background = new Image();
        this.background.src = "../../assets/InformationPanelBG.png";
    }

    render(context, map) {
        context.drawImage(this.background, map.position.x + 450, map.position.y + 200, map.canvas.size.x - (map.position.x * 2) - 900, map.canvas.size.y - (map.position.y * 2) - 400);

        context.fillStyle = "#ffffff";
        context.font = "50px Aarial";
        context.textAlign = "center";
        context.fillText(this.information, map.canvas.size.x / 2, map.size.y * 0.5);
    }
}

export { InformationPanelUI }