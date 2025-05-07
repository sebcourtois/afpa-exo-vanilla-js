const toPayElem = document.querySelector("#amount_to_pay")
const receivedElem = document.querySelector("#amount_received")

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

function onFormChange() {
    const amountToPay = toPayElem.value
    const amountReceived = receivedElem.value

    const amountToReturn = amountReceived - amountToPay
    if (amountToReturn <= 0) return

    const moneyChange = makeChange(amountToReturn)
    // console.log(amountToReturn, moneyChange)

    const html = `<p>${amountToReturn} € à rendre:</p>`
    const changeElem = document.querySelector("#money_change")
    changeElem.innerHTML = html + renderMoneyChange(moneyChange)
}

toPayElem.addEventListener("change", onFormChange)
receivedElem.addEventListener("change", onFormChange)