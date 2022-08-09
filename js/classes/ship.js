class Ship extends NEATAgent {
    constructor(brain, pos = createVector(rand(width), rand(height)), r = 20) {
        super(brain);
        this.position = createVector(pos.x, pos.y);
        this.r = r;
        this.heading = 1;
        this.rotation = 0;
        this.velocity = createVector(0, 0);
        this.accelMagnitude = 0;

        this.rmax = 4 / 3 * this.r;
        this.rmax2 = this.rmax * this.rmax;
        this.rmin2 = this.r * this.r;
        this.fireTimeout = 30;

        this.id = rand()
    }

    run(missiles, opShips, asteroids) {
        if (this.done) return;

        this.fireTimeout--;

        if (keyIsDown(UP_ARROW)) {
            this.setAccel(0.1);
        } else {
            this.setAccel(0);
        }
        if (keyIsDown(LEFT_ARROW)) {
            this.heading += -0.08;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.heading += 0.08;
        }
        if (keyIsDown(32)) {
            this.fire(missiles);
        }

        //this.networkPrediction(missiles, opShips)
        this.update()
        this.velocity.mult(0.99);
        this.render()
    }

    update() {
        this.heading += this.rotation;

        var force = p5.Vector.fromAngle(this.heading);
        force.mult(this.accelMagnitude);
        this.velocity.add(force);

        this.position.add(this.velocity);
        this.edges();
    }


    networkPrediction(missiles, opShips, asteroids) {
        opShips = opShips.find(e => e.id !== this.id);

        //minValue(missiles.filter(e => e.id !== this.id).map(e => dist(e.position.x, e.position.y, this.position.x, this.position.y)))

        let inputs = [
            this.heading,
            this.position.x / width, 
            this.position.y / height, 
            opShips.position.x / width, 
            opShips.position.y / height,
        ];

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

    fire(missiles) {
        if (this.fireTimeout > 0) return;
        this.fireTimeout = 30;
        missiles.push(new Missile(this.position, this.velocity, this.heading, this.id));
    }

    hits(asteroid) {
        let dist2 = (this.position.x - asteroid.position.x) * (this.position.x - asteroid.position.x)
            + (this.position.y - asteroid.position.y) * (this.position.y - asteroid.position.y);
        if (dist2 >= (asteroid.rmax + this.rmax2) * (asteroid.rmax + this.rmax2)) {
            return false;
        }
        if (dist2 <= asteroid.rmin2) {
            return true;
        }

        var vertices = [
            createVector(-2 / 3 * this.r, this.r).rotate(this.heading),
            createVector(-2 / 3 * this.r, -this.r).rotate(this.heading),
            createVector(4 / 3 * this.r, 0).rotate(this.heading)
        ];
        for (var i = 0; i < vertices.length; i++) {
            vertices[i] = p5.Vector.add(vertices[i], this.position);
        }

        var asteroid_vertices = asteroid.vertices();

        for (var i = 0; i < asteroid_vertices.length; i++) {
            for (var j = 0; j < vertices.length; j++) {
                var next_i = (i + 1) % asteroid_vertices.length;
                if (lineIntersect(vertices[j], vertices[(j + 1) % vertices.length],
                    asteroid_vertices[i], asteroid_vertices[next_i])) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.heading);
        fill(0);
        triangle(-2 / 3 * this.r, -this.r,
            -2 / 3 * this.r, this.r,
            4 / 3 * this.r, 0);

        if (this.accelMagnitude != 0) {
            translate(-this.r, 0);
            rotate(random(PI / 4, 3 * PI / 4));
            line(0, 0, 0, 10);
        }
        pop();
    }
}

class Agent extends Ship {

}