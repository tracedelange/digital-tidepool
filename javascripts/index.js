const height = 600
const width = 600
const gridScale = 40

let app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: 0xE2FAB5
});


drawLine = function(startX, startY, endX, endY) {
    let line = new PIXI.Graphics();
    line.lineStyle(1, 0x663333, 1);
    line.moveTo(startX, startY);
    line.lineTo(endX, endY);
    line.x = 0;
    line.y = 0;
    line.alpha = 0.5;
    app.stage.addChild(line);
}

drawGrid = function(){
    const lineSpacing = height/gridScale
    for (let i = 0; i<gridScale; i++){
        drawLine((lineSpacing) + ((lineSpacing)*i)+1,0,lineSpacing + ((lineSpacing)*i)+1,height)
        drawLine(0,lineSpacing + (lineSpacing*i)+1,width,lineSpacing + (lineSpacing*i)+1)
    }
}

generateGrid = function(gridScale){
    const grid = []
    for (let i = 0; i < gridScale; i++){
        grid.push([])
        for (let x = 0; x < gridScale; x++){
            grid[i].push([])
        }
    }
    return grid
}

const canvasDiv = document.getElementById('canvas')

document.addEventListener('DOMContentLoaded', function(event){

    canvasDiv.appendChild(app.view);

    drawGrid()
    
    grid = generateGrid(gridScale)


})

