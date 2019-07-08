var s;
var scl = 20;
var count = 0;
var food;
var sp33d = 10;


//Main which creatse canvas, sets framerate, and chooses the location for the food constantly
function setup() {
  createCanvas(600,600); 
  s = new Snake();
  
  
  pickLocation();
}

//Pick location for food
function pickLocation() {
 var cols = floor(width/scl);
 var rows = floor(height/scl);
 food = createVector(floor(random(cols)),floor(random(rows)));
 food.mult(scl);
}

//Draw the background, call the death, update, and show functions
function draw() {
  background(51);
  frameRate(sp33d);
  if (s.eat(food)) {
   pickLocation();
   count++;
   sp33d++;
   console.log("Score: ",count);

  }
  s.death();
  s.update();
  s.show();
  s.auto();

  
  fill(255,0,100);
  rect(food.x,food.y,scl,scl);
}

//Key strokes function
/*function keyPressed() {
  if (keyCode === UP_ARROW){
    s.dir(0,-1);
  }else if(keyCode === DOWN_ARROW){
    s.dir(0,1)
  }else if(keyCode === RIGHT_ARROW){
    s.dir(1,0)
  }else if(keyCode === LEFT_ARROW){
    s.dir(-1,0);
  }
}*/

//Overall snake function
function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 0;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  
  this.eat = function(pos) {
   var d = dist(this.x,this.y,pos.x,pos.y);

   
   if (d <1) {
     this.total++;
    return true; 
   }else{
     return false;
   }
  }
  
  this.dir = function(x,y) {
    this.xspeed = x;
    this.yspeed = y;
  }
  
  this.death = function() {
   for (var i =0; i <this.tail.length; i++) {
    var pos = this.tail[i];
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d< 1) {
     this.total = 0;
     this.tail = [];
     count =0;
     sp33d = 10;
    }
   }
  }
  
  this.update = function() {
    if (this.total === this.tail.length) {
    for(var i = 0; i < this.tail.length-1; i++) {
     this.tail[i] = this.tail[i+1]; 
    }    
   }
   this.tail[this.total-1] = createVector(this.x,this.y);

    
   this.x = this.x + this.xspeed*scl;
   this.y = this.y + this.yspeed*scl;
   
   this.x = constrain(this.x,0,width-scl);
   this.y = constrain(this.y,0,height-scl);

  }
  
  this.show = function() {
   fill(255); 
   for (var i =0; i<this.tail.length; i++){
    rect(this.tail[i].x,this.tail[i].y, scl,scl); 
   }
    
   fill(255);
   rect(this.x,this.y,scl,scl); 
    
  }
  //automatic attempts
  this.auto = function(pos) {
   var distance = dist(this.x, this.y, pos.x, pos.y);
   if(distance <= 10){
     this.xspeed++;
     this.yspeed++;
   }
  }
  
}
