class Missile extends Entity {
    constructor(pos, vel, a, id) {
        super(pos.x, pos.y, 4);

        this.time = 3 * 60;
        this.position = createVector(pos.x, pos.y);;
        this.velocity = p5.Vector.fromAngle(a);
        this.velocity.mult(10);
        this.velocity.add(vel);

        this.width = 2;
        this.height = 10;

        this.armed = 5;
        this.blownUp = false;

        this.id = id;
    }

    run() {
        this.armed--;

        this.update();
        this.render();
    }


    hits(asteroid) {
        if (this.armed > 0) return;

        let dist2 = (this.position.x - asteroid.position.x) * (this.position.x - asteroid.position.x)
            + (this.position.y - asteroid.position.y) * (this.position.y - asteroid.position.y);


        if (dist2 <= asteroid.rmin2) {
            this.blownUp = true;
            return true;
        }
        if (dist2 >= asteroid.rmax2) {
            return false;
        }

        if (!(asteroid instanceof Asteroid)) return false;

        var last_pos = p5.Vector.sub(this.position, this.velocity);
        var asteroid_vertices = asteroid.vertices();
        for (var i = 0; i < asteroid_vertices.length - 1; i++) {
            if (lineIntersect(last_pos,
                this.position,
                asteroid_vertices[i],
                asteroid_vertices[i + 1])) {
                this.blownUp = true;
                return true;
            }
        }

        if (lineIntersect(last_pos,
            this.position,
            asteroid_vertices[0],
            asteroid_vertices[asteroid_vertices.length - 1])) {
            this.blownUp = true;
            return true;
        }
        return false;
    }

    offscreen() {
        if (this.position.x > width || this.position.x < 0) {
            return true;
        }
        if (this.position.y > height || this.position.y < 0) {
            return true;
        }
        return false;
    }

    render() {
        push();
        rectMode(CENTER);
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + PI / 2);
        rect(0, 0, 2, 10, 3)
        pop();
    }
}