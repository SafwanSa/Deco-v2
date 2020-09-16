var vehicles = [];
var foods = [];
var poisons = [];
var deaths = 0.0;
var born = 0;
var generation = 1;
var conNum = 20;

function setup() {
  createCanvas(600, 600);

  for (var i = 0; i < conNum; i++) {
    vehicles.push(new Vehicle(random(width), random(height), this.generation));
  }

  for (var i = 0; i < conNum * 2; i++) {
    foods.push(createVector(random(width), random(height)));
  }

  for (var i = 0; i < conNum / 2; i++) {
    poisons.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(51);
  textSize(20);
  fill(255);
  text(`Population: ${this.vehicles.length}`, 10, height - 10);

  textSize(20);
  fill(255);
  text(`Deaths: ${this.deaths}`, 150, height - 10);

  textSize(20);
  fill(255);
  text(`Born: ${this.born}`, 300, height - 10);

  textSize(20);
  fill(255);
  text(`Generation: ${this.generation}`, 400, height - 10);

  if (random(1) < 0.8 / this.vehicles.length) {
    foods.push(createVector(random(width), random(height)));
  }

  if (random(1) < 0.01) {
    poisons.push(createVector(random(width), random(height)));
  }

  for (var i = 0; i < foods.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(foods[i].x, foods[i].y, 4, 4);
  }

  for (var i = 0; i < poisons.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poisons[i].x, poisons[i].y, 4, 4);
  }

  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].behaviour(foods, poisons);
    vehicles[i].boundries();
    vehicles[i].display();
    vehicles[i].update();
    var child = vehicles[i].clone(this.generation);
    if (child) {
      vehicles.push(child);
      this.born += 1;
      if ((this.vehicles.length + this.deaths) % (conNum / 2) === 0) this.generation += 1;
    }

    if (vehicles[i].dead()) {
      foods.push(createVector(vehicles[i].pos.x, vehicles[i].pos.y));
      vehicles.splice(i, 1);
      this.deaths += 1;
      if ((this.vehicles.length + this.deaths) % (conNum / 2) === 0) this.generation += 1;
    }
  }
}
