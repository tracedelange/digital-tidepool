const height = 600
const width = 600
const gridScale = 40
const margin = 1

const lineSpacing = height/gridScale

const frameRate = 1000/3

const green = "93E9BE"

const greenGrowthRate = .5

// DOM item declarations
const canvasDiv = document.getElementById('canvas')
const initalGreenPopInput = document.getElementById('green-starting-pop')
const gridConfig = document.getElementById('gridConfig')
const configSubmitButton = document.getElementById('config-submission-button')
const pauseButton = document.getElementById('pause')
const resumeButton = document.getElementById('resume')
const resetButton = document.getElementById('reset')

//Simulation running bool
let running = false

//Generate grid

let app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: 0xE2FAB5,
    resolution: window.devicePixelRatio || 1
});

// PIXI.loader
//   .add("/assets/images/eater.png")
//   .load(function(){
//       console.log('sprites loaded')
//   });

const eaterTexture = PIXI.Texture.fromURL('assets/images/eater.png');


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
    rectangle.drawRect(0, 0, (lineSpacing-margin), (lineSpacing-margin));
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

const drawEater = () => {
    let eater = new PIXI.Sprite(eaterTexture);
}



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
    drawSquare(x,y,color)
}

const setGridIndex = (x,y,color) => {
    setGridArray(x,y,0,1)
    drawSquare(x,y,color)
}

const setGridArray = (x,y,index,value) => {
    grid[x][y][index] = value
}

const populateGreens = (n) => {
    for (let i = 0; i < n; i++){
        populateGridInital(green)
    }
}

const mainConfig = () => {
    
    gridConfig.addEventListener('submit', function(event){
        


        event.preventDefault()
        
        populateGreens(initalGreenPopInput.value)

        
        
        startSim()
        
    })

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


//Sim loop functions
const startSim = () => {

    running = true
    
    //adjust buttons
    initalGreenPopInput.disabled = true
    configSubmitButton.disabled = true
    pauseButton.disabled = false

    //start sim loop

    
    setInterval(gameLoop, frameRate)
    

    // gameLoop()
}

//green reproduction functions
const reproduceGreen = (x,y) => {
    let chance = Math.random()
    if (chance < greenGrowthRate) {
        //decide which square will be turned green
        let zone = Math.random()

        if ( zone < 1 ){
            //Zone 1
            let xMod = Math.floor(Math.random() * 3)-1
            let yMod = Math.floor(Math.random() * 3)-1
            
            setGridIndex((x+xMod),(y+yMod), green)

        // } else if ( zone > .7 && zone < .9 ){
        //     //Zone 2
        //     xMod = 


        // } else if ( zone > .9 ){
        //     //Zone 3

        }

    }
}

const gameLoop = () => {

    if (running === true){
        for (let x = 0; x < grid.length; x++){
            for (let y = 0; y < grid.length; y++){
                if (grid[x][y][0] == 1){
                    
                    

                    try { reproduceGreen(x,y) }
                    catch (e) {}
                }
            }
        }
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

    // running = false

    // pauseButton.disabled = true
    // resumeButton.disabled = true
    // resetButton.disabled = true

    // initalGreenPopInput.disabled = false
    // configSubmitButton.disabled = false

}

const grid = generateGrid(gridScale)

document.addEventListener('DOMContentLoaded', function(event){
    
    canvasDiv.appendChild(app.view);
    
    drawGrid()
    
    
    mainConfig()
    
    drawEater()
    // setInterval(populateGrid, 100)

})

