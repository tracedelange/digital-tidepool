//Canvas scale and grid height constants 
const gridScale = 20
const widthInital = (document.body.clientWidth)*.96 
const height = ((document.body.clientHeight)*.89) - (((document.body.clientHeight)*.95) % gridScale)

const margin = 1
const html = document.getElementsByTagName('html')[0]
const lineSpacing = Math.floor(height/gridScale)
const numRows = gridScale
const numCols = Math.floor((widthInital/lineSpacing))
const width = widthInital - (widthInital % numCols)

const frameRate = 1000/15


// DOM item declarations
const canvasDiv = document.getElementById('canvas')
const initalGreenPopInput = document.getElementById('green-starting-pop')
const initalEaterPopInput = document.getElementById('eater-starting-pop')
const initalHunterPopInput = document.getElementById('hunter-starting-pop')

const gridConfig = document.getElementById('gridConfig')
const configSubmitButton = document.getElementById('config-submission-button')
const pauseButton = document.getElementById('pause')
const resumeButton = document.getElementById('resume')
const resetButton = document.getElementById('reset')
const aboutButton = document.getElementById('about')
const guide = document.getElementById('guide')
const defaultParameterButton = document.getElementById('set-params-default')
const parameterDiv = document.getElementById('parameters')
const parameterButton = document.getElementById('parameter-button')
// const parameterOverrideForm = document.getElementById('parameter-override')

//Stat DOM Nodes
const timestepNode = document.getElementById('timestep')
const eaterPop = document.getElementById('eater-pop')
const greenPop = document.getElementById('green-pop')
const greenEaterRatio = document.getElementById('green-eater-ratio')
const averageGen = document.getElementById('average-eater-generation')
const hunterPop = document.getElementById('hunter-pop')
const hunterGreenRatio = document.getElementById('hunter-eater-ratio')
const averageHunterGen = document.getElementById('average-hunter-gen')

//DOM Items for Constant Declaration
const getGreenGrowthRate = () => document.getElementById('green-growth-rate').value
const getEaterPerception = () => document.getElementById('eater-perception').value //measure of how many blocks the eaters can scan in search of a green
const getEaterLifespan = () => document.getElementById('eater-lifespan').value
const getEaterDeathChance = () => document.getElementById('eater-death-rate').value
const getEaterReproductionRate = () => document.getElementById('eater-reproduction-rate').value
const getEaterGestationPeriod = () => document.getElementById('eater-gestation-period').value
const getEaterNutrientRequirement = () => document.getElementById('eater-nutrient-requirement').value

const getHunterPerception = () => document.getElementById('hunter-perception').value
const getHunterLifespan = () => document.getElementById('hunter-lifespan').value
const getHunterDeathChance = () => document.getElementById('hunter-death-rate').value
const getHunterNutrientRequirement = () => document.getElementById('hunter-nutrient-requirement').value
const getHunterGestationPeriod = () => document.getElementById('hunter-gestation-period').value
const getHunterReproductionRate = () => document.getElementById('hunter-reproduction-rate').value

// const green = "93E9BE"
const background = "E2FAB5"

//Creature constants
// const greenGrowthRate = .08

// const eaterPerception = 4 //measure of how many blocks the eaters can scan in search of a green
const eaterScale = 1
// const eaterLifespan  = 300 //measure of how many frames an eater survives before death
// const eaterDeathChance = .5
// const eaterReproductionRate = .2
// const eaterGestationPeriod = 50
// const eaterNutrientRequirement = 50

//Game loop running and final ending message displayed booleans
let running = false
doomMessageShown = false

//Guide page visibile boolean
let guideVisible = false
let paramsVisible = false

//Pixi Specific declarations
let app = new PIXI.Application({
    // width: width,
    // height: height,
    width: width, 
	height: height,
	autoResize: true,
    backgroundColor: 0xCCFFCC,
    // resizeTo: window

    resolution: window.devicePixelRatio || 1
});

// font-family:Arial;
// font-size:16px;
// font-weight:bold;
// font-style:italic;

let MessageStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: Math.round(width/60),
    fill: "white",
    stroke: 'black',
    strokeThickness: 2,
    dropShadow: true,

    fontStyle: 'italic',
    fontWeight: 'bold',
    dropShadowBlur: 4,
  });


PIXI.Loader.shared
.add("./assets/images/eater.png")
.add("./assets/images/green.png")
.add("./assets/images/dead_eater.png")
.add("./assets/images/hunter.png")
.load(function(){
      console.log('resources loaded')
  })