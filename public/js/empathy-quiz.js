document.addEventListener("DOMContentLoaded", function () {
    const formStart = document.getElementById("empathyQuizStart");
    const form = document.getElementById("empathyQuizForm");
    const body = document.querySelector("body");

    formStart.addEventListener("submit", function (event) {
        event.preventDefault();

        formStart.classList.add("hidden");
        form.classList.remove("hidden");
        body.classList.remove("h-screen");
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const scores = [];
        for (let i = 1; i <= 5; i++) {
            const value = document.querySelector(`input[name="q${i}"]:checked`);
            if (value) scores.push(parseInt(value.value));
        }

        if (scores.length < 5) {
            document.getElementById("results").innerText = "Please answer all questions.";
            return;
        }

        const total = scores.reduce((a, b) => a + b, 0);
        const avg = total / scores.length;

        let persona = "";
        if (avg >= 4) persona = "Emotionally Intuitive";
        else if (avg >= 3) persona = "Balanced Empath";
        else persona = "Practical Helper";

        let advice = "";
        if (persona === "Emotionally Intuitive") {
            advice = "You're very in tune with emotions. Try to give space for others to express themselves.";
        } else if (persona === "Balanced Empath") {
            advice = "You balance emotional understanding and practical support well.";
        } else {
            advice = "You prefer action over emotion. Consider listening without fixing right away.";
        }

        document.getElementById("results").innerText =
            `Your Empathy Persona: ${persona}\n\nAdvice: ${advice}`;
        });
});