const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');
const calendarGrid = document.getElementById('calender-grid');
const monthYearLabel = document.getItemById('calendar-month-year');

let habits = JSON.parse(localStorage.getItem('cal-habits')) || [];
let selectedHabitIndex = habits.length > 0 ? 0 : null;

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "Deecember"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function saveData() {
    localStorage.setItem('cal-habits', JSON.stringify(habits));
}

function renderHabits() {
    habitLit.innerHTML = '';
    if (habits.length === 0) {
        habitList.innerHTML = '<li style="color:var(--text-muted); font-size:0.9rem, list-style:none;">No added yet.</li>';
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
    renderCalender();
}

function deleteHabit(index) {
    habits.splice(index, 1);
    if (selectedHabitIndex >= habits.length) {
        selectedHabitIndex = habits.length > 0 ? habits.length - 1 : null;
    }
    saveData();
    renderHabits();
    renderCalender();
}

function renderCalender() {
    calenderGird.innerHTML = '';
    monthYearLabl.innerHTML = `${monthNames[currentMonth]} ${currentYear}`;
    weekdays.forEach(day => {
        const div = document.createElement('div');
        div.className = 'weekday';
        div.innerText = day;
        calenderGird.appendChild(div);
    });
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getData();
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calenderGird.appendChild(emptyDiv);
    }
    const currentSelectedHabit = habits[selectedHabitIndex];
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerText = day;
        const date
    }
}