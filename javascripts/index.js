const height = 600
const width = 600
const gridScale = 40
const margin = 1

const lineSpacing = height/gridScale


// DOM item declarations
const canvasDiv = document.getElementById('canvas')
const initalGreenPopInput = document.getElementById('green-starting-pop')
const gridConfig = document.getElementById('gridConfig')
const configSubmitButton = document.getElementById('config-submission-button')
const pauseButton = document.getElementById('pause')
const resumeButton = document.getElementById('resume')
const resetButton = document.getElementById('reset')

let app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: 0xE2FAB5
});


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
    rectangle.drawRect(0, 0, (lineSpacing), (lineSpacing));
    rectangle.endFill();
    rectangle.x = (lineSpacing) + ((lineSpacing)*(x-1));
    rectangle.y = (lineSpacing) + ((lineSpacing)*(y-1))+margin;
    app.stage.addChild(rectangle);
}

const drawGrid = function(){
    for (let i = 0; i<gridScale; i++){
        drawLine((lineSpacing) + ((lineSpacing)*i)+1,0,lineSpacing + ((lineSpacing)*i)+1,height)
        drawLine(0,lineSpacing + (lineSpacing*i)+1,width,lineSpacing + (lineSpacing*i)+1)
    }
}

const generateGrid = function(gridScale){
    const grid = []
    for (let i = 0; i < gridScale; i++){
        grid.push([])
        for (let x = 0; x < gridScale; x++){
            grid[i].push([])
        }
    }
    return grid
}

const populateGrid = (color) => {
    let x = Math.floor(Math.random()*gridScale)
    let y = Math.floor(Math.random()*gridScale)
    drawSquare(x,y,color)
}

const populateGreens = (n) => {
    for (let i = 0; i < n; i++){
        populateGrid("93E9BE")
    }
}

const configureButtons = () => {

    gridConfig.addEventListener('submit', function(event){
        
        event.preventDefault()
        
        populateGreens(initalGreenPopInput.value)
    
        initalGreenPopInput.disabled = true
        configSubmitButton.disabled = true
    
        pauseButton.disabled = false
        resetButton.disabled = false
        
    
    })
}

document.addEventListener('DOMContentLoaded', function(event){
    
    canvasDiv.appendChild(app.view);
    
    drawGrid()
    
    grid = generateGrid(gridScale)
    
    configureButtons()


    // setInterval(populateGrid, 100)

})

