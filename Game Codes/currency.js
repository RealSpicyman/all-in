class Currency {

    constructor(initialAmount = 0.00) {

        this._refreshFromStorage();


        if (this.bank === null || isNaN(this.bank)) {
            this.bank = initialAmount;
            this._saveToStorage();
        }

        console.log("Currency initialized. Balance:", this.bank.toFixed(2));
    }

    _refreshFromStorage() {
        const storedBank = localStorage.getItem('currencyBank');
        this.bank = storedBank !== null ? parseFloat(storedBank) : null;
        this.totalWon = parseFloat(localStorage.getItem('totalWon')) || 0.00;
        this.totalLost = parseFloat(localStorage.getItem('totalLost')) || 0.00;
    }
    

    getBalance() {
        return this.bank;
    }

    getTotalWon() {
        return this.totalWon;
    }

    getTotalLost() {
        return this.totalLost;
    }

    canAfford(amount) {
        return this.bank >= amount;
    }

    addWinnings(winnings) {
        this.bank += winnings;
        this.totalWon += winnings;
        localStorage.setItem('currencyBank', this.bank);
        return this.bank;
    }

    resetBalance() {
        this.bank = 10000.00;
        this.totalWon = 0.00;
        this.totalLost = 0.00;
        this._saveToStorage();
        return this.bank;
    }

    _saveToStorage() {
        localStorage.setItem('currencyBank', this.bank);
        localStorage.setItem('totalWon', this.totalWon);
        localStorage.setItem('totalLost', this.totalLost);
    }

    placeBet(amount) {
        if (!this.canAfford(amount)) {
            return false;
        }
        this.bank -= amount;
        this.totalLost += amount;
        this._saveToStorage();
        return true;
    }
}

if (!window.currency) {
    window.currency = new Currency(10000);
    console.log("Global currency object created");
}



