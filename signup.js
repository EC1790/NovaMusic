
const form = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");


let appointments = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const teacher = document.getElementById("teacher").value;

 
  const appointment = { date, time, teacher };


  appointments.push(appointment);

 
  renderAppointments();
  

  form.reset();
});

function renderAppointments() {
  appointmentList.innerHTML = "";
  appointments.forEach((appt, index) => {
    const li = document.createElement("li");
    li.textContent = `${appt.date} at ${appt.time} with ${appt.teacher}`;
    appointmentList.appendChild(li);
  });
}
