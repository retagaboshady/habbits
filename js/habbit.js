const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function saveToLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

