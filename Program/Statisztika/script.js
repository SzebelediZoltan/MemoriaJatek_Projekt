const gameButton = document.getElementById("Game");
const resetButton = document.getElementById("reset");
const localBtn = document.getElementById("local");
const globalBtn = document.getElementById("global");
const storageType = document.getElementById("storageType");
const storageButtons = document.getElementById("storageButtons");
const difficultyButtons = document.getElementById("difficultyButtons");
const statTable = document.getElementById("statTable");
const statTableBody = statTable.querySelector("tbody");

// Game gomb -> vissza a játékhoz
gameButton.addEventListener("click", () => {
    window.location.href = "../index.html"; // vagy ahova kell
});

// Reset gomb -> teljes oldal újratöltése
resetButton.addEventListener("click", () => {
    location.reload();
});

// Local kiválasztás
localBtn.addEventListener("click", () => {
    storageType.textContent = "LocalStorage";
    showStats("local");
    toggleVisibility();
});

// Global kiválasztás -> nehézség gombok jelennek meg
globalBtn.addEventListener("click", () => {
    difficultyButtons.style.display = "flex";
    storageButtons.style.display = "none";
    storageType.style.display = "none";
    statTable.style.display = "none";
});

// Nehézség gombok (global esetén)
difficultyButtons.addEventListener("click", (e) => {
    if (e.target.classList.contains("difficulty")) {
        const level = e.target.dataset.diff;
        storageType.textContent = `GlobalStorage - ${capitalize(level)} Mode`;
        showStats("global", level);
        toggleVisibility();
    }
});

// Mock adatok betöltése (ide jöhet LocalStorage fetch is)
function showStats(type, difficulty = null) {
    statTableBody.innerHTML = "";

    const dummyData = [
        { email: "szebe99@gmail.com", points: 101, date: "2024-04-11 15:30" },
        { email: "meme@lol.com", points: 85, date: "2024-04-15 13:42" },
        { email: "shrek@swamp.com", points: 99, date: "2024-04-18 17:10" }
    ];

    dummyData.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.email}</td>
            <td>${entry.points}</td>
            <td>${entry.date}</td>
        `;
        statTableBody.appendChild(row);
    });
}

// UI váltás
function toggleVisibility() {
    storageButtons.style.display = "none";
    difficultyButtons.style.display = "none";
    storageType.style.display = "block";
    statTable.style.display = "table";
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
