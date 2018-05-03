// Jonas Karg 03.05.2018
// This is my attempt at building a somewhat
// flexible physics engine using basic math.

Obj myObj; // (posX, posY, mass, media)
Medium air, water; // (posX, posY, width, height, density)

void setup() {
  size(700, 700);
  air = new Medium(new PVector(0, 0), new PVector(width / 2, height), 1);
  water = new Medium(new PVector(width / 2, 0), new PVector(width / 2, height), 1.7);
  myObj = new Obj(new PVector(width / 2, height / 2), 5, new Medium[] {air, water});
  strokeWeight(2);
}

void draw() {
  background(255, 255, 255);
  if (mousePressed) {
    myObj.applyForce(new PVector(mouseX, mouseY).sub(myObj.pos).div(100));
  }
  myObj.update();
  noStroke();
  water.show();
  stroke(100);
  line(mouseX, mouseY, myObj.pos.x, myObj.pos.y);
  myObj.show();
}

// The object
class Obj {
  Medium media[];
  PVector pos = new PVector(), 
    vel = new PVector(), 
    acc = new PVector(), 
    step = new PVector();
  float mass, dTime = 0;

  Obj(PVector _pos, float _mass, Medium _media[]) {
    pos = _pos;
    mass = _mass;
    vel = new PVector(0, 0);
    acc = new PVector(0, 0);
    media = _media;
  }

  void applyForce(PVector force) {
    acc = force.div(mass);
    vel.add(acc.mult(dTime));
  }

  void update() {
    dTime = ((millis() / 1000.0) - dTime);
    for (int i = 0; i < media.length; i++) {
      if (media[i].check(pos)) {
        vel.div(media[i].density * dTime);
      }
    }

    step = PVector.add(pos, PVector.mult(vel, dTime));

    if (step.x <= 0 || step.x >= width || step.y <= 0 || step.y >= height) {
      if (step.x <= 0 || step.x >= width) {
        vel.x *= -1;
      }

      if (step.y <= 0 || step.y >= height) {
        vel.y *= -1;
      }
      vel.mult(0.9); // Stop to bounce after some time
    }
    pos.add(vel.mult(dTime));
  }

  void show() {
    strokeWeight(3);
    fill(150, 100, 100);
    ellipse(pos.x, pos.y, mass * 5, mass * 5);
  }
}

// The medium, the objects are going through.
class Medium {
  PVector pos = new PVector(), 
    size = new PVector();
  float density;

  Medium(PVector _pos, PVector _size, float _density) {
    pos = _pos;
    size = _size;
    density = _density;
  }

  Boolean check(PVector _pos) {
    if (_pos.x >= pos.x && _pos.y >= pos.y && _pos.x <= pos.x + size.x && _pos.y <= pos.y + size.y) {
      return true;
    } else {
      return false;
    }
  }

  void show() {
    fill(200, 200, 255);
    rect(pos.x, pos.y, size.x, size.y);
  }
}