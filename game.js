// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

const player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computer = {
    x: canvas.width - 20 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 4,
    vy: 4,
    size: ballSize
};

let playerScore = 0;
let computerScore = 0;

// Keyboard and mouse controls
const keys = {};
let mouseY = canvas.height / 2;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update game state
function update() {
    // Player paddle control - mouse
    if (mouseY - paddleHeight / 2 > 0 && mouseY + paddleHeight / 2 < canvas.height) {
        player.y = mouseY - paddleHeight / 2;
    }

    // Player paddle control - arrow keys
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.vy = -ball.vy;
        ball.y = Math.max(ball.size, Math.min(canvas.height - ball.size, ball.y));
    }

    // Ball collision with paddles
    // Player paddle collision
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height &&
        ball.vx < 0
    ) {
        ball.vx = -ball.vx;
        ball.x = player.x + player.width + ball.size;
        // Add spin based on where the ball hits the paddle
        let deltaY = ball.y - (player.y + player.height / 2);
        ball.vy += deltaY * 0.05;
    }

    // Computer paddle collision
    if (
        ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height &&
        ball.vx > 0
    ) {
        ball.vx = -ball.vx;
        ball.x = computer.x - ball.size;
        // Add spin based on where the ball hits the paddle
        let deltaY = ball.y - (computer.y + computer.height / 2);
        ball.vy += deltaY * 0.05;
    }

    // Ball out of bounds - scoring
    if (ball.x < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    if (ball.x > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }

    // Computer AI
    const computerCenter = computer.y + computer.height / 2;
    if (computerCenter < ball.y - 35) {
        if (computer.y + computer.height < canvas.height) {
            computer.y += computer.speed;
        }
    } else if (computerCenter > ball.y + 35) {
        if (computer.y > 0) {
            computer.y -= computer.speed;
        }
    }
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw player paddle
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw computer paddle
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);

    // Draw ball
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.vy = (Math.random() - 0.5) * 4;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();