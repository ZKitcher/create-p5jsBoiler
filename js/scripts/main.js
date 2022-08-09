
let room;
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    room = new Room();

}

function draw() {
    push();
    background(51);
    pop();

    run();
}

const run = () => {
    // RUN objects here
    room.run();

    render()
}

const render = () => {
    renderText();
}

const renderText = () => {
    // Render text at the bottom left of the screen.
    push();
    fill('#FFF');
    [
        `Framerate : ${frameRate().toFixed(0)}`,
    ].reverse().forEach((e, i) => text(e, 10, height - (13 * (i + 1))));
    pop();
}

function keyPressed() {
    // Switch case for key pressed event listeners.
    switch (key.toLowerCase()) {
        case 'c':
            createCanvas(window.innerWidth, window.innerHeight);
            break;
    }
}

function mouseClicked() { }

const lineIntersect = (l1v1, l1v2, l2v1, l2v2) => {
    var base = p5.Vector.sub(l1v1, l2v1);
    var l1_vector = p5.Vector.sub(l1v2, l1v1);
    var l2_vector = p5.Vector.sub(l2v2, l2v1);
    var direction_cross = cross(l2_vector, l1_vector);
    var t = cross(base, l1_vector) / direction_cross;
    var u = cross(base, l2_vector) / direction_cross;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return true;
    } else {
        return false;
    }
}

const cross = (v1, v2) => {
    return v1.x * v2.y - v2.x * v1.y;
}