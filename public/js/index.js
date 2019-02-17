$(document).ready(function () {
    const totalPrice = document.getElementById('totalPrice');
    const buttonPlus = document.getElementById('buttonPlus');
    const buttonMinus = document.getElementById('buttonMinus');
    const productAmount = document.getElementById('productAmount');
    const price = Number(totalPrice.innerText.split(' ')[1]);

    buttonMinus.addEventListener('click', () => {
        if (Number(productAmount.innerText) === 1) return;
        else {
            const amount = Number(productAmount.innerText) - 1;
            productAmount.innerText = amount;
            totalPrice.innerText = '$ ' + (price * amount);
        }
    })

    buttonPlus.addEventListener('click', () => {
        const amount = Number(productAmount.innerText) + 1;
        productAmount.innerText = amount;
        totalPrice.innerText = '$ ' + (price * amount);
    })
})