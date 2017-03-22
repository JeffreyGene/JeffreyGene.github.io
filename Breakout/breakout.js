let MyGame = (function(){
    let that = {};
    let brickWidth = 66.07;
    let brickHeight = 15;
    let gameSpeed = 5;
    let startTime = 0;
    let score = 0;
    let currentPaddleScore = 0;
    that.started = false;
    let countDown = 3;
    let oneSecond = performance.now();
    that.paused = false;
    let bricksRemoved = 0;
    let brickUpdate = 0;
    let gameOver = false;
    let animation;
    let halfSize = false;
    let secondBall = 1;
    let ballsAdded = 1;
    let highScores = [];
    let processInput = function(elapsedTime){
        
    };

    function updateScore(x, y){
        GameModel.bricks[x][y].broken = true;
        let center = {x: GameModel.bricks[x][y].x + brickWidth / 2, y: GameModel.bricks[x][y].y + brickHeight / 2}
        for(let i = 0; i < 20; i++){
            smokeParticles.create(center);
        }
        if((!halfSize) && x == 0){
            GameModel.paddle.width /= 2;
            halfSize = true;
        }
        score += GameModel.bricks[x][y].value;
        currentPaddleScore += GameModel.bricks[x][y].value;
        bricksRemoved++;
        GameModel.lineCount[x]++;
        if (GameModel.lineCount[x] == 14) {
            score += 25;
            GameModel.linesCleared++;
        }
    }

    that.clearHighScores = function(){
        highScores = [];
        localStorage.removeItem('scores');
        scoreDiv = document.getElementById('high-scores');
        let resetButton = document.getElementById('resetButton');
        scoreDiv.innerHTML = '';
        scoreDiv.appendChild(resetButton);

    }

    let update = function (elapsedTime) {
        if (!gameOver && !that.paused) {
            input.update(elapsedTime);

            //Check if we lost a life
            for(let i = 0; i < secondBall; i++){
                if (GameModel.ball[i].y + GameModel.ball[i].height >= GameModel.paddle.y) {
                    if(GameModel.ball[i].x + GameModel.ball[i].width < GameModel.paddle.x || 
                    GameModel.ball[i].x > GameModel.paddle.x + GameModel.paddle.width){
                        secondBall--;
                        GameModel.ball.splice(i, 1);
                        console.log('Length: ' + GameModel.ball.length);
                        if(secondBall == 0){
                            GameModel.lives--;
                            currentPaddleScore = 0;
                            let tempLives = GameModel.lives;
                            let tempScore = score;
                            let tempBricks = GameModel.bricks;
                            let tempLineCount = GameModel.lineCount;
                            let tempLinesCleared = GameModel.linesCleared;
                            GameModel.initialize();
                            that.initialize();
                            GameModel.lives = tempLives;
                            score = tempScore;
                            GameModel.bricks = tempBricks;
                            GameModel.lineCount = tempLineCount;
                            GameModel.linesCleared = tempLinesCleared;
                            window.cancelAnimationFrame(animation);
                        }
                    }
                }
            }
            for(let i = 0; i < secondBall; i++){
                if (that.started) {
                    GameModel.ball[i].x += gameSpeed * GameModel.ball[i].xSpeed;
                    GameModel.ball[i].y += -gameSpeed * GameModel.ball[i].ySpeed;
                }
            }
            
            if (GameModel.paddle.x < 0) {
                GameModel.paddle.x = 0;
            }
            else if (GameModel.paddle.x > 1000 - GameModel.paddle.width) {
                GameModel.paddle.x = 1000 - GameModel.paddle.width;
            }

            for(let i = 0; i < secondBall; i++){
                //Check for a wall collision
                if (GameModel.ball[i].y <= 0) {
                    GameModel.ball[i].ySpeed *= -1;
                }
                else if (GameModel.ball[i].x <= 0) {
                    GameModel.ball[i].xSpeed *= -1;
                }
                else if (GameModel.ball[i].x + GameModel.ball[i].width >= 1000) {
                    GameModel.ball[i].xSpeed *= -1;
                }

                //Check for a paddle collision
                if((GameModel.ball[i].y + GameModel.ball[i].height) > GameModel.paddle.y){
                    let paddleCenter = GameModel.paddle.x + GameModel.paddle.width / 2;
                    let ballCenter = GameModel.ball[i].x + GameModel.ball[i].width / 2;
                    let divisor = (paddleCenter - GameModel.paddle.x + GameModel.ball[i].width / 2) * 4 / 3;
                    if(GameModel.ball[i].x + GameModel.ball[i].width >= GameModel.paddle.x &&
                    ballCenter < paddleCenter){
                        let deltaCenter = paddleCenter - ballCenter;
                        let percentage = deltaCenter / divisor;
                        let angle = Math.PI / 2 * percentage + Math.PI / 2;
                        GameModel.ball[i].xSpeed = Math.cos(angle);
                        GameModel.ball[i].ySpeed = Math.sin(angle);
                    }
                    else if(GameModel.ball[i].x <= GameModel.paddle.x + GameModel.paddle.width  &&
                            ballCenter > paddleCenter){
                        let deltaCenter = ballCenter - paddleCenter;
                        let percentage = deltaCenter / divisor;
                        let angle = Math.PI / 2 - Math.PI / 2 * percentage;
                        GameModel.ball[i].xSpeed = Math.cos(angle);
                        GameModel.ball[i].ySpeed = Math.sin(angle);
                    }
                }

                //Check for a brick collision
                if (GameModel.ball[i].y <= 255 && GameModel.ball[i].y >= 90) {
                    let topCollision = Math.ceil((GameModel.ball[i].y - 100) / (brickHeight + 5)) - 1;
                    if (topCollision < 0) {
                        topCollision = 8;
                    }
                    else if (topCollision > 8) {
                        topCollision = 8;
                    }
                    let bottomCollision = Math.ceil((GameModel.ball[i].y + GameModel.ball[i].height - 100) / (brickHeight + 5)) - 1;
                    if (bottomCollision < 0) {
                        bottomCollision = 8;
                    }
                    else if (bottomCollision > 8) {
                        bottomCollision = 8;
                    }
                    let leftCollision = Math.ceil((GameModel.ball[i].x) / (brickWidth + 5)) - 1;
                    if (leftCollision < 0) {
                        leftCollision = 0;
                    }
                    else if (leftCollision > 13) {
                        leftCollision = 13;
                    }
                    let rightCollision = Math.ceil((GameModel.ball[i].x + GameModel.ball[i].width) / (brickWidth + 5)) - 1;
                    if (rightCollision > 13) {
                        rightCollision = 13;
                    }
                    else if (rightCollision < 0) {
                        rightCollision = 0;
                    }
                    if (GameModel.ball[i].topCollision != topCollision) {
                        GameModel.ball[i].topCollision = topCollision;
                        GameModel.ball[i].top = performance.now();
                    }
                    if (GameModel.ball[i].bottomCollision != bottomCollision) {
                        GameModel.ball[i].bottomCollision = bottomCollision;
                        GameModel.ball[i].bottom = performance.now();
                    }
                    if (GameModel.ball[i].leftCollision != leftCollision) {
                        GameModel.ball[i].leftCollision = leftCollision;
                        GameModel.ball[i].left = performance.now();
                    }
                    if (GameModel.ball[i].rightCollision != rightCollision) {
                        GameModel.ball[i].rightCollision = rightCollision;
                        GameModel.ball[i].right = performance.now();
                    }
                    //Going up and hit a wall of bricks
                    if ((!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].leftCollision].broken) &&
                            (!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].rightCollision].broken) && GameModel.ball[i].ySpeed > 0) {
                        if (GameModel.ball[i].rightCollision == GameModel.ball[i].leftCollision) {
                            updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                        }
                        else {
                            updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                            updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                        }
                        GameModel.ball[i].ySpeed *= -1;
                    }
                    //Going down and hit a wall of bricks
                    else if ((!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].leftCollision].broken) &&
                            (!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].rightCollision].broken) && GameModel.ball[i].ySpeed < 0) {
                        if (GameModel.ball[i].rightCollision == GameModel.ball[i].leftCollision) {
                            updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                        }
                        else {
                            updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                            updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].leftCollision);
                        }
                        GameModel.ball[i].ySpeed *= -1;
                    }
                    //Going left and hit a wall of bricks
                    else if ((!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].leftCollision].broken) &&
                            (!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].leftCollision].broken) && GameModel.ball[i].xSpeed < 0) {
                        if (GameModel.ball[i].topCollision == GameModel.ball[i].bottomCollision) {
                            updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                        }
                        else {
                        updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                        updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].leftCollision);
                        }
                        GameModel.ball[i].xSpeed *= -1;
                    }
                    //Going right and hit a wall of bricks
                    else if ((!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].rightCollision].broken) &&
                            (!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].rightCollision].broken) && GameModel.ball[i].xSpeed > 0) {
                        if (GameModel.ball[i].topCollision == GameModel.ball[i].bottomCollision) {
                            updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                        }
                        else {
                            updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                            updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                        }
                        GameModel.ball[i].xSpeed *= -1;
                    }
                    //If the ball partially hits a single brick
                    else if(GameModel.ball[i].xSpeed > 0){
                        if(GameModel.ball[i].ySpeed > 0){
                            if(!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].rightCollision].broken){
                                if(GameModel.ball[i].top < GameModel.ball[i].right){
                                    updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                                    GameModel.ball[i].xSpeed *= -1;
                                }
                                else {
                                    updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                                    GameModel.ball[i].ySpeed *= -1;
                                }
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].leftCollision].broken){
                                updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                                GameModel.ball[i].ySpeed *= -1;
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].rightCollision].broken){
                                updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                                GameModel.ball[i].xSpeed *= -1;
                            }
                        }
                        else if(GameModel.ball[i].ySpeed < 0){
                            if(!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].rightCollision].broken){
                                if(GameModel.ball[i].bottom < GameModel.ball[i].right){
                                    updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                                    GameModel.ball[i].xSpeed *= -1;
                                }
                                else {
                                    updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                                    GameModel.ball[i].ySpeed *= -1;
                                }
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].leftCollision].broken){
                                updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].leftCollision);
                                GameModel.ball[i].ySpeed *= -1;
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].rightCollision].broken){
                                updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                                GameModel.ball[i].xSpeed *= -1;
                            }
                        }
                    }
                    else if(GameModel.ball[i].xSpeed < 0){
                        if(GameModel.ball[i].ySpeed > 0){
                            if(!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].leftCollision].broken){
                                if(GameModel.ball[i].top < GameModel.ball[i].left){
                                    updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                                    GameModel.ball[i].xSpeed *= -1;
                                }
                                else {
                                    updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                                    GameModel.ball[i].ySpeed *= -1;
                                }
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].rightCollision].broken){
                                updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].rightCollision);
                                GameModel.ball[i].ySpeed *= -1;
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].leftCollision].broken){
                                updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].leftCollision);
                                GameModel.ball[i].xSpeed *= -1;
                            }
                        }
                        else if(GameModel.ball[i].ySpeed < 0){
                            if(!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].leftCollision].broken){
                                if(GameModel.ball[i].bottom < GameModel.ball[i].left){
                                    updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].leftCollision);
                                    GameModel.ball[i].xSpeed *= -1;
                                }
                                else {
                                    updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].leftCollision);
                                    GameModel.ball[i].ySpeed *= -1;
                                }
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].bottomCollision][GameModel.ball[i].rightCollision].broken){
                                updateScore(GameModel.ball[i].bottomCollision, GameModel.ball[i].rightCollision);
                                GameModel.ball[i].ySpeed *= -1;
                            }
                            else if(!GameModel.bricks[GameModel.ball[i].topCollision][GameModel.ball[i].leftCollision].broken){
                                updateScore(GameModel.ball[i].topCollision, GameModel.ball[i].leftCollision);
                                GameModel.ball[i].xSpeed *= -1;
                            }        
                        }
                    }
                }
            }

            //Update game speed
            if ((bricksRemoved >= 4) && brickUpdate == 0) {
                gameSpeed += 1;
                brickUpdate++;
            }
            else if (bricksRemoved >= 12 && brickUpdate == 1) {
                gameSpeed += 1.33;
                brickUpdate++;
            }
            else if (bricksRemoved >= 36 && brickUpdate == 2) {
                gameSpeed += 1.67;
                brickUpdate++;
            }
            else if (bricksRemoved >= 62 && brickUpdate == 3) {
                gameSpeed += 2;
                brickUpdate++;
            }

            //Check if we need a second ball
            if(currentPaddleScore / ballsAdded >= 100){
                //if(ballsAdded <= 6){
                    console.log('Second Ball: ' + currentPaddleScore / ballsAdded);
                    secondBall = secondBall + 1;
                    ballsAdded++;
                    GameModel.secondBall();
                    console.log(secondBall);
               // }
            }

            //Check if game is over
            if ((GameModel.linesCleared == 8 || GameModel.lives == 0) && (!gameOver)) {
                console.log("Game Over!");
                if(localStorage.hasOwnProperty('scores')){
                    highScores = JSON.parse(localStorage.getItem('scores'));
                }
                else{
                    highScores = [];
                }
                for(let i = 0; i < highScores.length; i++){
                    if(score > highScores[i] && (!gameOver)){
                        console.log('high score: ' + score + ' at: ' + i);
                        highScores.splice(i, 0, score);
                        if(highScores.length > 5){
                            highScores.length = 5;
                        }
                        gameOver = true;
                        break;
                    }
                }
                if(highScores.length < 5 && (!gameOver)){
                    console.log('high score: ' + score + ' end: ' + highScores.length);
                    highScores.push(score);
                    gameOver = true;
                }
                gameOver = true;
                localStorage['scores'] = JSON.stringify(highScores);
                let scoreDiv = document.getElementById('high-scores');
                let resetButton = document.getElementById('resetButton');
                scoreDiv.innerHTML = '';
                let title = document.createElement('h2');
                title.innerHTML = 'High Scores';
                scoreDiv.appendChild(title);
                for(let i = 0; i < highScores.length; i++){
                    let temp = document.createElement('p');
                    temp.innerHTML = (i + 1) + '. ' + highScores[i];
                    scoreDiv.appendChild(temp);
                    console.log('score: ' + highScores[i]);
                }
                scoreDiv.appendChild(resetButton);
            }
        }
        else {
            //console.log("Game Over!");
        }
    };

    let render = function (elapsedTime) {
        Graphics.drawRectangle(0, 0, 1000, 500, 'rgba(220, 220, 220, 1');
        //let image = Document.getElementById('space');
        //Graphics.renderImage(image, 0, 0, 1000, 500);
        //Draw bircks
        for(let j = 0; j < 8; j++){
            for(let i = 0; i < 14; i++){
                if(!GameModel.bricks[j][i].broken){
                    Graphics.drawRectangle(GameModel.bricks[j][i].x, GameModel.bricks[j][i].y, 
                                    GameModel.bricks[j][i].width, GameModel.bricks[j][i].height, 
                                    GameModel.bricks[j][i].color);
                }
            }
        }

        //Draw paddle
        Graphics.drawRectangle(GameModel.paddle.x, GameModel.paddle.y, GameModel.paddle.width, 
                                GameModel.paddle.height, GameModel.paddle.color);

        //Draw ball
        for(let i = 0; i < secondBall; i++){
            Graphics.drawRectangle(GameModel.ball[i].x, GameModel.ball[i].y, GameModel.ball[i].width, 
                                GameModel.ball[i].height, GameModel.ball[i].color);
        }
        
        //Draw the score
        Graphics.drawScore('Score: ' + score, 10, 30);

        //Draw the lives
        Graphics.drawLives(GameModel.lives, 1000 - GameModel.paddle.width - 5, 30, GameModel.paddle.width,
                                GameModel.paddle.height, GameModel.paddle.color)

        //Draw the countdown
        if(!gameOver){
            if (countDown == 0) {
                that.started = true;
            }
            if (!that.started) {
                Graphics.drawText(countDown, 500 - 35, 250, '128px Arial, sans-serif',
                    'rgba(0, 0, 0, 1)');
                if (elapsedTime - oneSecond >= 1000) {
                    countDown--;
                    oneSecond = performance.now();
                }
            }
        }
        else{
            Graphics.drawText('Game Over!', 150, 250, '128px Arial, sans-serif',
                    'rgba(0, 0, 0, 1)');
        }
        
        if(that.paused){
            //console.log('paused');
            Graphics.drawPauseMenu(pauseGameState[pauseIndex]);
        }
        smokeParticles.update(.01);
        smokeParticles.render();
    };
let elapsedTime;
let smokeParticles;
    let gameLoop = function(){
        elapsedTime = performance.now();
        processInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);
        animation = window.requestAnimationFrame(gameLoop);
    }

    that.initialize = function () {
        gameSpeed = 3;
        startTime = 0;
        score = 0;
        currentPaddleScore = 0;
        secondBall = 1;
        ballsAdded = 1;
        that.started = false;
        countDown = 3;
        oneSecond = performance.now();
        bricksRemoved = 0;
        brickUpdate = 0;
        gameOver = false;
        halfSize = false;
        window.cancelAnimationFrame(animation);
        that.paused = false;
        that.started = false;
        startTime = performance.now();
        oneSecond = performance.now();
        let spec = {
            center: {x: 500, y: 250},
            image: 'coin.png'
        }
        smokeParticles = ParticleSystem(spec, Graphics);
        gameLoop();
    };

    return that;
}());

let gameState = [];
gameState.push('newGame');
gameState.push('highScores');
gameState.push('credits');
let pauseGameState = [];
pauseGameState.push('resume');
pauseGameState.push('quit');
let pauseIndex = 0;
let stateIndex = 0;
let gameMenu = 'mainMenu';

function localStorageScore(){
    if(localStorage.hasOwnProperty('scores')){
        highScores = JSON.parse(localStorage.getItem('scores'));
    }
    else{
        highScores = [];
    }
    let scoreDiv = document.getElementById('high-scores');
    let resetButton = document.getElementById('resetButton');
    scoreDiv.innerHTML = '';
    let title = document.createElement('h2');
    title.innerHTML = 'High Scores';
    scoreDiv.appendChild(title);
    for(let i = 0; i < highScores.length; i++){
        let temp = document.createElement('p');
        temp.innerHTML = (i + 1) + '. ' + highScores[i];
        scoreDiv.appendChild(temp);
        console.log('score: ' + highScores[i]);
    }
    scoreDiv.appendChild(resetButton);
}

function initialize(){
    Graphics.initialize();
    Graphics.drawMenu(gameState[stateIndex]);
    console.log('Initializing...')
    localStorageScore();
}