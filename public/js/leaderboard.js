// Import Firebase SDK (Make sure you have Firebase initialized in your project)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function fetchPlayers() {
    const playersRef = ref(db, "players");
    const snapshot = await get(playersRef);

    if (!snapshot.exists()) {
        console.error("No player data found.");
        return;
    }

    const playersData = [];
    snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();

        playersData.push({
            name: data.Name || "Unknown",
            totalPlayTime: data.TotalPlayTime || 0,
            points: data.Points || 0,
        });
    });

    updateLeaderboard(playersData);
    updateCharts(playersData);
}

function updateLeaderboard(players) {
    players.sort((a, b) => b.points - a.points);
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";

    players.forEach((player, index) => {
        const row = `<tr><td>${index + 1}</td><td>${player.name}</td><td>${player.points}</td></tr>`;
        leaderboard.innerHTML += row;
    });
}

let playtimeChartInstance;
let pointsChartInstance;

Chart.defaults.font.size = 15;
Chart.defaults.font.family = "Garet";

function updateCharts(playersData) {
    const topPlaytimePlayers = playersData.sort((a, b) => b.totalPlayTime - a.totalPlayTime).slice(0, 10);

    if (playtimeChartInstance) {
        playtimeChartInstance.destroy();
    }
    if (pointsChartInstance) {
        pointsChartInstance.destroy();
    }

    const ctx1 = document.getElementById("playtimeChart").getContext("2d");
    playtimeChartInstance = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: topPlaytimePlayers.map(p => p.name),
            datasets: [{
                label: "Total Playtime (hours)",
                data: topPlaytimePlayers.map(p => p.totalPlayTime),
                backgroundColor: "#f0e442",
            }]
        },
        options: {
            responsive: true,
        }
    });
}

fetchPlayers();
