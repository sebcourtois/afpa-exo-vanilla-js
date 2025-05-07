const EMAIL_PATTERN = /[^@]+@[^@.]+\.[^@.]+/gm
const emailInput =document.querySelector("#email_input")

function onFormSubmitted(event) {
    event.preventDefault()

    const email = emailInput.value
    if (!email.match(EMAIL_PATTERN)) {
        emailInput.style.background = "orangered"
        return
    }
    emailInput.style.background = "springgreen"
    console.log(email)
}

function onEmailChanged(event) {
    event.target.style.background = ""
}

document.querySelector("#submit_button").addEventListener("click", onFormSubmitted)
emailInput.addEventListener("input", onEmailChanged)
