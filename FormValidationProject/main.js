const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

let isError = false;

function cleanInputString(str) {
    const regex = /[+-\s]/g;
    str.replace(regex, "");
    return str.replace(regex, "");
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

function addEntry() {

    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);

    const existingEntriesCount = targetInputContainer.querySelectorAll('input[type="text"]').length;

    // Define the number of entries you want to add
    const entriesToAdd = 1; // Change this value to add more entries

    // Loop to add multiple entries
    for (let i = 0; i < entriesToAdd; i++) {
        // Calculate the entry number based on existing entries count
        const entryNumber = existingEntriesCount + i + 1;

        const HTMLString = `<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
            <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name" />
            <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
            <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />`;

        targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
    }
}



function calculateCalories (e) {
    e.preventDefault();
    isError = false;
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
    if ( isError ) {
        return;
    }
    const consumedCalories = 
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories + exerciseCalories + budgetCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit  = (remainingCalories < 0) ? "Surplus" : "Deficit";
    output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;
    output.classList.remove("hide");
} 

function getCaloriesFromInputs (list) {
    let calories = 0;
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null; 
        }
        calories += Number(currVal);
    }
    return calories;
}

function clearForm () {
    const inputContainers = document.querySelectorAll('.input-container');
    for (const container of inputContainers){
        container.innerHTML = "";
    }
    budgetNumberInput.value = "";
    output.innerText = "";
    output.classList.add("hide");
}

addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener("click", clearForm);