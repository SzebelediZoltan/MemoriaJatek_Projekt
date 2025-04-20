// --- Általános változók ---
let difficulty = null;
let firstCard = null;
let mistakes = 0;
let flipping = false;
let intervalID;
let startTime;

const CARDS = [
    "dababby", "datboy", "lean", "oioioi", "orange", "shrek",
    "skibidi", "wilson", "spooky scary skeleton", "nyan cat",
    "meme guy", "knuckles", "dame to cosita", "big chungus"
];

// --- DOM elemek ---
const startButton = document.querySelector("#startButton");
const statisticsButton = document.querySelector('#statistics');
const difficultyButtons = document.querySelector("#difficulties");
const ageInput = document.querySelector('input[type="number"]');
const emailInput = document.querySelector('input[type="email"]');
const cardsContainer = document.querySelector("#cards");
const power1Button = document.querySelector("#power1");
const power2Button = document.querySelector("#power2");
const playAgainButton = document.querySelector("#playAgain");
const loginError = document.querySelector("#loginerror");

// --- Eseménykezelők ---
startButton.addEventListener("click", handleStart);
statisticsButton.addEventListener("click", () => window.location.href = 'Statisztika/index.html');
difficultyButtons.addEventListener("click", handleDifficultySelection);
ageInput.addEventListener("change", validateAgeInput);
cardsContainer.addEventListener("click", handleFlip);
power1Button.addEventListener("click", handlePower1);
power2Button.addEventListener("click", handleRandomPick);
playAgainButton.addEventListener("click", reset);

// --- Játék újraindítása ---
function reset() {
    if (difficulty) document.querySelector(`#${difficulty}`).classList.remove("selected");

    difficulty = null;
    mistakes = 0;

    document.querySelector("#win").style.display = "none";
    document.querySelector("#game").style.display = "none";
    document.querySelector("#login").style.display = "flex";
    loginError.style.display = "none";

    emailInput.value = "";
    ageInput.value = "";

    power1Button.disabled = false;
    power2Button.disabled = false;
}

// --- Véletlen egész szám generálása ---
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Életkor input validálása ---
function validateAgeInput() {
    const value = parseInt(ageInput.value);
    if (isNaN(value)) ageInput.value = "";
    else ageInput.value = Math.min(Math.max(value, 1), 99);
}

// --- Nehézségi szint kiválasztása ---
function handleDifficultySelection(e) {
    const button = e.target;
    if (!button.matches(".difficultyButton")) return;

    if (difficulty) document.querySelector(`#${difficulty}`).classList.remove("selected");
    button.classList.add("selected");
    difficulty = button.id;
}

// --- Indítás gomb kezelése ---
function handleStart() {
    const [isEmailValid, isAgeValid, isDifficultySelected] = validateData();

    if (isEmailValid && isAgeValid && isDifficultySelected) {
        const cards = generateCards();
        startGame(cards);
    } else {
        showLoginError([isEmailValid, isAgeValid, isDifficultySelected]);
    }
}

// --- Adatok ellenőrzése ---
function validateData() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailInput.value;
    const age = parseInt(ageInput.value);

    return [emailPattern.test(email), age >= 1 && age <= 99, difficulty !== null];
}

// --- Hibák megjelenítése ---
function showLoginError([emailValid, ageValid, difficultySelected]) {
    let errorMessage = "Unknown error";
    if (!difficultySelected) errorMessage = "Select a difficulty";
    else if (!emailValid) errorMessage = "Give us a real email address";
    else if (!ageValid) errorMessage = "Give us a correct age (1 - 99)";

    loginError.innerText = errorMessage;
    loginError.style.display = "block";
}

// --- Kártyák generálása ---
function generateCards() {
    let count;
    switch (difficulty) {
        case "easy": count = 2; break;
        case "medium": count = 9; break;
        case "hard": count = 12; break;
    }
    const selected = [...CARDS.slice(0, count), ...CARDS.slice(0, count)];
    shuffle(selected);
    return selected;
}

// --- Kártyák keverése ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Játék indítása ---
function startGame(cards) {
    document.querySelector("#login").style.display = "none";
    document.querySelector("#game").style.display = "block";
    updateMistakes();
    showCards(cards);
    startTime = Date.now();
    updateTimer();
    setTimeout(() => {
        intervalID = setInterval(updateTimer, 1000);
    }, 3000)
}

function updateTimer() {
    document.querySelector("#game").children[0].innerText = "Time: " + getTime();
}

function getTime() {
    const elapsed = Date.now() - startTime;
    const mins = Math.floor(elapsed / 60000).toString().padStart(2, "0");
    const secs = Math.floor((elapsed / 1000) % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}

// --- Kártyák megjelenítése ---
function showCards(cards) {
    cardsContainer.innerHTML = cards.map(name => `
        <div class="card">
            <div class="front"></div>
            <div class="back flipped">
                <img src="Images/${name}.png" alt="${name}">
            </div>
        </div>`).join("");
    handleAllFlip();
}

// --- Kártya kattintás kezelése ---
function handleFlip(e) {
    const card = e.target.closest(".card");
    if (!card || card.children[0].classList.contains("flipped")) return;

    flipCard(card);

    flipping = true;
    if (!firstCard) {
        firstCard = card;
    } else {
        cardsContainer.removeEventListener("click", handleFlip);     
        compareCards(card)
            .then(() => cardMatch(card))
            .catch(() => cardMismatch(card));
    }
}

// --- Lépésszámláló frissítése ---
function updateMistakes() {
    document.querySelector("#game").children[1].innerText = "Mistakes: " + mistakes;
}

// --- Kártya megfordítása ---
function flipCard(card) {
    if (!card) return;
    card.children[0].classList.toggle("flipped");
    card.children[1].classList.toggle("flipped");
}

// --- Két kártya összehasonlítása ---
function compareCards(card) {
    return new Promise((resolve, reject) => {
        flipping = true;
        
        setTimeout(() => {
            const img1 = card.children[1].children[0].src;
            const img2 = firstCard.children[1].children[0].src;
            if (img1 == img2) {
                resolve()
            } else {
                reject()
            }
        }, 1000);
    });
}

function cardMatch(card) {
    firstCard.style.visibility = "hidden";
    card.style.visibility = "hidden";
    firstCard = null;
    flipping = false;
    cardsContainer.addEventListener("click", handleFlip);
    checkWin();
}

function cardMismatch(card) {
    setTimeout(() => {
        flipCard(firstCard);
        flipCard(card);
        firstCard = null;
        flipping = false;
        mistakes++
        updateMistakes()
        cardsContainer.addEventListener("click", handleFlip);
    }, 1000);
}

// --- Játék vége ellenőrzése ---
function checkWin() {
    const allHidden = Array.from(cardsContainer.children).every(c => c.style.visibility === "hidden");
    if (allHidden) handleWin();
}

function handleWin() {
    document.querySelector("#win").style.display = "flex";
    clearInterval(intervalID);
    document.querySelector("#win").children[1].innerText = `You have won our game in ${getTime()} and with ${mistakes} mistakes`;
    
    pushToLocal()
    pushToGlobal()
}

function pushToLocal() {
    let datas = JSON.parse(localStorage.getItem("datas"))
    let today = new Date()
    
    if(!datas) {
        datas = []
    }
    
    let data = {
        email: emailInput.value,
        age: ageInput.value,
        level: difficulty,
        time: getTime(),
        mistakes: mistakes,
        date: `${today.getFullYear()}.${today.getMonth()}.${today.getDay()}`
    }
    
    console.log("asd");
    console.log(data);

    datas.push(data)

    console.log(datas);
    

    localStorage.setItem("datas", JSON.stringify(datas))
}

async function pushToGlobal() {
    let postData = {
        "email": emailInput.value,
        "age": parseInt(ageInput.value),
        "level": difficulty,
        "time": Math.floor((Date.now()-startTime) / 1000),
        "mistakes": mistakes
    }

    const OPTIONS = {
        method: "POST",
        body: JSON.stringify(postData)
    }

    const response = await fetch(`http://localhost/memory/create/`, OPTIONS);
    const data = await response.json()
    console.log(data);
    
}

// --- Power 2: Véletlenszerű pár felfedése ---
function handleRandomPick() {
    if (flipping) return;
    const src = pickValidRandomSrc();
    doRandomPick(src);
    power2Button.disabled = true;
}

function doRandomPick(src) {
    const picked = [];
    flipping = true;

    for (const card of cardsContainer.children) {
        if (card.children[1].children[0].src === src) {
            flipCard(card);
            picked.push(card);
        }
    }

    setTimeout(() => {
        for (const card of picked) card.style.visibility = "hidden";
        checkWin();
        flipping = false;
    }, 2000);
}

function pickValidRandomSrc() {
    const available = Array.from(cardsContainer.children).filter(c => c.style.visibility !== "hidden");
    return available[getRndInteger(0, available.length - 1)].children[1].children[0].src;
}

// --- Power 1: Összes kártya felfedése pár másodpercre ---
function handlePower1() {
    if (!flipping) {
        handleAllFlip();
        power1Button.disabled = true;
    }
}

function handleAllFlip() {
    flipping = true;
    flipAll();
    setTimeout(() => {
        flipAll();
        flipping = false;
    }, 3000);
}

function flipAll() {
    for (const card of cardsContainer.children) {
        flipCard(card);
    }
}