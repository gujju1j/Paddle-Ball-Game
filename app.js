/**
 * Created by Jeevan on 5/19/17.
 */

var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var winScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

// mouse position synchronized to paddle position for player 1
function calcMousePos(evnt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evnt.clientX - rect.left - root.scrollLeft;
    var mouseY = evnt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

// handling mouse click to enable new game to continue
function handleMouseClick(evnt) {
    if(winScreen) {
        player1Score = 0;
        player2Score = 0;
        winScreen = false;
    }
}

// defining the ball speed on loading the webpage
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
        moveAll();
        drawAll();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
        function(evnt) {
            var mousePos = calcMousePos(evnt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        });
}


// reset the ball from middle of the screen when it misses to hit the paddle
function ballReset() {
    if(player1Score >= WINNING_SCORE ||
        player2Score >= WINNING_SCORE) {

        winScreen = true;

    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

// computer paddle movement automated according to padlle position
function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY - 35) {
        paddle2Y = paddle2Y + 20;
    } else if(paddle2YCenter > ballY + 35) {
        paddle2Y = paddle2Y - 20;
    }
}


// ball and paddle movement controlled by mouse
function moveAll() {
    if(winScreen) {
        return;
    }

    computerMovement();

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if(ballX < 0) {
        if(ballY > paddle1Y &&
            ballY < paddle1Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY
                -(paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++; // must be BEFORE ballReset()
            ballReset();
        }
    }
    if(ballX > canvas.width) {
        if(ballY > paddle2Y &&
            ballY < paddle2Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY
                -(paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++; // must be BEFORE ballReset()
            ballReset();
        }
    }
    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

// drawing the middle line

function drawLine() {
    for(var i=0;i<canvas.height;i+=40) {
        colorRect(canvas.width/2-1,i,2,20,'white');
    }
}

// displaying output after player/ computer won
function drawAll() {
    // next line blanks out the screen with black
    colorRect(0,0,canvas.width,canvas.height,'black');

    if(winScreen) {
        canvasContext.fillStyle = 'white';

        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won", canvas.width/2, canvas.height/3);
        } else if(player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won", canvas.width/2, canvas.height/3);
        }

        canvasContext.fillText("click to continue", canvas.width/2, canvas.height/1.5);
        return;
    }

    drawLine();

    // this is left player paddle
    colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'green');

    // this is right computer paddle
    colorRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'red');

    // next line draws the ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

// ball shape and color
function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
    canvasContext.fill();
}

// paddle shape and color
function colorRect(leftX,topY, width,height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY, width,height);
}