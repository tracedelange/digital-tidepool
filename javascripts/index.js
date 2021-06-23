const gridScale = 30
let width = (document.body.clientWidth)*.96 
const height = ((document.body.clientHeight)*.95) - (((document.body.clientHeight)*.95) % gridScale)
// const width = (window.screen.width)*.95
// const height = (window.screen.height)*.8
const margin = 1
const html = document.getElementsByTagName('html')[0]
const lineSpacing = Math.floor(height/gridScale)

const numRows = gridScale
const numCols = Math.floor((width/lineSpacing))

width = width - (width % numCols)

const frameRate = 1000/15

//1980x1080 most common screen size apparently 

const green = "93E9BE"
const background = "E2FAB5"

//Creature constants
const greenGrowthRate = .08

const eaterPerception = 4 //measure of how many blocks the eaters can scan in search of a green
const eaterScale = 1
const eaterLifespan  = 300 //measure of how many frames an eater survives before death
const eaterDeathChance = .5
const eaterReproductionRate = .2
const eaterGestationPeriod = 50
const eaterNutrientRequirement = 50


// DOM item declarations
const canvasDiv = document.getElementById('canvas')
const initalGreenPopInput = document.getElementById('green-starting-pop')
const initalEaterPopInput = document.getElementById('eater-starting-pop')

const gridConfig = document.getElementById('gridConfig')
const configSubmitButton = document.getElementById('config-submission-button')
const pauseButton = document.getElementById('pause')
const resumeButton = document.getElementById('resume')
const resetButton = document.getElementById('reset')
const aboutButton = document.getElementById('about')
const guide = document.getElementById('guide')

const greenPop = document.getElementById('green-pop')
const eaterPop = document.getElementById('eater-pop')
const greenEaterRatio = document.getElementById('green-eater-ratio')
const averageGen = document.getElementById('average-eater-generation')




//These can be replaced by class objects 
const eaters = [];
const greens = [];
const messages = [];

//Simulation running bool
let running = false

doomMessageShown = false

//Guide page visible bool
let guideVisible = false

//Pixi Specific declarations
let app = new PIXI.Application({
    // width: width,
    // height: height,
    width: width, 
	height: height,
	autoResize: true,
    backgroundColor: 0xE2FAB5,
    // resizeTo: window

    resolution: window.devicePixelRatio || 1
});

let messageStyle = new PIXI.TextStyle({
    fontFamily: "Times New Roman",
    fontSize: Math.round(width/50),
    fill: "white",
    stroke: 'black',
    strokeThickness: 2,
    dropShadow: true,
    // dropShadowColor: "#000000",
    dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
  });

PIXI.Loader.shared
.add("./assets/images/eater.png")
.add("./assets/images/green.png")
.add("./assets/images/dead_eater.png")
.load(function(){
      console.log('resources loaded')
  })

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

const addButtonListeners = () => {
    pauseButton.addEventListener('click', function(){
        pauseSim()
    })
    resumeButton.addEventListener('click', function(){
        resumeSim()
    })
    resetButton.addEventListener('click', function (){
        resetSim()
    })
    aboutButton.addEventListener('click', function(){
        displayAbout()
    } )
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
        



        startSim()
        
    })

    addButtonListeners()



}

//Content loaded event
document.addEventListener('DOMContentLoaded', function(event){
    
    grid = generateGrid(gridScale)
    
    // drawGrid()
    // drawBackgroundSprite()
    
    mainConfig()
    

})

