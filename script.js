const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let mario;
const marioWidth = 40;
const marioHeight = 60;
let marioX = 50;
let marioY = canvas.height - marioHeight;
let isJumping = false;
let pebbles = []; // Store the pebbles
const pebbleWidth = 10;
const pebbleHeight = 10;
let isShooting = false; // Indicates if Mario is currently shooting

const groundHeight = 5;

function drawMario() {
    if (mario) {
        ctx.drawImage(mario, marioX, marioY, marioWidth, marioHeight);
    }
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        const jumpHeight = 100;
        const jumpDuration = 500; // milliseconds
        const startTime = Date.now();

        function jumpLoop() {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;

            if (elapsedTime < jumpDuration) {
                const progress = (elapsedTime / jumpDuration);
                marioY = canvas.height - marioHeight - (jumpHeight * Math.sin(progress * Math.PI));
                requestAnimationFrame(jumpLoop);
            } else {
                marioY = canvas.height - marioHeight;
                isJumping = false;
            }
        }

        requestAnimationFrame(jumpLoop);
    }
}

function shootPebble() {
    if (!isShooting) {
        isShooting = true;

        const pebble = {
            x: marioX + marioWidth / 2 - pebbleWidth / 2,
            y: marioY - pebbleHeight,
            speed: 5 // Adjust the speed as needed
        };

        pebbles.push(pebble);

        setTimeout(() => {
            isShooting = false;
        }, 500); // Adjust the shooting rate (milliseconds)
    }
}

function updatePebbles() {
    for (let i = 0; i < pebbles.length; i++) {
        pebbles[i].y -= pebbles[i].speed;

        // Remove pebbles that are out of bounds
        if (pebbles[i].y < -pebbleHeight) {
            pebbles.splice(i, 1);
            i--;
        }
    }
}

function drawPebbles() {
    for (let i = 0; i < pebbles.length; i++) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(pebbles[i].x, pebbles[i].y, pebbleWidth, pebbleHeight);
    }
}

function update() {
    if (isJumping) {
        return;
    }

    if (marioX < canvas.width) {
        marioX += 5; // Adjust the speed as needed
    } else {
        marioX = -marioWidth;
    }

    updatePebbles(); // Update pebbles
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMario();
    drawPebbles(); // Draw pebbles
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    requestAnimationFrame(draw);
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        jump();
    }
    if (event.key === 'ArrowDown' && !isShooting) {
        shootPebble();
    }
});

const imageUrlInput = document.getElementById('image-url');
const loadImageButton = document.getElementById('load-image');

loadImageButton.addEventListener('click', () => {
    const imageUrl = imageUrlInput.value;
    if (imageUrl) {
        mario = new Image();
        mario.src = imageUrl;

        mario.onload = function () {
            imageUrlInput.value = ''; // Clear the input field
        };
    }
});

draw();
setInterval(update, 100 / 60);
