const width = (window.innerWidth)/3
const height = width
const gridScale = 20
const margin = 1

const lineSpacing = Math.floor(height/gridScale)

const frameRate = 1000/2

const green = "93E9BE"
const background = "E2FAB5"

//Creature constants
const greenGrowthRate = .2
const eaterPerception = 10 //measure of how many blocks the eaters can scan in search of a green

// DOM item declarations
const canvasDiv = document.getElementById('canvas')
const initalGreenPopInput = document.getElementById('green-starting-pop')
const initalEaterPopInput = document.getElementById('eater-starting-pop')

const gridConfig = document.getElementById('gridConfig')
const configSubmitButton = document.getElementById('config-submission-button')
const pauseButton = document.getElementById('pause')
const resumeButton = document.getElementById('resume')
const resetButton = document.getElementById('reset')




const eaters = [];
const greens = [];

//Simulation running bool
let running = false

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

// const eaterTexture = PIXI.Texture.from('./assets/images/eater.png');

PIXI.Loader.shared
.add("./assets/images/eater.png")
.add("./assets/images/green.png")
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
    for (let i = 0; i<gridScale; i++){
        drawLine((lineSpacing) + ((lineSpacing)*i)+1,0,lineSpacing + ((lineSpacing)*i)+1,height)
        drawLine(0,lineSpacing + (lineSpacing*i)+1,width,lineSpacing + (lineSpacing*i)+1)
    }
}

//Grid manipulation
const generateGrid = function(gridScale){
    const grid = []
    for (let i = 0; i < gridScale; i++){
        grid.push([])
        for (let x = 0; x < gridScale; x++){
            grid[i].push([0])
        }
    }
    return grid
}

const populateGridInital = (color) => {
    let x = Math.floor(Math.random()*gridScale)
    let y = Math.floor(Math.random()*gridScale)
    setGridArray(x,y,0,1)
    drawGreenSprite(x,y)
    // drawSquare(x,y,color)
}

const setGridIndex = (x,y,color,id) => {
    setGridArray(x,y,0,id)
    drawSquare(x,y,color)
}

const setGridArray = (x,y,index,value) => {
    grid[x][y][index] = value
}

const scanArea = (id, range, target) => {
    //Alternate approach: Filter through the list of greens and determine which are closest. OR Use .find to determine the first green that satisfies the callback
    
    let bx = parseInt(id.split(',')[0])
    let by = parseInt(id.split(',')[1])
    
    return greens.find(function(green){
        let gx = parseInt(green.id.split(',')[0])
        let gy = parseInt(green.id.split(',')[1])
        // console.log(green.id, id)
        // console.log(Math.abs(bx-gx), Math.abs(by-gy))
        if (Math.abs(bx-gx) < range && Math.abs(by-gy) < range){
           return gx,gy
        }

        // console.log(green.id[0])
        // // console.log(id)
    })
    

    // //loop over the grid in the range of perception

    // let targetsInArea = []
    // for (let xp = -range; xp < range+1; xp++){
    //     for (yp = -range; yp < range+1; yp++){
    //         // console.log(`scanning square ${x+xp}, ${y+yp}`)
    //         try { if (grid[x+xp][y+yp][0] == target){
    //             targetsInArea.push([x+xp, y+yp])

    //         }}
    //         catch (e) { }
            
    //     }
    // }
    // console.log(targetsInArea)
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

const populateGreens = (n) => {
    for (let i = 0; i < n; i++){
        populateGridInital(green)
    }
}

const reproduceGreen = (x,y, id) => {
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


//Eater Functions
const populateEaters = (n) => {
    for (let i = 0; i < n; i++){
        let x = Math.floor(Math.random()*gridScale)
        let y = Math.floor(Math.random()*gridScale)
        setGridArray(x,y,0,2)
        drawEater(x,y)
    }
}

const drawEater = (x,y) => {
    // let eater = new PIXI.Sprite(eaterTexture);

    let eater = new PIXI.Sprite(PIXI.loader.resources["./assets/images/eater.png"].texture);    

    eater.width = lineSpacing - margin
    eater.height = lineSpacing - margin
    
    eater.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
    eater.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;

    eater.id = `${x},${y}`
    
    app.stage.addChild(eater);
    eaters.push(eater)
}

const moveEater = (eater) => {
    // console.log('tick')
    let x = parseInt(eater.id.split(',')[0])
    let y = parseInt(eater.id.split(',')[1])

    //Determine if eater has a target. If so, move the eater one space towards the target, if not, move randomly

    //If target is defined, let x and y mod direct towards target, else set x and y mod to random 
    if (eater.target !== undefined){
        //move towards target

        // console.log(parseInt(eater.target.split(',')[0]))
        // let dis = Math.hypot(parseInt(eater.target.split(',')[0])-x, parseInt(eater.target.split(',')[1])-y)
        // console.log(dis)

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
    if (x+xMod > grid.length -1 || y+yMod > grid.length-1){
        xMod = 0
        yMod = 0
    }
    //Quick test to determine if destination location is not out of lower-bounds
    if (x+xMod < 0 || y+yMod < 0){
        xMod = 0
        yMod = 0
    }

    //update the eaters X and Y position and then update the ID to reflect its position
    
    eater.x = (lineSpacing+margin) + ((lineSpacing)*((x+xMod)-1));
    eater.y = (lineSpacing+margin) + ((lineSpacing)*((y+yMod)-1)) + margin;
    
    
    // console.log(eater.id)
    
    if (grid[x+xMod][y+yMod][0] === 1){
        // console.log('moving into occupied green space')
        //if the space about to be occupied by an eater is currently occupied by a green,
        //remove the green from the canvas.
        let greenId = `${x+xMod},${y+yMod}`
        let green = app.stage.children.find(function(ind){
            return ind.id == greenId
        })
        let greensIndex = greens.findIndex((green) => green.id === greenId)
        // console.log(greensIndex)
        greens.splice(greensIndex, 1)
        app.stage.removeChild(green)
        
    }

    
    eater.id = `${x+xMod},${y+yMod}`
    setGridArray(x, y, 0, 0)
    setGridArray(x+xMod, y+yMod, 0, 2)

    // console.log(xMod)
    // console.log(yMod)

    if (xMod === 0 && yMod === 0){

        eater.target = undefined;
    }

    // console.log(typeof(eater.id), typeof(eater.target))

    // if (eater.id === eater.target){
    //     eater.target = undefined
    // }
    
    // console.log(`eater at ${eater.id} moved from ${x,y} to ${x+xMod, y+yMod}`)
    // console.log(`grid values at start point: ${grid[x][y][0]}`)
    // console.log(`grid values at ending point: ${grid[x+xMod][y+yMod]}`)
}

//Given an eater sprite object, scan the area and choose a target for the eater. If no target is found, set target attribute to = ''.
const searchForPrey = (eater) => {
    
    //determine if the given eater has a target, if not, scan the area and assign the eater target a target if one is found in the area.
    //If none are found in the area, the eater will default to random movement 

    if (eater.target === undefined){
        let prey = scanArea(eater.id, eaterPerception, 1)
        // console.log(prey.id)
        if (prey !== undefined){
            eater.target = prey.id
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


const gameLoop = () => {
    
    if (running === true){
        
        
        //Iterate over eater object
        eaters.forEach(function(eater){
            // console.log(eater.id[0])
            // console.log(eater.id[2])
            
            
            searchForPrey(eater);
            moveEater(eater);
            
        })
        
        //Iterate over each green object

        //ADVANTAGE - we are no longer iterating over the entire grid each step, now we are only iterating over the arrays containing the elements
        let gridSnapShot = [...grid]
        greens.forEach(function(green){

            let x = green.id.split(',')[0]
            let y = green.id.split(',')[1]

            try { reproduceGreen(parseInt(x), parseInt(y), `${x},${y}`) }
            catch (e) {}//console.log(e)}

        })


        // for (let x = 0; x < grid.length; x++){
        //     for (let y = 0; y < grid.length; y++){
        //         //carry out functions if given square is green
        //         if (gridSnapShot[x][y][0] == 1){
        //             try { reproduceGreen(x,y, gridSnapShot) }
        //             catch (e) {}
        //         }
        //     }
        // }
        
        
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
    
    mainConfig()
    

})

