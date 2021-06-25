class Hunter {
    static all = [];
    constructor(x,y, parentGen=0){
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["./assets/images/hunter.png"].texture);

        this.sprite.width = (lineSpacing - margin)
        this.sprite.height = (lineSpacing - margin)
        this.sprite.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
        this.sprite.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;
        
        this.generation = parentGen + 1
        this.age = 0
        this.nutrients = 0

        this.id = `${x},${y}`

        grid[x][y][0] = 3

        Hunter.all.push(this)

        app.stage.addChild(this.sprite)
    }

    static populateHunters = (n) => {
        for (let i = 0; i < n; i++){
            let x = Math.floor(Math.random()*numCols)
            let y = Math.floor(Math.random()*numRows)
    
            if (grid[x][y][0] === 0) {
                // setGridArray(x,y,0,2)
                new Hunter(x,y)
            }
        }
    }

    static processHunters = () => {
        Hunter.all.forEach(hunter => {
            hunter.searchForPrey()
            hunter.moveHunter()
            hunter.manageAge()
            hunter.reproduceHunter()
            calculateAverageGenHunters()
        })
    }

    moveHunter = () => {
        let x = parseInt(this.id.split(',')[0])
        let y = parseInt(this.id.split(',')[1])
        let xMod;
        let yMod;
        
        //If target is defined, let x and y mod direct towards target, else set x and y mod to random 
        if (this.target !== undefined){
            //move towards target
            //calculate distance from each square to target and move to the square with the lowest distance.
            
            let targetX = parseInt(this.target.split(',')[0])
            let targetY = parseInt(this.target.split(',')[1])
            
            
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
            
        } else if (this.target === undefined){
            //If target is undefined, set the next movement to be random
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
        // //Test if new desination location is already occupied by an eater. 
        // if (grid[x+xMod][y+yMod][0] === 2) {
        //     yMod = 0
        //     xMod = 0
        // }
        
        //Eater remains static if gestating
        if (this.gestation !== undefined) {
            xMod = 0
            yMod = 0
        }
        
        //update the eaters X and Y position and then update the ID to reflect its position
        
        this.sprite.x = (lineSpacing+margin) + ((lineSpacing)*((x+xMod)-1));
        this.sprite.y = (lineSpacing+margin) + ((lineSpacing)*((y+yMod)-1)) + margin;
        
        if (grid[x+xMod][y+yMod][0] === 1){
            // console.log('moving into occupied green space')
            
            //if the space about to be occupied by an eater is currently occupied by a green,
            //remove the green from the canvas.
            let greenId = `${x+xMod},${y+yMod}`
            
            Green.removeGreen(greenId)
            
            //Add a point of nutrition for the eater that removed the green
            // this.nutrients = this.nutrients+1
            
        } else if (grid[x+xMod][y+yMod][0] === 2) {

            let eaterId = `${x+xMod},${y+yMod}`

            let eater = Eater.all.find(ind => ind.id === eaterId)

            if (eater !== undefined) {
                eater.deleteEater()
                this.nutrients = this.nutrients + 50
            }


        }
        
        
        this.id = `${x+xMod},${y+yMod}`
        
        //set index of square currently occupied to zero
        setGridArray(x, y, 0, 0)
        
        //set the index of the square about to be occupied to 2
        setGridArray(x+xMod, y+yMod, 0, 2)
        
        //If the eater is attempting to move out of bounds or is on top of their target, change their target to undefined so they can find a new one
        if (xMod === 0 && yMod === 0){
            this.target = undefined;
        }
    }

    searchForPrey = () => {
        //determine if the given hunter has a target, if not, scan the area and assign the hunter a target if one is found in the area.
        //If none are found in the area, the hunter will default to random movement 
        if (this.target === undefined){
            let prey = scanAreaForEaters(this.id, hunterPerception)
            if (prey.length !== 0){
                let target = prey[Math.floor(Math.random()*prey.length)]
                this.target = target.id
            }
        }
    }
    manageAge = () => {
        this.age = this.age + 1
        if (this.age > hunterLifespan) { //Make death saving rolls
            if (Math.random() < hunterDeathChance) {
                this.deleteHunter()
                // this.drawDeadEater()
            }
        }
    }
    deleteHunter = () => {
        let x = parseInt(this.id.split(',')[0])
        let y = parseInt(this.id.split(',')[1])
        Hunter.all.splice(Hunter.all.indexOf(this), 1)
        app.stage.removeChild(this.sprite)
        grid[x][y][0] = 0
    }

    reproduceHunter = () => {
        // first determine if hunter is currently gestating, if not, roll for age and gestation. If it is, manage gestation period 
        if (this.gestation === undefined) {
            //if hunter is sexually mature and has collected sufficient nutrients, roll a small chance for reproduction
            if (this.age > (hunterLifespan*(1/3)) && this.nutrients > hunterNutrientRequirement) {
                // console.log('hunter capable of reproduing')
                if (Math.random() < hunterReproductionRate) {
                    //if sucessful splitting is possible, make the hunter remain in the same location until gestation period reaches zero
                    this.gestation = hunterGestationPeriod
                    //Remove nutrients from hunter 
                    this.nutrients = this.nutrients - hunterNutrientRequirement
                }
            }
        } else if (this.gestation > 0) {
            // console.log(hunter.gestation)
            this.gestation = this.gestation - 1
            this.sprite.tint = "0xDE3163" 
        } else if (this.gestation === 0) {
            //birth child and set gestation to undefined
            // console.log('child born')
            
            this.sprite.tint = '0xFFFFFF'
            let childLocation = scanAreaForNewHunter(this.id)
            
            new Hunter(childLocation[0],childLocation[1], this.generation)
            // grid[childLocation[0]][gridLocation[1]][0] = 1
            
            this.gestation = undefined
        }
    } 

}

const scanAreaForEaters = (id, range) => {
    //Alternate approach: Filter through the list of greens and determine which are closest. OR Use .find to determine the first green that satisfies the callback
    
    let bx = parseInt(id.split(',')[0])
    let by = parseInt(id.split(',')[1])
    
    let targets = Eater.all.filter(function(eater){
        let gx = parseInt(eater.id.split(',')[0])
        let gy = parseInt(eater.id.split(',')[1])
        // console.log(green.id, id)
        // console.log(Math.abs(bx-gx), Math.abs(by-gy))
        if (Math.abs(bx-gx) < range && Math.abs(by-gy) < range){
            
            return eater
        }
    })

    if (targets !== undefined) {
        return targets //[Math.floor(Math.random()*targets.length)]
    }
}

const scanAreaForNewHunter = (id) => {
    let pX = parseInt(id.split(',')[0])
    let pY = parseInt(id.split(',')[1])

    //Eaters were being spawned inside of greens, double assignment not allowed. Let's add a check where if there are greens, we remove them.
    for (let xx = -1; xx < 2; xx++){
        for (let yy = -1; yy < 2; yy++){

                if (grid[Math.abs(xx+pX)][Math.abs(yy+pY)][0] !== 3){
                    let cX = Math.abs(xx+pX)
                    let cY = Math.abs(yy+pY)
                    if (grid[Math.abs(xx+pX)][Math.abs(yy+pY)][0] === 2) {
                        console.log('Eater exists at Hunter child spawn, removing eater')
                        let eater = Eater.all.find(ind => ind.id === `${cX},${cY}`)
                        eater.deleteEater()
                        return [cX, cY]
                    } else if (grid[Math.abs(xx+pX)][Math.abs(yy+pY)][0] === 1) {
                        console.log('green exists at eater child spawn, removing eater')
                        Green.removeGreen([cX,cY].join(','))
                        return [cX, cY]
                    } else {
                        return [cX, cY]
                    }
                }
        }
    }
}

const calculateAverageGenHunters = () => {
    let sum = 0
    Hunter.all.forEach(hunter => {
    sum = hunter.generation + sum })

    let avgGen = sum/Hunter.all.length

    averageHunterGen.innerText = `Average Hunter Generation: ${(avgGen).toFixed(2)}`
}
