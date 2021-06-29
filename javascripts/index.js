



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

const resetDefaultParameters = () => { 
    populateParametersFromJson('DefaultParameters')
    

    // document.cookie = 'parameters='
    // location.reload()
}




//Content loaded event + MAIN CONFIG
document.addEventListener('DOMContentLoaded', function(event){
    
    grid = generateGrid(gridScale)

    mainConfig()
    
})

