(function () {
    let products = document.querySelectorAll(".product");
    for (let i = 0; i < products.length; i++) {
        product = products[i];
        product.addEventListener('click', hundler);
    }

    function hundler(evt) {
        let element = evt.target;
        let current = evt.currentTarget;
        let like = element.closest('.product__like');
        let buttonCountPlus = element.closest(".counter__btn--plus");
        let buttonCountMinus = element.closest(".counter__btn--minus");
        let btn = element.closest(".btn ");
        let counter = current.querySelector(".counter");
        let count = current.querySelector(".counter__number");
        let input = current.querySelector(".counter__input");
        let number = input.value;

        function btnTrigger() {
            current.querySelector(".btn ").classList.toggle("visually-hidden");
            counter.classList.toggle("visually-hidden");
        };

        if (like) {
            like.classList.toggle("active");
        }
        if (buttonCountPlus) {
            number++;
            count.innerHTML = number;
            input.value = number;

        }
        if (buttonCountMinus) {
            if (number > 1) {
                number--;
                count.innerHTML = number;
                input.value = number;
            } else {
                btnTrigger();
            }
        }

        if (btn) {
            btnTrigger();
        }
    }
})();
