class Room {
    constructor(ships = [new Ship()/*, new Ship()*/]) {
        this.ships = ships;
        this.asteroids = [];
        this.missiles = [];
        this.spawnAsteroids()

        this.completed = false;

        this.winner = null;
    }

    run() {
        this.ships.forEach(e => e.run(this.missiles, this.ships, this.asteroids))
        this.asteroids.forEach(e => e.run())
        this.missiles.forEach(e => e.run())

        if (this.ships.find(e => e.done)) {
            this.completed = true;
        }

    }

    collisionCheck() {
        for (let i = 0; i < this.missiles.length; i++) {
            this.asteroids.forEach((f, j) => {
                if (this.missiles[i].hits(f)) {
                    let newAsteroids = this.asteroids[j].breakup();
                    this.asteroids = this.asteroids.concat(newAsteroids);
                    this.asteroids.splice(j, 1);
                }
            })

            this.ships.forEach((f) => {
                if (this.missiles[i].hits(f)) {
                    f.done = true;
                }
            })

            if (this.missiles[i].offscreen() || this.missiles[i].blownUp) {
                this.missiles.splice(i, 1)
                i--;
            }
        }

        for (let i = 0; i < this.ships.length; i++) {
            this.asteroids.forEach((f) => {
                if (this.ships[i].hits(f)) {
                    this.ships[i].done = true;
                }
            })
        }
    }

    spawnAsteroids() {
        for (var i = 0; i < 5; i++) {
            this.asteroids.push(new Asteroid());
        }
    }

}