var mr = 0.01;
class Vehicle {
  constructor(x, y, name, dna) {
    this.name = name;
    this.pos = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = random(1, 3);
    this.maxSpeed = (1 / this.r) * 10;
    this.maxForce = random(0.1, 0.3);
    this.momentum = 1;
    this.health = 1;
    this.dna = [];

    if (dna === undefined) {
      // Food Weight
      this.dna[0] = random(-2, 2);
      // Poison Weight
      this.dna[1] = random(-2, 2);
      // Food Perception
      this.dna[2] = random(0, 100);
      // Poison Perception
      this.dna[3] = random(0, 100);
    } else {
      // Mutation
      this.dna[0] = dna[0];
      if (random(1) < mr) {
        this.dna[0] += random(-0.1, 0.1);
      }

      this.dna[1] = dna[1];
      if (random(1) < mr) {
        this.dna[1] += random(-0.1, 0.1);
      }

      this.dna[2] = dna[2];
      if (random(1) < mr) {
        this.dna[2] += random(-10, 10);
      }

      this.dna[3] = dna[3];
      if (random(1) < mr) {
        this.dna[3] += random(10, 10);
      }
    }
  }

  update = function () {
    // Decrease the health
    this.health -= 0.01 * (1 / this.r);

    // Accelerate
    this.velocity.add(this.acceleration);

    // Limit the velocity to the max speed
    this.velocity.limit(this.maxSpeed);

    // Update position
    this.pos.add(this.velocity);

    // Reset the acceleration each cycle
    this.acceleration.mult(0);
  };

  behaviour = function (good, bad) {
    var steerG = this.eat(good, 0.2, this.dna[2]);
    var steerB = this.eat(bad, -0.8, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerG.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  };

  eat = function (list, nutrition, perception) {
    var minDist = Infinity;
    var closest = null;

    for (var i = list.length - 1; i >= 0; i--) {
      var d = list[i].dist(this.pos);

      if (d < this.maxSpeed && d < perception) {
        this.health += nutrition;
        if (this.r < 5) {
          this.r += 0.1;
          this.maxSpeed = (1 / this.r) * 10;
        }
        list.splice(i, 1);
      } else {
        if (d < minDist) {
          minDist = d;
          closest = list[i];
        }
      }
    }

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  };

  seek = function (target) {
    var desired = p5.Vector.sub(target, this.pos);

    desired.setMag(this.maxSpeed);

    var steer = p5.Vector.sub(desired, this.velocity);

    steer.limit(this.maxForce);

    return steer;
  };

  applyForce = function (force) {
    // Adding the mass
    var newForce = force.mult(1 / this.r);
    this.acceleration.add(newForce);
  };

  boundries = function () {
    var d = 25;

    var desired = null;

    if (this.pos.x < d) {
      desired = createVector(this.maxSpeed, this.velocity.y);
    } else if (this.pos.x > width - d) {
      desired = createVector(-this.maxSpeed, this.velocity.y);
    }

    if (this.pos.y < d) {
      desired = createVector(this.velocity.x, this.maxSpeed);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxSpeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxSpeed);

      var steer = p5.Vector.sub(desired, this.velocity);

      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  };

  clone = function (name) {
    if (random(1) < 0.001) {
      return new Vehicle(random(width), random(height), name, this.dna);
    }
    return null;
  };

  dead = function () {
    return this.health <= 0;
  };

  display = function () {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);

    textSize(10);
    fill(255);
    text(`${this.name}`, -6, this.r + 15);

    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  };
}
