const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png',
    scale: 1,
    framesMax: 1
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 161
    },
    imageSrc: './assets/shop.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 100,
        y: 0

    },
    velocity: {
        x: 0,
        y: 10,
    },
    color: 'red',
    offset: {
        x: -180,
        y: -157
    },
    imageSrc: './assets/enemy/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    sprites: {
        idle: {
            imageSrc: './assets/enemy/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/enemy/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/enemy/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/enemy/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/enemy/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/enemy/samuraiMack/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/enemy/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 40
        },
        width: 175,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 750,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
    },
    color: 'blue',
    offset: {
        x: -180,
        y: -168
    },
    imageSrc: './assets/player/kenji/idle.png',
    scale: 2.5,
    framesMax: 4,
    sprites: {
        idle: {
            imageSrc: './assets/player/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/player/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/player/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/player/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/player/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/player/kenji/Take Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/player/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 50
        },
        width: 200,
        height: 50
    }

});

function animate() {

    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    // player movement
    player.velocity.x = 0;

    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement
    enemy.velocity.x = 0;

    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');

    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // player attack
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.framesCurrent == 4) {
        player.isAttacking = false;
        enemy.takeHit();
        document.querySelector('#enemy').style.width = `${enemy.health}%`;
        console.log("Player attack");
    }

    // missed attack
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    // enemy attack
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.framesCurrent == 2) {
        enemy.isAttacking = false;
        player.takeHit();
        document.querySelector('#player').style.width = `${player.health}%`;
        console.log("Enemy attack");
    }

    // missed attack
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }


    // Game Over
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}


decreaseTimer();

animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -15;
                break;
            case ' ':
                player.attack();
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -15;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})
