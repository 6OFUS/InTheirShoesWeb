// SAMPLE
const players = [
    { name: "Alice", totalPlayTime: 50, points: 1200, pointsHistory: [100, 300, 700, 900, 1200] },
    { name: "Bob", totalPlayTime: 80, points: 1500, pointsHistory: [200, 600, 900, 1300, 1500] },
    { name: "Charlie", totalPlayTime: 30, points: 800, pointsHistory: [50, 200, 500, 600, 800] },
    { name: "David", totalPlayTime: 90, points: 2000, pointsHistory: [300, 700, 1100, 1600, 2000] },
];

// Sort and get top 10 players by total playtime
const topPlaytimePlayers = players.sort((a, b) => b.totalPlayTime - a.totalPlayTime).slice(0, 10);

// Bar Chart: Top 10 Players by Total Playtime
const ctx1 = document.getElementById("playtimeChart").getContext("2d");
new Chart(ctx1, {
    type: "bar",
    data: {
        labels: topPlaytimePlayers.map(p => p.name),
        datasets: [{
            label: "Total Playtime (hours)",
            data: topPlaytimePlayers.map(p => p.totalPlayTime),
            backgroundColor: "#4CAF50",
        }]
    },
    options: { responsive: true }
});

// Line Chart: Points Over Time
const ctx2 = document.getElementById("pointsChart").getContext("2d");
new Chart(ctx2, {
    type: "line",
    data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        datasets: players.map(player => ({
            label: player.name,
            data: player.pointsHistory,
            borderColor: "#3498db",
            fill: false
        }))
    },
    options: { responsive: true }
});

// LEADERBOARD
const leaderboard = document.getElementById("leaderboard");
players.sort((a, b) => b.points - a.points).forEach((player, index) => {
    const row = `<tr><td>${index + 1}</td><td>${player.name}</td><td>${player.points}</td></tr>`;
    leaderboard.innerHTML += row;
});
