var audio = document.getElementById('slots_audio');
const winningAudio = new Audio('/audio/winning_sound_effect.mp3');
const losingAudio = new Audio('/audio/losing_sound_effect.mp3');
let spinning = false;

winningAudio.preload = 'auto';
losingAudio.preload = 'auto';
winningAudio.load();
losingAudio.load();

if (!window.currency) {
    console.error("Currency not loaded - waiting for initialization");
    document.addEventListener('currencyReady', initSlotsGame);
} else {
    initSlotsGame();
}

function initSlotsGame() {
    let currentBet = 0;

    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
            balanceElement.textContent = `${window.currency.getBalance().toFixed(2)}`;
        }
    }

    function displayMessage(message, clear = false) {
        const output = document.getElementById('output');
        if (clear) {
            output.innerText = "";
        }
        output.style.fontWeight = 'bold';
        output.innerText += message + "\n";
        output.scrollTop = output.scrollHeight;
    }

    function spinReel() {
        const reel = ['🍒', '🔔', '🍋', '7️⃣'];
        return reel[Math.floor(Math.random() * reel.length)];
    }

    function checkWin(reel1, reel2, reel3) {
        let winnings = 0;

        if (reel1 === '🍒' && reel2 === '🍒' && reel3 === '🍒') {
            winnings = 100 * currentBet;
            winningAudio.play();
            displayMessage(`🎉 JACKPOT!! Triple Cherries! 🍒🍒🍒: $${winnings}`);
        } else if (reel1 === '🔔' && reel2 === '🔔' && reel3 === '🔔') {
            winnings = 50 * currentBet;
            winningAudio.play();
            displayMessage(`🎊 Triple Bells! 🔔🔔🔔: $${winnings}`);
        } else if (reel1 === '🍋' && reel2 === '🍋' && reel3 === '🍋') {
            winnings = 10 * currentBet;
            winningAudio.play();
            displayMessage(`🎊 Triple Lemons! 🍋🍋🍋: $${winnings}`);
        } else if (reel1 === '7️⃣' && reel2 === '7️⃣' && reel3 === '7️⃣') {
            winnings = 5 * currentBet;
            winningAudio.play();
            displayMessage(`🎊 Lucky Sevens! 7️⃣7️⃣7️⃣: $${winnings}`);
        } else {
            losingAudio.play();
            displayMessage("❌ No win this time!");
        }

        if (winnings > 0) {
            currency.addWinnings(winnings);
        } else {
            currency.placeBet(currentBet);
        }

        updateBalanceDisplay();
        displayMessage(`\nCurrent Balance: $${currency.getBalance().toFixed(2)}`);
        spinning = false;

        if (currency.getBalance() <= 0) {
            displayMessage("💀 GAME OVER!");
        }
    }

    async function animateReel(reelNumber, finalSymbol, delay, stoppedReels) {
        const symbols = ['🍒', '🔔', '🍋', '7️⃣'];
        let count = 0;
        const maxCount = 15;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (count >= maxCount) {
                    clearInterval(interval);
                    stoppedReels[reelNumber] = finalSymbol;
                    displayMessage(`( <${stoppedReels[0]}> | <${stoppedReels[1]}> | <${stoppedReels[2]}> )`, true);
                    resolve(finalSymbol);
                    return;
                }
                const tempSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                stoppedReels[reelNumber] = tempSymbol;
                displayMessage(`( <${stoppedReels[0]}> | <${stoppedReels[1]}> | <${stoppedReels[2]}> )`, true);
                count++;
            }, delay);
        });
    }

    async function animateSpin(reel1, reel2, reel3) {
        let stoppedReels = ["?", "?", "?"];
        await animateReel(0, reel1, 100, stoppedReels);  // First reel stops first
        await animateReel(1, reel2, 150, stoppedReels);  // Second reel stops second
        await animateReel(2, reel3, 200, stoppedReels);  // Third reel stops last

        displayMessage(`( <${reel1}> | <${reel2}> | <${reel3}> )`, true);
        audio.pause();
        spinning = false;
        checkWin(reel1, reel2, reel3);
    }

    window.placeBet = function () {
        if (spinning) {
            displayMessage("⚠️ Please wait, the reels are still spinning.");
            return;
        }

        const betInput = document.getElementById('betInput');
        const bet = parseFloat(betInput.value, 10);

        if (isNaN(bet) || bet <= 0) {
            displayMessage("⚠️ Please enter a valid bet.");
            return;
        }

        if (!currency.canAfford(bet)) {
            displayMessage(`❌ You don't have enough money to place that bet.\nBalance: $${currency.getBalance()}`);
            return;
        }

        currentBet = bet;
        spinning = true;

        displayMessage(`\n----- SPINNING FOR: $${currentBet.toFixed(2)} -----\n`, true);

        audio.preload = 'auto';
        audio.load();
        audio.play();

        const reel1 = spinReel();
        const reel2 = spinReel();
        const reel3 = spinReel();

        animateSpin(reel1, reel2, reel3);
    };

    function start() {
        displayMessage(`💰 You have $${currency.getBalance().toFixed(2)}\n\nWelcome to Slots`, true);
        updateBalanceDisplay();
    }

    window.resetGame = function () {
        if (confirm("Don't Give Up! Press OK to get $10,000 and go\nALL-IN!!!")) {
            currency.resetBalance();
            displayMessage("Game reset! Balance restored to $10,000", true);
            updateBalanceDisplay();
            currentBet = 0;
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('spinButton').addEventListener('click', placeBet);
        document.getElementById('resetButton').addEventListener('click', resetGame);
        start();
    });
}

audio.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play().catch(e => console.log("Play error:", e));
});