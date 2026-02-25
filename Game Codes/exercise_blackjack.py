import random

# Define deck and card values
suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
values = {"2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, 
          "J": 10, "Q": 10, "K": 10, "A": 11}  # Aces handled separately

# Function to create and shuffle deck
def create_deck():
    deck = [{"rank": rank, "suit": suit} for suit in suits for rank in ranks]
    random.shuffle(deck)
    return deck

# Function to deal a card
def deal_card(deck):
    return deck.pop()

# Function to calculate hand value, handling Aces
def calculate_hand_value(hand):
    value = sum(values[card["rank"]] for card in hand)
    aces = sum(1 for card in hand if card["rank"] == "A")

    while value > 21 and aces:
        value -= 10  # Convert an Ace from 11 to 1
        aces -= 1

    return value

# Function to display a hand
def display_hand(hand, hide_first_card=False):
    if hide_first_card:
        print("Dealer's Hand: [Hidden]", hand[1])
    else:
        print("Hand:", [f"{card['rank']} of {card['suit']}" for card in hand], "Value:", calculate_hand_value(hand))

# Function to handle bets
def place_bet(balance):
    while True:
        try:
            bet = int(input(f"You have ${balance}. Enter your bet: "))
            if 1 <= bet <= balance:
                return bet
            print("Invalid bet. Please enter an amount within your balance.")
        except ValueError:
            print("Please enter a valid number.")

# Function to play a hand
def play_hand(deck, player_hand, dealer_hand, balance, bet):
    # Player's turn
    while calculate_hand_value(player_hand) < 21:
        move = input("\nChoose: Hit (h), Stand (s), Double Down (d): ").lower()
        
        if move == 'h':
            player_hand.append(deal_card(deck))
            display_hand(player_hand)
        elif move == 'd':  # Double down
            if bet * 2 <= balance:
                bet *= 2
                player_hand.append(deal_card(deck))
                display_hand(player_hand)
                break  # Double down means you take one last card
            else:
                print("Not enough balance to double down!")
        elif move == 's':
            break
        else:
            print("Invalid choice, please enter 'h', 's', or 'd'.")

    # If player busts
    if calculate_hand_value(player_hand) > 21:
        print("\nYou busted! Dealer wins.")
        return -bet

    # Dealer's Turn
    print("\nDealer's turn:")
    display_hand(dealer_hand)

    while calculate_hand_value(dealer_hand) < 17:
        dealer_hand.append(deal_card(deck))
        display_hand(dealer_hand)

    # Determine winner
    player_value = calculate_hand_value(player_hand)
    dealer_value = calculate_hand_value(dealer_hand)

    print("\nFinal Results:")
    print("Your Hand:", player_hand, "Value:", player_value)
    print("Dealer's Hand:", dealer_hand, "Value:", dealer_value)

    if dealer_value > 21:
        print("Dealer busted! You win!")
        return bet
    elif player_value > dealer_value:
        print("You win!")
        return bet
    elif player_value < dealer_value:
        print("Dealer wins!")
        return -bet
    else:
        print("It's a tie!")
        return 0

# Function to handle splitting hands
def split_hand(deck, player_hand, dealer_hand, balance, bet):
    if player_hand[0]["rank"] == player_hand[1]["rank"]:
        choice = input("Do you want to split? (y/n): ").lower()
        if choice == 'y' and bet * 2 <= balance:
            hand1 = [player_hand[0], deal_card(deck)]
            hand2 = [player_hand[1], deal_card(deck)]
            print("\nPlaying first split hand:")
            display_hand(hand1)
            result1 = play_hand(deck, hand1, dealer_hand, balance, bet)

            print("\nPlaying second split hand:")
            display_hand(hand2)
            result2 = play_hand(deck, hand2, dealer_hand, balance, bet)

            return result1 + result2  # Return total earnings from both hands
    return play_hand(deck, player_hand, dealer_hand, balance, bet)

# Main game loop
def play_blackjack():
    balance = 1000  # Start with $1000
    
    while balance > 0:
        deck = create_deck()
        print("\nWelcome to Blackjack!")

        bet = place_bet(balance)

        # Initial hands
        player_hand = [deal_card(deck), deal_card(deck)]
        dealer_hand = [deal_card(deck), deal_card(deck)]

        print("\nYour hand:")
        display_hand(player_hand)
        display_hand(dealer_hand, hide_first_card=True)

        # Handle splitting
        earnings = split_hand(deck, player_hand, dealer_hand, balance, bet)

        balance += earnings
        print(f"\nYour new balance: ${balance}")

        if balance <= 0:
            print("You're out of money! Game over.")
            break

        play_again = input("\nPlay another round? (y/n): ").lower()
        if play_again != 'y':
            print("Thanks for playing! Final balance:", balance)
            break

# Run the game
play_blackjack()