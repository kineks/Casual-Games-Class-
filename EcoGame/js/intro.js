{
    var stage;
    var keys = {
        rkd: false,
        lkd: false,
        ukd: false,
        dkd: false
    };

    var gameIsRunning = true;
    var player;
    var block = {};
    block.width = 20;
    block.heigh = 40;
    var weaponColide = [];
    weaponColide.x = 0;
    weaponColide.y = 0;
    weaponColide.width = 0;
    weaponColide.height = 0;
    var speed = 3;
    var speedCurrent;
    var jumpTemp = 0;
    var jumpSpeed = 20;
    var isJumping = false;
    var mustTouchGround = false;
    var enemyKills = 0;
    var score = 0;
    var scoreText;
    var lifeText;


    var ground;
    var ground2;
    var container;

    var mouseCheck = false;
    var weaponCooldown = 20;
    var weaponDuration = 1;
    var weaponWidh = 100;
    var weaponHeight = 80;
    var attackTimer = 0;
    var attackCheck = false;
    var weaponDamage = 1;
    var enemyList = [];
    var powerUpList = [];
    var queue;
    var preloadText;
    var playerSS;

    var lifeFull = 5;
    var timeUntilSummon = 0;
    var timeUntilSummonMultiplier = 1;
    var timeUntilSummonMultiplierIncrease = 60;
    var summonMultiplierIncrease = 0.01;


    var random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}


function resetWeapon() {
    weaponColide.x = 0;
    weaponColide.y = 0;
    weaponColide.width = 0;
    weaponColide.height = 0;
}

var goRight = function () {
    player.x += speedCurrent;
};

var goLeft = function () {
    player.x -= speedCurrent;
};

function fingerDown(e) {
    /*    console.log(e.keyCode);*/
    if (e.keyCode === 68) {
        keys.rkd = true;
    }
    if (e.keyCode === 87) {
        keys.ukd = true;
    }
    if (e.keyCode === 65) {
        keys.lkd = true;
    }
    if (e.keyCode === 83) {
        keys.dkd = true;
    }
    if (e.keyCode === 49) {
        // buttonul 1
    }
    if (e.keyCode === 50) {
        // buttonul 2
    }
    if (e.keyCode === 85) {
        mouseCheck = true;
    }
}

function fingerUp(e) {
    if (e.keyCode === 68) {
        keys.rkd = false;
    }
    if (e.keyCode === 87) {
        keys.ukd = false;
    }
    if (e.keyCode === 65) {
        keys.lkd = false;
    }
    if (e.keyCode === 83) {
        keys.dkd = false;
    }
    if (e.keyCode === 49) {

    }
    if (e.keyCode === 85) {
        mouseCheck = false;
    }

}

function mouseDown() {

    mouseCheck = true;
}

function mouseUp() {
    mouseCheck = false;

}

function charJump() {
    var factor = 0.2;
    if (isJumping) {
        player.y -= jumpTemp;
        jumpTemp = (1 - factor) * jumpTemp;
        if (jumpTemp <= 1) {
            isJumping = false;
        }
    }
    else if (mustTouchGround) {
        player.y += jumpTemp;
        jumpTemp = (1 + factor) * jumpTemp * 0.85;
    }
}

function movePlayer() {
    if (keys.rkd) {
        speedCurrent = speed;
        playerMove(goRight);
        player.x += speed;
    }
    if (keys.lkd) {
        speedCurrent = speed;
        playerMove(goLeft);
        player.x -= speed;
    }
    if ((keys.ukd) && (isJumping == false)) {
        if (mustTouchGround) {

        }
        isJumping = true;
        jumpTemp = jumpSpeed;
        mustTouchGround = true;
    }
    if (keys.dkd) {
        player.y += speed*2;
    }
}

function playerMove() {
    for (var i = 1; i <= 2; i++) {
        (function () {
            setTimeout(function () {
                speedCurrent = speedCurrent / 2;
                if (speedCurrent < 0.5) {
                    speedCurrent = speed;
                }
            }, i * 100);
        })(i);
    }
}
function movePowerUp() {
    for ( var i=0; i<powerUpList.length; i++){
        var power = powerUpList[i];

        if ( (power.y < 540-power.height ) && (power.levitate==false)){

            power.y += power.speed;
            power.speed=power.speed*1.01;
        }
        else if ((power.y + power.height  > 460) && ( power.levitate==false)){
   power.y = 520 -power.height;
            power.levitate=true;

        }





        if ((power.levitate) && (power.levCheck)) {
            power.y ++;
            power.levAmount++;

        }
         if ((power.levCheck)&&(power.levAmount >= 20 )) {
            power.levCheck = false;
        }
         if (power.levCheck == false ){
            power.y--;
            power.levAmount--;
        }
         if ((power.levCheck == false ) && ( power.levAmount < -20 )){
            power.levCheck = true;
        }


    }
}
function moveEnemies() {
    for (var i = 0; i < enemyList.length; i++) {


        var block = enemyList[i];
        if (block.enemyMove == true) {
            if (block.alive) {
                block.x = block.x - block.speedX;
                if (block.goingUp) {
                    block.y -= block.speedY;
                    if (block.y < block.posHeight - block.maxHeightDiff) {
                        block.goingUp = false;
                    }

                }
                else {
                    block.y += block.speedY;
                    if (block.y > block.posHeight + block.maxHeightDiff) {
                        block.goingUp = true;
                    }
                }
                /* var tempY = block.y;
                 if (tempY == block.y ) {
                 block.y--;
                 if ((block.y + 5 ) == tempY){
                 block.y++;
                 }
                 }*/


                if (block.x < 0 - block.width) {
                    block.container.removeChild(block);
                    block.alive = false;
                    if ( block.name == "trash") {
                        lifeFull--;


                    }
                    else if ( block.name == "special" ){
                        score+=1000;
                    }
                    else {
                        score+=100;
                    }
                    resetPosition(block);
                    block.container.removeChild(block.healthText);
                   /* switch(block.name){
                        case "trash":
                            lifeFull--;
                            enemyCount++;
                            break;
                        default:
                            break;
                        }*/


                }
            }
        }
        block.healthText.x = block.x - block.width / 2;
        block.healthText.y = block.y - block.height;
        block.healthText.text = "Health : " + block.currHealth;
    }
}


function hitTest(rect1, rect2) {
    /*  console.log(" rect1 x = " + rect1.x + " rect 2 .x " + rect2.x + " rect2 width  " + rect2.width + " rect2 height " + rect2.height)*/
    if (rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y) {
        return false;
    }

    return true;
}


/*

 function collide() {
 if (hitTest(block, player)) {
 }
 if (hitTest(block, weaponColide)) {
 for (var i = 1; i < enemyList.length; i++) {

 if (block.id == i) {
 block.currHealth -= weaponDamage;
 console.log(block.currHealth);
 damageEnemy(block);}
 block.healthDamage = true;
 }

 }
 }
 */

function collidePowerUp() {
    for (var i = 0; i < powerUpList.length; i++)
    {
        var powerCollider = {
            x : powerUpList[i].x,
            y : powerUpList[i].y ,
            width : powerUpList[i].width,
            height : powerUpList[i].height
        };

        if (hitTest(powerCollider, player)){
            speed += 0.01;
          container.removeChild(powerUpList[i]);
        }
    }
}

function collideBlock() {

    for (var i = 0; i < enemyList.length; i++) {

        var currCollider = {
            x: enemyList[i].x + enemyList[i].container.x,
            y: enemyList[i].y,
            width: enemyList[i].width,
            height: enemyList[i].height
        };

        if (hitTest(currCollider, weaponColide)) {


            enemyList[i].currHealth -= weaponDamage;
            /*      console.log(enemyList[i].currHealth);*/
            damageEnemy(enemyList[i]);
            enemyList[i].healthDamage = true;
        }


    }
}


function damageEnemy(event) {
    if (event.currHealth < 1) {
        event.container.removeChild(event);
        event.alive = false;
        if ( event.name == "trash") {
         score+=10;
            enemyKills++;
            if (enemyKills % 5 == 0 ){
                summonPowerUp(event.x, event.y);
            }
            console.log(enemyKills);

        }
        else if ( event.name == "special" ){
            score+=100;
        }
        else {
            lifeFull--;
        }
        resetPosition(event);
        event.container.removeChild(event.healthText);
        delete enemyList[event];


    }
}
function summonPowerUp(posX, posY) {
    var power = new createjs.Shape();
    power.graphics.beginFill('#F00');
    power.graphics.drawRect(0, 0, 31, 31);
    power.width = 31;
    power.height = 31;
    power.x = posX;
    power.y = posY;
    power.speed = 1;
    power.levitate = false;
    power.levCheck = true;
    power.levAmount = 0;
    container.addChild(power);
    powerUpList.push(power);
}


function summonEnemy() {


    var block = new createjs.Shape();
    block.type = random(1, 100);
    block.name = "";
    if( block.type <= 20 ) {
        block.name = "fish";
    }
    else if ( block.type >= 95 ) {
        block.name = "special";
    }
    else if ( 20 < block.type < 95 ) {
        block.name = "trash";
    }



    switch(block.name){
        case "fish":
            console.log(block.name + " random number is : " + block.type);

            block.graphics.beginFill('#bFF');
            block.graphics.drawRect(0, 0, 60, 40);
            block.width = 60;
            block.height = 40;
            block.speedY = 1;
            block.speedX = 4;

            break;
        case "trash":
            console.log(block.name + " random number is : " + block.type);

            block.graphics.beginFill('#000');
            block.graphics.drawRect(0, 0, 20, 40);
            block.width = 20;
            block.height = 40;
            block.speedY = Math.floor(Math.random() * ((2*(timeUntilSummonMultiplier) - 1) + 1) + 1);
            block.speedX = Math.floor(Math.random() * ((2*(timeUntilSummonMultiplier) - 1) + 1) + 1);

            break;
        case "special":
            console.log(block.name + " random number is : " + block.type);


            block.graphics.beginFill('#FFF');
            block.graphics.drawRect(0, 0, 70, 70);
            block.width = 70;
            block.height = 70;
            block.speedY = 0.6;
            block.speedX = 0.6;

            break;
        default :
            break;
    }
    block.x = 800;

    block.maxHeightDiff = Math.floor(Math.random() * ((200 - 5) + 1) + 5);
    block.y = Math.floor(Math.random() * (((540-block.height - block.maxHeightDiff) - (block.maxHeightDiff)) + 1) + block.maxHeightDiff);
    block.goingUp = Math.random() <= 0.5;
    block.posHeight = block.y;



    block.health = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    block.currHealth = block.health;
    block.alive = true;
    block.healthText = new createjs.Text('Health :', "30px Calibri", "#0F0");
    block.enemyMove = true;
    block.container = container;
    block.healthDamage = true;
    container.addChild(block.healthText);

    container.addChild(block);
    enemyList.push(block);

}

function resetPosition(event) {
    event.x = -500;
    event.y = -500;
    event.width = 0;
    event.height = 0;
}

function weaponAttack() {
    weaponColide = new createjs.Shape();
    weaponColide.graphics.beginFill('#FFF');
    weaponColide.graphics.drawRect(0, 0, weaponWidh, weaponHeight);
    stage.addChild(weaponColide);
    weaponColide.x = player.x + player.width;
    weaponColide.y = player.y - weaponHeight / 2 + player.height / 2;
    weaponColide.width = weaponWidh;
    weaponColide.height = weaponHeight;
    attackCheck = true;
    weaponDuration = weaponCooldown;
    weaponColide.alpha = 1;
    collideBlock();
}

function initialize() {
    stage = new createjs.Stage("intro");
    preloadText = new createjs.Text("Loading", "30px Verdana", "#000");
    preloadText.textBaseline = "middle";
    preloadText.textAlign = "center";
    preloadText.x = stage.canvas.width / 2;
    preloadText.y = stage.canvas.height / 2;
    stage.addChild(preloadText);
    preload();
}

function preload() {
    queue = new createjs.LoadQueue(true);
    queue.on("progress", progress);
    queue.on("complete", startGame);

    queue.loadManifest(
        [
            /*  "img/1.jpg", "img/star.png",*/
            {"id": "playerRun", "src": "js/playerrun.json"}
        ]
    );
}


function progress(e) {
    var percent = Math.round(e.progress * 100);
    preloadText.text = "Loading: " + percent + "%";
    stage.update()
}

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', tickHappened);
    stage.removeChild(preloadText);
    playerSS = new createjs.SpriteSheet(queue.getResult("js/playerrun.json"));
    console.log(playerSS);

    player = new createjs.Sprite(playerSS, 'right');
    player.width = 20;
    player.height = 40;
    player.x = 50;
    player.y = 540-player.height;


    scoreText = new createjs.Text('Score : ', "30px Courier", "#FFF");
    scoreText.y = 50;
    lifeText = new createjs.Text('Text : ', "30px Courier", "#FFF");
    //healthText = new createjs.Text('Health :', "30px Calibri", "#0F0");


    container = new createjs.Container();
    ground = new createjs.Bitmap("img/ground.png");
    ground.x = 0;
    ground.y = 540;
    ground2 = new createjs.Bitmap("img/ground.png");
    ground2.x = 800;
    ground2.y = 440;


    container.addChild(ground2, ground);
    stage.addChild(container);
    stage.addChild(scoreText);
    stage.addChild(lifeText);
    stage.addChild(player);
    console.log(player);
    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    enemyList = [];
}

function tickHappened(e) {
    if (gameIsRunning) {
        console.log(timeUntilSummonMultiplier);
    /*console.log(container.x);*/
/*    console.log(timeUntilSummon + ", " + timeUntilSummonMultiplier);*/
    timeUntilSummon--;
    if (timeUntilSummon <= 0) {
        summonEnemy();
        summonEnemy();
        summonEnemy();


        timeUntilSummon = Math.floor(Math.random() * ((340 - 70) + 1) + 70);
        timeUntilSummon /= timeUntilSummonMultiplier;

    }
    timeUntilSummonMultiplierIncrease--;
    if (timeUntilSummonMultiplierIncrease <= 0 && timeUntilSummonMultiplier <= 5) {
        timeUntilSummonMultiplier += summonMultiplierIncrease * timeUntilSummonMultiplier;
        timeUntilSummonMultiplierIncrease = 200;
    }

    movePlayer();
    if (isJumping || mustTouchGround) {
        charJump();
    }
    if (player.y >= 540-player.height) {
        mustTouchGround = false;
        player.y = 540-player.height;
    }
    if (player.x < 0) {
        player.x = 0;
    }
    if (ground.x < -800) {
        ground.x = 0;
    }
    if (ground2.x < 0) {
        ground2.x = 800;
    }
    /*    collide();*/


    scoreText.text = "Score : " + score;
    lifeText.text = "Life left " + lifeFull;

    if (mouseCheck) {
        if (weaponDuration == 0) {
            weaponAttack();
        }
    }

    weaponDuration--;
    if (weaponDuration < 0) {
        weaponDuration = 0;
    }

    if (attackCheck) {
        attackTimer++;
    }

    if (attackTimer == 2) {
        attackTimer = 0;
        stage.removeChild(weaponColide);
        resetWeapon();
        attackCheck = false;
    }

    for (var i = 0; i < enemyList.length; i++) {
        var block = enemyList[i];

        if ((( block.health - block.currHealth) >= block.health) && (block.healthDamage == true)) {

            block.healthDamage = false;
        }
        else if ((( block.health - block.currHealth) > block.health / 2) && (block.healthDamage == true)) {

            block.healthDamage = false;
            block.healthText.color = "#f00";

        }


    }
        if ( lifeFull <= 0 ){
            gameIsRunning = false;
        }

    moveEnemies();
    movePowerUp();
        collidePowerUp();
    stage.update(e);

    }
}