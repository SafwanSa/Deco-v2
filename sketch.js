var vehicles = [];
var foods = [];
var poisons = [];
var deaths = 0.0;
var born = 0;
var generation = 1;
var conNum = 30;
var debug;
var speed = 1;

function setup() {
  createCanvas(1080, 720);

  for (var i = 0; i < conNum; i++) {
    vehicles.push(new Vehicle(random(width), random(height), this.generation));
  }

  for (var i = 0; i < conNum * 2; i++) {
    foods.push(createVector(random(width), random(height)));
  }

  for (var i = 0; i < conNum / 2; i++) {
    poisons.push(createVector(random(width), random(height)));
  }

  debug = createCheckbox();
}

function draw() {
  // let x = map(mouseX, 0, width, -200, 200);
  // camera(x, 0, (height/2) / tan(PI/6), x, 0, 0, 0, 1, 0);
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

  textSize(20);
  fill(255);
  text(`D/B Rate: ${(this.deaths / this.born).toFixed(2)}`, 600, height - 10);

  if (random(1) < 5 / this.foods.length) {
    foods.push(createVector(random(width), random(height)));
  }

  if (random(1) < 1 / this.foods.length) {
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
    vehicles[i].behaviour(foods, poisons, this.vehicles);
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
