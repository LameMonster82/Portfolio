class PlasmaShot extends Image {
    constructor(posX, posY, playerAngleX, playerAngleY, angle, life, texture, speed) {
        super(32, 16)
        this.posX = posX;
        this.posY = posY;
        this.playerAngleX = playerAngleX;
        this.playerAngleY = playerAngleY;
        this.angle = angle;
        this.life = life;
        this.texture = texture;
        this.speed = speed;
    }

    drawPlasma() {
        this.posX += this.playerAngleX * this.speed;
        this.posY += this.playerAngleY * this.speed;

        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle);

        if (!((((canvas.width / 2) + playerPositionX) - (window.innerWidth / 2)) >= this.posX + this.width ||
                ((canvas.height / 2) + playerPositionY) - (window.innerHeight / 2) >= this.posY + this.height ||
                ((canvas.width / 2) + playerPositionX) + (window.innerWidth / 2) <= this.posX ||
                ((canvas.height / 2) + playerPositionY) + (window.innerHeight / 2) <= this.posY)) {
            ctx.drawImage(this.texture, -28, 28, 32, 16);
            ctx.drawImage(this.texture, -28, -46, 32, 16);
        }

        ctx.rotate(-this.angle);
        ctx.translate(-this.posX, -this.posY);
    }
    degrate() {
        if (this.life <= 0) {
            plasmaArray.splice(plasmaArray.indexOf(this), 1);
        } else {
            this.life--;
        }
    }
    checkCollisionToAsteroid(asteroid) {
        if (!(this.posX - 28 >= asteroid.posX + asteroid.width ||
                this.posY - 46 >= asteroid.posY + asteroid.height ||
                this.posX + 28 <= asteroid.posX ||
                this.posY + this.height <= asteroid.posY)) // It just works :)
        {
            asteroid.life = 0;
            this.life = 0;
            scoreboard += asteroid.score;
        }
    }
}

function handlePlasma() {
    plasmaArray.forEach(shot => {
        shot.drawPlasma();
        shot.degrate();
        asteroidArray.forEach(asteroid => {
            shot.checkCollisionToAsteroid(asteroid);
        });
    });
}