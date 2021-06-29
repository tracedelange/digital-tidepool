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
        submitParamsToJson()
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

const validateInput = (node, min, max, minO, maxO) => {
    node.addEventListener('change', function(){
        if (node.value <= min){
            node.value = minO
        } else if (node.value > max) {
            node.value = maxO
        }
    })
}

const addParameterValidators = () => {
    validateInput(document.getElementById('green-growth-rate'), 0, 1, .1, 1)
    validateInput(document.getElementById('eater-perception'), -1, 20, 0, 20)
    validateInput(document.getElementById('eater-lifespan'), 10, 1000, 10, 1000)

    validateInput(document.getElementById('eater-death-rate'), 0, 1, .1, 1)
    validateInput(document.getElementById('eater-reproduction-rate'), 0, 1, .1, 1)
    validateInput(document.getElementById('eater-gestation-period'), 1, 1000, 1, 1000)
    validateInput(document.getElementById('eater-nutrient-requirement'), 1, 1000, 1, 1000)
    
    validateInput(document.getElementById('hunter-perception'), -1, 20, 0, 20)
    validateInput(document.getElementById('hunter-lifespan'), 10, 1000, 10, 1000)
    validateInput(document.getElementById('hunter-death-rate'), 0, 1, .1, 1)
    validateInput(document.getElementById('hunter-nutrient-requirement'), 1, 1000, 1, 1000)
    validateInput(document.getElementById('hunter-gestation-period'), 1, 1000, 1, 1000)
    validateInput(document.getElementById('hunter-reproduction-rate'), 0, 1, .1, 1)

    validateInput(initalGreenPopInput, 0, 1000, 1, 1000)
    validateInput(initalEaterPopInput, 0, 100, 1, 100)
    validateInput(initalHunterPopInput, 0, 50, 1, 50)
    

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
    // bakeParameters()
    submitParamsToJson()

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

const populateTimestepRecord = () => {
    // let cookie = document.cookie;

    fetch(`http://localhost:3000/previousTimesteps`)
    .then(response => response.json())
    .then(data => {
        data.forEach(entry => {
            let timeEntry = document.createElement('li')
            timeEntry.innerText = entry.length
            timeEntries.insertBefore(timeEntry, timeEntries.firstChild)
        });
    })
}

const submitTimestepRecord = () => {

    let currentTime = parseInt(timestepNode.innerText.split(' ')[1])
    
    let data = {
        length: currentTime
    }

    let timeEntry = document.createElement('li')
    timeEntry.innerText = data.length
    timeEntries.insertBefore(timeEntry, timeEntries.firstChild)

    const configurationObject = {


        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch("http://localhost:3000/previousTimesteps", configurationObject)
    .then(function(response) {
        return response.json();
      })
    .then(function(object) {
        console.log(object);
      })
    .catch(function(error) {
        alert("Bad things! Ragnarők!");
        console.log(error.message);
      });  

}

const submitParamsToJson = () => {
    const paramData = {
        "initalGreenPopulation": initalGreenPopInput.value,
        "initalEaterPopulation": initalEaterPopInput.value,
        "initalHunterPopulation": initalHunterPopInput.value,

        'greenGrowthRate' : getGreenGrowthRate(),

        'eaterPerception' : getEaterPerception(),
        'eaterLifespan' : getEaterLifespan(),
        'eaterDeathChance' : getEaterDeathChance(),
        'eaterReproductionRate' : getEaterReproductionRate(),
        'eaterGestationPeriod' : getEaterGestationPeriod(),
        'eaterNutrientRequirement' : getEaterNutrientRequirement(),
        
        'hunterPerception' : getHunterPerception(),
        'hunterLifespan' : getHunterLifespan(),
        'hunterDeathChance' : getHunterDeathChance(),
        'hunterNutrientRequirement' : getHunterNutrientRequirement(),
        'hunterGestationPeriod' : getHunterGestationPeriod(),
        'hunterReproductionRate' : getHunterReproductionRate() 
    }

    const configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(paramData)
      };
      
    fetch("http://localhost:3000/currentParameters", configurationObject); 
}

const populateParametersFromJson = (source='currentParameters') => {
    fetch(`http://localhost:3000/${source}`)
    .then(response => response.json())
    .then(data => {
        initalGreenPopInput.value = data['initalGreenPopulation'],
        initalEaterPopInput.value = data['initalEaterPopulation'],
        initalHunterPopInput.value = data['initalHunterPopulation']
        document.getElementById('green-growth-rate').value = data['greenGrowthRate']
        document.getElementById('eater-perception').value = data['eaterPerception']
        document.getElementById('eater-lifespan').value = data['eaterLifespan']
        document.getElementById('eater-death-rate').value = data['eaterDeathChance']
        document.getElementById('eater-reproduction-rate').value = data['eaterReproductionRate']
        document.getElementById('eater-gestation-period').value = data['eaterGestationPeriod']
        document.getElementById('eater-nutrient-requirement').value = data['eaterNutrientRequirement']
        document.getElementById('hunter-perception').value = data['hunterPerception']
        document.getElementById('hunter-lifespan').value = data['hunterLifespan']
        document.getElementById('hunter-death-rate').value = data['hunterDeathChance']
        document.getElementById('hunter-nutrient-requirement').value = data['hunterNutrientRequirement']
        document.getElementById('hunter-gestation-period').value = data['hunterGestationPeriod']
        document.getElementById('hunter-reproduction-rate').value = data['hunterReproductionRate']
    })
}




//Main config 
const mainConfig = () => {
    
    populateParametersFromJson()

    canvasDiv.appendChild(app.view);

    gridConfig.addEventListener('submit', function(event){ 

        submitParamsToJson()
        
        event.preventDefault()
        
        Hunter.populateHunters(initalHunterPopInput.value)
        
        Eater.populateEaters(initalEaterPopInput.value)
        
        Green.populateGreens(initalGreenPopInput.value)
       
        parameterDiv.style.display = 'none'

        startSim() 
    })



    // populateParametersFromJson();

    populateTimestepRecord();

    addButtonListeners();

    addParameterValidators();


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
        submitTimestepRecord()
    }
    if (Eater.all.length === 0 && doomMessageShown === false) {
        addDoomMessage('Eaters have gone extinct. As a result, Hunters will starve and Greens will dominate the tidepool unchecked.', 'ee', (0.8) )
        doomMessageShown = true
        submitTimestepRecord()
    } 
    if (Hunter.all.length === 0 && doomMessageShown === false) {
        addDoomMessage('Hunters have gone extinct. As a result, Eaters will reproduce unchecked and exceed the carrying capacity of the Greens. They will starve.', 'he', (0.95))
        doomMessageShown = true
        submitTimestepRecord()
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

    //Check for endgame scenarios

    if (Green.all.length === numCols*numRows){
        let message = app.stage.children.find(child => child.message === 'here!')
        app.stage.removeChild(message)
        addDoomMessage('Greens have dominated the tidepool.', 'ee', (0))
        pauseSim()
        resumeButton.disabled = true
        // submitTimestepRecord()    
    } 

    if (Eater.all.length === 0 && Hunter.all.length === 0 && Eater.all.length) {
        pauseSim()
        resumeButton.disabled = true
        // submitTimestepRecord()    
    }



}

const addDoomMessage = (message, id, positionMod) => {
    const doomMessage = new PIXI.Text(message, MessageStyle)
    doomMessage.x = width / 3 - ((width/3)*positionMod)
    doomMessage.y = height / 2 - 18  
    doomMessage.id = id
    doomMessage.message = 'here!'
    app.stage.addChild(doomMessage)
    // console.log('doom Message added')
    doomMessageShown = true
}

