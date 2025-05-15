document.addEventListener("DOMContentLoaded", function () {
    const formStart = document.getElementById("empathyQuizStart");
    const form = document.getElementById("empathyQuizForm");
    const body = document.querySelector("body");
    const container = document.getElementById("quiz-container");
    
    const questions = [
        "I feel comfortable expressing my emotions.",
        "I often consider other people's feelings before speaking",
        "I prefer solving problems over discussing emotions",
        "I can easily sense when someone is upset, even if they don't say it",
        "I like offering practical advice more than emotional support."
    ];

    const colors = [
        { border: 'border-red-500', bg: 'bg-red-500' },
        { border: 'border-orange-400', bg: 'bg-orange-400' },
        { border: 'border-gray-400', bg: 'bg-gray-400' },
        { border: 'border-green-400', bg: 'bg-green-400' },
        { border: 'border-emerald-500', bg: 'bg-emerald-500' }
    ];

    formStart.addEventListener("submit", function (event) {
        event.preventDefault();

        //Dynamically create the quiz questions
        questions.forEach((question, index) => {
            const qNum = index + 1;
            const div = document.createElement("div");
            div.className = `max-w-xl mx-auto p-5 font-sans space-y-8`;
            div.setAttribute("data-aos", "fade-up");

            // Question text
            const p = document.createElement("p");
            p.className = "font-medium text-lg mb-4 text-center";
            p.textContent = `${qNum}. ${question}`;

            // Radio 
            const radioSet = document.createElement("div");
            radioSet.className = "flex justify-center space-x-4";
            for (let i = 1; i <= 5; i++) {
            const label = document.createElement("label");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `q${qNum}`;
            input.value = i;
            input.className = "peer hidden";

            const dot = document.createElement("div");
            dot.className = `w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${colors[i - 1].border} peer-checked:${colors[i - 1].bg} transition`;

            label.appendChild(input);
            label.appendChild(dot);
            radioSet.appendChild(label);
            }

            // Labels
            const scaleLabels = document.createElement("div");
            scaleLabels.className = "flex justify-between mt-2 text-sm text-gray-500 px-3";
            scaleLabels.innerHTML = `<span>Strongly Disagree</span><span>Strongly Agree</span>`;

            div.appendChild(p);
            div.appendChild(radioSet);
            div.appendChild(scaleLabels);

            container.appendChild(div);
        });

        formStart.classList.add("hidden");
        form.classList.remove("hidden");
        body.classList.remove("h-screen");
        AOS.refresh()
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