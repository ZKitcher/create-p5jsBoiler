//Config Variables
const CanvasWidth = 1366;
const CanvasHeight = 768;
const CanvasColour = '#0f0f0f';
const Title = "Simulation";
const TabTitle = "Simulation";

let dataPoints = {
    'Temp': { data: 0 }
};
const loggedData = ['Temp'];

//==========================================================================
//Data manipulation

const updateData = () => {
    for (const key in dataPoints)
        $(`#${key}Val`).text(dataPoints[key].data);
}

const resetDesiredData = () => { loggedData.map(e => dataPoints[e].data = 0) }

const setHTML = () => {
    $('#title').text(Title);
    $('title').text(TabTitle);

    for (const key in dataPoints)
        $('#dataRep').append(
            `<a>${key}:
                <div class="dataPoint" id="${key}Val">${dataPoints[key].data}</div>
            </a>`);
}

//==========================================================================
// p5 setup and draw
// Initialise and update tate

function setup() {
    createCanvas(CanvasWidth, CanvasHeight);

    setHTML();

    initialiseState();
}

function draw() {
    background(CanvasColour);

    resetDesiredData();

    updateState();

    updateData();
}

const initialiseState = () => {
    for (let i = 0; i < width / 10; i++) {
        particles.push(new Particle());
    }
}

const updateState = () => {
    for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
    }
}

//==========================================================================
// p5 sketch element

let particles = [];

class Particle {
    constructor() {
        this.x = random(0, width);
        this.y = random(0, height);
        this.r = random(1, 8);
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-1, 1.5);
    }

    createParticle() {
        noStroke();
        fill('rgba(200,169,169,0.5)');
        circle(this.x, this.y, this.r);
    }

    moveParticle() {
        if (this.x < 0 || this.x > width)
            this.xSpeed *= -1;
        if (this.y < 0 || this.y > height)
            this.ySpeed *= -1;
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    joinParticles(particles) {
        particles.forEach(element => {
            let dis = dist(this.x, this.y, element.x, element.y);
            if (dis < 85) {
                stroke('rgba(255,255,255,0.04)');
                line(this.x, this.y, element.x, element.y);

                dataPoints.Temp.data++;
            }
        });
    }
}
