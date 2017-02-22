//Generate a random maze using prim's algorithm
function generateRandomMaze(mazeSize){
    //Generate an empty maze
    let mazeCells = [];
    for(let i = 0; i < mazeSize; i++){
        let mazeRow = [];
        for(let j = 0; j < mazeSize; j++){
            let newCell = {
                visited: false,
                topWall: 'notChecked',
                rightWall: 'notChecked',
                bottomWall: 'notChecked',
                leftWall: 'notChecked',
                solution: 'notChecked'
            };
            mazeRow.push(newCell);
        }
        mazeCells.push(mazeRow);
    }
    //Leave one wall open around the finished cell
    let finishWall = Math.floor(Math.random() * 2);
    if(finishWall == 1){
        mazeCells[mazeSize - 1][mazeSize - 1].topWall = 'closed';
        mazeCells[mazeSize - 1][mazeSize - 2].bottomWall = 'closed';
        mazeCells[mazeSize - 1][mazeSize - 1].leftWall = 'open';
        mazeCells[mazeSize - 2][mazeSize - 1].rightWall = 'open';
    }
    else{
        mazeCells[mazeSize - 1][mazeSize - 1].leftWall = 'closed';
        mazeCells[mazeSize - 2][mazeSize - 1].rightWall = 'closed';
        mazeCells[mazeSize - 1][mazeSize - 1].topWall = 'open';
        mazeCells[mazeSize - 1][mazeSize - 2].bottomWall = 'open';
    }

    //Close the outer walls of the maze
    for(let topRow = 0; topRow < mazeSize; topRow++){
        mazeCells[0][topRow].topWall = 'closed';
    }
    for(let bottomRow = 0; bottomRow < mazeSize; bottomRow++){
        mazeCells[mazeSize - 1][bottomRow].bottomWall = 'closed';
    }
    for(let leftRow = 0; leftRow < mazeSize; leftRow++){
        mazeCells[leftRow][0].leftWall = 'closed';
    }
    for(let rightRow = 0; rightRow < mazeSize; rightRow++){
        mazeCells[rightRow][mazeSize - 1].rightWall = 'closed';
    }
    
    //Pick a random cell 
    let randX = Math.floor(Math.random() * mazeSize); 
    let randY = Math.floor(Math.random() * mazeSize);
    while(randX == mazeSize - 1 && randY == mazeSize - 1){
        randX = Math.floor(Math.random() * mazeSize); 
        randY = Math.floor(Math.random() * mazeSize);
    }
    mazeCells[randX][randY].visited = true;
    //Add walls to wallList    
    let wallList = [];
    function addWalls(row, col){
        //Check the top wall
        if(mazeCells[row][col].topWall == 'notChecked'){
            mazeCells[row][col].topWall = 'checked';
            mazeCells[row - 1][col].bottomWall = 'checked';
            let newWall = {
                cellOneRow: row,
                cellOneCol: col
            };
            newWall.cellTwoRow = row - 1;
            newWall.cellTwoCol = col;
            wallList.push(newWall);
        }
        //Check the bottom wall
        if(mazeCells[row][col].bottomWall == 'notChecked'){
            mazeCells[row][col].bottomWall = 'checked';
            mazeCells[row + 1][col].topWall = 'checked';
            let newWall = {
                cellOneRow: row,
                cellOneCol: col
            };
            newWall.cellTwoRow = row + 1;
            newWall.cellTwoCol = col;
            wallList.push(newWall);
        }
        //Check the right walll
        if(mazeCells[row][col].rightWall == 'notChecked'){
            mazeCells[row][col].rightWall = 'checked';
            mazeCells[row][col + 1].leftWall = 'checked';
            let newWall = {
                cellOneRow: row,
                cellOneCol: col
            };
            newWall.cellTwoRow = row;
            newWall.cellTwoCol = col + 1;
            wallList.push(newWall);
        }
        //Check the left wall
        if(mazeCells[row][col].leftWall == 'notChecked'){
            mazeCells[row][col].leftWall = 'checked';
            mazeCells[row][col - 1].rightWall = 'checked';
            let newWall = {
                cellOneRow: row,
                cellOneCol: col
            };
            newWall.cellTwoRow = row;
            newWall.cellTwoCol = col - 1;
            wallList.push(newWall);
        }
    }
    addWalls(randX, randY);

    //When open is true, the passed in wall will be open, otherwise the wall will be closed
    function updateWall(rowOne, colOne, rowTwo, colTwo, open){
        if(open){
            if(rowOne < rowTwo){
                mazeCells[rowOne][colOne].bottomWall = 'open';
                mazeCells[rowTwo][colTwo].topWall = 'open';
            }
            else if(rowOne > rowTwo){
                mazeCells[rowOne][colOne].topWall = 'open';
                mazeCells[rowTwo][colTwo].bottomWall = 'open';
            }
            else if(colOne < colTwo){
                mazeCells[rowOne][colOne].rightWall = 'open';
                mazeCells[rowTwo][colTwo].leftWall = 'open';
            }
            else if(colOne > colTwo){
                mazeCells[rowOne][colOne].leftWall = 'open';
                mazeCells[rowTwo][colTwo].rightWall = 'open';
            }
        }
        else {
            if(rowOne < rowTwo){
                mazeCells[rowOne][colOne].bottomWall = 'closed';
                mazeCells[rowTwo][colTwo].topWall = 'closed';
            }
            else if(rowOne > rowTwo){
                mazeCells[rowOne][colOne].topWall = 'closed';
                mazeCells[rowTwo][colTwo].bottomWall = 'closed';
            }
            else if(colOne < colTwo){
                mazeCells[rowOne][colOne].rightWall = 'closed';
                mazeCells[rowTwo][colTwo].leftWall = 'closed';
            }
            else if(colOne > colTwo){
                mazeCells[rowOne][colOne].leftWall = 'closed';
                mazeCells[rowTwo][colTwo].rightWall = 'closed';
            }
        }
    }

    while(wallList.length > 0){
        //Pick a random wall
        let randWall = Math.floor(Math.random() * wallList.length);
        //Check adjacent cell
        let rowOne = wallList[randWall].cellOneRow;
        let colOne = wallList[randWall].cellOneCol;
        let rowTwo = wallList[randWall].cellTwoRow;
        let colTwo = wallList[randWall].cellTwoCol;
        //Add walls to wallList
        if(mazeCells[rowOne][colOne].visited == false){
            mazeCells[rowOne][colOne].visited = true;
            //Open the wall
            updateWall(rowOne, colOne, rowTwo, colTwo, true);
            addWalls(rowOne, colOne);
        }
        else if(mazeCells[rowTwo][colTwo].visited == false){
            mazeCells[rowTwo][colTwo].visited = true;            
            //Open the wall
            updateWall(rowOne, colOne, rowTwo, colTwo, true);
            addWalls(rowTwo, colTwo);
        }
        else {
            //Close the wall
            updateWall(rowOne, colOne, rowTwo, colTwo, false);
        }
        //Remove wall from wallList
        wallList.splice(randWall, 1);
    }
    for(let i = 0; i < mazeSize; i++){
        for(let j = 0; j < mazeSize; j++){
            mazeCells[i][j].visited = false;
        }
    }
    //return the maze
    return mazeCells;
}

let mazeSize = 10;
let maze = generateRandomMaze(mazeSize);
let player = {
    row: 0,
    col: 0,
    dir: 'right'
};
let start = {
    row: 0,
    col: 0
};
let end = {
    row: mazeSize - 1,
    col: mazeSize - 1
};
let breadCrumbs = false;
let hint = false;
let shortestPath = false;
let showScore = true;
let highScores = [];
let currentHighScore = -1;
let startTime = performance.now();
let elapsedTime = (performance.now() - startTime) / 1000;
let gameOver = false;
let reported = false;
let gameStarted = false;
let startTimer = false;
function newGame(size) {
    mazeSize = size;
    maze = generateRandomMaze(mazeSize);
    player.row = 0;
    player.col = 0;
    end.row = mazeSize - 1;
    end.col = mazeSize - 1;
    breadCrumbs = false;
    hint = false;
    shortestPath = false;
    showScore = true;
    currentHighScore = -1;
    startTime = performance.now();
    elapsedTime = (performance.now() - startTime) / 1000;
    gameOver = false;
    reported = false;
    gameStarted = false;
    startTimer = false;
    recursiveSolution(0, 0);
}

//Find the path to the finish
function recursiveSolution(row, col){
    maze[row][col].solution = 'visited';
    if(row == end.row && col == end.col){
        maze[row][col].solution = 'solutionPath';
    }
    else {
        if(maze[row][col].topWall == 'open'){
            if(maze[row - 1][col].solution == 'notChecked'){
                recursiveSolution(row - 1, col);
                if(maze[row - 1][col].solution == 'solutionPath'){
                    maze[row][col].solution = 'solutionPath';
                }
            }
        }
        if(maze[row][col].bottomWall == 'open'){
            if(maze[row + 1][col].solution == 'notChecked'){
                recursiveSolution(row + 1, col);
                if(maze[row + 1][col].solution == 'solutionPath'){
                    maze[row][col].solution = 'solutionPath';
                }
            }
        }
        if(maze[row][col].leftWall == 'open'){
            if(maze[row][col - 1].solution == 'notChecked'){
                recursiveSolution(row, col - 1);
                if(maze[row][col - 1].solution == 'solutionPath'){
                    maze[row][col].solution = 'solutionPath';
                }
            }
        }
        if(maze[row][col].rightWall == 'open'){
            if(maze[row][col + 1].solution == 'notChecked'){
                recursiveSolution(row, col + 1);
                if(maze[row][col + 1].solution == 'solutionPath'){
                    maze[row][col].solution = 'solutionPath';
                }
            }
        }
    }
}
recursiveSolution(0, 0);

function keydown(e){
    if(!gameOver){
        if(e.key == 'a' || e.key == 'j' || e.key == 'ArrowLeft'){
            console.log('you pressed a');
            gameStarted = true;
            player.dir = 'left';
            if (maze[player.row][player.col].leftWall == 'open') {
                if (maze[player.row][player.col - 1].solution == 'solutionPath') {
                    maze[player.row][player.col].solution = 'visited';
                }
                else {
                    maze[player.row][player.col].solution = 'solutionPath';
                }
                player.col--;
            }
        }
        else if(e.key == 's' || e.key == 'k' || e.key == 'ArrowDown'){
            console.log('you pressed s');
            gameStarted = true;
            player.dir = 'down';
            if (maze[player.row][player.col].bottomWall == 'open') {
                if (maze[player.row + 1][player.col].solution == 'solutionPath') {
                    maze[player.row][player.col].solution = 'visited';
                }
                else {
                    maze[player.row][player.col].solution = 'solutionPath';
                }
                player.row++;
            }
        }
        else if(e.key == 'd' || e.key == 'l' || e.key == 'ArrowRight'){
            console.log('you pressed d');
            gameStarted = true;
            player.dir = 'right';
            if (maze[player.row][player.col].rightWall == 'open') {
                if (maze[player.row][player.col + 1].solution == 'solutionPath') {
                    maze[player.row][player.col].solution = 'visited';
                }
                else {
                    maze[player.row][player.col].solution = 'solutionPath';
                }
                player.col++;
            }
        }
        else if(e.key == 'w' || e.key == 'i' || e.key == 'ArrowUp'){
            console.log('you pressed w');
            gameStarted = true;
            player.dir = 'up';
            if (maze[player.row][player.col].topWall == 'open') {
                if (maze[player.row - 1][player.col].solution == 'solutionPath') {
                    maze[player.row][player.col].solution = 'visited';
                }
                else {
                    maze[player.row][player.col].solution = 'solutionPath';
                }
                player.row--;
            }
        }
    }
    if(e.key == 'h') {
        hint = !hint;
    }
    else if (e.key == 'b') {
        breadCrumbs = !breadCrumbs;
    }
    else if (e.key == 'p') {
        shortestPath = !shortestPath;
    }
    else if(e.key =='y'){
        showScore = !showScore;
    }
    else {
        console.log(e.key);
    }
    console.log('row: ', player.row, ' col: ', player.col);
}
window.addEventListener('keydown', keydown);

function update() {
    if(player.row == end.row && player.col == end.col){
        gameOver = true;
    }
    if (maze[player.row][player.col].visited != true) {
        if (maze[player.row][player.col].solution == 'solutionPath') {
            currentHighScore++;
        }
        else {
            currentHighScore--;
        }
    }
    maze[player.row][player.col].visited = true;
    if(gameStarted){
        if(!startTimer){
            startTime = performance.now();
            startTimer = true;
        }
        elapsedTime = (performance.now() - startTime) / 1000;
    }
}

let Graphics = (function(){
        let that = {};
        let canvas;
        let context;

        that.initialize = function(){
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
        };

        that.drawRectangle = function(x, y, width, height, color){
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        };

        that.drawCell = function(cell, row, col, cellSize, wallSize){
            let offset = cellSize - wallSize;
            if(cell.topWall == 'closed'){
                that.drawRectangle(col * cellSize, row * cellSize, cellSize, wallSize, 'rgba(255, 255, 255, 0.5)');
            }
            if(cell.bottomWall == 'closed'){
                that.drawRectangle(col * cellSize, row * cellSize + offset, cellSize, wallSize, 'rgba(255, 255, 255, 0.5)');
            }
            if(cell.rightWall == 'closed'){
                that.drawRectangle(col * cellSize + offset, row * cellSize, wallSize, cellSize, 'rgba(255, 255, 255, 0.5)');
            }
            if(cell.leftWall == 'closed'){
                that.drawRectangle(col * cellSize, row * cellSize, wallSize, cellSize, 'rgba(255, 255, 255, 0.5)');
            }
        };

        that.drawPlayer = function(row, col, cellSize, color){
            let crumbRow = cellSize * row + cellSize * 0.25;
            let crumbCol = cellSize * col + cellSize * 0.25;
            that.drawRectangle(crumbCol, crumbRow, cellSize * 0.5, cellSize * 0.5, color);
        };

        that.drawBreadCrumb = function(row, col, cellSize, color){
            let crumbRow = cellSize * row + cellSize * 0.375;
            let crumbCol = cellSize * col + cellSize * 0.375;
            that.drawRectangle(crumbCol, crumbRow, cellSize * 0.25, cellSize * 0.25, color);
        };

        that.save = function(){
            context.save();
        };

        that.restore = function(){
            context.restore();
        };

        return that;
}());

function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function render() {
    Graphics.save();
    let canvasWidth = 800;
    //Draw the maze
    Graphics.drawRectangle(0, 0, canvasWidth, canvasWidth, 'rgba(0, 0, 125, 0.1)');
    for(let i = 0; i < mazeSize; i++){
        for(let j = 0; j < mazeSize; j++){
            Graphics.drawCell(maze[i][j], i, j, canvasWidth / mazeSize, 20 / mazeSize);
            if(maze[i][j].visited && breadCrumbs){
                //Draw the bread crumbs
                Graphics.drawBreadCrumb(i, j, canvasWidth / mazeSize, 'rgba(255, 255, 0, 1)');
            }
            if (maze[i][j].solution == 'solutionPath' && shortestPath) {
                //Draw the solution
                Graphics.drawBreadCrumb(i, j, canvasWidth / mazeSize, 'rgba(0, 255, 0, 1)');
            }
        }
    }
    //Draw the hint
    if (hint) {
        if (maze[player.row][player.col].topWall == 'open' && maze[player.row - 1][player.col].solution == 'solutionPath') {
            Graphics.drawBreadCrumb(player.row - 1, player.col, canvasWidth / mazeSize, 'rgba(0, 255, 0, 1)');
        }
        else if (maze[player.row][player.col].bottomWall == 'open' && maze[player.row + 1][player.col].solution == 'solutionPath') {
            Graphics.drawBreadCrumb(player.row + 1, player.col, canvasWidth / mazeSize, 'rgba(0, 255, 0, 1)');
        }
        else if (maze[player.row][player.col].leftWall == 'open' && maze[player.row][player.col - 1].solution == 'solutionPath') {
            Graphics.drawBreadCrumb(player.row, player.col - 1, canvasWidth / mazeSize, 'rgba(0, 255, 0, 1)');
        }
        else if (maze[player.row][player.col].rightWall == 'open' && maze[player.row][player.col + 1].solution == 'solutionPath') {
            Graphics.drawBreadCrumb(player.row, player.col + 1, canvasWidth / mazeSize, 'rgba(0, 255, 0, 1)');
        }
    }

    //Draw the starting and ending points
    Graphics.drawPlayer(0, 0, canvasWidth / mazeSize, 'rgba(255, 0, 0, 1)');
    Graphics.drawPlayer(mazeSize - 1, mazeSize - 1, canvasWidth / mazeSize, 'rgba(0, 255, 0, 1)');
    
    //Draw the player
    Graphics.drawPlayer(player.row, player.col, canvasWidth / mazeSize, 'rgba(255, 20, 147, 1)');

    Graphics.restore();

    //Draw the score
    let eventLine = document.createElement('p');
    let textNode = null;
    if(showScore && !gameOver){
        textNode = document.createTextNode('Score: ' + currentHighScore);
    }
    else if(gameOver){
        textNode = document.createTextNode('You win! Final Score: ' + currentHighScore);
    }
    else{
        textNode = document.createTextNode('Score: ?');
    }
    let highScoreDiv = document.getElementById('curHighScore');
    eventLine.appendChild(textNode);
    clearBox('curHighScore');
    highScoreDiv.insertBefore(eventLine, highScoreDiv.firstChild);

    //Draw the time elapsed
    eventLine = document.createElement('p');
    textNode = document.createTextNode('Time: ' + Math.floor(elapsedTime));
    let timeDiv = document.getElementById('curTime');
    eventLine.appendChild(textNode);
    clearBox('curTime');
    timeDiv.insertBefore(eventLine, timeDiv.firstChild);

    
}
 
function gameLoop(){
    if(!gameOver){
        update();  
    }
    else{
        if(!reported){
            let inserted = false;
            if(highScores.length == 0){
                highScores.push(currentHighScore);
                inserted = true;
            }
            else if(highScores[highScores.length - 1] < currentHighScore){
                highScores.push(currentHighScore);
                inserted = true;
            }
            reported = true;
            clearBox('high-scores');
            for(let i = 0; i < highScores.length; i++){
                if(highScores[i] >= currentHighScore){
                    if(!inserted){
                        highScores.splice(i, 0, currentHighScore);
                        inserted = true;
                    }
                }
                // //Draw the high scores
                // eventLine = document.createElement('p');
                // textNode = document.createTextNode(highScores.length - i + '. ' + highScores[i]);
                // let scoreDiv = document.getElementById('high-scores');
                // eventLine.appendChild(textNode);
                // scoreDiv.insertBefore(eventLine, scoreDiv.firstChild);
            }
            if(highScores.length > 5){
                    highScores.splice(0, 1);
            }
            for(let i = 0; i < highScores.length; i++){
                //Draw the high scores
                eventLine = document.createElement('p');
                textNode = document.createTextNode(highScores.length - i + '. ' + highScores[i]);
                let scoreDiv = document.getElementById('high-scores');
                eventLine.appendChild(textNode);
                scoreDiv.insertBefore(eventLine, scoreDiv.firstChild);
            }
        }
    }   
    render();
    requestAnimationFrame(gameLoop);
}

function initialize(){
    Graphics.initialize();
    gameLoop();
}