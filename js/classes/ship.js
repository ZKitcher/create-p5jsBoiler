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

        this.shield = 120;    

        this.colour = [rand(100, 255), rand(100, 255), rand(100, 255)]
    }

    run(missiles, opShips, asteroids) {
        if (this.done) return;

        if (this.fireTimeout > 0) this.fireTimeout--;
        this.shield--;

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

        this.score++;

        if (this.score > 30 && this.velocity > 1) {
            this.done = true;
            this.failed = true;
        }

        this.networkPrediction(missiles, opShips, asteroids)
        this.update()
        this.velocity.mult(0.99);
        //this.render()
    }

    update() {
        this.heading += this.rotation;

        var force = p5.Vector.fromAngle(this.heading);

        if (!isNaN(this.accelMagnitude) && this.accelMagnitude !== 0) {
            force.mult(this.accelMagnitude);
            this.velocity.add(force);
        }

        this.position.add(this.velocity);
        this.edges();
    }


    networkPrediction(missiles, opShips) {
        let op = opShips.find(e => e.brain.id !== this.brain.id);

        let missile = missiles.filter(e => e.id !== this.brain.id)
            .sort((a, b) =>
                dist(a.position.x, a.position.y, this.position.x, this.position.y) -
                dist(b.position.x, b.position.y, this.position.x, this.position.y)
            ) ?? {
            heading: 0,
            position: {
                x: 0,
                y: 0
            }
        };

        if (missile.length > 5) {
            missile = missile.slice(0, 5);
        } else {
            while (missile.length < 5) {
                missile.push({
                    heading: 0,
                    position: {
                        x: 0,
                        y: 0
                    }
                })
            }
        }

        let inputs = [
            this.heading,
            this.position.x / width,
            this.position.y / height,
            this.fireTimeout / 30,

            op.heading,
            op.position.x / width,
            op.position.y / height,

        ];

        inputs = inputs.concat(missile.map(e => [
            e.heading,
            e.position.x / width,
            e.position.y / height,
        ])).flat()

        this.prediction = this.brain.predict(inputs);

        this.prediction[0] = between(this.prediction[0], -1, 1);
        this.prediction[1] = between(this.prediction[0], -1, 1);
        this.prediction[2] = between(this.prediction[0], -1, 1);

        this.setAccel(this.prediction[0] * 0.1);
        this.heading += this.prediction[1] * 0.08;
        if (this.prediction[2] > 0) {
            this.fire(missiles);
        }
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

    calculateFitness() {
        this.fitness = this.score;

        if (this.failed === true || this.success === false) this.fitness /= 2;

        if (this.success) this.fitness += this.fitness * 0.2;
    }

    render() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.heading);
        this.shield > 0 ? fill(100, 100, 255) : fill(this.colour);
        
        if(this.topAgent){
            fill(0, 0, 0)
        }

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
