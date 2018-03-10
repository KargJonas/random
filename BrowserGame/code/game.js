// Jonas Karg 28.01.2018

// Elements
var fps = document.getElementById("frameDisplay");

// Variables
var cnv,
    x, y,
    scl = 10, nodes = 70, perlinZoom = 10, deltaHeight = 100, waterLevel,
    shift,
    rot = 0,
    heightMap = [],
    borderWidth = 10,
    perlinOffset;

function setup() {
    cnv = createCanvas(innerWidth, innerHeight, WEBGL);
    cnv.parent("gameContainer");
    setAttributes('antialias', true);
    
    strokeWeight(1);
    shift = scl * (nodes - 1) / 2;
    waterLevel = random(10, 60);

    for (x = 0; x < nodes; x ++) {
        heightMap[x] = [];
        for (y = 0; y < nodes; y++) {
            heightMap[x][y] = noise(x / perlinZoom, y / perlinZoom) * deltaHeight;
        }
    }
}

function draw() {
    background(0, 0, 0, 0);
    fpsUpdater();

    ambientLight(50, 50, 50);
    // pointLight(255, 255, 255, 100, 100, 0);

    rotateX(radians(70));
    if (mouseIsPressed) {rot = radians(-mouseX / 5.0);}
    rotateZ(rot);

    noStroke(); // Water
    translate(-shift, -shift, waterLevel);
    fill(100, 100, 255);
    rect(0, 0, shift * 2, shift * 2);
    translate(0, 0, -waterLevel);
    
    stroke(0); // Terrain
    fill(100, 255, 100);
    terrain();
    
    fill(255); // Borders
    borders();
}

function terrain() {
    for (y = 0; y < nodes - 1; y ++) {
        beginShape(TRIANGLE_STRIP);
        for (x = 0; x < nodes; x ++) {
            fill(map(heightMap[x][y], 0, deltaHeight, 50, 255), 200, 0);
            vertex(x * scl, y * scl, heightMap[x][y]);
            vertex(x * scl , (y + 1) * scl, heightMap[x][y+1]);
        }
        endShape();
    }
}

function borders() {
    translate(shift, 0, deltaHeight / 2);
    box(2 * shift + borderWidth, borderWidth, deltaHeight / 2 + 20);
    translate(0, shift * 2, 0);
    box(2 * shift + borderWidth, borderWidth, deltaHeight / 2 + 20);
    translate(shift, -shift, 0);
    box(borderWidth, 2 * shift + borderWidth, deltaHeight / 2 + 20);
    translate(-shift * 2, 0, 0);
    box(borderWidth, 2 * shift + borderWidth, deltaHeight / 2 + 20);
}

function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
}

function fpsUpdater() {
    if(frameCount % 10 == 0) {
        fps.innerHTML = "Framerate: " + round(frameRate());
    }
}

function randomWorld() {
    console.log("Generating new world...");
    perlinOffset += random(0, 0.001);
    for (x = 0; x < nodes; x ++) {
        for (y = 0; y < nodes; y++) {
            heightMap[x][y] = noise((x + perlinOffset) / perlinZoom, (y + perlinOffset) / perlinZoom) * deltaHeight;
        }
    }
    console.log("Done..");
    document.getElementById("testButton").value = "Nice, you broke it!";
}