class Asteroids extends Image {
    constructor(posX, posY, width, height, life, score, playerLastAngleX, playerLastAngleY, angle, texture) {
        super(width, height);
        this.posX = posX;
        this.posY = posY;
        this.life = life;
        this.score = score;
        this.speed = scoreboard / 100000;
        this.playerLastAngleX = playerLastAngleX;
        this.playerLastAngleY = playerLastAngleY;
        this.angle = angle;
        this.collision = true;
        this.texture = texture;
    }

    drawAsteroid() {
        this.posX -= this.playerLastAngleX * this.speed;
        this.posY -= this.playerLastAngleY * this.speed;
        //console.log(this.posX)

        if (!((((canvas.width / 2) + playerPositionX) - (window.innerWidth / 2)) >= this.posX + this.width ||
                ((canvas.height / 2) + playerPositionY) - (window.innerHeight / 2) >= this.posY + this.height ||
                ((canvas.width / 2) + playerPositionX) + (window.innerWidth / 2) <= this.posX ||
                ((canvas.height / 2) + playerPositionY) + (window.innerHeight / 2) <= this.posY)) {
            ctx.drawImage(this.texture, this.posX, this.posY, this.width, this.height);
        }
    }

    checkCollisionToPlayer() {
        if (!(((canvas.width / 2) + playerPositionX) - 44 >= this.posX + this.width ||
                ((canvas.height / 2) + playerPositionY) - 44 >= this.posY + this.height ||
                ((canvas.width / 2) + playerPositionX) + 44 <= this.posX ||
                ((canvas.height / 2) + playerPositionY) + 44 <= this.posY) && this.collision) // It just works :)
        {
            playerImage.src = "SVG/playerDead.svg";
            //console.log("hit")
            //backgroundMusic.pause();
            setTimeout(stopGame, 36);
        }
    }
    checkIfOutsidePlayspace() {
        if ((this.posX < canvas.width + 100 && this.posX < -200) || (this.posY < canvas.height + 100 && this.posY < -200)) {
            //console.log("outside")
            asteroidArray.splice(asteroidArray.indexOf(this), 1);
        }
    }

    degrate() {
        if (this.life <= 0) {
            this.collision = false;
            if (this.width > 0 && this.height > 0) {
                this.width -= 2;
                this.height -= 2;
            } else {
                asteroidArray.splice(asteroidArray.indexOf(this), 1);
                //console.log("ded")
            }

        } else {
            this.life--;
        }
    }
}

function coordinatesAsteroid(axis) {
    if (axis) { // true = X
        var x = getRandomArbitrary(-50, canvas.width + 50);
        if ((x > ((canvas.width / 2) + playerPositionX) - (window.innerWidth / 2) - 20 &&
                x < ((canvas.width / 2) + playerPositionX) + (window.innerWidth / 2) + 20)) {
            return coordinatesAsteroid(true); // try again
        } else {
            return x;
        }
    } else { // false = Y
        var y = getRandomArbitrary(-50, canvas.height + 50);
        if ((y > ((canvas.height / 2) + playerPositionY) - (window.innerHeight / 2) - 20 &&
                y < ((canvas.height / 2) + playerPositionY) + (window.innerHeight / 2) + 20)) {
            return coordinatesAsteroid(false); // try again
        } else {
            return y;
        }
    }
}

function createAsteroid() {
    var asteroidType = getRandomInt(3);
    var asteroidVariant = getRandomInt(3);
    var texture = 'asteroid' + asteroidType + '_' + asteroidVariant;
    var positionX = coordinatesAsteroid(true);
    var positionY = coordinatesAsteroid(false);

    var mouseDistanceXAsteroid = ((canvas.width / 2) + playerPositionX) - positionX;
    var mouseDistanceYAsteroid = ((canvas.height / 2) + playerPositionY) - positionY;
    var asteroidAngleX = Math.atan2(mouseDistanceYAsteroid, mouseDistanceXAsteroid).toFixed(2);
    var asteroidAngleY = Math.atan2(mouseDistanceXAsteroid, mouseDistanceYAsteroid).toFixed(2);
    var playerLastAngleToAsteroidX = Math.round(((Math.abs(asteroidAngleX / 3) * 10) - 5) * 2);
    var playerLastAngleToAsteroidY = Math.round(((Math.abs(asteroidAngleY / 3) * 10) - 5) * 2);

    newAsteroid = new Asteroids(
        positionX,
        positionY,
        256 + (Math.random() - Math.random()) * 100, // X
        128 + (Math.random() - Math.random()) * 100, // Y
        10000,
        (asteroidType + 1) * 1000,
        playerLastAngleToAsteroidX,
        playerLastAngleToAsteroidY,
        0, //Angle
        eval(texture) // Random Texture
    );

    asteroidArray.push(newAsteroid);
}

function handleAsteroids() {
    //console.log(maxAsteroids);
    setTimeout(() => {
        if (asteroidArray.length < maxAsteroids) {
            createAsteroid();
        }
    }, Math.round(getRandomArbitrary(20, 100)));

    asteroidArray.forEach(asteroid => {
        asteroid.drawAsteroid();
        asteroid.checkCollisionToPlayer();
        asteroid.checkIfOutsidePlayspace();
        asteroid.degrate();
    });
}