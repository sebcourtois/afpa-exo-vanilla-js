const maleOptElem = document.querySelector("#male_option")
const femaleOptElem = document.querySelector("#female_option")
const ageInputElem = document.querySelector("#age_input")
const checkButtonElem = document.querySelector("#check_button")

function isTaxable(gender, age) {
    return (
        (gender === "male" && age > 20)
        || (gender === "female" && age >= 18 && age <= 35)
    )
}

function getSelectedGender() {
    if (maleOptElem.checked) return maleOptElem.value
    if (femaleOptElem.checked) return femaleOptElem.value
    return null
}

function onCheckButtonClicked(event) {
    const gender = getSelectedGender()
    const age = ageInputElem.value

    if (!(gender && age)) return

    event.preventDefault()

    const statusElem = document.querySelector("#taxable_status")
    statusElem.textContent = isTaxable(gender, age) ? "Vous êtes imposable." : "Vous ne payez pas d'impôts !"
}

checkButtonElem.addEventListener("click", onCheckButtonClicked)
