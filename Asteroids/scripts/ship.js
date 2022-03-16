function drawShip() {
    scoreboard += Math.round(shipAcceleration * 5);

    ctx.translate((canvas.width / 2) + playerPositionX, (canvas.height / 2) + playerPositionY);
    ctx.rotate(angleX);
    ctx.drawImage(playerImage, -64, -64, playerImage.height, playerImage.width);
    ctx.rotate(-angleX);
    if (dashCooldown > 0) {
        ctx.rotate(0.5 * Math.PI);
        drawDashCooldown();
        ctx.rotate(-0.5 * Math.PI);
    }
    drawPlasmaCooldown();

    ctx.fillStyle = "white";
    ctx.font = "40px Open Sans";
    ctx.textBaseline = 'top';
    ctx.textAlign = "left";
    ctx.fillText("Score: " + scoreboard, -(window.innerWidth / 2) + 70, -(window.innerHeight / 2) + 70);

    ctx.translate(-((canvas.width / 2) + playerPositionX), -((canvas.height / 2) + playerPositionY));

    if ((canvas.width / 2) + playerPositionX < -50 || (canvas.width / 2) + playerPositionX > canvas.width + 50 ||
        (canvas.height / 2) + playerPositionY < -50 || (canvas.height / 2) + playerPositionY > canvas.height + 50) {
        stopGame();
    }
};

var r = 255;
var g = 0;
var interval;

function drawDashCooldown() {
    if (dashCooldown >= 99) {
        r = 255;
        g = 0;
        interval = setInterval(() => {
            r -= 5;
            g += 5;
        }, 1);
        setTimeout(() => {
            clearInterval(interval);
        }, 2800);
    }
    ctx.fillStyle = "rgb(" + r + "," + g + ",0)";
    ctx.arc(0, 0, 10, Math.PI, ((dashCooldown / 50) - 1) * Math.PI, false);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.fillStyle = "black"
}

function drawPlasmaCooldown() {
    if (plasmaEnabledCooldown) {
        ctx.fillStyle = "rgb(" + (plasmaCooldown / 2) + "," + (500 - plasmaCooldown) + ",0)";
    } else {
        ctx.fillStyle = "red";
    }
    ctx.fillRect((window.innerWidth / 2) - 160, -((window.innerHeight / 2) - 60), 70, plasmaCooldown / 2);
    ctx.lineWidth = 9;
    ctx.lineJoin = "round";
    if (plasmaEnabledCooldown) {
        ctx.strokeStyle = "grey";
    } else {
        ctx.strokeStyle = "darkred";
    }
    ctx.strokeRect((window.innerWidth / 2) - 160, -((window.innerHeight / 2) - 60), 70, 250);
}

function createPlasma() {
    var lazerTexture = null;
    if (secondLaser === false) {
        lazerTexture = plasmaImage1;
    } else {
        lazerTexture = plasmaImage2;
    }
    var plasma = new PlasmaShot(
        (canvas.width / 2) + playerPositionX,
        (canvas.height / 2) + playerPositionY,
        playerLookingAtX,
        playerLookingAtY,
        angleX,
        200,
        lazerTexture,
        5);
    plasmaArray.push(plasma);
}