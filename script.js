var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

const WIDTH = 640;
const HEIGHT = 400;
const FPS = 60;

canvas.width = WIDTH;
canvas.height = HEIGHT;

var bricklist = [];
var scoreCount = 0;
var lives = 3;
var numBricks = 0; 
var intervalVar;

var running = false;


		ctx.font = "20px Arial";
		ctx.fillText("Rules", canvas.width / 2 - 25, 25);
		ctx.font = "15px Arial";
		ctx.fillText("Bounce the ball off your paddle to hit the red bricks, which will score you a point.", 60, 45);
		ctx.fillText("Be careful to not let the ball hit the bottom, as you will lose a life.", 120, 65);
		ctx.fillText("If you run out of lives, the game is over.", 190, 85);

		ctx.beginPath();	//Starting Point
		ctx.strokeStyle = "black";	//Fills rectangle with colour.
		ctx.strokeRect(canvas.width / 2 - 12, canvas.height / 2 + 25,25,25);	//Creates rectangle which can be filled, (x,y,width,height)
		ctx.strokeRect(canvas.width / 2 - 37, canvas.height / 2 + 50,25,25);
		ctx.strokeRect(canvas.width / 2 + 13, canvas.height / 2 + 50,25,25);
		ctx.closePath();	// Ends drawing point.

		ctx.font = "15px Arial";
		ctx.fillText("Click to Start.", canvas.width / 2 - 45, 310);

		ctx.font = "15px Arial";
		// ctx.fillText("W", canvas.width / 2 - 8, canvas.height / 2 + 44);
		ctx.fillText("A", canvas.width / 2 - 30, canvas.height / 2 + 69);
		// ctx.fillText("S", canvas.width / 2 - 5, canvas.height / 2 + 69);
		ctx.fillText("D", canvas.width / 2 + 20, canvas.height / 2 + 69);

		ctx.beginPath();	//Starting Point
		ctx.moveTo(canvas.width / 2 - 12,canvas.height / 2 + 75);	//Coordinates
		ctx.lineTo(canvas.width / 2 + 13,canvas.height / 2 + 75);
		ctx.stroke();	//Displays line
		ctx.closePath();	//Final Point

		// Controls Text
		ctx.font = "15px Arial";
		ctx.fillText("Hold 'A' or 'D' to go move left or right, to bounce the ball off the paddle. ", 80, 350 )

var score = {
	x: canvas.width / 2 - 15,
	y: 22,
	colour: "black",

	print: function(){
		ctx.font = "18px Arial";
		ctx.fillStyle = score.colour;
		ctx.fillText("Score: " + scoreCount,score.x,score.y);
	}
}

var livesBoard = {
	x: 100,
	y: 22,
	colour: "black",

	print: function(){
		ctx.font = "18px Arial";
		ctx.fillStyle = score.colour;
		ctx.fillText("Lives: " + lives,livesBoard.x,livesBoard.y);
	}
}

var paddle = {
	width: 80,
	height: 5,
	x: canvas.width / 2 - 40,
	y: 350,
	xv: 8,
	colour: "blue",

	draw: function() {
		ctx.fillStyle = paddle.colour;
		ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	}
}

var ball = {
	x: 0,
	y: 200,
	xv: 0,
	yv: 0,
	r: 6,
	colour: "grey", 

	draw: function(){
		ctx.beginPath();
		ctx.arc(ball.x,ball.y,ball.r, 0, Math.PI * 2, false); 
		ctx.strokeStyle = "white";
		ctx.fillStyle = ball.colour;
		ctx.fill();
		ctx.stroke();
	},

	animate: function(){
		ball.x += ball.xv;
		ball.y += ball.yv;
	},

	collision: function(){
		if(ball.x + ball.r > canvas.width){
			ball.xv = -ball.xv;		
		}	
		if(ball.y + ball.r > canvas.height){
			ball.yv = -ball.yv;	
			lives--;
		}
		if(ball.x - ball.r < 0){
			ball.xv = -ball.xv;		
		}	
		if(ball.y - ball.r < 0){
			ball.yv = -ball.yv;		
		}
		if((paddle.x < ball.x + ball.r)  && 
		   (ball.x < paddle.x + paddle.width) &&
		   (paddle.y < ball.y + ball.r) &&
		   (ball.y < paddle.y + paddle.height)){
				ball.yv = -ball.yv;
		}
	}
}

var bricks = {
	width:45,
	height: 12,
	x: 40,
	y: 30,
	offsetX: 56,
	offsetY: 45,
	limit: 3,
	colour: "red",

	draw: function(t,i) { //testing forEach, if want to call method through main function, remove parameters
		for(let i = 0; i < bricklist.length; i++){
			ctx.fillStyle = bricks.colour;
			// ctx.fillRect(bricklist[i].x, bricklist[i].y, bricks.width, bricks.height);
			ctx.fillRect(t.x, t.y, bricks.width, bricks.height);
		}
	}
}


function tester(){
	for(let i = 1; i <= 4; i++){
		bricks.x = 40;
		for(let j = 1; j <= 10; j++){
			bricklist[numBricks] = {x:bricks.x, y:bricks.y};
			numBricks++;
			bricks.x += bricks.offsetX;
		}
		bricks.y += bricks.offsetY;
	}
}

//Controls
var Keys = { // Default value false, so nothing occurs
    left: false,
    right: false
};

document.onkeydown = function(e){  //When clicked, value switches to true, allowing move function to run
     var kc = e.keyCode;

     if(kc === 65) Keys.left = true;
     if(kc === 68) Keys.right = true;
 };

document.onkeyup = function(e){	//When keys are released, the keys no longer function, but the keys still pressed do.
     var kc = e.keyCode;

     if(kc === 65) Keys.left = false;
     if(kc === 68) Keys.right = false;
};

function movement(){
    if(Keys.left) {
        paddle.x -= paddle.xv;
    }
    if(Keys.right){
         paddle.x += paddle.xv;
    }
}

// Collision
function collision(){
	// Paddle & Canvas
	if(paddle.x + paddle.width > canvas.width){
		paddle.x -= paddle.xv;
	} else if(paddle.x < 0){
		paddle.x += paddle.xv;
	}
}

collisionBrick = function(t,ball){
	return ((t.x < ball.x + ball.r) && //10 is less than 20 + 10 = 30
		    (ball.x + ball.r < t.x + bricks.width) && //20 + 10 = 30 is less than 10 + 45 = 55
			(t.y < ball.y + ball.r) &&
			(ball.y + ball.r < t.y + bricks.height))
}

function gameOver(){
	if(lives == 0){
		clearInterval(intervalVar);
		ctx.font = "15px Arial";
		ctx.fillText("You Lose... Click the game to try again.", 200, 285);
		running = false;
	}
	if(scoreCount == 40){
		clearInterval(intervalVar);
		ctx.font = "15px Arial";
		ctx.fillText("You Win! Click the game to try again.", 200, 285);
		running = false;
	}
}

function main() {
	ctx.clearRect(0,0,WIDTH,HEIGHT);

	bricklist.forEach(bricks.draw); //This works, not bricks.draw();
	// bricks.draw();
	paddle.draw();
	ball.draw();
	score.print();
	livesBoard.print();

	for(key in bricklist){
		if(collisionBrick(bricklist[key],ball)){
			delete bricklist[key];
			ball.yv = -ball.yv;	
			scoreCount++;
		}
	}

	gameOver();
	ball.animate();
	movement();
	ball.collision();
	collision();
}

function startgame(){
	running = true;
	ball.x = canvas.width / 3;
	ball.y = 200;
	ball.xv = 3;
	ball.yv = 4;

	bricklist = [];
	numBricks = 0; 
	bricks.x = 40;
	bricks.y = 30;

	scoreCount = 0;
	lives = 3;

	tester();
	intervalVar = setInterval(main, 1000 / FPS);
}

function initialize(){
	if(running){
		running = false;
		clearInterval(intervalVar);
	} else {
	startgame();
}
}

canvas.addEventListener("click", initialize);