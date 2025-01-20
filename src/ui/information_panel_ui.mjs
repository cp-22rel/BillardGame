import { UI } from "./ui.mjs";

class InformationPanelUI extends UI {
    constructor(information) {
        super();
        this.information = information;
        this.background = new Image();
        this.background.src = "../../assets/InformationPanelBG.png";
    }

    render(context, map) {
        context.drawImage(this.background, map.size.x * 0.35, map.size.y * 0.3, map.size.x * 0.3, map.size.y * 0.4);

        context.fillStyle = "#ffffff";
        context.font = "50px Aarial";
        context.textAlign = "center";
        context.fillText(this.information, map.size.x / 2, map.size.y * 0.5);
    }
}

export { InformationPanelUI }