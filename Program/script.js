let difficulty;
const CARDS = ["dabbaby", "datboy", "lean", "oioioi", "orange", "shrek", "skibidi"]

const startButton = document.querySelector("#startButton")
startButton.addEventListener("click", handleStart)

function handleStart() {
    let problems = validData()
    if(!problems.includes(false)) {
        let actCards = generateCards()
        resetLogIn()
        startGame(actCards)
    } else {
        showNotValid(problems)
    }
}

function resetLogIn() {
    
}

function showNotValid(problems) {
    let error
    
    if (problems[2] == false) {
        error = "Select a difficulty"
    } else if (problems[0] == false) {
        error = "Give us a real email address"
    } else {
        error = "Give us a correct age (1 - 99)"
    }

    showLogInError(error)   
}

function showLogInError(error) {
    const p = document.querySelector("#loginerror")
    p.innerText = error
    p.style.display = "block"
}

function validData() {
    const email = document.querySelector('input[type="email"]').value;
    const age = document.querySelector('input[type="number"]').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);

    const isAgeValid = age >= 1 && age <= 99;

    const isDifficultySelected = difficulty != null

    return [isEmailValid, isAgeValid, isDifficultySelected];
}


function startGame(actCards) {
    document.querySelector("#login").style.display = "none"
    document.querySelector("#game").style.display = "block"
}

function generateCards() {
    let actCards
    switch (difficulty) {
        case "easy":
            actCards = CARDS.slice(0, 6)
            break;
        case "medium":
            actCards = CARDS.slice(0, 9)
            break;
        case "hard":
            actCards = CARDS.slice(0, 12)
            break;
        default:
            break;
    }

    return actCards
}

const dificultyDivs = document.querySelector("#difficulties")
dificultyDivs.addEventListener("click", handleDificultySelection)

function handleDificultySelection(e) {
    const button = e.target
    
    if(button.matches(".difficultyButton")) {
        if (difficulty != null) {
            
            document.querySelector("#" + difficulty).classList.remove("selected")
        }

        button.classList.add("selected")
        difficulty = button.id
    }
}

const input = document.querySelector('input[type="number"]');

input.addEventListener("change" , ()=> {
        const value = parseInt(input.value);
        if (isNaN(value)) {
            input.value = "";
        } else if (value < 1) {
            input.value = 1;
        } else if (value > 99) {
            input.value = 99;
        }
});

const div = document.querySelector("#cards");
div.addEventListener("click", handleFlip);
function handleFlip(e) {
    const card = e.target.parentNode;
    if (card.matches(".card")) {
        const front = card.children[0];
        const back = card.children[1];
        
        front.classList.add("flipped");
        back.classList.remove("flipped");
        setTimeout(() => {
            back.classList.add("flipped");
            front.classList.remove("flipped");
        }, 1000);
    }
}


