function updateBalanceDisplay() {
    console.log("[DEBUG] Updating balance display...");

    const balanceElement = document.getElementById('balanceAmount');
    const currentBalance = currency.getBalance();
    const storedBalance = localStorage.getItem('currencyBank');

    console.log("Currency instance balance:", currentBalance);
    console.log("LocalStorage balance:", storedBalance);

    if (balanceElement) {
        balanceElement.innerText = `${currentBalance.toFixed(2)}`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("[DEBUG] DOM fully loaded");
    updateBalanceDisplay();
});

document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        updateBalanceDisplay();
    }
});

window.addEventListener("storage", function (e) {
    if (e.key === "currencyBank") {
        updateBalanceDisplay();
    }
});
