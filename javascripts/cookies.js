//Write a function that takes the current parameters, serializes them and passes them as a string to the document as a cookie.
const bakeParameters = () => {

    let paramData = {
        "initalGreenPopulation": initalGreenPopInput.value,
        "initalEaterPopulation": initalEaterPopInput.value,
        'greenGrowthRate' : document.getElementById('green-growth-rate').value,
        'eaterPerception' : document.getElementById('eater-perception').value,
        'eaterLifespan' : document.getElementById('eater-lifespan').value,
        'eaterDeathChance' : document.getElementById('eater-death-rate').value,
        'eaterReproductionRate' : document.getElementById('eater-reproduction-rate').value,
        'eaterGestationPeriod' : document.getElementById('eater-gestation-period').value,
        'eaterNutrientRequirement' : document.getElementById('eater-nutrient-requirement').value
    }

    document.cookie = `parameters=${JSON.stringify(paramData)}`
}

const populateParametersFromCookies = () => {
    let cookie = document.cookie;

    if (cookie !== undefined) {

        let data = JSON.parse(cookie.split('=')[1])

        initalGreenPopInput.value = data['initalGreenPopulation'],
        initalEaterPopInput.value = data['initalEaterPopulation'],
        document.getElementById('green-growth-rate').value = data['greenGrowthRate']
        document.getElementById('eater-perception').value = data['eaterPerception']
        document.getElementById('eater-lifespan').value = data['eaterLifespan']
        document.getElementById('eater-death-rate').value = data['eaterDeathChance']
        document.getElementById('eater-reproduction-rate').value = data['eaterReproductionRate']
        document.getElementById('eater-gestation-period').value = data['eaterGestationPeriod']
        document.getElementById('eater-nutrient-requirement').value = data['eaterNutrientRequirement']
    }
}


// "initalGreenPopulation": "50",
//     "initalEaterPopulation": "5",
//     "greenGrowthRate": "0.03",
//     "eaterPerception": "4",
//     "eaterLifespan": "300",
//     "eaterDeathChance": "0.5",
//     "eaterReproductionRate": "0.2",
//     "eaterGestationPeriod": "50",
//     "eaterNutrientRequirement": "50"