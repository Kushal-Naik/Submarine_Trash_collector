var LOGO = 0;
var READY =1
var PLAY = 2;
var END = 3;
var gameState = 0;

var DR, DRimg;
var sea;
var bR, bL, bD;

var TC = 0;
var t = 1000;
var timerValue;

var canI, bottleI, maskI, sodaI, trashI;
var f1, f2, f3, f4;
var logo, logoI;
var restart, restartI;

localStorage["HighestScore"] = 0;

function preload()
{
  scrapS = loadSound('sfx/scrap.wav');
  oceanS = loadSound('sfx/ocean.mp3');

	DRimg = loadImage("img/submarine-r.png");
  seaImg = loadImage("img/sea.png");
  sea1 = loadImage("img/sea1.png");

  bottleI = loadImage("img/bottle.png");
  canI = loadImage("img/can.png");
  maskI = loadImage("img/mask.png");
  sodaI = loadImage("img/soda-can.png");
  trashI = loadImage("img/trash-bag.png");

  logoI = loadImage("img/logo.png");
  restartI = loadImage("img/restart.png");
  start1 = loadImage("img/start1.png");

  f1 = loadImage("img/f1.png");
  f2 = loadImage("img/f2.png");
  f3 = loadImage("img/f3.png");
  f4 = loadImage("img/f4.png");

  //skyI = loadImage("img/sky.png");

}

function setup() {
	//createCanvas(displayWidth, displayHeight-150);
  createCanvas(1300, 650);

    bR = createSprite(-2200, 1700, 1000, 2016);
    bR.shapeColor = "#CEA588";

    bL = createSprite(2200, 1700, 1000, 2016);
    bL.shapeColor = "#CEA588";

    bD = createSprite(0, 3200, 4600, 1000);
    bD.shapeColor = "#CEA588";

    bU = createSprite(0, 660, 4000, 20);
    bU.visible = false;

    // sky = createSprite(0, 690, 3416, 1000);
    // sky.addImage("sky", skyI);
    // sky.scale = 1; 

    sea = createSprite(0, 1700, 3416, 2016);
    sea.addAnimation("sea1", sea1);

       

    animals = new Group();
    obstacles = new Group();
    
    DR = createSprite(0, 690, 80,60);
    DR.shapeColor = "blue"; 
    DR.addImage(DRimg);
    DR.scale = 0.7;
    DR.setCollider("rectangle", 0, 20, 225, 100, 0);
    
    restart = createSprite(DR.x,DR.y+140);
    restart.addImage(restartI);
    restart.scale = 0.4;
    restart.visible = false;

    start = createSprite(DR.x, DR.y+150);
    start.addImage(start1);
    start.scale = 0.5;

    logo = createSprite(0, 500);
    logo.addImage(logoI);
    logo.scale = 0.35;

    //oceanS.play();
        
}

function draw() {
  rectMode(CORNER);
  //background(200, 100, 255);
  //background(0, 144, 208);
  background(7, 0, 64);

  camera.position.x = DR.x;
  camera.position.y = DR.y;

  //LOGO
  if(gameState === 0){
    logo.visible = true;

    if(mousePressedOver(start)){
      start.visible = false;
      gameState = 1;
      timerCountdown();
    }
    
  }

  //READY
  if(gameState === 1){
    logo.visible = false;
    //start.visible = true;


    timerValue = 60;
    restart.visible = false;
    DR.x = 0;
    DR.y = 690;
    
    spawnA();
    spawnO();
    TC = 0;

    if(TC === 0){
      gameState = 2;
    }

  }

  //PLAY
  if(gameState === 2){

      if(DR.isTouching(obstacles, removeBlocks)){
        scrapS.play();
        TC = TC + 1;
      }

      if(bR.isTouching(animals, removeA) || bL.isTouching(animals, removeA)){
        
      }

      collide();
      Dmovement();
            
      if (timerValue == 0) {
        gameState = 3;
      }
  }

  //END
  if(gameState === 3){
    if(localStorage["HighestScore"]<TC){
      localStorage["HighestScore"] = TC;
    }

    DR.velocityX = 0;
    DR.velocityY = 0;    

    restart.visible = true;
    restart.x = DR.x;
    restart.y = DR.y +200;

    if(mousePressedOver(restart)){
      t = 1000;
      animals.destroyEach();
      obstacles.destroyEach();
      gameState = 1;
    }

    
    
  }

  drawSprites();
      
  textAlign(CENTER, CENTER);
  fill("white");
  strokeWeight(100);
  textSize(30);
  text("Trash Collected : " +TC, DR.x + 450, DR.y - 250);
  text("High Score: "+ localStorage["HighestScore"], DR.x-500,DR.y -250);

  textSize(80);
  text(timerValue, DR.x, DR.y - 260);

  if(gameState === 3){
    textSize(100);
    text("GAME OVER", DR.x, DR.y-125);
  }

  
  //L -1026 682
  //R  1025 580
  //D  60 2393

  console.log(DR.x, DR.y);
}

function spawnA(){
  for (var j = 0; j < 26; j++) {
    var a = createSprite(random(-1600, 1600), random(680 ,2700), 60, 30);
    // a.shapeColor = "green";
    var randA = Math.round(random(1,4));
    switch(randA) {
      case 1: a.addImage(f1);
              a.velocityX = a.velocityX+1;
              a.setCollider("rectangle", 0, 0, 200, 100);
              break;
      case 2: a.addImage(f2);
              a.velocityX = a.velocityX-1;
              a.setCollider("rectangle", 0, 0, 400, 200);
              break;
      case 3: a.addImage(f3);
              a.velocityX = a.velocityX-1;
              break;
      case 4: a.addImage(f4);
              a.velocityX = a.velocityX+1;
              a.setCollider("rectangle", 0, 0, 450, 300);
              break;
      default: break;
    }

    a.scale = 0.2;
    //a.debug = true;
    animals.add(a);
    
  }

}

function spawnO(){
  for (var i = 0; i < 50; i++) {
    var o = createSprite(random(-1600, 1700), random(680 ,2600), 60, 30);
    
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: o.addImage(canI);
              o.scale = 0.15;
              break;
      case 2: o.addImage(bottleI);
              o.scale = 0.2;
              break;
      case 3: o.addImage(maskI);
              o.scale = 0.15;
              break;
      case 4: o.addImage(sodaI);
              o.scale = 0.15;
              break;
      case 5: o.addImage(trashI);
              o.scale = 0.2;
              break;
      default: break;
    }

    obstacles.add(o);
  }
}

function timerCountdown() {
  setInterval(function() {
    if (timerValue > 0) {
      timerValue--;
    }
  }, t);
}

function removeA(sprite, animal){
  animal.remove();
}

function removeBlocks(sprite, obstacle){
  obstacle.remove();
}

function Dmovement(){
  

  //safety
  if(keyDown("P")){
    DR.x = 60;
    DR.y = 580;
    DR.velocityX = 0;
    DR.velocityY = 0;
  }

  //movement
  if(keyDown("W") || keyDown(UP_ARROW)){
    //DR.y = DR.y - 15;
    DR.velocityY = DR.velocityY - 1;
  }
  if(keyDown("S") || keyDown(DOWN_ARROW)){
    //DR.y = DR.y + 15;
    DR.velocityY = DR.velocityY + 1;
  }
  if(keyDown("A") || keyDown(LEFT_ARROW)){
    //DR.x = DR.x - 15;
    DR.velocityX = DR.velocityX - 1;
  }
  if(keyDown("D") || keyDown(RIGHT_ARROW)){
    //DR.x = DR.x + 15;
    DR.velocityX = DR.velocityX + 1;
  }

  //Brake
  if(keyDown("space")){
    DR.velocityY = 0;
    DR.velocityX = 0;
  }

  //gravity
  //DR.velocityY = DR.velocityY + 0.2;
  //box1.velocityY = box1.velocityY + 0.3;

  //water resistance
  if(DR.velocityX > 0){
    DR.velocityX = DR.velocityX - 0.15;
  }
  if(DR.velocityX < 0){
    DR.velocityX = DR.velocityX + 0.15;
  }
  if(DR.velocityY < 0){
    DR.velocityY = DR.velocityY + 0.15;
  }
  if(DR.velocityY > 0){
    DR.velocityY = DR.velocityY - 0.15;
  }
}

function collide(){
  DR.collide(bR);
  DR.collide(bL);
  DR.collide(bD);
  DR.collide(bU);
}