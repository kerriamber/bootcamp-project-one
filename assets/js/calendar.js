const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const calendar = document.getElementById("calendar");

const prevButton = document.getElementById("calendar-prev");
const nextButton = document.getElementById("calendar-next");
const monthHeader = document.getElementById("current-month");

function renderCalendar(monthIndex, year) {
    const calendarDays = calendar.querySelectorAll(".calendar-row td");
    const firstMonthDay = new Date(year, monthIndex, 1);
    monthHeader.dataset.month = monthIndex;
    monthHeader.dataset.year = year;
    let firstDayOnCalendar;

    if (firstMonthDay.getDay() === 0) {
        firstDayOnCalendar = firstMonthDay;
    } else {
        firstDayOnCalendar = new Date(year, monthIndex, 1 - firstMonthDay.getDay());
    }

    let date = new Date(firstDayOnCalendar);

    calendarDays.forEach((day) => {
        if (date.getMonth() !== monthIndex) {
            day.classList.remove("active-month");
            day.classList.add("inactive-month");
        } else {
            day.classList.remove("inactive-month");
            day.classList.add("active-month");
        }

        day.innerHTML = `<span class='calendar-date'>${date.getUTCDate()}</span>`;
        date = new Date(date.getTime() + ONE_DAY_IN_MILLISECONDS);
    });

    monthHeader.innerText = `${MONTHS[monthIndex]} ${year}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    renderCalendar(today.getMonth(), today.getFullYear());
});

prevButton.addEventListener("click", () => {
    let month = parseInt(monthHeader.dataset.month);
    let year = parseInt(monthHeader.dataset.year);
    
    if (month === 0) {
        renderCalendar(11, year - 1);
    } else {
        renderCalendar(month - 1, year);
    }
});

nextButton.addEventListener("click", () => {
    let month = parseInt(monthHeader.dataset.month);
    let year = parseInt(monthHeader.dataset.year);
    if (month === 11) {
        renderCalendar(0, year + 1);
    } else {
        renderCalendar(month + 1, year);
    }
});