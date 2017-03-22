let GameModel = (function () {
    let that = {};
    that.bricks = [];
    that.ball = [];
    that.paddle = {
        x: 466.965,
        y: 475,
        width: 66.07,
        height: 15,
        color: 'rgba(128, 0, 128, 1)',
        speed: 0
    };
    that.lives = 3;

    that.secondBall = function(){
        that.ball.push({
            x: that.paddle.x + that.paddle.width / 2,
            y: 465,
            width: 10,
            height: 10,
            color: 'rgba(0, 0, 0, 1)',
            xSpeed: Math.cos(4 * Math.PI / 10),
            ySpeed: Math.sin(4 * Math.PI / 10),
            top: performance.now(),
            bottom: performance.now(),
            left: performance.now(),
            right: performance.now(),
            topCollision: 20,
            bottomCollision: 20,
            leftCollision: 20,
            rightCollision: 20
        });
    };

    that.initialize = function () {
        that.bricks = [];
        that.ball = [];
        that.paddle = {};
        for (let j = 0; j < 9; j++) {
            let temp = [];
            for (let i = 0; i < 14; i++) {
                if (j == 0 || j == 1) {
                    temp.push({
                        x: 5 + i * 71.07,
                        y: 100 + j * 20,
                        width: 66.07,
                        height: 15,
                        color: 'rgba(0, 255, 0, 1)',
                        broken: false,
                        value: 5
                    });
                }
                else if (j == 2 || j == 3) {
                    temp.push({
                        x: 5 + i * 71.07,
                        y: 100 + j * 20,
                        width: 66.07,
                        height: 15,
                        color: 'rgba(0, 0, 255, 1)',
                        broken: false,
                        value: 3
                    });
                }
                else if (j == 4 || j == 5) {
                    temp.push({
                        x: 5 + i * 71.07,
                        y: 100 + j * 20,
                        width: 66.07,
                        height: 15,
                        color: 'rgba(255, 102, 0, 1)',
                        broken: false,
                        value: 2
                    });
                }
                else if (j == 6 || j == 7) {
                    temp.push({
                        x: 5 + i * 71.07,
                        y: 100 + j * 20,
                        width: 66.07,
                        height: 15,
                        color: 'rgba(255, 255, 0, 1)',
                        broken: false,
                        value: 1
                    });
                }
                else {
                    temp.push({
                        x: 5 + i * 71.07,
                        y: 100 + j * 20,
                        width: 66.07,
                        height: 15,
                        color: 'rgba(255, 255, 0, 1)',
                        broken: true,
                        value: 0
                    });
                }
            }
            that.bricks.push(temp);
        }
        that.ball.push({
            x: 495,
            y: 465,
            width: 10,
            height: 10,
            color: 'rgba(0, 0, 0, 1)',
            xSpeed: Math.cos(4 * Math.PI / 10),
            ySpeed: Math.sin(4 * Math.PI / 10),
            top: performance.now(),
            bottom: performance.now(),
            left: performance.now(),
            right: performance.now(),
            topCollision: 20,
            bottomCollision: 20,
            leftCollision: 20,
            rightCollision: 20
        });
        that.paddle = {
            x: 500 - 66.07,
            y: 475,
            width: 66.07 * 2,
            height: 15,
            color: 'rgba(128, 0, 128, 1)',
            speed: 10
        };
        that.lives = 3;
        that.lineCount = [];
        for(let i = 0; i < 9; i++){
            that.lineCount.push(0);
        }
        that.lineCount[8] = -5;
        that.linesCleared = 0;
    }

    return that;
}());