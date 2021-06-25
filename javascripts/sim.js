const addButtonListeners = () => {
    pauseButton.addEventListener('click', function(){
        pauseSim()
    })
    resumeButton.addEventListener('click', function(){
        resumeSim()
    })
    resetButton.addEventListener('click', function (){
        //On reset clicked, package all parameter data and submit it to a json server
        //Once completed, reload the page. 
        bakeParameters()
        resetSim()
    })
    aboutButton.addEventListener('click', function(){
        displayAbout()
    } )
    parameterButton.addEventListener('click', function(){
        displayParams()
    })

    defaultParameterButton.addEventListener('click', (event) => {
        event.preventDefault()
        resetDefaultParameters()
    })

}

const pauseSim = () => {
    //Update running variable to false to stop the game loop
    running = false
    //Update buttons to allow either sim reset or resume
    pauseButton.disabled = true
    resumeButton.disabled = false
    resetButton.disabled = false
}

const resumeSim = () => {
    running = true
    pauseButton.disabled = false
    resumeButton.disabled = true
    resetButton.disabled = true
}
const resetSim = () => {
    location.reload()
}

const startSim = () => {
    running = true
    
    getParameters()
    bakeParameters()

    //adjust buttons
    initalGreenPopInput.disabled = true
    configSubmitButton.disabled = true
    pauseButton.disabled = false
    initalEaterPopInput.disabled = true

    //start sim loop
    setInterval(gameLoop, frameRate)

}

const getParameters = () => {

    greenGrowthRate = parseFloat(getGreenGrowthRate())

    eaterPerception = parseInt(getEaterPerception())
    eaterLifespan = parseInt(getEaterLifespan())
    eaterDeathChance = parseFloat(getEaterDeathChance())
    eaterReproductionRate = parseFloat(getEaterReproductionRate())
    eaterGestationPeriod = parseInt(getEaterGestationPeriod())
    eaterNutrientRequirement = parseInt(getEaterNutrientRequirement())

    hunterPerception = parseInt(getHunterPerception())
    hunterLifespan = parseInt(getHunterLifespan())
    hunterDeathChance = parseFloat(getHunterDeathChance())
    hunterNutrientRequirement = (parseInt(getHunterNutrientRequirement()))*50
    hunterGestationPeriod = parseInt(getHunterGestationPeriod())
    hunterReproductionRate = parseFloat(getHunterReproductionRate())

}

const updateStats = () => {

    greenPop.innerText = `Green Population: ${Green.all.length}`
    eaterPop.innerText = `Eater Population: ${Eater.all.length}`
    hunterPop.innerText = `Hunter Population: ${Hunter.all.length}`
    greenEaterRatio.innerText = `Green to Eater Ratio: ${Math.round(Green.all.length / Eater.all.length)}:1`
    hunterGreenRatio.innerText = `Eater to Hunter Rato: ${Math.round(Eater.all.length / Hunter.all.length)}:1`


    timestepNode.innerText = `Timestep: ${parseInt(timestepNode.innerText.split(' ')[1]) + 1}`
    
}

//Main config 
const mainConfig = () => {
    
    // populateParametersFromJson('currentParameters')

    canvasDiv.appendChild(app.view);

    gridConfig.addEventListener('submit', function(event){
        
        event.preventDefault()
        
        Hunter.populateHunters(initalHunterPopInput.value)
        
        Eater.populateEaters(initalEaterPopInput.value)
        
        Green.populateGreens(initalGreenPopInput.value)

        
        parameterDiv.style.display = 'none'
        // parameterButton.disabled = true


        startSim()
        
    })

    populateParametersFromCookies()

    addButtonListeners()

}

const gameLoop = () => {

    
    if (running === true){

        Hunter.processHunters()
        // debugger;
        Eater.processEaters()
        
        Green.processGreens()
        

        // sweepOutGreens()
        checkForExtinction()
        updateStats()

    }
}

const checkForExtinction = () => {
    if (Green.all.length === 0 && doomMessageShown === false) {
        addDoomMessage('Greens have gone extinct. As a result, Eaters and Hunters will starve.', 'ge', (0.75) )
        doomMessageShown = true
    }
    if (Eater.all.length === 0 && doomMessageShown === false) {
        addDoomMessage('Eaters have gone extinct. As a result, Hunters will starve and Greens will dominate the tidepool unchecked.', 'ee', (0.8) )
        doomMessageShown = true
    } 
    if (Hunter.all.length === 0 && doomMessageShown === false) {
        addDoomMessage('Hunters have gone extinct. As a result, Eaters will reproduce unchecked and exceed the carrying capacity of the Greens. They will starve.', 'he', (0.95))
        doomMessageShown = true
    } 

    if (doomMessageShown === true) {
        let message = app.stage.children.find(child => child.message === 'here!')
        if (message.id === 'ge'){
            app.stage.removeChild(message)
            addDoomMessage('Greens have gone extinct. As a result, Eaters will fail to reproduce and die off, Hunters will follow shortly.', 'ge', (.75))
        } else if ( message.id === 'ee' ) {
            app.stage.removeChild(message)
            addDoomMessage('Eaters have gone extinct. As a result, Hunters will starve and Greens will dominate the tidepool unchecked.', 'ee', (0.8))
        } else if ( message.id === 'he' ) {
            app.stage.removeChild(message)
            addDoomMessage('Hunters have gone extinct. As a result, Eaters will reproduce unchecked. They will consume all of their resources and starve.', 'he', (0.95) )
        }
    }
}

const addDoomMessage = (message, id, positionMod) => {
    const doomMessage = new PIXI.Text(message, MessageStyle)
    doomMessage.x = width / 3 - ((width/3)*positionMod)
    doomMessage.y = height / 2 - 18  
    doomMessage.id = id
    doomMessage.message = 'here!'
    app.stage.addChild(doomMessage)
    console.log('doom Message added')
    doomMessageShown = true
}

