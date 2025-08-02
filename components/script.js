let maxRange = 10; //Default Mode Easy
let secretNumber = getRandomNumber(maxRange);
let attempts = 0;
let timer = null;
let timeElapsed = 0;
let timerEnable = false;
let timeStart = false;

function getRandomNumber() {
    return Math.floor(Math.random() * maxRange) + 1;
}

function checkGuest() {
    const guestInput = document.getElementById('guessInput');
    const guess = Number(guestInput.value);
    const resultText = document.getElementById('resultText');
    const attemptsText = document.getElementById('attemptsText');

    if(!guess || guess < 1 || guess > maxRange){
        resultText.textContent = `Please enter a number between 1 and ${maxRange}.`;
        return;
    }

    //Start timer only on first valid guess
    if (timerEnable && !timeStart) {
        timeStart = true;
        timer = setInterval(() => {
            timeElapsed++;
            document.getElementById("timerDisplay").textContent = `Time: ${timeElapsed}s`;
        }, 1000);
    }

    attempts++;

    if(guess < secretNumber) {
        resultText.textContent = "Too Low!";
    } else if(guess > secretNumber) {
        resultText.textContent = "Too High!";
    } else {
        resultText.textContent = `Correct! You guess it in ${attempts} tries.`;
        clearInterval(timer) //Stop timer
        saveToScoreBoard(attempts, maxRange);
    }

    attemptsText.textContent = `Attempt: ${attempts}`;
}

function resetGame() {
    secretNumber = getRandomNumber(maxRange);
    attempts = 0;
    document.getElementById('guessInput').value = '';
    document.getElementById('resultText').textContent = '';
    document.getElementById('attemptsText').textContent = '';

    //Reset and stop any running timer
    timeElapsed = 0;
    timeStart = false;
    clearInterval(timer);
    if(timerEnable) {
        document.getElementById("timerDisplay").textContent = "Time: 0s";
    }
}

function setDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    maxRange = parseInt(difficulty);
    document.getElementById('rangeText').innerHTML = `I'm thinking of a number between <strong>1 and ${maxRange}</strong>. Can you guess it?`;
    resetGame();
}

function saveToScoreBoard(attempts, difficulty) {
    const score = {
        date: new Date().toLocaleString(),
        attempts: attempts,
        difficulty: difficulty,
        time: timerEnable ? `${timeElapsed}s` : "None"
    };

    const previousScores = JSON.parse(localStorage.getItem("scoreboard")) || [];
    previousScores.push(score);
    localStorage.setItem("scoreboard", JSON.stringify(previousScores));
}

function toggleTimer() {
    const checkbox = document.getElementById("enableTimer");
    timerEnable = checkbox.checked;

    //Restart the game when the timer setting changes
    resetGame();

    // Show "Time: 0s" if enabled
    if(timerEnable) {
        document.getElementById("timerDisplay").textContent = "Time: 0s";
    }else {
        document.getElementById("timerDisplay").textContent = "";
    }
}