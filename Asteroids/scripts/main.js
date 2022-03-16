// Window
const canvas = document.getElementById("canvasArea");
const ctx = canvas.getContext('2d');

canvas.width = 7680;
canvas.height = 4320;

var backgroundImageScale = 16;
var gameShouldStop = false;
var gamePaused = false;
var timePlayed = 0;

var mainGameClock;

// Position
var canvasOffsetX = -((canvas.width / 2) - (window.innerWidth / 2));
var canvasOffsetY = -((canvas.height / 2) - (window.innerHeight / 2));
var playerLookingAtX = 0;
var playerLookingAtY = 0;
var playerPositionX = 0;
var playerPositionY = 0;
var mouseDistanceX;
var mouseDistanceY;
var angleX;
var angleY;
var mouseX;
var mouseY;

//Asteroids
var asteroidArray = [];
var maxAsteroids = 25;

//Ship
var plasmaEnabledCooldown = true;
var plasmaEnabled = true;
var secondLaser = false;
var plasmaCooldown = 0;
var plasmaArray = [];

//Dash
var accelerationEnabled = true;
var shipAcceleration = 0;
var mouseEnabled = true;
var dashCooldown = 0;
var scoreboard = 0;

// Texrures
const playerDeadImage = new Image();
const backgroundImage = new Image();
const plasmaImage1 = new Image();
const plasmaImage2 = new Image();
const playerImage = new Image();
const asteroid0_0 = new Image();
const asteroid0_1 = new Image();
const asteroid0_2 = new Image();
const asteroid1_0 = new Image();
const asteroid1_1 = new Image();
const asteroid1_2 = new Image();
const asteroid2_0 = new Image();
const asteroid2_1 = new Image();
const asteroid2_2 = new Image();
const planetArray = [
    planet0 = new Image(),
    planet1 = new Image(),
    planet2 = new Image(),
    planet3 = new Image(),
    planet4 = new Image(),
    planet5 = new Image(),
    planet6 = new Image()
];


backgroundImage.src = "SVG/background2.svg";
asteroid0_0.src = "SVG/asteroid0_0.svg"
asteroid0_1.src = "SVG/asteroid0_1.svg"
asteroid0_2.src = "SVG/asteroid0_2.svg"
asteroid1_0.src = "SVG/asteroid1_0.svg"
asteroid1_1.src = "SVG/asteroid1_1.svg"
asteroid1_2.src = "SVG/asteroid1_2.svg"
asteroid2_0.src = "SVG/asteroid2_0.svg"
asteroid2_1.src = "SVG/asteroid2_1.svg"
asteroid2_2.src = "SVG/asteroid2_2.svg"
playerDeadImage.src = "SVG/player.svg"
plasmaImage1.src = "SVG/plasma1.svg";
plasmaImage2.src = "SVG/plasma2.svg";
playerImage.src = "SVG/player.svg";
planet0.src = "SVG/planet0.svg";
planet1.src = "SVG/planet1.svg";
planet2.src = "SVG/planet2.svg";
planet3.src = "SVG/planet3.svg";
planet4.src = "SVG/planet4.svg";
planet5.src = "SVG/planet5.svg";
planet6.src = "SVG/planet6.svg";




// Audio
var overheatBeepSound = new Audio("Audio/overheatBeep.ogg");
var dashCooldownSound = new Audio("Audio/dashDone.ogg");
var backgroundMusic = new Audio("Audio/CI5Ingame2.ogg");
var gameOverSound = new Audio("Audio/CI5GameOver.ogg");
var overheatSound = new Audio("Audio/overheat.ogg");
var shootSound = new Audio("Audio/shoot.ogg");
var dashSound = new Audio("Audio/swish.ogg");
var backgroundMusicInterval;
backgroundMusic.currentTime = 0;
overheatBeepSound.volume = 0.5;
dashSound.playbackRate = 2.5;
backgroundMusic.loop = true;
backgroundMusic.volume = 0;
overheatSound.volume = 0.5;
gameOverSound.volume = 0.5;
shootSound.volume = 0.5;

playerImage.width = 128; //dont know. Dont care
playerImage.height = 128;

function mousePosition(MouseEvent) {
    if (mouseEnabled) {
        mouseX = MouseEvent.pageX;
        mouseY = MouseEvent.pageY;
    }
};
canvas.onmousemove = mousePosition;


function internalMath() {
    if (shipAcceleration >= 0) {
        shipAcceleration -= 0.01;
    }
    if (shipAcceleration > 2 && accelerationEnabled === true) {
        shipAcceleration = 2;
    }

    if (dashCooldown > 0) {
        dashCooldown--;
    }
    if (plasmaCooldown >= 500 && !gamePaused && !gameShouldStop) {
        plasmaEnabledCooldown = false;
        plasmaCooldown = 495;
        overheatSound.play();
        setTimeout(function() {
            plasmaEnabledCooldown = true;
            overheatBeepSound.play();
        }, 5000);
    } else if (plasmaCooldown > 1) {
        plasmaCooldown -= 5;
    }


    mouseDistanceX = (window.innerWidth / 2) - mouseX;
    mouseDistanceY = (window.innerHeight / 2) - mouseY;
    angleX = Math.atan2(mouseDistanceY, mouseDistanceX).toFixed(2);
    angleY = Math.atan2(mouseDistanceX, mouseDistanceY).toFixed(2);
    playerLookingAtX = (((Math.abs(angleX / 3) * 10) - 5) * 2);
    playerLookingAtY = (((Math.abs(angleY / 3) * 10) - 5) * 2);
}

function setCanvas() {
    canvas.style.left = canvasOffsetX + "px";
    canvas.style.top = canvasOffsetY + "px";

    ctx.clearRect(-canvasOffsetX, -canvasOffsetY,
        ((canvas.width / 2) + playerPositionX) + (window.innerWidth / 2),
        ((canvas.height / 2) + playerPositionY) + (window.innerHeight / 2));
};

function drawBackground() {
    ctx.translate(0, 0);
    ctx.drawImage( // draw only what we need
        backgroundImage, -canvasOffsetX, -canvasOffsetY,
        window.innerWidth, window.innerHeight, -canvasOffsetX, -canvasOffsetY,
        window.innerWidth, window.innerHeight);
};

planetArray.forEach(planet => {
    planet.posX = getRandomArbitrary(0, canvas.width);
    planet.posY = getRandomArbitrary(0, canvas.height);
    planet.angle = getRandomArbitrary(-2, 2) * Math.PI;
    planet.width = getRandomArbitrary(8, 128);
    planet.height = getRandomArbitrary(8, 128);
    planet.speed = getRandomArbitrary(-2, 2);
});

function drawPlanets() {
    planetArray.forEach(planet => {
        planet.posX += planet.speed;
        planet.posY += planet.speed;

        if ((((canvas.width / 2) + playerPositionX) - (window.innerWidth / 2) <= planet.posX ||
                ((canvas.height / 2) + playerPositionY) - (window.innerHeight / 2) <= planet.posY ||
                ((canvas.width / 2) + playerPositionX) + (window.innerWidth / 2) >= planet.posX ||
                ((canvas.height / 2) + playerPositionY) + (window.innerHeight / 2) >= planet.posY)) {
            ctx.translate(planet.posX, planet.posY);
            ctx.rotate(planet.angle);
            ctx.drawImage(planet, 0, 0, planet.width, planet.height);
            ctx.rotate(-planet.angle);
            ctx.translate(-planet.posX, -planet.posY);
        }
    });
}

function moveCanvas() {
    if (shipAcceleration > 0 && accelerationEnabled) {
        canvasOffsetX -= playerLookingAtX * shipAcceleration;
        canvasOffsetY -= playerLookingAtY * shipAcceleration;
        playerPositionX += playerLookingAtX * shipAcceleration;
        playerPositionY += playerLookingAtY * shipAcceleration;
    }
}

function drawGradient() {
    ctx.beginPath();
    ctx.translate(0, 0)

    if (((canvas.width / 2) + playerPositionX) - (window.innerWidth / 2) <= 400) {
        var left = ctx.createLinearGradient(0, 0, 400, 0);
        left.addColorStop(0, 'black');
        left.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = left;
        ctx.fillRect(0, 0, 400, canvas.height);
    }

    if ((((canvas.height / 2) + playerPositionY) - (window.innerHeight / 2) <= 400)) {
        ctx.beginPath();
        var up = ctx.createLinearGradient(0, 0, 0, 400);
        up.addColorStop(0, 'black');
        up.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = up;
        ctx.fillRect(0, 0, canvas.width, 400);
    }

    if (!(((canvas.width / 2) + playerPositionX) + (window.innerWidth / 2) <= canvas.width - 400)) {
        ctx.beginPath();
        var right = ctx.createLinearGradient(canvas.width - 400, 0, canvas.width, 0);
        right.addColorStop(0, 'rgba(0, 0, 0, 0)');
        right.addColorStop(1, 'black');
        ctx.fillStyle = right;
        ctx.fillRect(canvas.width - 400, 0, canvas.width, canvas.height);
    }

    if (!(((canvas.height / 2) + playerPositionY) + (window.innerHeight / 2) <= canvas.height - 400)) {
        ctx.beginPath();
        var down = ctx.createLinearGradient(0, canvas.height - 400, 0, canvas.height);
        down.addColorStop(0, 'rgba(0, 0, 0, 0)');
        down.addColorStop(1, 'black');
        ctx.fillStyle = down;
        ctx.fillRect(0, canvas.height - 400, canvas.width, canvas.height);
    }
}

function stopGame() {
    playerImage.src = "SVG/playerDead.svg";
    backgroundMusic.pause();
    gameOverSound.play();
    if (!gameShouldStop) {
        gameShouldStop = true;
        gamePaused = true;
        stopBackgroundMusic();
        clearInterval(mainGameClock);
        setTimeout(function() { // Wait for everything to finish drawing
            ctx.fillStyle = "rgba(20, 0, 0, 0.4)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "bold 90px Open Sans";
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText("Game Over", (canvas.width / 2) + playerPositionX, (canvas.height / 2) + playerPositionY);
            ctx.font = "70px Open Sans";
            ctx.fillText("Score: " + scoreboard, (canvas.width / 2) + playerPositionX, (canvas.height / 2) + playerPositionY + 100);
            ctx.fillText("Time: " + Math.round((timePlayed * 16) / 1000) + " Seconds", (canvas.width / 2) + playerPositionX, (canvas.height / 2) + playerPositionY + 200);
        }, 16);
    }
}

function stopBackgroundMusic() {
    backgroundMusicInterval = setInterval(function() {
        if (backgroundMusic.volume >= 0.02) {
            backgroundMusic.volume -= 0.02;
        } else if (backgroundMusic.volume === 0) {
            backgroundMusic.pause();
        }
    }, 160);
}

function startBackgroundMusic() {
    backgroundMusic.play();
    backgroundMusicInterval = setInterval(function() {
        if (backgroundMusic.volume < 0.3) {
            backgroundMusic.volume += 0.01;
        }
    }, 160);
}

function accelerateCanvas(key) {
    // Move the canvas rather than the ship
    // Easier to manage
    if (backgroundMusic.currentTime === 0) {
        startBackgroundMusic();
    }
    switch (key.code) {
        case "Escape":
            gamePaused ^= true;
            pauseGame();
            break;
        case "KeyW":
            shipAcceleration += 0.05;
            break;
        case "KeyS":
            shipAcceleration -= 0.1;
    }

    if (key.code === "KeyW" && key.shiftKey === true && dashCooldown === 0 && accelerationEnabled === true && !gamePaused && !gameShouldStop) {
        playerDash();
    }
};
window.addEventListener('keydown', accelerateCanvas);

function mouseClick(e) {
    if (typeof e === 'object' && plasmaEnabled === true && plasmaEnabledCooldown === true && !gamePaused && !gameShouldStop) {
        if (backgroundMusic.currentTime === 0) {
            startBackgroundMusic();
        }
        switch (e.button) {
            case 0:
            case 2:
                shootSound.pause();
                shootSound.currentTime = 0;
                shootSound.play();
                plasmaEnabled = false;
                setTimeout(function() {
                    plasmaEnabled = true;
                }, 125);
                plasmaCooldown += 100;

                secondLaser = secondLaser ? false : true;
                createPlasma();
                break;
            default:
                log.textContent = `Unknown button code: ${e.button}`;
        }

    } else if (gameShouldStop) {
        location.reload();
    }
}
window.addEventListener('mousedown', mouseClick);

function playerDash() {
    var accelerationDone = false;
    oldShipAcceleration = shipAcceleration;
    accelerationEnabled = false;
    mouseEnabled = false;
    dashSound.play();

    var dashInterval = setInterval(function() {
        if (shipAcceleration <= 6 && accelerationDone === false) {
            shipAcceleration += 0.25;
        } else if (shipAcceleration >= oldShipAcceleration) {
            shipAcceleration -= 0.25;
            accelerationDone = true;
        }

        canvasOffsetX -= playerLookingAtX * shipAcceleration;
        canvasOffsetY -= playerLookingAtY * shipAcceleration;
        playerPositionX += playerLookingAtX * shipAcceleration;
        playerPositionY += playerLookingAtY * shipAcceleration;
    }, 16);


    setTimeout(function() {
        mouseEnabled = true;
        accelerationEnabled = true;
        dashCooldown = 100;
        clearInterval(dashInterval);
        setTimeout(function() {
            dashCooldownSound.play();
        }, 2800);
    }, 500);
}

function pauseGame() {
    clearInterval(backgroundMusicInterval);
    if (gamePaused && !gameShouldStop) {
        stopBackgroundMusic();
        clearInterval(mainGameClock);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 90px Open Sans";
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillText("Paused", (canvas.width / 2) + playerPositionX, (canvas.height / 2) + playerPositionY);
    } else if (!gamePaused && !gameShouldStop) {
        mainGameClock = setInterval(main, 16);
        startBackgroundMusic();
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function main() {
    timePlayed++;
    internalMath();
    setCanvas();
    drawBackground();
    drawPlanets();
    moveCanvas();
    handleAsteroids();
    handlePlasma();
    drawShip();
    drawGradient();
};

//Workaround for a shitty scaling bug
document.body.style.zoom = "25%";
mainGameClock = setInterval(main, 16);
setTimeout(function() {
    ctx.font = "bold 90px Open Sans";
    ctx.fillText("", 0, 0); // Buffer font
    ctx.font = "70px Open Sans";
    ctx.fillText("", 0, 0); // Buffer font

    document.body.style.zoom = "100%";
}, 256);