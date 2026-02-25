'''
a casino game where players bet on which hand, 
the player's or the banker's, 
will have a total closest to nine. 

How to play:

players place bets on the player, banker, or a tie 
Two cards are dealt to the player and the banker 
The cards in each hand are added together 
If the total is more than nine, the last digit is used 
If either hand is eight or nine, it's called a "natural" and the round ends 
The winning side is announced, and bets are paid out 

Card values:

    Aces are worth 1 point
    2-9 are worth their face value
    10s and face cards (Kings, Queens, Jacks) are worth 0 point
    cant win more than 9 points 
    lose all money if u lose
    if players total is a 0-5 they draw a third card
    if
    if player has 6-7 they stand
    if player has 8-9 they win called natural
    5% commission on banker bets
    
    if that its gonna be a tie and win you get 8 times your bet

    if you bet on player or banker and its a tie nothing happens

    should ask for how much u wnat to bet
    display your 2 cards
    then ask if you want to bet on player banker or tie
    then display the bankers 2 cards
    then display the winner
    minues the money from the loser 
    if you win you double the bet
    if you tie you get 8 times the bet
    then ask if you want to play again
'''


import random

# balance for right now
player_balance = 1000  

# Ranks and their Baccarat values
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']
rankValues = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 0,
              'Jack': 0, 'Queen': 0, 'King': 0, 'Ace': 1}
suits = {'h': 'Hearts', 'd': 'Diamonds', 'c': 'Clubs', 's': 'Spades'}  

def dealHand():            # deals cards and their points are returend
    dealtCards = []
    totalPoints = 0

    for _ in range(2):  
        rank = random.choice(ranks)  # Pick a random rank
        suit = random.choice(list(suits.keys()))  # Pick a random suit
        cardName = f"{rank} of {suits[suit]}"  # Full card name
        
        dealtCards.append(cardName)
        totalPoints += rankValues[rank]

    return dealtCards, totalPoints % 10  # Baccarat keeps only the last digit

def playerDeal():
    global player_balance  

    print(f"Your current balance: ${player_balance}")
    while True:
        try:
            bet = int(input("Enter your bet amount: $"))
            if bet > player_balance or bet <= 0:                        # checks if bet is valid
                print("Invalid bet. Enter a value within your balance.")
            else:
                break
        except ValueError:
            print("Please enter a valid number.")

    print("\nDealing your cards...")
    playerCards, playerPoints = dealHand()
    
    print(f"Your cards: {', '.join(playerCards)} (Points: {playerPoints})") 

    betChoice(bet, playerCards, playerPoints)

def betChoice(bet, playerCards, playerPoints):
    """Asks the player who they want to bet on AFTER seeing their own cards."""
    print("Who do you want to bet on? Player, Banker, or a Tie?")
    betOn = input("Enter 'p' for Player, 'b' for Banker, 't' for Tie: ").strip().lower()

    if betOn in ['p', 'b', 't']:
        playGame(bet, betOn, playerCards, playerPoints)
    else:
        print("Invalid choice. Enter 'p', 'b', or 't'.")
        betChoice(bet, playerCards, playerPoints)

def playGame(bet, betOn, playerCards, playerPoints):
    """Deals banker's cards, determines winner, and updates balance."""
    global player_balance

    bankerCards, bankerPoints = dealHand()

    print("\nRevealing banker's cards...")
    print(f"Banker's cards: {', '.join(bankerCards)} (Points: {bankerPoints})")

    winner = comparePoints(playerPoints, bankerPoints)
    payout(bet, betOn, winner)

def comparePoints(playerPoints, bankerPoints):
    """Determines who wins the round."""
    if playerPoints > bankerPoints:
        print("Player wins!")
        return 'p'
    elif bankerPoints > playerPoints:
        print("Banker wins!")
        return 'b'
    else:
        print("It's a Tie!")
        return 't'

def payout(bet, betOn, winner):
    global player_balance

    if betOn == winner:
        if winner == 'p':  
            winnings = bet
        elif winner == 'b':  
            winnings = int(bet * 0.95)  
        elif winner == 't':  
            winnings = bet * 8
        
        player_balance += winnings  
        print(f"You won ${winnings}! Your new balance: ${player_balance}")
    
    else:
        player_balance -= bet  
        print(f"You lost ${bet}. Your new balance: ${player_balance}")

    if player_balance > 0:
        playAgain()
    else:
        print("You're out of money. Game over.")

def playAgain():
    """Asks the player if they want to continue playing."""
    choice = input("Do you want to play again? (y/n): ").strip().lower()
    if choice == 'y':
        playerDeal()
    else:
        print("Thanks for playing.")

if __name__ == '__main__':
    playerDeal()