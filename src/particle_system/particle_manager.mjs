import { Particle } from "./particle.mjs";

class ParticleManager {
    constructor() {
        this.particles = [];
    };

    static manager = new ParticleManager();

    createParticle(particle) {
        this.particles = [...this.particles, particle];
    }

    update(context, isRunning = true) {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles.length > 0 && this.particles[i] instanceof Particle) {
                if (this.particles[i].lifeTime <= 0) {
                    this.particles = this.particles.filter((particle) => particle !== this.particles[i]);
                    continue;
                }
                if (isRunning) {
                    this.particles[i].update();
                    this.particles[i].render(context);
                }
                else if (this.particles[i].ignorePause) {
                    this.particles[i].update();
                    this.particles[i].render(context);
                }
            }
        }
    }
}
export { ParticleManager };