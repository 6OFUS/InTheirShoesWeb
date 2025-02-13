function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

function openAchievementModal(id, title, description, points, difficulty, category, badgeSrc) {
    document.getElementById('achievement-badge').src = badgeSrc;
    document.getElementById('achievement-title').innerText = title;
    document.getElementById('achievement-description').innerText = description;
    document.getElementById('achievement-points').innerText = points;
    document.getElementById('achievement-difficulty').innerText = difficulty;
    document.getElementById('achievement-category').innerText = category;
    openModal('achievement-modal');
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const achievementsContainer = document.getElementById("achievements-container");
    const userId = "4bd6130f-e414-4ee0-ad8a-f52be5c97c7c";

    get(ref(db, `users/${userId}/Achievements`)).then((snapshot) => {
        if (snapshot.exists()) {
            const achievements = snapshot.val();
            achievementsContainer.innerHTML = Object.entries(achievements).map(([id, data]) => {
                const imgPath = data.obtained ? `img/achievements/obtained/${id}.png` : `img/achievements/unobtained/${id}.png`;
                return `
                    <div class='relative group cursor-pointer' onclick="openAchievementModal('${id}')">
                        <img src='${imgPath}' alt='${data.title} Badge' class='w-full h-full object-contain transition transform hover:-translate-y-1'>
                        <div class='absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded'>
                            ${data.title}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }).catch((error) => {
        console.error("Error fetching achievements:", error);
    });
});