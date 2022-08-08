class Ship extends NEATAgent {
    constructor() {
        super()

        this.turnRate = 0.08;
        this.gripStatic = 0.3;
        this.position = createVector(width / 2, height / 2);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.angle = -1.56;
        this.mass = 10;
        this.currentAcceleration = 0.15;
        this.trail = [];

        this.missiles = [];

        this.firedAMissile = 0;
    }

    run() {
        this.update();
        this.render();
    }

    getPos() {
        return this.position.copy();
    }

    update() {
        if (this.done) return;

        if (this.position.x < 0 || this.position.y < 0 || this.position.x > width || this.position.y > height) {
            this.failed = true;
            this.done = true;
        }

        this.firedAMissile--;
        
        if (keyIsPressed) {
            if (keyIsDown(UP_ARROW)) {
                this.adjustVelocity(this.currentAcceleration)
            }
            if (keyIsDown(DOWN_ARROW)) {
                this.adjustVelocity(-this.currentAcceleration)
            }
            if (keyIsDown(LEFT_ARROW)) {
                this.angle -= this.turnRate;
            }
            if (keyIsDown(RIGHT_ARROW)) {
                this.angle += this.turnRate;
            }
            if (keyIsDown(32)) {
                this.fire();
            }
        }

        this.trail.push({
            position: this.getPos(),
        });

        if (this.trail.length > 400) {
            this.trail.shift()
        }

        let vB = this.vectWorldToBody(this.velocity, this.angle);
        let bodyFixedDrag;
        bodyFixedDrag = createVector(vB.x * -this.gripStatic, vB.y * 0.05);
        let worldFixedDrag = this.vectBodyToWorld(bodyFixedDrag, this.angle)
        this.acceleration.add(worldFixedDrag.div(this.mass));
        this.angle = this.angle % TWO_PI;
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration = createVector(0, 0);

        this.missiles.forEach(e => e.run())
        this.missiles = this.missiles.filter(e => e.time > 1)

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

    vectWorldToBody(vect, ang) {
        let v = vect.copy();
        let vn = createVector(
            v.x * cos(ang) + v.y * sin(ang),
            v.x * sin(ang) - v.y * cos(ang)
        );
        return vn;
    }

    fire() {
        if (this.firedAMissile > 0) return;
        this.firedAMissile = 30;
        this.missiles.push(new Missile(this.position.x, this.position.y, this.angle))
    }

    render() {
        push();
        fill(100, 100, 100, 127);
        rectMode(CENTER);
        stroke(200);
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        rect(0, 0, 10, 20, 3)
        strokeWeight(3)
        point(4, 10)
        point(-4, 10)
        pop()

        push();
        for (let p of this.trail) {
            stroke(255);
            point(p.position.x, p.position.y);
        }
        pop()
    }
}