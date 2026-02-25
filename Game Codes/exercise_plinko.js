const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');

const pegs = [];
const balls = [];
const floatingLabels = [];

const slots = [100, 10, 5, 2, 1, .5, .3, .1, .1, .3, .5, 1, 2, 5, 10, 100];
const slotCount = slots.length;

const pegRadius = 6;
const ballRadius = 10;
const spacingX = canvas.width / slotCount;
const spacingY = 35;

let gravity = 0.05;
let friction = 0.96;
let bounceStrength = 0.7;

let pegRows = 16;

function updateBalanceDisplay() {
  const balanceElement = document.getElementById('balanceAmount');
  if (balanceElement) {
    balanceElement.innerText = currency.getBalance().toFixed(2); 
  }
}

function createPegs() { // grid
  pegs.length = 0;
  for (let row = 0; row < pegRows; row++) {
    const pegCount = row + 2;
    const offsetX = (canvas.width - pegCount * spacingX) / 2;
    const y = row * spacingY + 40;
    for (let col = 0; col < pegCount; col++) {
      const x = offsetX + col * spacingX + spacingX / 2;
      pegs.push({ x, y });
    }
  }
}

function dropBall() {
  const bet = parseFloat(document.getElementById("betInput").value);

  if (isNaN(bet) || bet <= 0 || !window.currency.placeBet(bet)) {
    document.getElementById("resultText").textContent = "Enter a valid or affordable bet.";
    return;
  }

  const dropX = canvas.width / 2;
  const dropY = 0;
  const randomSpread = (Math.random() - 0.5) * 1.0; // Horizontal movement

  updateBalanceDisplay();

  balls.push({ // New ball
    x: dropX,
    y: dropY,
    vx: randomSpread,
    vy: 0,
    bet: bet,
    settled: false,
    removed: false
  });
}

function drawSlots() {
  const lastPegY = (pegRows - 1) * spacingY + 40;
  const boxY = lastPegY + spacingY / 2 - 10;

  const slotColors = [
    "#c93400", "#c73500", "#d34e00", "#dd6500",
    "#e67b00", "#ee9100", "#f5a700", "#fabd00",
    "#fabd00", "#f5a700", "#ee9100", "#e67b00",
    "#dd6500", "#d34e00", "#c73500", "#c93400"
  ];

  for (let i = 0; i < slotCount; i++) { // pos and size of slots
    const slotX = i * spacingX + 4;
    const slotWidth = spacingX - 8;
    const slotHeight = 40;
    const radius = 10;

    ctx.fillStyle = slotColors[i % slotColors.length];
    ctx.beginPath();
    ctx.moveTo(slotX + radius, boxY);
    ctx.lineTo(slotX + slotWidth - radius, boxY);
    ctx.quadraticCurveTo(slotX + slotWidth, boxY, slotX + slotWidth, boxY + radius);
    ctx.lineTo(slotX + slotWidth, boxY + slotHeight - radius);
    ctx.quadraticCurveTo(slotX + slotWidth, boxY + slotHeight, slotX + slotWidth - radius, boxY + slotHeight);
    ctx.lineTo(slotX + radius, boxY + slotHeight);
    ctx.quadraticCurveTo(slotX, boxY + slotHeight, slotX, boxY + slotHeight - radius);
    ctx.lineTo(slotX, boxY + radius);
    ctx.quadraticCurveTo(slotX, boxY, slotX + radius, boxY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(slots[i] + "x", i * spacingX + spacingX / 2, boxY + 27);
  }
}

let lastTime = performance.now(); // high res timer

function draw(currentTime = performance.now()) { // timing, reward, pegs, 60hz, 144hz
  const deltaTime = (currentTime - lastTime) / 10;
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSlots();

  ctx.fillStyle = "white";
  for (let peg of pegs) {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let ball of balls) { // loop through balls
    if (ball.removed) continue;

    if (!ball.settled) {
      ball.vy += gravity * deltaTime;

      const centerX = canvas.width / 2;
      const dxToCenter = centerX - ball.x;
      ball.vx += dxToCenter * 0.000225 * deltaTime; // Original Value is .0002, the higher the value, the more pulls it has

      ball.x += ball.vx * deltaTime; // Balls position
      ball.y += ball.vy * deltaTime;

      if (ball.x < ballRadius || ball.x > canvas.width - ballRadius) {
        ball.vx *= -1;
        ball.x = Math.max(ballRadius, Math.min(canvas.width - ballRadius, ball.x)); // direction
      }

      for (let peg of pegs) {
        const pegRowLimitY = (pegRows - 2) * spacingY + 40;
        if (ball.y > pegRowLimitY) break;

        const dx = peg.x - ball.x;
        const dy = peg.y - ball.y;
        const dist = Math.sqrt(dx * dx + dy * dy); // pythag cent of ball and pegs

        if (dist < pegRadius + ballRadius) {
          const angle = Math.atan2(dy, dx);
          const overlap = pegRadius + ballRadius - dist; // push
          ball.x -= Math.cos(angle) * overlap;
          ball.y -= Math.sin(angle) * overlap;

          ball.vx -= Math.cos(angle) * bounceStrength;
          ball.vy -= Math.sin(angle) * bounceStrength;

          ball.vx *= friction;
          ball.vy *= friction;

          ball.vx += (Math.random() - 0.5) * 0.2;
        }
      }

      const settleY = (pegRows - 1) * spacingY + 40 + spacingY / 2;
      if (ball.y > settleY) {
        ball.settled = true;

        const slotIndex = Math.floor(ball.x / spacingX); // money slots
        const multiplier = slots[slotIndex] || 0;
        const payout = ball.bet * multiplier;

        if (payout > 0) {
          currency.addWinnings(payout); // payout
          floatingLabels.push({
            text: `+${multiplier}x`,
            x: ball.x,
            y: canvas.height - 10,
            opacity: 1.0,
            color: multiplier >= 10 ? "gold" : multiplier >= 2 ? "orange" : "#ccc"
          });
          console.log(`[DEBUG] Currency is ${currency.getBalance()}`);
        }

        document.getElementById("resultText").textContent =
          payout > 0 ? `You won $${payout}!` : `You lost $${ball.bet}.`;
        ball.removed = true;

        updateBalanceDisplay();
      }
    }

    ctx.fillStyle = "gold"; // draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = floatingLabels.length - 1; i >= 0; i--) { // labels
    const label = floatingLabels[i];
    ctx.globalAlpha = label.opacity;
    ctx.fillStyle = label.color;
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label.text, label.x, label.y);

    label.y -= 0.5;
    label.opacity -= 0.01;

    if (label.opacity <= 0) {
      floatingLabels.splice(i, 1);
    }
  }
  ctx.globalAlpha = 1.0;

  requestAnimationFrame(draw); // r and loop
}

createPegs();
requestAnimationFrame(draw);