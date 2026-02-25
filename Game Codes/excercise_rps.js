const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');
let currentBet = 0;
let computer = '';
let player = '';

const winningAudio = new Audio('/audio/winning_sound_effect.mp3');
const losingAudio = new Audio('/audio/losing_sound_effect.mp3');

winningAudio.preload = 'auto';
losingAudio.preload = 'auto';
winningAudio.load();
losingAudio.load();

function displayMessage(message, clear = false) {
    const output = document.getElementById('output');
    if (clear) {
        output.innerText = "";
    }
    output.style.fontWeight = 'bold';
    output.innerText += message + "\n";
    output.scrollTop = output.scrollHeight;
}

function rps() {
    options = ["rock", "paper", "scissors"];
    computer = getRandomElement(options);
    
    displayMessage("Welcome to Rock, Paper, Scissors with Betting!");
    displayMessage(`Starting balance: ${currency.getBalance()}`);
}

function updateBalanceDisplay() {
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
        balanceElement.innerText = currency.getBalance().toFixed(2); 
    }
}

function determineWin(player, computer) {
    displayMessage(`Player: ${player}`, true);
    displayMessage(`Computer: ${computer}`);

    if (player === computer) {
        currency.addWinnings(currentBet);
        displayMessage("It's a tie! You keep your bet.");
    } else if ((player === 'rock' && computer === 'scissors') || 
               (player === 'paper' && computer === 'rock') || 
               (player === 'scissors' && computer === 'paper')) {
        displayMessage("You win!");
        winningAudio.play();
        currency.addWinnings(currentBet * 2);
    } else {
        displayMessage("You lose!");
        losingAudio.play();
    }

    updateBalanceDisplay();  
    displayMessage(`Your Balance: ${currency.getBalance().toFixed(2)}`);
    currentBet = 0;
}

function placeBet() {
    const betInput = document.getElementById('betInput');
    const bet = parseFloat(betInput.value, 10);

    if (isNaN(bet) || bet <= 0) {
        displayMessage("Please enter a valid bet.");
        return;
    }

    if (!currency.canAfford(bet)) {
        displayMessage("You don't have enough money to place that bet.", true);
        return;
    }

    currentBet = bet;
    if (!currency.placeBet(bet)) {
        return;
    }

    enableButton("rock");
    enableButton("paper");
    enableButton("scissors");
    rps();

    displayMessage("Select a choice (rock, paper, scissors)", true);
}

function resetGame() {
    if (confirm("Dont Give up! Press OK to get 10,000 and go\nALL-IN!!!")) {
        currency.resetBalance();
        displayMessage("Game reset! Balance restored to 10,000", true);  
        document.getElementById('betInput').value = '';
        currentBet = 0;
        disableButton("rock");
        disableButton("paper");
        disableButton("scissors");
        updateBalanceDisplay();  // Update balance after its reseet
    }
}

function disableButton(id) {
    document.getElementById(id).disabled = true;
}

function enableButton(id) {
    document.getElementById(id).disabled = false;
}

function getRandomElement(options) {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

function start() {
    displayMessage(`Welcome to Rock Paper Scissors\n\nPlace a bet to begin\n\nBalance: $${currency.getBalance().toFixed(2)}`, true);
    disableButton("rock");
    disableButton("paper");
    disableButton("scissors");
    
    // Clear tha when the game starts
    const betInput = document.getElementById('betInput');
    betInput.value = '';
    updateBalanceDisplay();  
}

document.addEventListener('DOMContentLoaded', start);

rock.addEventListener('click', function() {
    player = 'rock';
    disableButton("rock");
    disableButton("paper");
    disableButton("scissors");
    setTimeout(() => {
        determineWin(player, computer);
    }, 1000);
});

paper.addEventListener('click', function() {
    player = 'paper';
    disableButton("rock");
    disableButton("paper");
    disableButton("scissors");
    setTimeout(() => {
        determineWin(player, computer);
    }, 1000);
});

scissors.addEventListener('click', function() {
    player = 'scissors';
    disableButton("rock");
    disableButton("paper");
    disableButton("scissors");
    setTimeout(() => {
        determineWin(player, computer);
    }, 1000);
});