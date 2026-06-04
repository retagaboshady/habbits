const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');
const calendarGrid = document.getElementById('calendar-grid');
const monthYearLabel = document.getElementById('calendar-month-year');

let schedulerData = JSON.parse(localStorage.getItem('scheduler-data')) || {};
let selectedDateString = "";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function saveData() {
    localStorage.setItem('scheduler-data', JSON.stringify(schedulerData));
}

function renderSidebar() {
    habitList.innerHTML = '';
    
    if (!selectedDateString) {
        habitList.innerHTML = '<li style="color:var(--text-muted); font-size:0.9rem; list-style:none;">Click a day on the calendar to manage its habits.</li>';
        return;
    }

    const displayDate = new Date(selectedDateString);
    habitList.innerHTML = `<li style="list-style:none; font-weight:bold; margin-bottom:10px; color:var(--primary);">Selected Date: ${displayDate.toLocaleDateString()}</li>`;

    const dayHabits = schedulerData[selectedDateString] || [];

    if (dayHabits.length === 0) {
        habitList.innerHTML += '<li style="color:var(--text-muted); font-size:0.9rem; list-style:none;">No habits for this day yet.</li>';
        return;
    }

    dayHabits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.className = `habit-item ${habit.completed ? 'selected' : ''}`;
        li.style.cursor = 'pointer';
        
        li.innerHTML = `
            <span class="habit-name" style="${habit.completed ? 'text-decoration:line-through; opacity:0.6;' : ''}">${habit.name}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            habit.completed = !habit.completed;
            saveData();
            renderSidebar();
            renderCalendar();
        });

        habitList.appendChild(li);
    });
}

function addHabit() {
    const name = habitInput.value.trim();
    if (!name) return;
    if (!selectedDateString) {
        alert("Please click a day on the calendar first!");
        return;
    }

    if (!schedulerData[selectedDateString]) {
        schedulerData[selectedDateString] = [];
    }

    schedulerData[selectedDateString].push({
        name: name,
        completed: false
    });

    habitInput.value = '';
    saveData();
    renderSidebar();
    renderCalendar();
}

function deleteHabit(index) {
    if (schedulerData[selectedDateString]) {
        schedulerData[selectedDateString].splice(index, 1);
        if (schedulerData[selectedDateString].length === 0) {
            delete schedulerData[selectedDateString];
        }
        saveData();
        renderSidebar();
        renderCalendar();
    }
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

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (dateString === selectedDateString) {
            dayDiv.style.borderColor = 'var(--primary)';
            dayDiv.style.backgroundColor = 'rgba(99, 102, 241, 0.15)';
        }

        const numDiv = document.createElement('div');
        numDiv.className = 'day-number';
        numDiv.innerText = day;
        dayDiv.appendChild(numDiv);

        const habitsContainer = document.createElement('div');
        habitsContainer.className = 'day-habits';

        const dayHabits = schedulerData[dateString] || [];
        dayHabits.forEach((habit) => {
            const badge = document.createElement('div');
            badge.className = `calendar-habit-badge ${habit.completed ? 'completed' : ''}`;
            badge.innerText = habit.name;
            habitsContainer.appendChild(badge);
        });

        dayDiv.appendChild(habitsContainer);

        dayDiv.addEventListener('click', () => {
            selectedDateString = dateString;
            renderCalendar();
            renderSidebar();
        });

        calendarGrid.appendChild(dayDiv);
    }
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

renderSidebar();
renderCalendar();