import random

def rps():
    options = ("rock", "paper", "scissors")
    balance = 1000  # Starting balance
    running = True

    print("Welcome to Rock, Paper, Scissors with Betting!")
    print(f"Starting balance: ${balance}")

    while running and balance > 0:
        player = None
        computer = random.choice(options)
        
        # Get player's bet
        while True:
            try:
                bet = int(input(f"You have ${balance}. Enter your bet: "))
                if bet > balance or bet <= 0:
                    print("Invalid bet. Enter a valid amount.")
                else:
                    break
            except ValueError:
                print("Please enter a valid number.")
        
        # Get player's choice
        while player not in options:
            player = input("Enter a choice (rock, paper, scissors): ").lower()

        print(f"Player: {player}")
        print(f"Computer: {computer}")

        if player == computer:
            print("It's a tie! You keep your bet.")
        elif (player == "rock" and computer == "scissors") or \
            (player == "paper" and computer == "rock") or \
            (player == "scissors" and computer == "paper"):
            print("You win!")
            balance += bet  # Win the bet amount
        else:
            print("You lose!")
            balance -= bet  # Lose the bet amount

        if balance == 0:
            print("You're out of money! Game over.")
            break

        play_again = input("Play again? (y/n): ").lower()
        if play_again != "y":
            running = False

    print(f"Thanks for playing! You left with ${balance}.")

rps()
