function onInputTimeChanged(event) {
    const inputTimeStr = event.target.value
    if (!inputTimeStr) return

    const timeParts = inputTimeStr
        .split(":", 3)
        .map((s) => parseInt(s))

    let someDate = new Date()
    someDate.setHours(timeParts[0])
    someDate.setMinutes(timeParts[1])
    someDate.setSeconds(timeParts[2])

    const oneSecondInMs = 1000
    someDate.setTime(someDate.getTime() + oneSecondInMs)

    const outTimeElem = document.querySelector("#time_output")
    outTimeElem.value = someDate.toTimeString().split(" ", 2)[0]
}

document.querySelector("#time_input").addEventListener("change", onInputTimeChanged)