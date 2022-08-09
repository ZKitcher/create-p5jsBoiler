class Asteroid extends Entity {
    constructor(pos = createVector(random(width), random(height)), r = rand(40, 60), size = 3) {
        super(pos.x, pos.y, r)
        this.velocity = p5.Vector.random2D();
        this.total = floor(random(7, 15));
        this.size = size;
        switch (size) {
            case 1:
                this.velocity.mult(1.5); break;
            case 0:
                this.velocity.mult(2); break;
        }
        this.offset = [];
        for (var i = 0; i < this.total; i++) {
            this.offset[i] = random(-this.r * 0.2, this.r * 0.5);
        }

        this.rmin = this.r + minValue(this.offset);
        this.rmin2 = this.rmin * this.rmin;
        this.rmax = this.r + maxValue(this.offset);
        this.rmax2 = this.rmax * this.rmax;
        this.setRotation(rand(-0.03, 0.03))
    }

    run() {
        this.update();
        this.render();
    }

    breakup() {
        if (this.size > 0)
            return [
                new Asteroid(this.position, this.r / 2, this.size - 1),
                new Asteroid(this.position, this.r / 2, this.size - 1)
            ];
        else
            return [];
    }

    vertices() {
        var vertices = []
        for (var i = 0; i < this.total; i++) {
            var angle = this.heading + map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i];
            var vec = createVector(r * cos(angle), r * sin(angle));
            vertices.push(p5.Vector.add(vec, this.position));
        }

        return vertices;
    }

    render() {
        push();
        stroke(255);
        noFill();
        translate(this.position.x, this.position.y);
        rotate(this.heading);
        beginShape();
        for (var i = 0; i < this.total; i++) {
            var angle = map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i];
            vertex(r * cos(angle), r * sin(angle));
        }
        endShape(CLOSE);
        pop();
    }
}