const cvs = document.getElementById("gameview");
const ctx = cvs.getContext("2d");

//vẽ thanh đỡ bóng



const WIN = new Audio();
WIN.src = "./music/game-win.wav"

const LOSE = new Audio();
LOSE.src = "./music/game-lose.wav"

const HIT = new Audio();
HIT.src = "./music/hit.wav"

const BANNER = new Image();
BANNER.src = "./img/wraper.jpg";
const CROSSBAR_IMG = new Image();
CROSSBAR_IMG.src = "./img/crossbar.jpg";

const SOUND_IMG = new Image();
SOUND_IMG.src = "./img/sound.svg";

const BRICK_IMG = new Image();
BRICK_IMG.src = "./img/brick.jpg";

const SCORE_IMG = new Image();
SCORE_IMG.src = "./img/score.svg";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "./img/level.svg";

const LIFE_IMG = new Image();
LIFE_IMG.src = "./img/life.svg";

const CROSSBAR_WIDTH = 120;
const CROSSBAR_HEIGHT = 20;
const CROSSBAR_MARGIN_BOTTOM = 20;
const BALL_RADIUS = 10;
let DIEM = 0;
const SCORE = 10;
const LEVEL_MAX = 4;
let LEVEL = 1;
let HEART = 3;
let turnLeft = false;
let turnRight = false;

const crossbar = {
    x: cvs.width / 2 - CROSSBAR_WIDTH / 2,
    y: cvs.height - CROSSBAR_MARGIN_BOTTOM - CROSSBAR_HEIGHT,
    width: CROSSBAR_WIDTH,
    height: CROSSBAR_HEIGHT,
    dx: 10
}

function drawCrossBar() {

    ctx.fillStyle = "#2e3548";
    ctx.fillRect(crossbar.x, crossbar.y, crossbar.width, crossbar.height);
    ctx.drawImage(CROSSBAR_IMG, crossbar.x, crossbar.y, 120, 20);
    ctx.strokeStyle = "black";
    ctx.strokeRect(crossbar.x, crossbar.y, crossbar.width, crossbar.height);
}
// vẽ quả bóng

const ball = {
    x: cvs.width / 2,
    y: crossbar.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3,
    dy: -3
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.stroke();
}
// vẽ  gạch
const brick = {
    row: 1,
    collumn: 12,
    width: 55,
    height: 20,
    paddingLeft: 40,
    paddingTop: 20,
    marginTop: 60,
    colorBrick: "Black"
}
let bricks = [];


function createBrick() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.collumn; c++) {
            bricks[r][c] = {
                x: c * (brick.paddingLeft + brick.width) + brick.paddingLeft,
                y: r * (brick.paddingTop + brick.height) + brick.paddingTop + brick.marginTop,
                status: true
            }
        }
    }

}


function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.collumn; c++) {
            let b = bricks[r][c];
            if (bricks[r][c].status) {
                ctx.fillStyle = brick.colorBrick;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.drawImage(BRICK_IMG, b.x, b.y, 55, 20);
                ctx.strokeStyle = "black";
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }

        }
    }
}

createBrick();
//sự kiện di chuyển thanh đỡ bóng
document.addEventListener("keydown", function(event) {
    if (event.keyCode == 37) {
        turnLeft = true;
    } else if (event.keyCode == 39) {
        turnRight = true;
    }

});

document.addEventListener("keyup", function(event) {
    if (event.keyCode == 37) {
        turnLeft = false;
    } else if (event.keyCode == 39) {
        turnRight = false;
    }

});

// document.addEventListener("mousemove", function(event) {
//     if (crossbar.x > 0 && crossbar.x + crossbar.width < cvs.width) {
//         crossbar.x = event.clientX - 300;
//     }
// });




function moveCrossBar() {
    if (turnLeft && crossbar.x > 0) {
        crossbar.x -= crossbar.dx;
    } else if (turnRight && (crossbar.x + crossbar.width) < cvs.width) {
        crossbar.x += crossbar.dx;
    }
}

//sự kiện di chuyển  bóng
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function checkBallWall() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;

    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        HEART--;
        resetBall();
        // if (HEART <= 0) {
        //     checkGameOver();

        // }
    }
}
let GAME_OVER = false;

function checkGameOver() {

    if (HEART <= 0) {
        showGameOver();
        GAME_OVER = true;
        LOSE.play();
    }

}

function checkCrossBarWall() {
    if (ball.x < crossbar.x + crossbar.width && ball.y < crossbar.y + crossbar.height &&
        ball.x > crossbar.x && ball.y > crossbar.y - BALL_RADIUS) {


        let touchPoint = ball.x - (crossbar.x + crossbar.width / 2);


        touchPoint = touchPoint / (crossbar.width / 2);
        let angle = touchPoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);

    }
}

function checkBallBrick() {
    for (let r = 0; r < brick.row; r++) {

        for (let c = 0; c < brick.collumn; c++) {
            let b = bricks[r][c];
            if (b.status) {

                if (ball.x + ball.radius > b.x &&
                    ball.x - ball.radius < b.x + brick.width &&
                    ball.y + ball.radius > b.y &&
                    ball.y - ball.radius < b.y + brick.height) {
                    HIT.play();
                    b.status = false;
                    DIEM += SCORE;
                    ball.dy = -ball.dy;
                    console.log(DIEM);
                }
            }

        }
    }
}

function showDiem() {
    ctx.fillStyle = "#DCC50F";
    ctx.fillText(DIEM, 110, 30);
    ctx.font = "20px Verdana";
}
// const cvsScore = document.getElementsByName(flag);

function showLevel() {
    ctx.fillStyle = "#DCC50F";
    ctx.fillText(LEVEL, 260, 30);
    ctx.font = "20px Verdana";
    ctx.fillText("/" + 5, 272, 30);
}

function showMang() {
    ctx.fillStyle = "#B50606";
    ctx.fillText(HEART, 400, 30);
    ctx.font = "20px Verdana";
}

function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = crossbar.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

function checkQuaMan() {
    let lvUp = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.collumn; c++) {
            lvUp = lvUp && !bricks[r][c].status;
        }
    }
    if (lvUp) {
        if (LEVEL > LEVEL_MAX) {
            showWin()
            WIN.play();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBrick();
        LEVEL++;
        ball.speed += 1;
        resetBall();
    }
}
const notiGame = document.getElementById("noti-game");
const notiWin = document.getElementById("noti-win");
const notiGameOver = document.getElementById("noti-gameover");
const playAgain = document.getElementById("play-again");

function showWin() {
    notiGame.style.display = "block";
    notiWin.style.display = "block";
}

function showGameOver() {
    notiGame.style.display = "block";
    notiGameOver.style.display = "block";
}
playAgain.addEventListener("click", function() {
    location.reload();
})


function draw() {
    drawCrossBar();
    drawBall();
    drawBricks();
    showDiem();
    showLevel();
    showMang();
}

function update() {
    moveCrossBar();
    moveBall();
    checkBallWall();
    checkCrossBarWall();
    checkBallBrick();
    checkGameOver();
    checkQuaMan();
}

function loop() {
    ctx.drawImage(BANNER, 0, 0);
    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }
    draw();
    update();

}
loop();