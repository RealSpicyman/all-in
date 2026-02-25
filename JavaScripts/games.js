// Get modal element
const modal = document.getElementById("gameModal");
// Get close button
const closeButton = document.querySelector(".close-button");

// Game data (you can also fetch this from a server)
const games = [
    {
        title: "Rock Paper Scissors",
        description: "Classic battle of wits! Choose your move and win big.",
    },
    {
        title: "Slots",
        description: "Spin the reels and test your luck on the slot machines.",
    },
    {
        title: "Blackjack",
        description: "Beat the dealer and aim for 21 in this classic card game.",
    },
    {
        title: "Baccarat",
        description: "Bet on Player or Banker or Tie and get as close to 9 as possible."
    },
    {
        title: "Plinko",
        description: "Drop the balls and watch it bounce to big prizes."
    },
    {
        title: "Extra1",
        description: "More to come."
    }]

// Show modal when a game card is clicked
document.querySelectorAll('.game-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = games[index].title;
        document.getElementById('modal-description').textContent = games[index].description;
        modal.style.display = "block";
    });
});

// Close modal when close button is clicked
closeButton.addEventListener('click', () => {
    modal.style.display = "none";
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
