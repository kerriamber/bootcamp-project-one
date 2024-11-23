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

// For date math
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

// Important elements
const calendar = document.getElementById("calendar");
const prevButton = document.getElementById("calendar-prev");
const nextButton = document.getElementById("calendar-next");
const monthHeader = document.getElementById("current-month");

/**
 * Renders dates for the calender for the given month and year
 * @param {Number} monthIndex the index of the month to render, from 0 (January) to 11 (December)
 * @param {Number} year the year of the month to render
 */
function renderCalendar(monthIndex, year) {
    const calendarDays = calendar.querySelectorAll(".calendar-row td");
    const firstMonthDay = new Date(year, monthIndex, 1);

    // Add data attributes to the header to keep track of the currently displayed month and year
    monthHeader.dataset.month = monthIndex;
    monthHeader.dataset.year = year;

    monthHeader.innerText = `${MONTHS[monthIndex]} ${year}`;

    let firstDayOnCalendar;

    if (firstMonthDay.getDay() === 0) {
        // If the first day of the month is a Sunday, we don't need to render the previous month
        firstDayOnCalendar = firstMonthDay;
    } else {
        // If the first day of the month is not a Sunday, we need to render some days the previous month
        // JS's Date class is nice because if you pass in a negative number for the day, it will go back to the previous month
        firstDayOnCalendar = new Date(year, monthIndex, 1 - firstMonthDay.getDay());
    }

    let date = new Date(firstDayOnCalendar);

    // Loop through each cell in the calendar and render the date
    calendarDays.forEach((day) => {
        // Clear the contents of the cell
        day.innerHTML = "";

        if (date.getMonth() !== monthIndex) {
            // If the date is not in the current month, we need to style it differently
            day.classList.remove("active-month");
            day.classList.add("inactive-month");
        } else {
            day.classList.remove("inactive-month");
            day.classList.add("active-month");
        }

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("calendar-date");
        // I'm not sure if getUTCDate is perfect to use, especially on page load close to 00:00Z, but just using getDate will screw up thanks to daylight savings time
        dateSpan.innerText = date.getUTCDate();
        day.appendChild(dateSpan);

        // Technically, I guess this could open up some HTML injection stuff, so I guess it's better to use document.createElement and appendChild as I did above
        // day.innerHTML = `<span class='calendar-date'>${date.getUTCDate()}</span>`;

        // Increment the date by one day
        date = new Date(date.getTime() + ONE_DAY_IN_MILLISECONDS);
    });
}

// Render the calendar when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    renderCalendar(today.getMonth(), today.getFullYear());
});

// Add event listeners to the previous and next buttons
prevButton.addEventListener("click", () => {
    let month = parseInt(monthHeader.dataset.month);
    let year = parseInt(monthHeader.dataset.year);
    
    // If the currently displayed month is January, we need to go back to December of the previous year
    if (month === 0) {
        renderCalendar(11, year - 1);
    } else { // Otherwise, we just go back one month
        renderCalendar(month - 1, year);
    }
});

nextButton.addEventListener("click", () => {
    let month = parseInt(monthHeader.dataset.month);
    let year = parseInt(monthHeader.dataset.year);

    // If the currently displayed month is December, we need to go to January of the next year
    if (month === 11) {
        renderCalendar(0, year + 1);
    } else { // Otherwise, we just go forward one month
        renderCalendar(month + 1, year);
    }
});