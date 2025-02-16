import { emailJsKey } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init(emailJsKey);

    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let params = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
        };

        emailjs.send("service_a655z5s", "template_fz2pkg9", params)
            .then(function (response) {
                alert("Email sent successfully!");
                form.reset();
            })
            .catch(function (error) {
                alert("Failed to send email. Error: " + error.text);
            });
    });
});