Element.prototype.insertMeBefore = function (element) {
    element.parentNode.insertBefore(this, element);
},false;

Element.prototype.insertMeAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
},false;



class Simulator {
    constructor(simulatorElement, timeField, populationField) {
        this.simulatorElement = simulatorElement
        this.timeField = timeField
        this.populationField = populationField

        this.simulatorElement.appendChild(document.createTextNode("Actual Growth Rate:"))
        this.actualPopulationGrowthRateFiled = document.createElement("div")
        this.actualPopulationGrowthRateFiled.setAttribute("data-actual-population-growth-rate", "")
        this.simulatorElement.appendChild(this.actualPopulationGrowthRateFiled)

        this.simulatorElement.appendChild(document.createTextNode("Population Growth Rate:"))
        this.populationGrowthRateFiled = document.createElement("div")
        this.populationGrowthRateFiled.setAttribute("data-population-growth-rate", "")
        this.simulatorElement.appendChild(this.populationGrowthRateFiled)

        this.populationCapacityFiled = this.simulatorElement.querySelector("[data-population-capacity]")

        this.reset()
        this.updateDisplay()
    }

    reset() {
        this.time = 0
        this.populationCapacity = 10
        this.population = 1
        this.populationGrowthRatePerSecond = 0.01
        this.actualPopulationGrowthRateRatePerSecond = 0.00
    }

    update(dtInMS) {
        this.time += dtInMS
        this.actualPopulationGrowthRateRatePerSecond = (
            (1 - this.population / this.populationCapacity)
            * this.populationGrowthRatePerSecond
        )
        this.population += (
            dtInMS 
            * this.population
            * this.actualPopulationGrowthRateRatePerSecond / 1000
        )
    }

    updateDisplay() {
        const timeInSecond = (this.time) / 1000
        this.timeField.innerText = `${timeInSecond.toFixed(2)} s`
        this.populationCapacityFiled.innerText = this.populationCapacity.toFixed(2)
        this.populationField.innerText = this.population.toFixed(2)
        this.populationGrowthRateFiled.innerText = (
            `${(this.populationGrowthRatePerSecond * 100).toFixed(2)} %`
        )
        this.actualPopulationGrowthRateFiled.innerText = (
            `${(this.actualPopulationGrowthRateRatePerSecond * 100).toFixed(2)} %`
        )
    }
}


const simulatorElement = document.querySelector("[data-simulator]")
const timeField = document.querySelector("[data-time]")
const populationField = document.querySelector("[data-population]")
const simulator = new Simulator(simulatorElement, timeField, populationField)

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

const populationGrowthRateButton = document.createElement("button")
populationGrowthRateButton.setAttribute("population-growth-rate-button", "")
populationGrowthRateButton.innerText = "Pop Growth +0.1%"
populationGrowthRateButton.addEventListener("click", () => {
    simulator.populationGrowthRatePerSecond += 0.001
    simulator.updateDisplay()
})
populationGrowthRateButton.insertMeAfter(populationButton)


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

