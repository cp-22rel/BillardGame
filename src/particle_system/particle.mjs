import { Vector } from "../vector.mjs";
class Particle {
    constructor(position, lifeTime, ignorePause) {
        this.lifeTime = lifeTime;

        this.velocity = Vector.zero();
        this.size = Vector.zero();
        this.position = position;
        this.angle = 0;
        this.angularVelocity = 0;
        this.ignorePause = ignorePause ?? false;
    }

    update() { }

    render() { }
}

export { Particle };