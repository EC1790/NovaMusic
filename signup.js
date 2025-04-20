const form = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");

let appointments = [];

window.addEventListener("load", function () {
  const stored = localStorage.getItem("appointments");

  if (stored) {
    appointments = JSON.parse(stored);
    renderAppointments();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const teacher = document.getElementById("teacher").value;

  const appointment = { date, time, teacher };
  appointments.push(appointment);

  
  localStorage.setItem("appointments", JSON.stringify(appointments));

  renderAppointments();
  form.reset();
});

function renderAppointments() {
  appointmentList.innerHTML = "";

  appointments.forEach((appt) => {
    const li = document.createElement("li");
    li.textContent = `${appt.date} at ${appt.time} with ${appt.teacher}`;
    appointmentList.appendChild(li);
  });
}
