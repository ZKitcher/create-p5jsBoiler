class Missile {
    constructor(x, y, a) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.angle = a;
        this.currentAcceleration = 0.5;
        this.time = 3 * 60;
    }

    run() {
        this.update();
        this.render();
    }

    getPos() {
        return this.position.copy();
    }

    update() {
        this.time--;
        this.adjustVelocity(this.currentAcceleration)
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration = createVector(0, 0);
    }

    adjustVelocity(accel = this.currentAcceleration) {
        this.acceleration
            .add(
                this.vectBodyToWorld(
                    createVector(0, accel),
                    this.angle
                )
            );
    }

    vectBodyToWorld(vect, ang) {
        let v = vect.copy();
        let vn = createVector(
            v.x * cos(ang) - v.y * sin(ang),
            v.x * sin(ang) + v.y * cos(ang)
        );
        return vn;
    }

    render() {
        push();
        fill(10, 10, 10, 127);
        rectMode(CENTER);
        stroke(200);
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        rect(0, 0, 2, 10, 3)
        pop()
    }
}