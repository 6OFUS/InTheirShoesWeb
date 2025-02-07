import { GEMINI_API_KEY } from './config.js';

const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// memory of the conversation
let conversationHistory = [];

async function fetchGeminiResponse() {
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: conversationHistory.map(msg => ({ text: msg })) }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates.length || !data.candidates[0].content || !data.candidates[0].content.parts.length) {
            throw new Error("Invalid API response structure");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        return "Sorry, I couldn't process that request.";
    }
}

function appendMessage(sender, message) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("p-2", "rounded-md", "mb-2", sender === "user" ? "bg-blue-200" : "bg-gray-200");
    msgDiv.textContent = message;
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    conversationHistory.push((sender === "user" ? "User: " : "Bot: ") + message);
}

sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage("user", message);
    userInput.value = "";
    
    const botResponse = await fetchGeminiResponse();
    appendMessage("bot", botResponse);
});