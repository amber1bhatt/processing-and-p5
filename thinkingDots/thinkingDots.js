var population;
var lifespan = 400;
var lifeP;
var count = 0;
var target;
var generations = 1;
var survivors = 0;

var rx = 0;
var ry = 150;
var rw = 300;
var rh = 20;

function setup() {
  createCanvas(400,300);
  rocket = new Rocket();
  population = new Population();
  //lifeP = createP();
  target = createVector(width/2, height/5);
}

//Random location per iteration (in progress)
//function pickLocation() {
 //var cols = floor(width/16);
 //var rows = floor(height/16);
 //target = createVector(floor(cols), floor(rows));
 //target.mult(16);
//}


function draw() {
  background(0);
  ellipse(target.x,target.y,16,16);
  population.run();
  //lifeP.html(count);
  console.log("Generation: ", generations);
  //console.log("Survivor Count: ", survivors);
  count++;

  if(count == lifespan){
    population.evaluate();
    population.selection();
    //pickLocation();
    count = 0;
    generations++;
  }


  fill(255,50);
  rect(rx,ry,rw,rh);

}


function Population() {
 this.rockets = [];
 this.popSize = 300;
 this.matingPool = [];

 for(var i = 0; i < this.popSize; i++){
   this.rockets[i] = new Rocket();
 }

 this.evaluate = function(){

  var maxFit = 0;

  for(var i =0; i < this.popSize; i++){
   this.rockets[i].calcFitness();
   if(this.rockets[i].fitness > maxFit){
    maxFit = this.rockets[i].fitness;
    console.log("Fitness: ", maxFit);
   }
  }

  for(var i =0; i<this.popSize; i++){
   this.rockets[i].fitness /= maxFit;
  }
  this.matingPool = [];
  for(var i = 0; i < this.popSize; i++){
   var n = this.rockets[i].fitness * 100;
   for(var j = 0; j < n; j++){
    this.matingPool.push(this.rockets[i]);
   }
  }
 }

 this.selection = function() {
  var newRockets = [];
  for(var i =0; i < this.rockets.length; i++){
    var parentA = random(this.matingPool).dna;
    var parentB = random(this.matingPool).dna;
    var child = parentA.crossover(parentB);
    child.mutation();
    newRockets[i] = new Rocket(child);
  }
  this.rockets = newRockets;
 }


 this.run = function() {
   for(var i = 0; i < this.popSize; i++){
     this.rockets[i].update();
     this.rockets[i].show();
   }
 }

}

function DNA(genes){
 if(genes){
  this.genes = genes;
 }else{
   this.genes = [];
  for(var i = 0; i < lifespan; i++){
   this.genes[i] = p5.Vector.random2D();
   this.genes[i].setMag(0.2);
  }
 }
  this.crossover = function(partner) {
   var newGenes = [];
   var mid = floor(random(this.genes.length));
   for(var i = 0; i < this.genes.length; i++){
     if(i > mid){
      newGenes[i] = this.genes[i];
     }else{
      newGenes[i] = partner.genes[i];
     }
   }
   return new DNA(newGenes);
  }

  this.mutation = function(){
   for(var i = 0; i < this.genes.length; i++){
    if(random(1) < 0.01){
     this.genes[i] = p5.Vector.random2D();
     this.genes[i].setMag(0.2);
    }
   }
  }

}



function Rocket(dna){
 this.pos = createVector(width/2, height*.9);
 this.vel = createVector();
 this.acc = createVector();
 this.completed = false;
 this.crashed = false;
 if(dna){
  this.dna = dna;
 }else{
   this.dna = new DNA();
 }
 this.fitness = 0;


 this.applyForce = function(force){
   this.acc.add(force);
 }

 this.calcFitness = function(){
  var d = dist(this.pos.x,this.pos.y,target.x,target.y);

  this.fitness = map(d,0,width,width,0);
  if(this.completed){
   this.fitness *= 10;
   //survivors++;
  }
  if(this.crashed){
   this.fitness /= 10;
  }

 }

  this.update = function(){
   var d = dist(this.pos.x,this.pos.y, target.x,target.y);
   if(d < 10){
     this.completed = true;
     //survivors++;
     this.pos = target.copy();
   }

   if (this.pos.x > rx && this.pos.x < rx + rw && this.pos.y > ry && this.pos.y < ry + rh) {
     this.crashed = true;
    }
    //checking edges here
   if (this.pos.x > width || this.pos.x < 0) {
     this.crashed = true;
    }
   if (this.pos.y > height || this.pos.y < 0) {
     this.crashed = true;
    }


   this.applyForce(this.dna.genes[count]);
   if(!this.completed && !this.crashed){
     this.vel.add(this.acc);
     this.pos.add(this.vel);
     this.acc.mult(0);
     this.vel.limit(4);
    }
  }

  this.show = function(){
   push();
   noStroke();
   fill(255,204,100);
   translate(this.pos.x,this.pos.y);
   rotate(this.vel.heading());
   rectMode(CENTER);
   rect(0, 0, 5, 5);
   pop();

  }

}
