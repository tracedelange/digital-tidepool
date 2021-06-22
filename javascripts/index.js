const gridScale = 20
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

const eaterPerception = 3 //measure of how many blocks the eaters can scan in search of a green
const eaterScale = 1
const eaterLifespan  = 300 //measure of how many frames an eater survives before death
const eaterDeathChance = .01
const eaterReproductionRate = .05
const eaterGestationPeriod = 50
const eaterNutrientRequirement = 35


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

// let bg = new PIXI.Sprite(PIXI.loader.resources["./assets/images/sand.png"].texture);    
// bg.width = width
// bg.height = height

// app.stage.addChild(bg);

// const eaterTexture = PIXI.Texture.from('./assets/images/eater.png');

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

const drawSquare = (x,y,color) => {
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(`0x${color}`);
    rectangle.drawRect(0, 0, (lineSpacing), (lineSpacing)); //add (-margin) to each line spacing to fit gridlines
    rectangle.endFill();
    rectangle.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
    rectangle.y = (lineSpacing+margin) + ((lineSpacing)*(y-1))+margin;
    app.stage.addChild(rectangle);
}

const drawGrid = function(){
    for (let i = 0; i < numRows + 1; i++){
        drawLine(0,lineSpacing + (lineSpacing*i)+1,width,lineSpacing + (lineSpacing*i)+1)
    }
    for (let i = 0; i < numCols; i++){
        drawLine((lineSpacing) + ((lineSpacing)*i)+1,0,lineSpacing + ((lineSpacing)*i)+1,height)
    }
}

// const drawBackgroundSprite = () => {

//     let bg = new PIXI.Sprite(PIXI.loader.resources["./assets/images/sand.png"].texture);    
//     bg.width = width
//     bg.height = height
    
//     app.stage.addChild(bg);
    
// }

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

const populateGridInital = (color) => {
    let x = Math.floor(Math.random()*numCols)
    let y = Math.floor(Math.random()*numRows)

    if (grid[x][y][0] === 0){
        setGridArray(x,y,0,1)
        drawGreenSprite(x,y)
    }
}

const setGridIndex = (x,y,color,id) => {
    setGridArray(x,y,0,id)
    drawSquare(x,y,color)
}

const setGridArray = (x,y,index,value) => {
    grid[x][y][index] = value
}

const scanAreaForNewEater = (id) => {
    let pX = parseInt(id.split(',')[0])
    let pY = parseInt(id.split(',')[1])

    //Eaters were being spawned inside of greens, double assignment not allowed. Let's add a check where if there are greens, we remove them.
    for (let xx = -1; xx < 2; xx++){
        for (let yy = -1; yy < 2; yy++){

                if (grid[Math.abs(xx+pX)][Math.abs(yy+pY)][0] !== 2){
                    let cX = Math.abs(xx+pX)
                    let cY = Math.abs(yy+pY)
                    if (grid[Math.abs(xx+pX)][Math.abs(yy+pY)][0] === 1) {
                        console.log('green exists at eater child spawn, removing eater')
                        removeGreen([cX,cY].join(','))
                        return [cX, cY]
                    } else {
                        return [cX, cY]
                    }
                }
        }
    }
}



const scanAreaForGreens = (id, range) => {
    //Alternate approach: Filter through the list of greens and determine which are closest. OR Use .find to determine the first green that satisfies the callback
    
    let bx = parseInt(id.split(',')[0])
    let by = parseInt(id.split(',')[1])
    
    let targets = greens.filter(function(green){
        let gx = parseInt(green.id.split(',')[0])
        let gy = parseInt(green.id.split(',')[1])
        // console.log(green.id, id)
        // console.log(Math.abs(bx-gx), Math.abs(by-gy))
        if (Math.abs(bx-gx) < range && Math.abs(by-gy) < range){
            
            return green
        }
    })

    if (targets !== undefined) {
        return targets //[Math.floor(Math.random()*targets.length)]
    }
}

//Green Functions
const drawGreenSprite = (x,y) => {
    let green = new PIXI.Sprite(PIXI.loader.resources["./assets/images/green.png"].texture);    

    green.width = lineSpacing
    green.height = lineSpacing
    
    green.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
    green.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;

    green.id = `${x},${y}`
    
    greens.push(green)

    app.stage.addChild(green);
}

checkGreens = () => {
    let eaterIds = eaters.map(eater => eater.id)
    let vGreens = greens.filter(green => eaterIds.includes(green.id))
    vGreens.forEach(green => removeGreen(green.id))
    vGreens.forEach(green => app.stage.removeChild(green))
}


const populateGreens = (n) => {
    for (let i = 0; i < n; i++){
        populateGridInital(green)
    }
}

const reproduceGreen = (id) => {
    let x = parseInt(id.split(',')[0])
    let y = parseInt(id.split(',')[1])
    let chance = Math.random()
    if (chance < greenGrowthRate) {
        //decide which square will be turned green
        let zone = Math.random()

        if ( zone < 1 ){
            //Zone 1
            let xMod = Math.floor(Math.random() * 3)-1
            let yMod = Math.floor(Math.random() * 3)-1

            if (grid[x+xMod][y+yMod][0] === 0){
                // console.log(gridSnapShot[x+xMod][y+yMod][0])
                // setGridIndex((x+xMod),(y+yMod), green, 1)
                setGridArray(x+xMod,y+yMod,0,1)
                drawGreenSprite(x+xMod, y+yMod)
            } 
            

        // } else if ( zone > .7 && zone < .9 ){
        //     //Zone 2
        //     xMod = 


        // } else if ( zone > .9 ){
        //     //Zone 3

        }

    }
}


//
const removeGreen = (greenId) => {
    
    let green = app.stage.children.find(function(ind){
        return ind.id == greenId
    })
    let greensIndex = greens.findIndex((green) => green.id === greenId)

    let x = parseInt(greenId.split(',')[0])
    let y = parseInt(greenId.split(',')[1])

    greens.splice(greensIndex, 1)
    app.stage.removeChild(green)
    setGridArray(x,y,0,0)
}


//Eater Functions
const populateEaters = (n) => {
    for (let i = 0; i < n; i++){
        let x = Math.floor(Math.random()*numCols)
        let y = Math.floor(Math.random()*numRows)

        if (grid[x][y][0] === 0) {
            setGridArray(x,y,0,2)
            drawEater(x,y)
        }
    }
}

const calculateEaterAverageGeneration = () => {
    let total = eaters.reduce((eater) => {
        return eater.generation
    }, 0)
    return total/eaters.length
}

const drawEater = (x,y, parentGen=0) => {
    // let eater = new PIXI.Sprite(eaterTexture);

    let eater = new PIXI.Sprite(PIXI.loader.resources["./assets/images/eater.png"].texture);    

    eater.width = (lineSpacing - margin)*eaterScale
    eater.height = (lineSpacing - margin)*eaterScale
    
    eater.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
    eater.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;

    eater.generation = parentGen + 1
    eater.age = 0
    eater.nutrients = 0

    eater.id = `${x},${y}`
    
    app.stage.addChild(eater);
    eaters.push(eater)
}

const drawDeadEater = (x,y) => {
    // console.log('running draw dead eater')
    let deadEater = new PIXI.Sprite(PIXI.loader.resources["./assets/images/dead_eater.png"].texture)

    deadEater.width = (lineSpacing - margin)*eaterScale
    deadEater.height = (lineSpacing - margin)*eaterScale
    
    deadEater.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
    deadEater.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;

    deadEater.alpha = 0.5

    app.stage.addChild(deadEater)
}

const manageAge = (eater) => {
    eater.age = eater.age + 1
    // console.log(eater.age)

    if (eater.age > eaterLifespan) { //Make death saving rolls
        if (Math.random() < eaterDeathChance) {
            let eaterIndex = eaters.findIndex((entry) => entry.id === eater.id)
            // console.log(greensIndex)

            let X = parseInt(eater.id.split(',')[0])
            let Y = parseInt(eater.id.split(',')[1])

            grid[X][Y][0] = 0
            eaters.splice(eaterIndex, 1)
            app.stage.removeChild(eater)

            drawDeadEater(X,Y)

        }

    }
}


const moveEater = (eater) => {
    // console.log('tick')
    let x = parseInt(eater.id.split(',')[0])
    let y = parseInt(eater.id.split(',')[1])

    //Determine if eater has a target. If so, move the eater one space towards the target, if not, move randomly

    //If target is defined, let x and y mod direct towards target, else set x and y mod to random 
    if (eater.target !== undefined){
        //move towards target
        //calculate distance from each square to target and move to the square with the lowest distance.

        let targetX = parseInt(eater.target.split(',')[0])
        let targetY = parseInt(eater.target.split(',')[1])
        let min = [Infinity,'0,0']
        for (let xx = -1; xx < 2; xx++){
            for (let yy = -1; yy < 2; yy++) {
                // console.log(Math.hypot(targetX-(x+xx), targetY-(y+yy)))
                let dist = Math.hypot(targetX-(x+xx), targetY-(y+yy))
                if (dist < min[0]){
                    min[0] = dist
                    min[1] = String(xx) + ',' + String(yy)
                }

            }
        }
        xMod = parseInt(min[1].split(',')[0])
        yMod = parseInt(min[1].split(',')[1])
        
    } else if (eater.target === undefined){

        let xx = Math.floor(Math.random() * 2)
        if (xx === 0){
            xMod = -1
        } else {
            xMod = 1
        }
        let yy = Math.floor(Math.random() * 2)
        if (yy === 0){
            yMod = -1
        } else {
            yMod = 1
        }

    }



    //Quick test to determine if destination location is not out of upper-bounds
    if (x+xMod > grid.length -1 || y+yMod > grid[0].length-1){
        xMod = 0
        yMod = 0
    }
    //Quick test to determine if destination location is not out of lower-bounds
    if (x+xMod < 0 || y+yMod < 0){
        xMod = 0
        yMod = 0
    }
    //Test if new desination location is already occupied by an eater. 
    if (grid[x+xMod][y+yMod][0] === 2) {
        yMod = 0
        xMod = 0
    }

    //Eater remains static if gestating
    if (eater.gestation !== undefined) {
        xMod = 0
        yMod = 0
    }


    //update the eaters X and Y position and then update the ID to reflect its position
    
    eater.x = (lineSpacing+margin) + ((lineSpacing)*((x+xMod)-1));
    eater.y = (lineSpacing+margin) + ((lineSpacing)*((y+yMod)-1)) + margin;
    
    
    // console.log(eater.id)
    
    if (grid[x+xMod][y+yMod][0] === 1){
        console.log('moving into occupied green space')

        

        //if the space about to be occupied by an eater is currently occupied by a green,
        //remove the green from the canvas.
        let greenId = `${x+xMod},${y+yMod}`
        // let green = app.stage.children.find(function(ind){
        //     return ind.id == greenId
        // })
        // let greensIndex = greens.findIndex((green) => green.id === greenId)
        // // console.log(greensIndex)

        // // console.log(eater.id, ' eater')
        // // console.log(green.id, ' green')

        // greens.splice(greensIndex, 1)
        // app.stage.removeChild(green)

        removeGreen(greenId)

        //Add a point of nutrition for the eater that removed the green
        eater.nutrients = eater.nutrients+1
        
    }

    
    eater.id = `${x+xMod},${y+yMod}`
    setGridArray(x, y, 0, 0)
    setGridArray(x+xMod, y+yMod, 0, 2)

    // for (let hor = 0; hor <= eaterScale; hor++) {
    //     for (let vert = 0; vert < eaterScale; vert++) {
    //         // console.log(x+hor, y+vert)
    //         setGridArray(x+hor, y+vert, 0, 2)
    //     }
    // }

    // console.log(xMod)
    // console.log(yMod)

    if (xMod === 0 && yMod === 0){
        // console.log('new Target')
        eater.target = undefined;
    }
}

const reproduceEater = (eater) => {
    //first determine if eater is currently gestating, if not, roll for age and gestation. If it is, manage gestation period 

    // console.log('reproducing function running')
    if (eater.gestation === undefined) {
        //if eater is within the middle third of its total lifespan and has collected sufficient nutrients, roll a small chance for reproduction
        if (eater.age > (eaterLifespan*(1/3)) && eater.nutrients > eaterNutrientRequirement) {
            // console.log('able to reproduce')
            if (Math.random() < eaterReproductionRate) {
                
                //if sucessful splitting is possible, make the eater remain in the same location until gestation period reaches zero
                eater.gestation = eaterGestationPeriod
                //Remove nutrients from eater 
                eater.nutrients = eater.nutrients - eaterNutrientRequirement
            }
        }
     } else if (eater.gestation > 0) {
        // console.log(eater.gestation)
        eater.gestation = eater.gestation - 1
        eater.tint = "0x5D3FD3" 
    } else if (eater.gestation === 0) {
        //birth child and set gestation to undefined
        // console.log('child born')

        eater.tint = '0xFFFFFF'
        let childLocation = scanAreaForNewEater(eater.id)

        drawEater(childLocation[0],childLocation[1], eater.generation)

        eater.gestation = undefined
    }



}

//Given an eater sprite object, scan the area and choose a target for the eater. If no target is found, set target attribute to undefined.
const searchForPrey = (eater) => {
    
    //determine if the given eater has a target, if not, scan the area and assign the eater target a target if one is found in the area.
    //If none are found in the area, the eater will default to random movement 

    if (eater.target === undefined){
        let prey = scanAreaForGreens(eater.id, eaterPerception)
        // console.log(eater)
        // console.log(prey)

        if (prey.length !== 0){
            
            let target = prey[Math.floor(Math.random()*prey.length)]
            eater.target = target.id
            // eater.target = prey.id
            // eater.target = prey[Math.floor(Math.random()*prey.length)-1].id
            // console.log(prey)
            // console.log(eater.target)
        }
    }



    
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

    greenPop.innerText = `Green Population: ${greens.length}`
    eaterPop.innerText = `Eater Population: ${eaters.length}`
    greenEaterRatio.innerText = `Green to Eater Ratio: ${Math.round(greens.length / eaters.length)}:1`
    
    

}

const checkForExtinction = () => {
    if (greens.length === 0) {
        if (eaters.length === 0 && doomMessageShown === true) {
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
    if (eaters.length === 0) { 
        if (greens.length === (numCols*numRows) && doomMessageShown === true) {
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
        
        
        //Iterate over eater object
        eaters.forEach(function(eater){
            // console.log(eater.id[0])
            // console.log(eater.id[2])
            
            
            searchForPrey(eater);
            moveEater(eater);
            manageAge(eater)
            reproduceEater(eater)
            
        })
        
        //Iterate over each green object
        
        //ADVANTAGE - we are no longer iterating over the entire grid each step, now we are only iterating over the arrays containing the elements
        // let gridSnapShot = [...grid]
        greens.forEach(function(green){
            
            let x = green.id.split(',')[0]
            let y = green.id.split(',')[1]
            
            try { reproduceGreen(green.id) }
            catch (e) {} //console.log(e)}
            
            checkGreens()
            
        })
        
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
        
        populateGreens(initalGreenPopInput.value)

        populateEaters(initalEaterPopInput.value)



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

