const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    const result = document.querySelector('#result');
    if (player.health == enemy.health) {
        result.innerHTML = "TIE";
    } else if (player.health > enemy.health) {
        result.innerHTML = "Player1 Won!";
    } else {
        result.innerHTML = "Player2 Won!";
    }
}


let timer = 60;
let timerId;

function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000);
    if (timer > 0) {
        timer--;
        document.querySelector('.timer').innerHTML = timer;
    }
    if (timer == 0) {
        determineWinner({ player, enemy, timerId });
    }

}