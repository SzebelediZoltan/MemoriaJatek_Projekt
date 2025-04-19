// --- Általános változók ---
let difficulty;
let firstCard = null;
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
const cardsContainer = document.querySelector("#cards");

// --- Eseménykezelők ---
startButton.addEventListener("click", handleStart);
statisticsButton.addEventListener("click", () => window.location.href = 'Statisztika/index.html');
difficultyButtons.addEventListener("click", handleDifficultySelection);
ageInput.addEventListener("change", validateAgeInput);
cardsContainer.addEventListener("click", handleFlip);

// --- Játékindítás ---
function handleStart() {
    const [isEmailValid, isAgeValid, isDifficultySelected] = validData();

    if (isEmailValid && isAgeValid && isDifficultySelected) {
        const cards = generateCards();
        startGame(cards);
    } else {
        showLoginError([isEmailValid, isAgeValid, isDifficultySelected]);
    }
}

// --- Adatellenőrzés ---
function validData() {
    const email = document.querySelector('input[type="email"]').value;
    const age = document.querySelector('input[type="number"]').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);
    const isAgeValid = age >= 1 && age <= 99;
    const isDifficultySelected = difficulty !== null;

    return [isEmailValid, isAgeValid, isDifficultySelected];
}

// --- Hibakezelés ---
function showLoginError([email, age, difficultySelected]) {
    let errorMessage = "Unknown error";

    if (!difficultySelected) {
        errorMessage = "Select a difficulty";
    } else if (!email) {
        errorMessage = "Give us a real email address";
    } else if (!age) {
        errorMessage = "Give us a correct age (1 - 99)";
    }

    const errorParagraph = document.querySelector("#loginerror");
    errorParagraph.innerText = errorMessage;
    errorParagraph.style.display = "block";
}

// --- Életkor input korlátozás ---
function validateAgeInput() {
    const value = parseInt(ageInput.value);

    if (isNaN(value)) {
        ageInput.value = "";
    } else if (value < 1) {
        ageInput.value = 1;
    } else if (value > 99) {
        ageInput.value = 99;
    }
}

// --- Nehézségi szint kiválasztása ---
function handleDifficultySelection(e) {
    const button = e.target;
    
    if (button.matches(".difficultyButton")) {
        if (difficulty) {
            document.querySelector(`#${difficulty}`).classList.remove("selected");
        }
        button.classList.add("selected");
        difficulty = button.id;
    }
}

// --- Kártyák generálása ---
function generateCards() {
    let selectedCards;

    switch (difficulty) {
        case "easy":
            selectedCards = [...CARDS.slice(0, 2), ...CARDS.slice(0, 2)];
            break;
        case "medium":
            selectedCards = [...CARDS.slice(0, 9), ...CARDS.slice(0, 9)];
            break;
        case "hard":
            selectedCards = [...CARDS.slice(0, 12), ...CARDS.slice(0, 12)];
            break;
    }

    shuffle(selectedCards);
    return selectedCards;
}

// --- Keverés ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Játék kezdete ---
function startGame(cards) {
    document.querySelector("#login").style.display = "none";
    document.querySelector("#game").style.display = "block";
    showCards(cards);
}

// --- Kártyák megjelenítése ---
function showCards(cards) {
    cardsContainer.innerHTML = "";
    for (const name of cards) {
        cardsContainer.innerHTML += `
            <div class="card">
                <div class="front"></div>
                <div class="back flipped">
                    <img src="Images/${name}.png" alt="${name}">
                </div>
            </div>`;
    }
}

// --- Kártya kattintás kezelése ---
function handleFlip(e) {
    const card = e.target.closest(".card");

    if (!card || card.children[0].classList.contains("flipped")) return;

    flipCard(card);

    if (!firstCard) {
        firstCard = card;
    } else {
        cardsContainer.removeEventListener("click", handleFlip);
        compareCards(card)
            .then(() => cardMatch(card))
            .catch(() => cardMismatch(card));
    }
}

// --- Kártya forgatás ---
function flipCard(card) {
    card.children[0].classList.toggle("flipped"); // front
    card.children[1].classList.toggle("flipped"); // back
}

// --- Kártyák összehasonlítása ---
function compareCards(card) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img1 = card.children[1].children[0].src;
            const img2 = firstCard.children[1].children[0].src;
            img1 === img2 ? resolve(true) : reject(false);
        }, 1000);
    });
}

// --- Kártyák egyezése ---
function cardMatch(card) {
    firstCard.style.visibility = "hidden";
    card.style.visibility = "hidden";
    firstCard = null;
    cardsContainer.addEventListener("click", handleFlip);
    checkWin();
}

// --- Kártyák nem egyeznek ---
function cardMismatch(card) {
    flipCard(firstCard);
    flipCard(card);
    firstCard = null;
    cardsContainer.addEventListener("click", handleFlip);
}

// --- Játék megnyerésének ellenőrzése ---
function checkWin() {
    let allHidden = true;
    for (const card of cardsContainer.children) {
        if (card.style.visibility !== "hidden") {
            allHidden = false;
            break;
        }
    }

    if (allHidden) {
        document.querySelector("#win").style.display = "flex";
    }
}
