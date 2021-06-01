const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructions = document.querySelector('.game-instructions');
const startbutton = document.querySelector('.start-button');
let alienInterval;



//função ativa eventos - movimento e tiro

function flyShip(event) {
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    }else if(event.key == 'ArrowDown'){
        event.preventDefault();
        moveDown();
    }else if(event.key === " "){
        event.preventDefault();
        fireLaser();
    }
}

// função up

function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); // pega da classe player-shooter o valor do atributo do css top
    if(topPosition === "0px"){
        return
    }else {
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`;
    }
}

// função down

function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "500px"){
        return
    }else {
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

// função criar o tiro na player area

function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

// cria o laser

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition-10}px`; // -10 para que fique mais ou menos no meio da nave
    return newLaser;
}

// mover laser

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) =>{ // comparando se cada alien foi atingido, se sim , troca o src da imagem
            if(checkLaseColision(laser, alien)){
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        });
            

        if(xPosition === 340){
            laser.remove();
        }else {
            laser.style.left = `${xPosition + 5}px`;
        }
    }, 10);
}

// cria inimigos aleatorios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// movimentar aliens

function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50){
            if(Array.from(alien.classList).includes('dead-alien')){ // se o alien passar pela posição 50 e não tiver a classe dead perdemos o jogo
                alien.remove();
            }else {
                gameOver();
            }
        }else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

// colisão

function checkLaseColision(laser, alien){
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if (laserLeft != 340 && laserLeft + 40 >= alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        }else {
            return false;
        }
    }else {
        return false;
    }
}

// inicio do jogo

startbutton.addEventListener('click', (event) => {
    playGame();
})


function playGame() {
    startbutton.style.display = 'none';
    instructions.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

// funçao de game over

function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    setTimeout(() => {
        alert('Game Over');
        yourShip.style.top = "250px";
        startbutton.style.display = "block";
        instructions.style.display = "block";
    });
}