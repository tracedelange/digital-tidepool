class Eater {
    static all = [];
    constructor(id, parentGen=0){
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["./assets/images/eater.png"].texture);

        let x = parseInt(id.split(',')[0]) 
        let y = parseInt(id.split(',')[1])


        this.sprite.width = (lineSpacing - margin)*eaterScale
        this.sprite.height = (lineSpacing - margin)*eaterScale
        this.sprite.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
        this.sprite.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;
        this.generation = parentGen + 1
        this.age = 0
        this.nutrients = 0

        this.id = id

        Eater.all.push(this)

        app.stage.addChild(this.sprite)
    }

    
}


// const drawEater = (x,y, parentGen=0) => {
//     // let eater = new PIXI.Sprite(eaterTexture);

//     let eater = new PIXI.Sprite(PIXI.loader.resources["./assets/images/eater.png"].texture);    

//     eater.width = (lineSpacing - margin)*eaterScale
//     eater.height = (lineSpacing - margin)*eaterScale
    
//     eater.x = (lineSpacing+margin) + ((lineSpacing)*(x-1));
//     eater.y = (lineSpacing+margin) + ((lineSpacing)*(y-1)) + margin;

//     eater.generation = parentGen + 1
//     eater.age = 0
//     eater.nutrients = 0

//     eater.id = `${x},${y}`
    
//     app.stage.addChild(eater);
//     eaters.push(eater)
// }