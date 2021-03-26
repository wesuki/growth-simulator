class Simulator {
    constructor(timeField, populationField) {
        this.timeField = timeField
        this.populationField = populationField
        this.reset()
        this.updateDisplay()
    }

    reset() {
        this.time = 0
        this.population = 1
        this.populationGrowthRatePerSecond = 0.01
    }

    update(dtInMS) {
        this.time += dtInMS
        this.population += dtInMS * this.population * this.populationGrowthRatePerSecond / 1000
    }

    updateDisplay() {
        const timeInSecond = (this.time) / 1000
        this.timeField.textContent = `${timeInSecond.toFixed(2)} s`
        this.populationField.textContent = this.population.toFixed(2)
    }
}

// document.addEventListener("DOMContentLoaded", () => {
//     timeField.textContent = 0
// })

const timeField = document.querySelector("[data-time]")
const populationField = document.querySelector("[data-population]")
const simulator = new Simulator(timeField, populationField)

const dtInMS = 1000 / 25 // frame per second
function mainLoop() {
    simulator.update(dtInMS)
    simulator.updateDisplay()
}
var mainLoopEvent = undefined



const populationButton = document.querySelector("[population-button]")
populationButton.addEventListener("click", () => {
    simulator.population += 1
    simulator.updateDisplay()
})



const startButton = document.querySelector("[start-button]")

startButton.startText = "Start"
startButton.pauseText = "Pause"

startButton.setStart = () => {
    startButton.textContent = startButton.pauseText
    mainLoopEvent = setInterval(mainLoop, dtInMS)
}

startButton.setPause = () => {
    startButton.textContent = startButton.startText
    if (mainLoopEvent) clearTimeout(mainLoopEvent)
}

startButton.toggle = () => {
    if (startButton.textContent === startButton.startText) {
        startButton.setStart()
    } else {
        startButton.setPause()
    }
}

startButton.addEventListener("click", startButton.toggle)



const resetButton = document.querySelector("[reset-button]")

resetButton.addEventListener("click", () => {
    startButton.setPause()
    simulator.reset()
    simulator.updateDisplay()
})

