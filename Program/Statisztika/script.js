// --- DOM elemlek lekérdezése ---
const gameButton = document.getElementById("Game");
const localBtn = document.getElementById("local");
const globalBtn = document.getElementById("global");
const storageType = document.getElementById("storageType");
const storageButtons = document.getElementById("storageButtons");
const difficultyButtons = document.getElementById("difficultyButtons");
const statTable = document.getElementById("statTable");
const statTableBody = statTable.querySelector("tbody");
const emailFilter = document.getElementById("emailFilterContainer");
const emailInput = document.querySelector("input[type='email']");

let currentMode = null; // local vagy global

// --- Navigáció a játékhoz ---
gameButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// --- E-mail szűrő input esemény ---
emailInput.addEventListener("input", () => {
    if (emailInput.value === "") {
        showAllTr();
        return;
    }

    for (const tr of statTableBody.children) {
        if (!tr.children[0].innerText.includes(emailInput.value)) {
            tr.style.display = "none";
        } else {
            tr.style.display = "table-row";
        }
    }
});

// --- Local statisztika gomb ---
localBtn.addEventListener("click", () => {
    currentMode = "local";
    difficultyButtons.style.display = "flex";
    storageButtons.style.display = "none";
    statTable.style.display = "none";
    storageType.style.display = "none";
    emailFilter.style.display = "none";
});

// --- Global statisztika gomb ---
globalBtn.addEventListener("click", () => {
    currentMode = "global";
    difficultyButtons.style.display = "flex";
    storageButtons.style.display = "none";
    statTable.style.display = "none";
    storageType.style.display = "none";
    emailFilter.style.display = "none";
});

// --- Nehézségi szint gomb eseménykezelő ---
difficultyButtons.addEventListener("click", (e) => {
    if (e.target.classList.contains("difficulty")) {
        const level = e.target.dataset.diff;

        if (currentMode === "local") {
            storageType.textContent = `LocalStorage - ${capitalize(level)} Mode`;
            showLocal(level);
        } else if (currentMode === "global") {
            storageType.textContent = `GlobalStorage - ${capitalize(level)} Mode`;
            showGlobal(level);
        }

        toggleVisibility();
    }
});

// --- Szűrés a táblázatban e-mail alapján ---
statTable.addEventListener("change", (e) => {
    if (e.target.id === "emailFilter") {
        const filterValue = e.target.value.toLowerCase();
        const rows = statTableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const emailCell = row.querySelector("td");
            row.style.display = (emailCell && emailCell.textContent.toLowerCase().includes(filterValue))
                ? ""
                : "none";
        });
    }
});

// --- LocalStorage statisztikák megjelenítése ---
function showLocal(level) {
    statTableBody.innerHTML = "";
    let data = JSON.parse(localStorage.getItem("datas"));

    if (data) {
        data = sortData(data).filter(e => e.chosen_level === level);
        addToTable(data);
    } else {
        showError("Nincs adat!");
    }
}

// --- GlobalStorage statisztikák megjelenítése ---
async function showGlobal(level) {
    statTableBody.innerHTML = "";
    try {
        const response = await fetch(`http://localhost/memory/index.php?level=${level}`);
        let data = await response.json();

        if (response.status === 200) {
            data = sortData(data);
            addToTable(data);
        } else {
            showError(data.error);
        }
    } catch {
        showError("Nem működik a szerver!");
    }
}

// --- Adatok rendezése (idő, hibaszám szerint) ---
function sortData(data) {
    return data.sort((a, b) => {
        if (a.playtime !== b.playtime) return a.playtime - b.playtime;
        return a.mistakes - b.mistakes;
    });
}

// --- Táblázat feltöltése adatokkal ---
function addToTable(data) {
    
    data.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.email}</td>
            <td>${entry.age}</td>
            <td>${entry.chosen_level}</td>
            <td>${entry.playtime}</td>
            <td>${entry.mistakes}</td>
            <td>${entry.created_at}</td>
        `;
        statTableBody.appendChild(row);
    });
}

// --- Hibás esetek megjelenítése táblázatban ---
function showError(message) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6">${message}</td>`;
    row.style.color = "red";
    statTableBody.appendChild(row);
}

// --- Nézetek megjelenítésének vezérlése ---
function toggleVisibility() {
    statTable.style.display = "table";
    difficultyButtons.style.display = "none";
    storageButtons.style.display = "flex";
    storageType.style.display = "block";
    emailFilter.style.display = "block";
    emailInput.value = "";
    showAllTr();
}

// --- Segédfüggvény: minden sor megjelenítése ---
function showAllTr() {
    for (const tr of statTableBody.children) {
        tr.style.display = "table-row";
    }
}

// --- Szöveg első betűjének nagybetűsítése ---
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
