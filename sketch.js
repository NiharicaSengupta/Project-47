var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, brickImage, obstaclesImage, brick;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacle;

var score=0;
var jumpSound, checkpointSound, dieSound;
var gameOver, restart, gameOverImg, restartImg;

function preload()
{
    bg = loadImage("bg.png");
    mario_running = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
    mario_collided = loadImage("collided.png");
    brickImage = loadImage("brick.png");
    obstaclesImage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    groundImage = loadImage("ground2.png");

    dieSound = loadSound("die.mp3");
    jumpSound = loadSound("jump.mp3");
    checkpointSound = loadSound("checkPoint.mp3");
}

function setup()
{
    createCanvas(600,350);

    mario = createSprite(50,295,20,50);
    mario.addAnimation("running",mario_running);
    mario.addImage("collided",mario_collided);
    mario.scale = 2;
    mario.debug = true;

    ground = createSprite(200,330,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;
    ground.velocityX = -2;

    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;

    restart = createSprite(300,140);
    restart.addImage(restartImg);
    restart.scale = 0.5;

    invisibleGround = createSpirte(200,300,400,10);
    invisibleGround.visible = false;

    bricksGroup = new Group();
    obstaclesGroup = new Group();
    
}

function draw()
{

    background(bg);
    Text("SCORE = "+score,480,30);

    if(gameState === PLAY)
    {
        ground.velocityX = -12;
        if(keyDown("space") && mario.y >= 250)
        {
            mario.velocityY = -12;
            jumpSound.play();
        }

        if(score>0 && score%10 === 0)
        {
            checkpointSound.play();
        }

        //adding the gravity to the mario
        mario.velocityY += 0.5; 

        //logic of repeating the ground image
        if(ground.x<0)
        {
            ground.x = ground.width/2;
        }

        //logic for building series of bricks
        for(var i = 0; i<bricksGroup.length; i++)
        {
            if(bricksGroup.get(i).isTouching(mario))
            {
                bricksGroup.get(i).remove;
                score += 1;
            }
        }

        mario.collide(invisibleGround);

        spawnBricks();
        spawnObstacles();

        if(obstaclesGroup.isTouching(mario))
        {
            gameState = END;
            dieSound.play();
        }
    }
    else if(gameState === END)
    {
        gameOver.visible = true;
        restart.visible = true;

        //setting the velocity of every object to 0
        ground.velocityX = 0;
        mario.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        bricksGroup.setVelocityXEach(0);

        //change the mario animation to collided
        mario.changeAnimation("collided", mario_collided);

        //set lifetime of game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        bricksGroup.setLifetimeEach(-1);

        //if mouse is pressed on the restart button the game should reset
            if(mousePressedOver(restart))
            {
                reset();
            }
    }


    drawSprites();
}

//logic of reset button
function reset()
{
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    score = 0;
    mario.changeAnimation("running", mario_running);
    obstaclesGroup.destroyEach();
    bricksGroup.destroyEach();
}

//logic of spawning the obstacles
function spawnObstacles()
{
    if(frameCount%60 === 0)
    {
        obstacle = createSprite(600, 270, 10 , 40);
        obstacle.velocityX = -6;
        obstacle.addAnimation("obstaclesImage", obstaclesImage);
        obstacle.scale = 1.5;
        obstacle.lifetime = 300;
        obstaclesGroup.add(obstacle);
    }
}

//logic of spawning the bricks
function spawnBricks()
{

}
