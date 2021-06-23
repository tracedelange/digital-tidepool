class Green {
    static all = [];
    constructor(x,y){
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["./assets/images/green.png"].texture);

        this.sprite.width = lineSpacing
        this.sprite.height = lineSpacing
        this.sprite.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
        this.sprite.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;

        this.id = `${x},${y}`

        grid[x][y][0] = 1

        Green.all.push(this)

        app.stage.addChild(this.sprite);
    }

    static populateGreens = (n) => {
        for (let i = 0; i < n; i++){
            let x = Math.floor(Math.random()*numCols)
            let y = Math.floor(Math.random()*numRows)
            if (grid[x][y][0] === 0){
                // grid[x][y][0] = 1
                new Green(x,y)
            }
        }
    }

    static removeGreen = (greenId) => {
        let green = Green.all.find(ind => ind.id === greenId)
        let x = parseInt(greenId.split(',')[0])
        let y = parseInt(greenId.split(',')[1])
        app.stage.removeChild(green.sprite)
        Green.all.splice(Green.all.indexOf(green), 1)
        setGridArray(x,y,0,0)
    }

    static processGreens = () => {
        Green.all.forEach(green => {
            try { green.reproduceGreen() }
            catch (e) {}
            checkGreens()
        })
    }

    reproduceGreen = () => {
        let x = parseInt(this.id.split(',')[0])
        let y = parseInt(this.id.split(',')[1])
        let chance = Math.random()
        if (chance < greenGrowthRate) {
            //decide which square will be turned green
            let zone = Math.random()

            if ( zone < 1 ){
                //Zone 1
                let xMod = Math.floor(Math.random() * 3)-1
                let yMod = Math.floor(Math.random() * 3)-1

                if (grid[x+xMod][y+yMod][0] === 0){

                    new Green(x+xMod, y+yMod)
                } 
            }
        }
    }
}

checkGreens = () => {
    let eaterIds = eaters.map(eater => eater.id)
    let vGreens = Green.all.filter(green => eaterIds.includes(green.id))
    vGreens.forEach(green => Green.removeGreen(green.id))
}