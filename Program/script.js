const div = document.querySelector(".card");
        function handleFlip(e) {
            const card = e.target.parentNode;
            
            const front = card.children[0];
            const back = card.children[1];
            
            front.classList.add("flipped");
            back.classList.remove("flipped");
            setTimeout(() => {
                back.classList.add("flipped");
                front.classList.remove("flipped");
            }, 1000);
        }
        div.addEventListener("click", handleFlip);