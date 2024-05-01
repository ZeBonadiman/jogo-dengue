document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const visitPageButton = document.getElementById('visitPageButton');
    const gameContainer = document.getElementById('gameContainer');
    const endMenu = document.getElementById('endMenu');
    const ducks = document.querySelectorAll('.duck');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timerDisplay');
    const finalScoreDisplay = document.getElementById('finalScore');
    let score = 0, timeLimit = 40, moveInterval = 1500;
    let timerId, moveTimer;

    checkPreviousSession();

    startButton.addEventListener('click', () => {
        localStorage.setItem('gamePlayed', 'true');
        startButton.parentElement.style.display = 'none';
        gameContainer.style.display = 'block';
        startGame();
    });

    restartButton.addEventListener('click', () => {
        localStorage.removeItem('gamePlayed');
        localStorage.removeItem('finalScore');
        location.reload();
    });

    visitPageButton.addEventListener('click', () => {
        window.location.href = 'https://www.example.com'; // Substitua pela URL desejada
    });

    function startGame() {
        updateTimer();
        timerId = setInterval(() => {
            timeLimit--;
            updateTimer();
            if (timeLimit % 5 === 0) { // Aumenta a velocidade a cada 5 segundos
                increaseDuckSpeed();
            }
            if (timeLimit <= 0) {
                clearInterval(timerId);
                clearInterval(moveTimer);
                alert('Tempo esgotado! Jogo encerrado.');
                finishGame();
            }
        }, 1000);
        moveDucks();
    }

    function finishGame() {
        localStorage.setItem('finalScore', score);
        showEndMenu();
    }


    function checkPreviousSession() {
        if (localStorage.getItem('gamePlayed')) {
            score = localStorage.getItem('finalScore');
            showEndMenu();
        }
    }

    function updateTimer() {
        timerDisplay.innerText = 'Tempo: ' + timeLimit + 's';
    }

    function increaseDuckSpeed() {
        if (moveInterval > 300) { // Impede que a velocidade se torne impossivelmente rápida
            moveInterval -= 100;
            clearInterval(moveTimer);
            moveDucks();
        }
    }

    function moveDucks() {
        moveTimer = setInterval(() => {
            ducks.forEach(duck => {
                moveDuck(duck);
            });
        }, moveInterval);
    }
 
    function moveDuck(duck) {
        let newPos = getNewPosition(duck);
        duck.style.top = newPos.top + 'px';
        duck.style.left = newPos.left + 'px';
        duck.style.display = 'block';
    }

    function getNewPosition(duck) {
        let newPos;
        do {
            newPos = {
                top: Math.random() * (gameContainer.offsetHeight - 50),
                left: Math.random() * (gameContainer.offsetWidth - 50)
            };
        } while (Math.abs(newPos.top - parseFloat(duck.style.top)) < 50 && Math.abs(newPos.left - parseFloat(duck.style.left)) < 50);
        return newPos;
    }

    function shoot(event) {
        if (event.target.classList.contains('duck')) {
            score++;
            scoreDisplay.innerText = 'Pontuação: ' + score;
            event.target.style.display = 'none';  
            setTimeout(() => moveDuck(event.target), 200);  
        }
    }

    function showEndMenu() {
        const finalScoreDisplay = document.getElementById('finalScore');
        finalScoreDisplay.innerText = 'Sua pontuação: ' + score; // Atualiza com a pontuação final
        gameContainer.style.display = 'none';
        endMenu.style.display = 'flex'; // Assegura que os estilos flex sejam aplicados
    }
    
    
    ducks.forEach(duck => {
        duck.addEventListener('click', shoot);
    });
});