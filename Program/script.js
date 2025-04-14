let difficulty;

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
            input.value = ""; // Ha nem szám, töröljük
        } else if (value < 1) {
            input.value = 1; // Minimum 1
        } else if (value > 99) {
            input.value = 99; // Maximum 99
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


