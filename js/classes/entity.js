class Entity {
    constructor(x, y, radius) {
        this.position = createVector(x, y);
        this.r = radius;
        this.rmax = radius;
        this.heading = 1;
        this.rotation = 0;
        this.velocity = createVector(0, 0);
        this.accelMagnitude = 0;
    }

    update() {
        this.heading += this.rotation;

        var force = p5.Vector.fromAngle(this.heading);
        force.mult(this.accelMagnitude);
        this.velocity.add(force);

        this.position.add(this.velocity);
        this.edges();
    }

    setAccel(magnitude) {
        this.accelMagnitude = magnitude;
    }

    edges() {
        if (this.position.x > width + this.rmax) {
            this.position.x = -this.rmax;
        } else if (this.position.x < -this.rmax) {
            this.position.x = width + this.rmax;
        }
        if (this.position.y > height + this.rmax) {
            this.position.y = -this.rmax;
        } else if (this.position.y < -this.rmax) {
            this.position.y = height + this.rmax;
        }
    }

    setRotation(rot) {
        this.rotation = rot;
    }
}