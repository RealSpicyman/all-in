const suitMap = { h: 'hearts', d: 'diams', c: 'clubs', s: 'spades' };

function makeCardLI(card) {
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.className = `card rank-${card.rank.toLowerCase()} ${suitMap[card.suit]}`;
    const r = document.createElement('span');
    r.className = 'rank';
    r.textContent = card.rank;
    div.appendChild(r);
    const s = document.createElement('span');
    s.className = 'suit';
    s.innerHTML = '&nbsp;';
    div.appendChild(s);
    li.appendChild(div);
    return li;
}function renderPlayerHand(cards, points) {
    
    const details = document.getElementById('cardDetails');
    details.innerHTML = '';
  
    const wrapper = document.createElement('div');
    wrapper.className = 'playingCards';
  
    const ul = document.createElement('ul');
    ul.className = 'hand';
  
    cards.forEach((card, i) => {
      const li = makeCardLI(card);
      const cardEl = li.querySelector('.card');
  
      cardEl.style.animation      = 'dealIn 0.6s ease forwards';
      cardEl.style.animationDelay = `${i * 0.4}s`;
  
      function onEnd() {
        cardEl.style.animation = '';
        cardEl.style.opacity   = '1';
        cardEl.style.transform = 'translateY(0) scale(1) rotateZ(0)';
        cardEl.removeEventListener('animationend', onEnd);
      }
      cardEl.addEventListener('animationend', onEnd);
  
      ul.appendChild(li);
    });
  
    wrapper.appendChild(ul);
    details.appendChild(wrapper);
  
    document.getElementById('cardPoints').textContent = `Total Points: ${points}`;
  }
const audio = new Audio('/audio/card-mixing.mp3');
const winningAudio = new Audio('/audio/winning_sound_effect.mp3');
const losingAudio = new Audio('/audio/losing_sound_effect.mp3');

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
const rankValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
    '7': 7, '8': 8, '9': 9, '10': 0,
    'Jack': 0, 'Queen': 0, 'King': 0, 'Ace': 1
};
const suits = { 'h': 'Hearts', 'd': 'Diamonds', 'c': 'Clubs', 's': 'Spades' };

let currentBet = 0;
let currentBetType = '';
let playerHand = null;

function dealCard() {
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = Object.keys(suits)[Math.floor(Math.random() * 4)];
    return {
        name: `${rank} of ${suits[suit]}`,
        value: rankValues[rank],
        rank,
        suit
    };
}
function placeBet() {
    if (playerHand) return;
    const betAmount = parseFloat(document.getElementById('betAmount').value, 10);
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.innerHTML = '';
  
    if (isNaN(betAmount) || betAmount <= 0) {
      resultMessage.innerHTML = 'Invalid bet amount!';
      return;
    }
    if (!currency.canAfford(betAmount)) {
      resultMessage.innerHTML = "You don't have enough to place that bet.";
      return;
    }
  
    updateBalanceDisplay();
    currentBet = betAmount;
    playerHand = createPlayerHand();
  
    audio.preload = 'auto';
    audio.load();
    audio.play();
    setTimeout(() => audio.pause(), 1000);
  
    renderPlayerHand(playerHand.rawCards, playerHand.points);
  
    document.getElementById('gameOutput').classList.add('expanded');
  
    document.getElementById('playerCardsDisplay').classList.remove('hidden');
    document.getElementById('betChoiceSection').classList.remove('hidden');
  
    resultMessage.textContent = 'Who do you want to bet on?';
  }

function calculateHand(hand) {
    const total = hand.reduce((sum, card) => sum + card.value, 0);
    return total % 10;
}

function createPlayerHand() {
    const hand = [dealCard(), dealCard()];
    let points = calculateHand(hand);
    if (points <= 5) {
        hand.push(dealCard());
        points = calculateHand(hand);
    }
    return {
        rawCards: hand,
        cards: hand.map(c => c.name),
        points
    };
}

function chooseBetType(betType) {
    currentBetType = betType.toLowerCase();
    if (!currency.placeBet(currentBet)) {
        document.getElementById('resultMessage').innerHTML = "You don't have enough to place that bet.";
        return;
    }
    updateBalanceDisplay();
    determineOutcome();
}

function determineOutcome() {
    const bankerHand = createPlayerHand();
    const outputDiv  = document.getElementById('resultMessage');
  
    let output = `<h3>Game Results</h3>
      <p>Your Cards: ${playerHand.cards.join(', ')} (Points: ${playerHand.points})</p>
      <p>Banker's Cards: ${bankerHand.cards.join(', ')} (Points: ${bankerHand.points})</p>`;
  
    const winner = playerHand.points > bankerHand.points
      ? 'player'
      : bankerHand.points > playerHand.points
      ? 'banker'
      : 'tie';
  
    let winnings = 0;
    if (currentBetType === winner) {
      switch (winner) {
        case 'player': winnings = currentBet * 2; break;
        case 'banker': winnings = Math.floor(currentBet * 1.95); break;
        case 'tie':    winnings = currentBet * 9; break;
      }
      output += `<p style="color: #00cc66;">You won $${winnings.toFixed(2)}!</p>`;
      winningAudio.play();
      currency.addWinnings(winnings);
    } else {
      output += `<p style="color: firebrick;">You lost $${currentBet.toFixed(2)}.</p>`;
      losingAudio.play();
    }
  
    updateBalanceDisplay();
  
    outputDiv.innerHTML = output;
  
    document.getElementById('gameOutput').classList.add('expanded');
  
    document.getElementById('betChoiceSection').classList.add('hidden');
    if (currency.getBalance() <= 0) {
      outputDiv.innerHTML += '<p style="color: red;">Game Over! You are out of money.</p>';
    }
  
    playerHand = null;
  }

function updateBalanceDisplay() {
    document.getElementById('balanceDisplay').innerText = `Balance: $${currency.getBalance().toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', updateBalanceDisplay);

window.resetGame = function() {
    if (confirm("Dont Give up! Press OK to get 10,000 and go\nALL-IN!!!")) {
        currency.resetBalance();
        displayMessage("Game reset! Balance restored to $10,000", true);
        document.getElementById('betInput').value = '';
        currentBet = 0;
    }
};
