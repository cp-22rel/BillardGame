import { Vector } from "./vector.mjs";
import { ParticleManager } from "./particle_system/particle_manager.mjs";
import { ColorParticle } from "./particle_system/color_particle.mjs";

const BALLSTATE = {
    full: "full",
    half: "half",
    black: "black",
    white: "white",
};

class Ball {
    constructor(position, radius, velocity, value, elasticity) {
        this.position = this.newPosition = position;
        this.radius = radius;
        this.weight = radius * radius;
        this.angle = 0;
        this.angularVelocity = this.newAngularVelocity = 0;
        this.newVelocity = this.velocity = velocity;
        this.value = value;
        this.inertia = 0.5 * this.weight * this.radius * this.radius;
        this.visible = true;
        this.isPhysical = true;
        this.traceCouldown = 4;
        this.currentCouldown = this.traceCouldown;
        let state
        if (value === 0) {
            state = BALLSTATE.white;
        }
        else if (value < 8) {
            state = BALLSTATE.full;
        }
        else if (value === 8) {
            state = BALLSTATE.black;
        }
        else {
            state = BALLSTATE.half;
        }
        this.state = state;
        this.elasticity = this.elasticity ?? 1;
    }

    update(map, others) {
        if (Vector.length(this.velocity) !== 0 && this.currentCouldown <= 0) {
            ParticleManager.manager.createParticle(new ColorParticle(
                "#ffffff33",
                20,
                this.position,
                Vector.zero(),
                new Vector(20, 20),
                new Vector(-1, -1),
                Math.atan2(this.velocity.y, this.velocity.x)));
            this.currentCouldown = this.traceCouldown;
        }
        this.currentCouldown--;
        this.angularVelocity = Math.min(this.newAngularVelocity, 360);

        const speed = Vector.length(this.velocity);

        //Rotation Calculation
        const frictionnalForce = map.friction * this.weight * map.gravity;
        const torque = frictionnalForce * this.radius;

        const angularAccerleration = torque / this.inertia;

        this.newAngularVelocity = this.approachZero(this.newAngularVelocity, angularAccerleration);



        //Magnus Force Calculation

        const n_hat = Vector.crossProduct(this.newVelocity, Vector.length(this.newVelocity));
        const magnusForce = Vector.multiply(Vector.normalize(n_hat), map.airDensity * Vector.length(this.newVelocity) * this.angularVelocity * this.radius);



        //Applying Forces
        const magnusAcceleration = Vector.divide(magnusForce, this.weight);

        this.newVelocity = Vector.addVectors(this.newVelocity, Vector.reverse(magnusAcceleration));




        this.velocity = this.newVelocity;
        this.position = this.newPosition;
        this.angle += this.angularVelocity * Math.PI / 180;
        this.newVelocity = Vector.substractVectors(this.velocity, Vector.multiply(this.velocity, map.velocityLost * this.weight));
        if (Vector.length(this.newVelocity) < 0.1) {
            this.newVelocity = Vector.zero();
            // this.newAngularVelocity = 0;
        }
        this.position = this.newPosition = Vector.addVectors(this.position, this.velocity);

        let wallColision = false;
        if (this.position.x <= this.radius + map.position.x) {
            this.newVelocity.x = Math.abs(this.velocity.x);
            this.newPosition.x = this.radius + map.position.x

            wallColision = true;
        }
        if (this.position.x >= map.size.x - this.radius) {
            this.newVelocity.x = -Math.abs(this.velocity.x);
            this.newPosition.x = map.size.x - this.radius;
            wallColision = true;
        }
        if (this.position.y <= this.radius + map.position.y) {
            this.newVelocity.y = Math.abs(this.velocity.y);
            this.newPosition.y = this.radius + map.position.y;
            wallColision = true;
        }
        if (this.position.y >= map.size.y - this.radius) {
            this.newVelocity.y = -Math.abs(this.velocity.y);
            this.newPosition.y = map.size.y - this.radius;
            wallColision = true;
        }

        if (wallColision) {
            this.colisionsEffect(Vector.addVectors(this.position, this.velocity), 5);
        }
        if (map.playerBall === this && wallColision) {
            map.roundEventLog.colisions.push("wallCollision");
        }

        this.colisionHandler(others, map);
        if (this.goalColision(map)) {
            if (map.playerBall === this) {
                map.setPlayerBall(this);
            }
            else {
                if (map.currentPlayer.ballType !== this.state) {
                    map.roundEventLog.events.push("sinkWrongBall");
                }
                map.removeBall(this);
            }
        }
    }

    render(context, texture) {
        if (this.visible) {
            context.translate(this.position.x, this.position.y);
            context.rotate(this.angle);
            context.translate(-this.position.x, -this.position.y);
            context.drawImage(texture, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
            context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    colisionHandler(others, map) {
        for (let other of others) {
            if (this != other && other.isPhysical && this.isPhysical) {
                const offset = Vector.substractVectors(other.position, this.position);
                const hyp = Vector.length(offset);
                const diff = hyp - (this.radius + other.radius);
                if (diff < 0) {

                    this.colisionsEffect(Vector.addVectors(this.position, Vector.divide(offset, 2)), 2);

                    if (this === map.playerBall || other === map.playerBall) {
                        map.roundEventLog.colisions.push(this.state === BALLSTATE.white ? other : this);
                    }

                    if (this.state === BALLSTATE.black) {
                        map.roundEventLog.colisions.push(this);
                    }

                    const scaledOffset = Vector.normalize(offset);
                    this.newPosition = Vector.addVectors(this.position, Vector.multiply(scaledOffset, -((this.radius + other.radius - hyp) / 2)));

                    const v1 = Vector.dot(this.velocity, scaledOffset);
                    const v2 = Vector.dot(other.velocity, scaledOffset);

                    const m1 = this.weight;
                    const m2 = other.weight;

                    const newVel = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * this.elasticity) / (m1 + m2);

                    this.newAngularVelocity = (this.angularVelocity * this.inertia + other.angularVelocity * other.inertia) / (this.inertia + other.inertia);
                    const normal = new Vector(offset.x / hyp, offset.y / hyp);
                    const contactPoint = new Vector(this.position.x + normal.x * this.radius, this.position.y + normal.y * this.radius);

                    this.applyCollisionImpact(contactPoint, map);
                    // this.updateAngularVelocity(this.calculateTorque(Vector.divide(Vector.addVectors(this.position, other.position), 2)));



                    this.newVelocity = Vector.addVectors(this.velocity, Vector.multiply(scaledOffset, newVel - v1));

                    //Conservation of momentum (v1*m1+v2*m2 / m1+m2)
                    // const Vcm = Vector.divide(Vector.addVectors(Vector.multiply(this.velocity, this.weight), Vector.multiply(other.velocity, other.weight)), this.weight + other.weight);
                    // const V1cm = Vector.substractVectors(this.velocity, Vcm);
                    // this.newVelocity = Vector.addVectors(Vector.reverse(V1cm), Vcm);


                }
            }
        }
    }

    goalColision(map) {
        for (let goal of map.goalPosition) {
            if (Vector.distanceTo(this.position, goal) <= this.radius * 2) {
                return true;
            }
        }
        return false;
    }

    updateAngularVelocity(torque) {
        const angularImpulse = torque / this.inertia;
        this.newAngularVelocity += angularImpulse;
    }


    applyCollisionImpact(contactPoint, map) {
        const r = Vector.substractVectors(contactPoint, this.position);

        const vAtPoint = this.velocity.x * r.y - this.velocity.y * r.x;
        this.newAngularVelocity += (5 / 2) * (vAtPoint / (this.weight * this.radius)) * map.torqueMultiplier;
    }


    approachZero(value, strength) {
        if (value === 0 || Math.abs(value) < 0.5) {
            return 0;
        }
        if (this.value === 0) {
        }
        return value - (strength * (value / Math.abs(value)))
    }

    colisionsEffect(position, count) {
        for (let i = 0; i < count; i++) {
            const velocity = new Vector((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
            ParticleManager.manager.createParticle(new ColorParticle(
                "#ffffffdd",
                40,
                position,
                velocity,
                new Vector(20, 20),
                new Vector(-0.5, -0.5),
                Math.atan2(velocity.y, velocity.x),
            )
            );
        }
    }

    static intersectsWithCursor(ball, pointer) {
        const offset = Vector.absVector(Vector.substractVectors(ball.position, pointer));
        return Vector.length(offset) <= ball.radius;
    }

    static intersectsWithBalls(ball, others) {
        for (let other of others) {
            if (ball !== other) {
                const offset = Vector.substractVectors(other.position, ball.position);
                const hyp = Vector.length(offset);
                if (hyp < ball.radius + other.radius) {
                    return true;
                }
            }
        }
        return false;
    }

    static isBallInMap(ball, map) {
        if (ball.position.x <= ball.radius + map.position.x) {
            return false;
        }
        if (ball.position.x >= map.size.x - ball.radius) {
            return false;
        }
        if (ball.position.y <= ball.radius + map.position.y) {
            return false;
        }
        if (ball.position.y >= map.size.y - ball.radius) {
            return false;
        }
        return true;
    }

}
export { Ball, BALLSTATE };