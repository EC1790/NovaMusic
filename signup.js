
document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const form = document.getElementById("appointmentForm");
    
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("appointmentForm");
    
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            let date = document.getElementById("appointmentDate").value;
            let time = document.getElementById("appointmentTime").value; // Capture time
            let title = document.getElementById("appointmentTitle").value;
    
            if (date && time && title) {
                alert(`Appointment scheduled on ${date} at ${time}: ${title}`);
            } else {
                alert("Please fill out all fields.");
            }
        });
    });
   
    function generateCalendar(month, year) {
        calendar.innerHTML = ""; // Clear previous month
        let daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement("div");
            dayElement.className = "day";
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        }
    }

    let currentDate = new Date();
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let date = document.getElementById("appointmentDate").value;
        let title = document.getElementById("appointmentTitle").value;
        alert(`Appointment on ${date}: ${title}`);
    });
});