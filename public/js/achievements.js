import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig, supabaseAnonKey, supabaseUrl } from "./config.js";

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function openAchievementModal(id, title, description, points, difficulty, category, badgeSrc) {
    document.getElementById('achievement-badge').src = badgeSrc;
    document.getElementById('achievement-title').innerText = title;
    document.getElementById('achievement-description').innerText = description;
    document.getElementById('achievement-points').innerText = points;
    document.getElementById('achievement-difficulty').innerText = difficulty;
    document.getElementById('achievement-category').innerText = category;
    openModal('achievement-modal');
}

const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function getUserId() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user ? user.id : null;
}

document.addEventListener("DOMContentLoaded", async () => {
    const achievementsContainer = document.getElementById("achievements-container");

    const userId = await getUserId();
    if (!userId) {
        console.error("User not logged in");
        return;
    }

    get(ref(db, `players/${userId}/Achievements`)).then(async (snapshot) => {
        if (snapshot.exists()) {
            achievementsContainer.innerHTML = "";
            const achievements = snapshot.val();

            // Collect all achievement fetch promises
            const achievementPromises = Object.entries(achievements).map(async ([id, data]) => {
                const obtained = data.Obtained;
                const imgPath = obtained 
                    ? `img/achievements/obtained/${id}.png` 
                    : `img/achievements/unobtained/${id}.png`;

                try {
                    const achSnapshot = await get(ref(db, `achievements/${id}`));
                    if (!achSnapshot.exists()) return null;

                    const achData = achSnapshot.val();

                    // Create achievement element
                    const achievementElement = document.createElement('div');
                    achievementElement.className = "relative group cursor-pointer";
                    achievementElement.innerHTML = `
                        <img src="${imgPath}" alt="${achData.Title} Badge" class="w-full h-full object-contain transition transform hover:-translate-y-1">
                        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded">
                            ${achData.Title}
                        </div>
                    `;

                    achievementElement.addEventListener("click", () => {
                        openAchievementModal(
                            id,
                            achData.Title,
                            achData.Description,
                            achData.PointsAwarded,
                            achData.DifficultyLevel,
                            achData.Category,
                            imgPath
                        );
                    });

                    return achievementElement;
                } catch (error) {
                    console.error("Error fetching achievement data:", error);
                    return null;
                }
            });

            // Wait for all achievement fetches to complete
            const achievementElements = await Promise.all(achievementPromises);

            achievementElements.forEach(element => {
                if (element) achievementsContainer.appendChild(element);
            });
        }
    }).catch((error) => {
        console.error("Error fetching user achievements:", error);
    });
});
