
//General drawing functions
const drawLine = function(startX, startY, endX, endY) {
    let line = new PIXI.Graphics();
    line.lineStyle(1, 0x663333, 1);
    line.moveTo(startX, startY);
    line.lineTo(endX, endY);
    line.x = 0;
    line.y = 0;
    line.alpha = 0.5;
    app.stage.addChild(line);
}

const drawGrid = function(){
    for (let i = 0; i < numRows + 1; i++){
        drawLine(0,lineSpacing + (lineSpacing*i)+1,width,lineSpacing + (lineSpacing*i)+1)
    }
    for (let i = 0; i < numCols; i++){
        drawLine((lineSpacing) + ((lineSpacing)*i)+1,0,lineSpacing + ((lineSpacing)*i)+1,height)
    }
}

//Grid manipulation
const generateGrid = function(gridScale){
    const grid = []
    for (let i = 0; i < numCols; i++){
        grid.push([])
        for (let x = 0; x < numRows; x++){
            grid[i].push([0])
        }
    }
    return grid
}

const setGridIndex = (x,y,color,id) => {
    setGridArray(x,y,0,id)
    drawSquare(x,y,color)
}

const setGridArray = (x,y,index,value) => {
    grid[x][y][index] = value
}



//Sim loop functions
const startSim = () => {
    running = true
    
    getParameters()

    //adjust buttons
    initalGreenPopInput.disabled = true
    configSubmitButton.disabled = true
    pauseButton.disabled = false
    initalEaterPopInput.disabled = true

    //start sim loop
    setInterval(gameLoop, frameRate)

}

const updateStats = () => {

// const greenPop = document.getElementById('green-pop')
// const eaterPop = document.getElementById('eater-pop')
// const greenEaterRatio = document.getElementById('green-eater-ratio')
// const averageGen = document.getElementById('average-eater-generation')

    greenPop.innerText = `Green Population: ${Green.all.length}`
    eaterPop.innerText = `Eater Population: ${Eater.all.length}`
    greenEaterRatio.innerText = `Green to Eater Ratio: ${Math.round(Green.all.length / Eater.all.length)}:1`
    
    

}

const getParameters = () => {

    greenGrowthRate = parseFloat(getGreenGrowthRate())
    eaterPerception = parseInt(getEaterPerception())
    eaterLifespan = parseInt(getEaterLifespan())
    eaterDeathChance = parseFloat(getEaterDeathChance())
    eaterReproductionRate = parseFloat(getEaterReproductionRate())
    eaterGestationPeriod = parseInt(getEaterGestationPeriod())
    eaterNutrientRequirement = parseInt(getEaterNutrientRequirement())

}

const checkForExtinction = () => {
    if (Green.all.length === 0) {
        if (Eater.all.length === 0 && doomMessageShown === true) {
            pauseSim()
            resumeButton.disabled = true
            app.stage.children.find(child => child.id === 'ge').text = 'Greens have gone extinct. As a result, all eaters have starved.'
        } else if (doomMessageShown === false) {
            const doomMessage = new PIXI.Text('Greens have gone extinct. As a result, all eaters will starve.', messageStyle)
            doomMessage.x = width / 3 - ((width/3)*.20)
            doomMessage.y = height / 2 - 18  
            doomMessage.id = 'ge'
            app.stage.addChild(doomMessage)
            doomMessageShown = true
        }
    }
    if (Eater.all.length === 0) { 
        if (Green.all.length === (numCols*numRows) && doomMessageShown === true) {
            pauseSim()
            resumeButton.disabled = true
    
            app.stage.children.find(child => child.id === 'ee').text = 'Eaters have gone extinct. As a result, Greens have dominated the tidepool unchecked.'
        } else {
            const doomMessage = new PIXI.Text('Eaters have gone extinct. As a result, Greens will dominate the tidepool unchecked.', messageStyle)
            doomMessage.x = width / 3 - ((width/3)*.30)
            doomMessage.y = height / 2 - 18
            doomMessage.id = 'ee'
            app.stage.addChild(doomMessage)
            doomMessageShown = true
        }
        app.stage.children.find(child => child.id === 'ee').renderer()
    }
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

const displayAbout = () => {
    if (guideVisible){
        guide.style.display = 'none';
        // resumeSim()
        guideVisible = false
    } else {
        guide.style.display = 'inline';
        // pauseSim()
        guideVisible = true
    }
}

const displayParams = () => {
    if (paramsVisible){
        parameterDiv.style.display = 'none';
        paramsVisible = false
    } else {
        parameterDiv.style.display = 'inline';
        paramsVisible = true
    }
}

const submitOverrideParameters = () => { //Button currently disabled, might not even be used
    console.log('Override submit clicked and default prevented')
}

const submitParamsToJson = () => {
    
}

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

    //Technically not a button but its my code my rules
    parameterOverrideForm.addEventListener('submit', (event) => {
        event.preventDefault()
        submitOverrideParameters()
    })

}

const gameLoop = () => {

    
    if (running === true){
        
        Eater.processEaters()
        
        Green.processGreens()
        

        // sweepOutGreens()
        checkForExtinction()
        updateStats()

    }
}

//Main config 
const mainConfig = () => {
    

    canvasDiv.appendChild(app.view);

    gridConfig.addEventListener('submit', function(event){
        
        event.preventDefault()
        
        Green.populateGreens(initalGreenPopInput.value)

        Eater.populateEaters(initalEaterPopInput.value)
        
        parameterDiv.style.display = 'none'
        parameterButton.disabled = true


        startSim()
        
    })

    addButtonListeners()



}

//Content loaded event
document.addEventListener('DOMContentLoaded', function(event){
    
    grid = generateGrid(gridScale)

    mainConfig()
    
})

