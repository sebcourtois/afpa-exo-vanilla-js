function computePrice(nbrCopies) {
    const a = nbrCopies < 10 ? nbrCopies : 10
    nbrCopies -= 10

    let b = 0
    if (nbrCopies > 0) {
        b = nbrCopies < 20 ? nbrCopies : 20
        nbrCopies -= 20
    }
    const c = nbrCopies > 0 ? nbrCopies : 0

    const price = (0.1 * a) + (0.09 * b) + (0.08 * c)
    console.log(`(0.10 * ${a}) + (0.09 * ${b}) + (0.08 * ${c}) = ${price}`)
    return price
}

function onCalculationButtonClicked(event) {
    const nbrCopies = document.querySelector("#number_of_copy").value
    if (!nbrCopies) return

    event.preventDefault()

    const price = computePrice(nbrCopies)
    document.querySelector("#price_display").textContent = `Vous devez régler ${price} €`

}

document.querySelector("#calculation_button").addEventListener("click", onCalculationButtonClicked)