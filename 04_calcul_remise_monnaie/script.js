const toPayElem = document.querySelector("#amount_to_pay")
const receivedElem = document.querySelector("#amount_received")
const calculationButton = document.querySelector("#calculation_button")

function makeChange(amount) {
    let nbrInTen = 0
    let nbrInFive = 0

    if (amount >= 10) {
        nbrInTen = Math.floor(amount / 10)
        amount = amount % 10
    }
    if (amount >= 5) {
        nbrInFive = Math.floor(amount / 5)
        amount = amount % 5
    }
    return {
        10: nbrInTen,
        5: nbrInFive,
        1: amount,
    }
}

function renderMoneyChange(moneyChange) {
    return `
<ul>
    <li>${moneyChange[10]} billet(s) de 10</li>
    <li>${moneyChange[5]} billet(s) de 5</li>
    <li>${moneyChange[1]} pièce(s) de 1</li> 
</ul>`.trim()
}

function onFormSubmitted(event) {
    event.preventDefault()

    const amountToPay = toPayElem.value
    const amountReceived = receivedElem.value

    const amountToReturn = amountReceived - amountToPay
    const moneyChange = makeChange(amountToReturn)
    // console.log(amountToReturn, moneyChange)

    let html = `<p>Rien à rendre</p>`
    if (amountToReturn > 0) {
        html = `<p>${amountToReturn} € à rendre:</p>` + renderMoneyChange(moneyChange)
    }
    document.querySelector("#money_change").innerHTML = html
}

calculationButton.addEventListener("click", onFormSubmitted)