const questionsText = [
    "I try to understand how others feel in various situations.",
    "I often feel compassion when someone is upset.",
    "I notice subtle emotional cues like facial expressions or tone.",
    "I feel uneasy when others are distressed.",
    "I prefer structured routines and organized plans.",
    "I like discussing feelings before jumping into action.",
    "I imagine different perspectives to understand someone's experience.",
    "I stay composed when others are emotional.",
    "I enjoy solving practical problems more than emotional conversations.",
    "I like introducing new and creative experiences.",
    "I naturally take the lead in group activities.",
    "I check in on others' feelings even when things seem fine.",
    "I feel helpful when I offer clear steps to move forward.",
    "I often reflect on stories or past experiences of others.",
    "I listen supportively without letting my own emotions interfere."
];

const personas = [
    "Emotional Anchor",
    "Practical Protector",
    "Reflective Observer",
    "Boundaried Supporter",
    "Task-Oriented Helper"
];

const colors = [
    { border: 'border-red-500', bg: 'bg-red-500' },
    { border: 'border-orange-400', bg: 'bg-orange-400' },
    { border: 'border-gray-400', bg: 'bg-gray-400' },
    { border: 'border-green-400', bg: 'bg-green-400' },
    { border: 'border-emerald-500', bg: 'bg-emerald-500' }
];

// Prompt for Gemini
function buildGeminiPrompt(userRatings) {
    const personaList = `
    1. Emotional Anchor: Deeply compassionate and emotionally in tune with others.
    2. Practical Protector: Organized and pragmatic, preferring structure over emotion.
    3. Reflective Observer: Thoughtful and imaginative, often reflecting deeply on human experiences.
    4. Boundaried Supporter: Caring but emotionally balanced, good at offering support without burnout.
    5. Task-Oriented Helper: Energetic and action-driven, prefers to help through tasks more than conversations.
    `;
    const formattedAnswers = userRatings.map((val, i) => `${i + 1}. ${questionsText[i]} → ${val}`).join("\n");

    return `

    You are an empathy profiling assistant. Analyze the user's answers to a 15-question empathy quiz.

    Empathy Personas:
    ${personaList}

    Based on the following answers (scale of 1-5, where 1 = Strongly Disagree and 5 = Strongly Agree), identify which single empathy persona fits best. Then respond with:

    - Persona:
    - Advice:

    Answers:
    ${formattedAnswers}
        `.trim();
}

async function getEmpathyPersonaFromOpenAI(prompt) {
    const url = "http://localhost:3000/api/prompt"; // your local backend

    const body = { prompt };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        const output = data?.message;
        return output || "Sorry, your empathy persona could not be determined. Please try again.";
    } catch (error) {
        console.error("Backend API Error:", error);
        return "There was a problem analyzing your results. Please try again later.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("empathyQuizForm");
    const resultBox = document.getElementById("results");
    const formStart = document.getElementById("empathyQuizStart");
    const body = document.querySelector("body");
    const container = document.getElementById("quiz-container");

    formStart.addEventListener("submit", function (event) {
        event.preventDefault();
        questionsText.forEach((qText, i) => {
            const div = document.createElement("div");
            div.className = "max-w-xl mx-auto p-5 font-sans space-y-8";
            div.setAttribute("data-aos", "fade-up");

            const p = document.createElement("p");
            p.className = "font-medium text-lg mb-4 text-center";
            p.textContent = `${i + 1}. ${qText}`;

            const radioSet = document.createElement("div");
            radioSet.className = "flex justify-center space-x-4";

            for (let v = 1; v <= 5; v++) {
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `q${i + 1}`;
                input.value = v;
                input.className = "peer hidden";

                const dot = document.createElement("div");
                dot.className = `w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${colors[v - 1].border} peer-checked:${colors[v - 1].bg} transition`;

                label.appendChild(input);
                label.appendChild(dot);
                radioSet.appendChild(label);
            }

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
        AOS.refresh();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const responses = [];
        for (let i = 1; i <= questionsText.length; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (!selected) {
                resultBox.innerText = "Please answer all questions before submitting.";
                return;
            }
            responses.push(parseInt(selected.value));
        }

        resultBox.innerText = "Analyzing your empathy profile...";
        const prompt = buildGeminiPrompt(responses);
        const result = await getEmpathyPersonaFromOpenAI(prompt);
        resultBox.innerText = result;
        form.classList.add("hidden");
        body.classList.add("h-screen");
    });
});