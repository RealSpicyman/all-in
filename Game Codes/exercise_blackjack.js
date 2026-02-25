function initBlackJack() {
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const doubleBtn = document.getElementById('double-btn');
    const betInput = document.getElementById('bet');
    const spinButton = document.getElementById('spinButton');
    const resetButton = document.getElementById('resetButton');
    const balanceDisplay = document.getElementById('balanceAmount');

    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const values = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11 };

    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let currentBet = 0;
    let gameInProgress = false;

    function updateBalanceDisplay() {
        if (balanceDisplay && window.currency) {
            balanceDisplay.textContent = `${window.currency.getBalance().toFixed(2)}`;
        }
    }

    function displayOutput(message, clear = false) {
        const output = document.getElementById('output');
        if (clear) output.innerText = '';
        output.innerText += message + '\n';
        output.scrollTop = output.scrollHeight;
    }

    function displayDealer(message, clear = false) {
        const output = document.getElementById('dealer-hand');
        if (clear) output.innerText = '';
        output.innerText += message + '\n';
        output.scrollTop = output.scrollHeight;
    }

    function displayPlayer(message, clear = false) {
        const output = document.getElementById('player-hand');
        if (clear) output.innerText = '';
        output.innerText += message + '\n';
        output.scrollTop = output.scrollHeight;
    }

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ rank, suit });
            }
        }
        shuffleDeck();
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCard() {
        return deck.pop();
    }

    function calculateHandValue(hand) {
        let value = hand.reduce((sum, card) => sum + values[card.rank], 0);
        let aces = hand.filter(card => card.rank === "A").length;
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    function displayHand(hand, isDealer = false, hideFirstCard = false) {
        if (isDealer) {
            if (hideFirstCard) {
                displayDealer(`Dealer's Hand: [Hidden], ${hand[1].rank} of ${hand[1].suit}`, true);
            } else {
                displayDealer(`Dealer's Hand: ${hand.map(card => `${card.rank} of ${card.suit}`).join(', ')} - Value: ${calculateHandValue(hand)}`, true);
            }
        } else {
            displayPlayer(`Your Hand: ${hand.map(card => `${card.rank} of ${card.suit}`).join(', ')} - Value: ${calculateHandValue(hand)}`, true);
        }
    }

    function placeBet() {
        if (gameInProgress) {
            displayOutput("Finish current game first!");
            return;
        }

        const bet = parseFloat(betInput.value, 10);
        if (isNaN(bet) || bet <= 0) {
            displayOutput("Please enter a valid bet.", true);
            return;
        }

        if (!currency.canAfford(bet)) {
            displayOutput("You don't have enough money to place that bet.", true);
            return;
        }

        if (!currency.placeBet(bet)) return;

        currentBet = bet;
        createDeck();
        playerHand = [dealCard(), dealCard()];
        dealerHand = [dealCard(), dealCard()];
        gameInProgress = true;

        displayHand(dealerHand, true, true);
        displayHand(playerHand);
        updateBalanceDisplay();

        if (calculateHandValue(playerHand) === 21) {
            determineWin();
        } else {
            enableButtons();
        }
    }

    function determineWin() {
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);

        displayOutput("Final Results:");
        displayHand(playerHand);
        displayHand(dealerHand, true);

        if (playerValue > 21) {
            displayOutput("You busted! Dealer wins.", true);
        } else if (dealerValue > 21) {
            currency.addWinnings(currentBet * 2);
            displayOutput("Dealer busted! You win!", true);
        } else if (playerValue > dealerValue) {
            currency.addWinnings(currentBet * 2);
            displayOutput("You win!", true);
        } else if (playerValue < dealerValue) {
            displayOutput("Dealer wins!", true);
        } else {
            currency.addWinnings(currentBet);
            displayOutput("It's a tie!", true);
        }

        currentBet = 0;
        gameInProgress = false;
        updateBalanceDisplay();
        disableButtons();
    }

    function enableButtons() {
        hitBtn.disabled = false;
        standBtn.disabled = false;
        doubleBtn.disabled = false;
    }

    function disableButtons() {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleBtn.disabled = true;
    }

    function dealerTurn() {
        disableButtons();
        displayHand(dealerHand);
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(dealCard());
            displayHand(dealerHand);
        }
        determineWin();
    }

    function resetGame() {
        if (confirm("Don't give up! Press OK to get 10,000 and go ALL-IN!!!")) {
            currency.resetBalance();
            displayOutput("Game reset! Balance restored to $10,000", true);
            betInput.value = '';
            currentBet = 0;
            updateBalanceDisplay();
        }
    }

    function start() {
        displayOutput("Welcome to Blackjack\nPlace a bet to begin", true);
        updateBalanceDisplay();
        disableButtons();
    }

    // Event listeners
    spinButton.addEventListener('click', placeBet);
    resetButton.addEventListener('click', resetGame);
    hitBtn.addEventListener('click', function () {
        if (!gameInProgress) return;
        playerHand.push(dealCard());
        displayHand(playerHand);
        if (calculateHandValue(playerHand) > 21) {
            disableButtons();
            determineWin();
        }
    });
    standBtn.addEventListener('click', function () {
        if (!gameInProgress) return;
        dealerTurn();
    });
    doubleBtn.addEventListener('click', function () {
        if (!gameInProgress) return;
        if (currentBet * 2 <= currency.getBalance()) {
            if (currency.placeBet(currentBet)) {
                currentBet *= 2;
                playerHand.push(dealCard());
                displayHand(playerHand);
                if (calculateHandValue(playerHand) > 21) {
                    disableButtons();
                    determineWin();
                } else {
                    dealerTurn();
                }
                updateBalanceDisplay();
            }
        } else {
            displayOutput("Not enough funds to double!");
        }
    });

    start();
}

// ✅ Ensure everything waits for DOM + currency
document.addEventListener("DOMContentLoaded", function () {
    if (!window.currency) {
        document.addEventListener('currencyReady', initBlackJack);
    } else {
        initBlackJack();
    }
});
