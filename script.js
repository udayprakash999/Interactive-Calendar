function loadEvents() {
  const storedEvents = localStorage.getItem('events');
  return storedEvents ? JSON.parse(storedEvents) : {};
}

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

let events = loadEvents();

function updateCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  const month = parseInt(document.getElementById('month').value);
  const year = parseInt(document.getElementById('year').value);
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const daysInMonth = Array.from({ length: lastDate }, (_, i) => i + 1);
  const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  headers.forEach(day => {
    const header = document.createElement('div');
    header.className = 'day header';
    header.textContent = day;
    calendar.appendChild(header);
  });
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'day empty';
    calendar.appendChild(empty);
  }
  daysInMonth.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.textContent = day;
    dayDiv.onclick = () => openViewEditEventModal(new Date(year, month, day).toISOString().split('T')[0]);
    const dateKey = new Date(year, month, day).toISOString().split('T')[0];
    if (events[dateKey]) {
      dayDiv.classList.add('event');
    }
    calendar.appendChild(dayDiv);
  });
}

function openAddEventModal(date) {
  document.getElementById('addEventDate').value = date;
  document.getElementById('addEventTitle').value = '';
  document.getElementById('addEventDetails').value = '';
  document.getElementById('addEventModal').style.display = 'block';
}

function closeAddEventModal() {
  document.getElementById('addEventModal').style.display = 'none';
}

function openViewEditEventModal(date) {
  const event = events[date];
  document.getElementById('viewEditEventDate').value = date;
  if (event) {
    document.getElementById('viewEditEventTitle').textContent = event.title;
    document.getElementById('viewEditEventDetails').textContent = event.details;
    document.getElementById('deleteEventButton').style.display = 'inline-block';
  } else {
    document.getElementById('viewEditEventTitle').textContent = '';
    document.getElementById('viewEditEventDetails').textContent = '';
    document.getElementById('deleteEventButton').style.display = 'none';
  }
  document.getElementById('viewEditEventModal').style.display = 'block';
}

function closeViewEditEventModal() {
  document.getElementById('viewEditEventModal').style.display = 'none';
}

function openEditEventModal() {
  const date = document.getElementById('viewEditEventDate').value;
  const event = events[date];
  document.getElementById('editEventDate').value = date;
  document.getElementById('editEventTitle').value = event ? event.title : '';
  document.getElementById('editEventDetails').value = event ? event.details : '';
  closeViewEditEventModal();
  document.getElementById('editEventModal').style.display = 'block';
}

function closeEditEventModal() {
  document.getElementById('editEventModal').style.display = 'none';
}

document.getElementById('addEventForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const date = document.getElementById('addEventDate').value;
  events[date] = {
    title: document.getElementById('addEventTitle').value,
    details: document.getElementById('addEventDetails').value
  };
  saveEvents();
  updateCalendar();
  closeAddEventModal();
});

document.getElementById('editEventForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const date = document.getElementById('editEventDate').value;
  events[date] = {
    title: document.getElementById('editEventTitle').value,
    details: document.getElementById('editEventDetails').value
  };
  saveEvents();
  updateCalendar();
  closeEditEventModal();
});

function deleteEvent() {
  const date = document.getElementById('viewEditEventDate').value;
  delete events[date];
  saveEvents();
  updateCalendar();
  closeViewEditEventModal();
}

function prevMonth() {
  const monthElem = document.getElementById('month');
  const yearElem = document.getElementById('year');
  let month = parseInt(monthElem.value);
  let year = parseInt(yearElem.value);
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  monthElem.value = month;
  yearElem.value = year;
  updateCalendar();
}

function nextMonth() {
  const monthElem = document.getElementById('month');
  const yearElem = document.getElementById('year');
  let month = parseInt(monthElem.value);
  let year = parseInt(yearElem.value);
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  monthElem.value = month;
  yearElem.value = year;
  updateCalendar();
}

function populateMonthOptions() {
  const monthElem = document.getElementById('month');
  for (let i = 0; i < 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = new Date(0, i).toLocaleString('en', { month: 'long' });
    monthElem.appendChild(option);
  }
}

populateMonthOptions();
document.getElementById('year').value = new Date().getFullYear();
document.getElementById('month').value = new Date().getMonth();
updateCalendar();
