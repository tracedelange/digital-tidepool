//Write a function that takes the current parameters, serializes them and passes them as a string to the document as a cookie.
const bakeParameters = () => {

    let paramData = {
        "initalGreenPopulation": initalGreenPopInput.value,
        "initalEaterPopulation": initalEaterPopInput.value,
        "initalHunterPopulation": initalHunterPopInput.value,
        
        'greenGrowthRate' : document.getElementById('green-growth-rate').value,

        'eaterPerception' : document.getElementById('eater-perception').value,
        'eaterLifespan' : document.getElementById('eater-lifespan').value,
        'eaterDeathChance' : document.getElementById('eater-death-rate').value,
        'eaterReproductionRate' : document.getElementById('eater-reproduction-rate').value,
        'eaterGestationPeriod' : document.getElementById('eater-gestation-period').value,
        'eaterNutrientRequirement' : document.getElementById('eater-nutrient-requirement').value,

        "hunterPerception" : document.getElementById('hunter-perception').value,
        "hunterLifespan" : document.getElementById('hunter-lifespan').value,
        "hunterDeathChance" : document.getElementById('hunter-death-rate').value,
        "hunterNutrientRequirement" : document.getElementById('hunter-nutrient-requirement').value,
        "hunterGestationPeriod" : document.getElementById('hunter-gestation-period').value,
        "hunterReproductionRate" : document.getElementById('hunter-reproduction-rate').value


    }

    document.cookie = `parameters=${JSON.stringify(paramData)}`
}

const populateParametersFromCookies = () => {
    let cookie = document.cookie;
    let parameters = cookie.split('; ').find(entry => {
        return entry.split('=')[0] === 'parameters'
        })

    if (cookie !== '' && parameters !== 'parameters=') {


        
        let data = JSON.parse(parameters.split('=')[1])

        initalGreenPopInput.value = data['initalGreenPopulation'],
        initalEaterPopInput.value = data['initalEaterPopulation'],
        initalHunterPopInput.value = data['initalHunterPopulation']

        document.getElementById('green-growth-rate').value = data['greenGrowthRate']
        document.getElementById('eater-perception').value = data['eaterPerception']
        document.getElementById('eater-lifespan').value = data['eaterLifespan']
        document.getElementById('eater-death-rate').value = data['eaterDeathChance']
        document.getElementById('eater-reproduction-rate').value = data['eaterReproductionRate']
        document.getElementById('eater-gestation-period').value = data['eaterGestationPeriod']
        document.getElementById('eater-nutrient-requirement').value = data['eaterNutrientRequirement']

        document.getElementById('hunter-perception').value = data['hunterPerception']
        document.getElementById('hunter-lifespan').value = data['hunterLifespan']
        document.getElementById('hunter-death-rate').value = data['hunterDeathChance']
        document.getElementById('hunter-nutrient-requirement').value = data['hunterNutrientRequirement']
        document.getElementById('hunter-gestation-period').value = data['hunterGestationPeriod']
        document.getElementById('hunter-reproduction-rate').value = data['hunterReproductionRate']
    }
}


