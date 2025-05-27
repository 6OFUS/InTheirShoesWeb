import { OPENAI_API_KEY } from './config.js';

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

const colors = [
  { border: 'border-red-500', bg: 'bg-red-500' },
  { border: 'border-orange-400', bg: 'bg-orange-400' },
  { border: 'border-gray-400', bg: 'bg-gray-400' },
  { border: 'border-green-400', bg: 'bg-green-400' },
  { border: 'border-emerald-500', bg: 'bg-emerald-500' }
];

// Build prompts for OpenAI
function buildSinglePrompt(ratings) {
  const personaList = `
1. Emotional Anchor: Deeply compassionate and emotionally in tune with others.
2. Practical Protector: Organized and pragmatic, preferring structure over emotion.
3. Reflective Observer: Thoughtful and imaginative, often reflecting deeply on human experiences.
4. Boundaried Supporter: Caring but emotionally balanced, good at offering support without burnout.
5. Task-Oriented Helper: Energetic and action-driven, prefers to help through tasks more than conversations.
`;
  const answers = ratings.map((v,i) => `${i+1}. ${questionsText[i]} → ${v}`).join("\n");
  return `You are an empathy profiling assistant.\n\nEmpathy Personas:\n${personaList}\nBased on answers (1–5), identify the single best-fitting empathy persona, provide advice, and output a 5-element JSON array of trait scores [Compassion, Practicality, Reflection, Boundaries, Action].\n\nAnswers:\n${answers}`;
}

function buildDualPrompt(cg, cr) {
  const personaList = `
1. Emotional Anchor: Deeply compassionate and emotionally in tune with others.
2. Practical Protector: Organized and pragmatic, preferring structure over emotion.
3. Reflective Observer: Thoughtful and imaginative, often reflecting deeply on human experiences.
4. Boundaried Supporter: Caring but emotionally balanced, good at offering support without burnout.
5. Task-Oriented Helper: Energetic and action-driven, prefers to help through tasks more than conversations.
`;
  const cgAns = cg.map((v,i) => `${i+1}. ${questionsText[i]} → ${v}`).join("\n");
  const crAns = cr.map((v,i) => `${i+1}. ${questionsText[i]} → ${v}`).join("\n");
  return `You are an empathy coaching assistant.\n\nTwo people completed the quiz: Caregiver and Care Recipient.\nEmpathy Personas:\n${personaList}\nCompare their profiles, identify each persona, highlight mismatches, and provide personalized advice for the caregiver. Also output two 5-element JSON arrays of trait scores [Compassion, Practicality, Reflection, Boundaries, Action] for each.\n\nCaregiver Answers:\n${cgAns}\n\nCare Recipient Answers:\n${crAns}`;
}

async function callOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an empathy profiling assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.choices[0].message.content;
}

// Render Chart.js radar chart
function renderComparisonChart(cgScores, crScores) {
  const ctx = document.getElementById('comparisonChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Compassion','Practicality','Reflection','Boundaries','Action'],
      datasets: [
        { label: 'Caregiver', data: cgScores, fill: true, borderWidth: 2 },
        { label: 'Care Recipient', data: crScores, fill: true, borderWidth: 2 }
      ]
    },
    options: {
        responsive: true,
        scales: {
            r: {
            min: 0,
            max: 15, // increase this based on highest score
            ticks: {
                stepSize: 1
            },
            pointLabels: {
                font: {
                size: 14
                }
            }
            }
        },
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: false,
            }
        }
    }
  });
}

// Quiz initialization
document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('caregiverAnswers'); // Clear previous answers
  const quizForm = document.getElementById('empathyQuizForm');
  const results = document.getElementById('results');

  const form = document.getElementById("empathyQuizForm");
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

  // Handle submissions
  quizForm.addEventListener('submit', async e => {
    e.preventDefault();
    const answers = Array.from({length: questionsText.length}, (_,i) => {
      const sel = document.querySelector(`input[name=q${i+1}]:checked`);
      if (!sel) { alert('Answer all questions'); throw 'Incomplete'; }
      return +sel.value;
    });
    const stored = JSON.parse(localStorage.getItem('caregiverAnswers'));
    const usingDual = Boolean(stored);
    const prompt = usingDual ? buildDualPrompt(stored, answers) : buildSinglePrompt(answers);
    quizForm.classList.add('hidden');
    results.innerText = 'Analyzing...';
    try {
      const aiOutput = await callOpenAI(prompt);
      results.innerText = aiOutput;
      const matches = aiOutput.match(/\[[\d\.\s,]+\]/g) || [];
      const arrays = matches.map(m=>JSON.parse(m));
      if (!usingDual) {
        localStorage.setItem('caregiverAnswers', JSON.stringify(answers));
        const btn = document.createElement('button');
        btn.textContent='Have Care Recipient Take Quiz';
        btn.onclick = () => { quizForm.reset(); quizForm.classList.remove('hidden'); results.innerText=''; };
        btn.classList = 'm-4 bg-yellow-500 text-emerald-800 font-garet font-bold py-2 px-6 rounded-2xl hover:bg-agreen';
        results.appendChild(btn);
      } else if (arrays.length >= 2) {
        renderComparisonChart(arrays[0], arrays[1]);
        localStorage.removeItem('caregiverAnswers');
      }
    } catch (err) {
      results.innerText = 'Error: '+err;
    }
  });
});
