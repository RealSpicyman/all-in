const toggle = document.getElementById('toggleDark');
const navbar = document.querySelector('.navbar');
const body = document.querySelector('body');
const gameCards = document.querySelectorAll('.game-card');

if (localStorage.getItem('darkMode') === 'enabled') {
    navbar.classList.add('dark');
    body.classList.add('dark');
    toggle.classList.add('bi-moon');
    toggle.classList.remove('bi-brightness-high-fill');
} else {
    navbar.classList.remove('dark');
    body.classList.remove('dark');
    toggle.classList.add('bi-brightness-high-fill');
    toggle.classList.remove('bi-moon');
}

toggle.addEventListener('click', function () {
    this.classList.toggle('bi-moon');
    this.classList.toggle('bi-brightness-high-fill');
    navbar.classList.toggle('dark');
    body.classList.toggle('dark');

    if (navbar.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
