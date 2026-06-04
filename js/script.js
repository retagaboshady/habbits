const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');
const calendarGrid = document.getElementById('calendar-grid');
const monthYearLabel = document.getElementById('calendar-month-year');

let habits = JSON.parse(localStorage.getItem('cal-habits')) || [];
let selectedHabitIndex = habits.length > 0 ? 0 : null;

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function saveData() {
    localStorage.setItem('cal-habits', JSON.stringify(habits));
}

function renderHabits() {
    habitList.innerHTML = '';
    if (habits.length === 0) {
        habitList.innerHTML = '<li style="color:var(--text-muted); font-size:0.9rem; list-style:none;">No habits added yet.</li>';
        selectedHabitIndex = null;
        renderCalendar();
        return;
    }

    habits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.className = `habit-item ${index === selectedHabitIndex ? 'selected' : ''}`;
        li.innerHTML = `
            <span class="habit-name">${habit.name}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        
        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            selectedHabitIndex = index;
            renderHabits();
            renderCalendar();
        });

        habitList.appendChild(li);
    });
}

function addHabit() {
    const name = habitInput.value.trim();
    if (!name) return;

    habits.push({
        name: name,
        history: []
    });

    habitInput.value = '';
    if (selectedHabitIndex === null) selectedHabitIndex = habits.length - 1;
    saveData();
    renderHabits();
    renderCalendar();
}

function deleteHabit(index) {
    habits.splice(index, 1);
    if (selectedHabitIndex >= habits.length) {
        selectedHabitIndex = habits.length > 0 ? habits.length - 1 : null;
    }
    saveData();
    renderHabits();
    renderCalendar();
}

function renderCalendar() {
    calendarGrid.innerHTML = '';
    monthYearLabel.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    weekdays.forEach(day => {
        const div = document.createElement('div');
        div.className = 'weekday';
        div.innerText = day;
        calendarGrid.appendChild(div);
    });

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calendarGrid.appendChild(emptyDiv);
    }

    const currentSelectedHabit = habits[selectedHabitIndex];

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerText = day;

        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (currentSelectedHabit && currentSelectedHabit.history.includes(dateString)) {
            dayDiv.classList.add('completed');
        }

        dayDiv.addEventListener('click', () => {
            if (selectedHabitIndex === null) {
                alert("Please add and select a habit first!");
                return;
            }
            
            const historyIndex = currentSelectedHabit.history.indexOf(dateString);
            if (historyIndex > -1) {
                currentSelectedHabit.history.splice(historyIndex, 1);
            } else {
                currentSelectedHabit.history.push(dateString);
            }
            
            saveData();
            renderCalendar();
        });

        calendarGrid.appendChild(dayDiv);
    }

    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint';
    hintDiv.innerText = selectedHabitIndex !== null 
        ? `Showing calendar for "${habits[selectedHabitIndex].name}". Click a day to toggle completion.`
        : "Add a habit to open the calendar.";
    calendarGrid.appendChild(hintDiv);
}

habitList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        deleteHabit(index);
    }
});

addBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

renderHabits();
renderCalendar();