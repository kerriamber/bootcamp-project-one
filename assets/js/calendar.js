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
const eventModal = document.getElementById("eventModal");
const addEventBtn = document.getElementById("eventBtn");
const modalCloseBtn = document.getElementById("modal-close-btn");
const calendarDays = calendar.querySelectorAll(".calendar-row td");

const today = new Date();

/**
 * Renders dates for the calender for the given month and year
 * @param {Number} monthIndex the index of the month to render, from 0 (January) to 11 (December)
 * @param {Number} year the year of the month to render
 */
function renderCalendar(monthIndex, year) {
    const firstMonthDay = new Date(year, monthIndex, 1);

    // Add data attributes to the header to keep track of the currently displayed month and year
    monthHeader.dataset.month = monthIndex;
    monthHeader.dataset.year = year;

    monthHeader.innerText = `${MONTHS[monthIndex]} ${year}`;

    let firstDayOnCalendar,
        currentDayAlreadySelected = false; // so we don't add .current-day to multiple cells

    if (firstMonthDay.getDay() === 0) {
        // If the first day of the month is a Sunday, we don't need to render the previous month
        firstDayOnCalendar = firstMonthDay;
    } else {
        // If the first day of the month is not a Sunday, we need to render some days the previous month
        // JS's Date class is nice because if you pass in a negative number for the date, it will go back to the previous month
        firstDayOnCalendar = new Date(year, monthIndex, 1 - firstMonthDay.getDay());
    }

    let date = new Date(firstDayOnCalendar);

    // Loop through each cell in the calendar and render the date
    calendarDays.forEach((dayCell) => {
        // Clear the contents of the cell
        dayCell.innerHTML = "";

        // clear .current-day if it's there, since we're rendering the calendar again
        if (dayCell.classList.contains("current-day")) {
            dayCell.classList.remove("current-day");
        }

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("calendar-date");

        // If the date is from the previous or next month, we need to style it a bit differently
        // so it's apparent it's not part of the current month
        if (date.getMonth() !== monthIndex) {
            dateSpan.classList.add("inactive-month");
        } else {
            dateSpan.classList.add("active-month");
        }

        const IS_TODAY = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const IS_FIRST_OF_MONTH = date.getDate() === 1;

        /*
         * I could almost certainly have better names for these two constants,
         * but as we know, there are two hard things in computer science:
         * - cache invalidation
         * - naming things
         * - off-by-one errors.
         * So I'm just going to leave these as they are for now.
         */
        const IS_FIRST_OF_CURRENT_MONTH_BUT_NOT_CURRENT_YEAR = IS_FIRST_OF_MONTH &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() !== today.getFullYear();

        const IS_FIRST_OF_MONTH_TO_DISPLAY = IS_FIRST_OF_MONTH &&
            date.getMonth() === monthIndex &&
            date.getMonth() != today.getMonth();

        const shouldPreselectDay = IS_TODAY ||
            IS_FIRST_OF_CURRENT_MONTH_BUT_NOT_CURRENT_YEAR ||
            IS_FIRST_OF_MONTH_TO_DISPLAY;

        if (shouldPreselectDay && !currentDayAlreadySelected) {
            currentDayAlreadySelected = true; // don't add .current-day to any other cells
            dayCell.classList.add("current-day");
        }

        // Pad the date with a leading zero if necessary (because it looks nicer [and I hate CSS])
        let currentDate;
        if (date.getUTCDate() < 10) {
            currentDate = `0${date.getUTCDate()}`;
        } else {
            currentDate = date.getUTCDate();
        }
        dateSpan.innerText = currentDate;

        dayCell.appendChild(dateSpan);

        // Increment the date by one day
        date = new Date(date.getTime() + ONE_DAY_IN_MILLISECONDS);
    });
}

// Render the calendar when the page loads
document.addEventListener("DOMContentLoaded", () => {
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

calendarDays.forEach((dayCell) => {
    /*
     * We can't use an arrow function here because we need `this` to refer to the element that was clicked
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#cannot_be_used_as_methods
     */
    dayCell.addEventListener("click", function () {
        const currentlySelectedDay = calendar.querySelector(".current-day");

        // currentlySelectedDay should never be null, but guard against it just in case
        if (currentlySelectedDay) {
            currentlySelectedDay.classList.remove("current-day");
        }

        this.classList.add("current-day");
    });
});

//function to add event
addEventBtn.addEventListener("click", () => {
    eventModal.style.display = "block";
});

//function to close event modal
modalCloseBtn.addEventListener("click", () => {
    eventModal.style.display = "none";
    document.getElementById("event-type").value = "";
    document.getElementById("event-date").value = "";
    document.getElementById("event-time").value = "";
});

//function to save event
document.getElementById("event-save").addEventListener("click", () => {
    const eventType = document.getElementById("event-type").value;
    const eventTime = document.getElementById("event-time").value;

    if (eventType && eventTime) {
        const event = document.createElement("div");
        event.classList.add("event");
        event.innerHTML = `<strong>${eventType}</strong> - @ ${eventTime}`;

        document.querySelector(".current-day").appendChild(event);

        eventModal.style.display = "none";
        document.getElementById("event-type").value = "";
        document.getElementById("event-time").value = "";
    } else {
        alert("Please fill out all fields");
    }
});