/* JS to load the navbar in every file
*/
document.addEventListener("DOMContentLoaded", function () {
    fetch("../templates/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));
});