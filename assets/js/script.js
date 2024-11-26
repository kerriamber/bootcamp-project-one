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
const addEventSpan = document.getElementsByClassName("close")[0];

//function to add event
addEventBtn.addEventListener("click", () => {
    eventModal.style.display = "block";
});

//function to close event modal
addEventSpan.addEventListener("click", () => {
    eventModal.style.display = "none";
});

