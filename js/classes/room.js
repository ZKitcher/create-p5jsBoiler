class Room {
    constructor(ships = [new Ship(), new Ship()], id, topRoom) {
        this.ships = ships;
        this.missiles = [];

        this.completed = false;

        this.id = id;

        this.winner = null;

        this.topRoom = topRoom;
    }

    run() {
        this.missiles.forEach(e => e.run())
        this.ships.forEach(e => e.run(this.missiles, this.ships))

        this.collisionCheck();

        if (this.ships.find(e => e.done)) {
            this.completed = true;
        }
    }

    collisionCheck() {
        for (let i = 0; i < this.missiles.length; i++) {
            this.ships.forEach((f) => {
                if (f.shield < 0 && this.missiles[i].hits(f)) {
                    f.failed = true;
                    this.missiles[i].success = true;
                    f.score += 1000;
                    this.ships.forEach(g => g.done = true)
                }
            })

            if (this.missiles[i].offscreen() || this.missiles[i].blownUp) {
                this.missiles.splice(i, 1)
                i--;
            }
        }
    }

    render(){
        this.missiles.forEach(e => e.render())
        this.ships.forEach(e => e.render())
    }

}