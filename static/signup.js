/* The js of signup, connected to signup.html
saves events in an array and saves their dates
has the addEvent, deleteEvent, displayReminders, createEventTooltip and showCalendar
main functions with a lot helper functions.
*/
const API_URL = "http://localhost:5000/events";
let events = [];

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();


let eventDateInput =
	document.getElementById("eventDate");
let eventTitleInput =
	document.getElementById("eventTitle");
let eventDescriptionInput =
	document.getElementById("eventDescription");
let reminderList =
	document.getElementById("reminderList");


let eventIdCounter = 1;

/* Adds events to the sql database by taking it's id and fields and sending a post request to the api
Adds to the events array
*/
async function addEvent() {
	let date = eventDateInput.value;
	let title = eventTitleInput.value;
	let description = eventDescriptionInput.value;

	if (date && title) {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ date, title, description }),
		});

		const newEvent = await response.json();
		events.push(newEvent);
		showCalendar(currentMonth, currentYear);
		eventDateInput.value = "";
		eventTitleInput.value = "";
		eventDescriptionInput.value = "";
		displayReminders();
	}
}

/* Sends a delete message to the api and removes the event from the array
*/
async function deleteEvent(eventId) {
	await fetch(`${API_URL}/${eventId}`, {
		method: "DELETE",
	});

	let eventIndex = events.findIndex((event) => event.id === eventId);
	if (eventIndex !== -1) {
		events.splice(eventIndex, 1);
		showCalendar(currentMonth, currentYear);
		displayReminders();
	}
}
/* Displays reminders by going through the array making sure the month and year matches
Displays in the reminders section
*/

function displayReminders() {
	reminderList.innerHTML = "";
	for (let i = 0; i < events.length; i++) {
		let event = events[i];
		let eventDate = new Date(event.date + "T00:00:00");
		if (eventDate.getMonth() ===
			currentMonth &&
			eventDate.getFullYear() ===
			currentYear) {
			let listItem = document.createElement("li");
			listItem.innerHTML =
				`<strong>${event.title}</strong> - 
			${event.description} on 
			${eventDate.toLocaleDateString()}`;

			
			let deleteButton =
				document.createElement("button");
			deleteButton.className = "delete-event";
			deleteButton.textContent = "Delete";
			deleteButton.onclick = function () {
				deleteEvent(event.id);
			};

			listItem.appendChild(deleteButton);
			reminderList.appendChild(listItem);
		}
	}
}


function generate_year_range(start, end) {
	let years = "";
	for (let year = start; year <= end; year++) {
		years += "<option value='" +
			year + "'>" + year + "</option>";
	}
	return years;
}

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

createYear = generate_year_range(2020, 2050);

document.getElementById("year").innerHTML = createYear;

let calendar = document.getElementById("calendar");

let months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
let days = [
	"Sun", "Mon", "Tue", "Wed",
	"Thu", "Fri", "Sat"];

dataHead = "<tr>";
for (dhead in days) {
	dataHead += "<th data-days='" +
		days[dhead] + "'>" +
		days[dhead] + "</th>";
}
dataHead += "</tr>";

document.getElementById("thead-month").innerHTML = dataHead;

monthAndYear =
	document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
	currentYear = currentMonth === 11 ?
		currentYear + 1 : currentYear;
	currentMonth = (currentMonth + 1) % 12;
	showCalendar(currentMonth, currentYear);
}


function previous() {
	currentYear = currentMonth === 0 ?
		currentYear - 1 : currentYear;
	currentMonth = currentMonth === 0 ?
		11 : currentMonth - 1;
	showCalendar(currentMonth, currentYear);
}


function jump() {
	currentYear = parseInt(selectYear.value);
	currentMonth = parseInt(selectMonth.value);
	showCalendar(currentMonth, currentYear);
}

/* Generates and displays a monthly calendar grid for a given month and year,
 puting each day cell and highlighting special dates such as the current day and those with events.
*/
function showCalendar(month, year) {
	let firstDay = new Date(year, month, 1).getDay();
	tbl = document.getElementById("calendar-body");
	tbl.innerHTML = "";
	monthAndYear.innerHTML = months[month] + " " + year;
	selectYear.value = year;
	selectMonth.value = month;

	let date = 1;
	for (let i = 0; i < 6; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				cell = document.createElement("td");
				cellText = document.createTextNode("");
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else if (date > daysInMonth(month, year)) {
				break;
			} else {
				cell = document.createElement("td");
				cell.setAttribute("data-date", date);
				cell.setAttribute("data-month", month + 1);
				cell.setAttribute("data-year", year);
				cell.setAttribute("data-month_name", months[month]);
				cell.className = "date-picker";
				cell.innerHTML = "<span>" + date + "</span";

				if (
					date === today.getDate() &&
					year === today.getFullYear() &&
					month === today.getMonth()
				) {
					cell.className = "date-picker selected";
				}

				
				if (hasEventOnDate(date, month, year)) {
					cell.classList.add("event-marker");
					cell.appendChild(
						createEventTooltip(date, month, year)
				);
				}

				row.appendChild(cell);
				date++;
			}
		}
		tbl.appendChild(row);
	}

	displayReminders();
}

/* Makes a tooltip element displaying all events scheduled for a specific date
Which can be shown when a user hovers over or interacts with a calendar cell.
*/
function createEventTooltip(date, month, year) {
	let tooltip = document.createElement("div");
	tooltip.className = "event-tooltip";
	let eventsOnDate = getEventsOnDate(date, month, year);
	for (let i = 0; i < eventsOnDate.length; i++) {
		let event = eventsOnDate[i];
		let eventDate = new Date(event.date + "T00:00:00");
		let eventText = `<strong>${event.title}</strong> - 
			${event.description} on 
			${eventDate.toLocaleDateString()}`;
		let eventElement = document.createElement("p");
		eventElement.innerHTML = eventText;
		tooltip.appendChild(eventElement);
	}
	return tooltip;
}


function getEventsOnDate(date, month, year) {
	return events.filter(function (event) {
		let eventDate = new Date(event.date + "T00:00:00");
		return (
			eventDate.getDate() === date &&
			eventDate.getMonth() === month &&
			eventDate.getFullYear() === year
		);
	});
}


function hasEventOnDate(date, month, year) {
	return getEventsOnDate(date, month, year).length > 0;
}


function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}
/*Retrieves the list of events from a backend database via an API call
Updates the calendar view accordingly.
*/
async function loadEventsFromDB() {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new Error(`Server error: ${response.status}`);
		}
		events = await response.json();
		showCalendar(currentMonth, currentYear);
	} catch (error) {
		console.error("Error loading events:", error.message);
	}
}

loadEventsFromDB();