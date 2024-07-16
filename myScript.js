// myScript.js

// Constants
const numRows = 50; // Number of rows
const numCols = 50; // Number of columns
const grid = document.getElementById('myGrid');
const map = {};
// Create the grid
function createGrid() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.state = 'dead'; // Custom attribute to track state
            cell.dataset.x = row;
            cell.dataset.y = col;
            //cell.textContent = null;

            // Combine x and y coordinates into a single key
            const coordinateKey = `${row},${col}`;
            cell.dataset.ck = coordinateKey;
            cell.dataset.neighborScore = 0
            map[coordinateKey] = cell.dataset.state;
            //cell.textContent = cell.dataset.ck;
            grid.appendChild(cell);
        }
    }
}
// Toggle cell state (alive/dead)
function toggleCellState(cell) {
    const currentState = cell.dataset.state;
    cell.dataset.state = currentState === 'alive' ? 'dead' : 'alive';
    cell.classList.toggle('alive', currentState === 'dead');
    map[cell.dataset.ck] = cell.dataset.state;
}
function generateNoise() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        if (Math.random() < 0.21 && cell.dataset.state == 'dead') {
            toggleCellState(cell);
        }
    });
}
function boomerang() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        //console.log(cell.dataset.ck);
        if (cell.dataset.ck == '21,21' || cell.dataset.ck == '22,21' || 
            cell.dataset.ck == '22,23' || cell.dataset.ck == '23,21' ||
             cell.dataset.ck == '23,22') {
            toggleCellState(cell);
        }
    });
    scoreMap();
}
function blossom() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        //console.log(cell.dataset.ck);
        if (cell.dataset.ck == '30,24' || cell.dataset.ck == '30,26' || 
            cell.dataset.ck == '31,24' || cell.dataset.ck == '31,26' ||
             cell.dataset.ck == '32,24' || cell.dataset.ck == '32,26' ||
            cell.dataset.ck == '29,25') {
            toggleCellState(cell);
        }
    });
    scoreMap();
}
function seed() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        //console.log(cell.dataset.ck);
        if (cell.dataset.ck == '21,41' || cell.dataset.ck == '22,40' || 
            cell.dataset.ck == '22,41' || cell.dataset.ck == '23,42' ||
             cell.dataset.ck == '23,41') {
            toggleCellState(cell);
        }
    });
    scoreMap();
}

function getScore(cell) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    // Define relative offsets for neighbors
    const neighborOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0],  [1, 1]
    ];
    let neighborhoodScore = 0;

    for (const [dx, dy] of neighborOffsets) {
        const neighborX = (x + dx + numRows) % numRows;
        const neighborY = (y + dy + numCols) % numCols;

        const coordinateKey = `${neighborX},${neighborY}`;
        if (map[coordinateKey] === 'alive') {
            neighborhoodScore += 1;
        }
    }
    ////console.log(neighborhoodScore);
    return neighborhoodScore;
}
// Simulate cellular automata (randomly toggle cells)
function scoreMap() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.dataset.neighborScore = getScore(cell);
        //cell.textContent = cell.dataset.neighborScore;
    });
}
function clearMap() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        //console.log(cell.dataset.ck);
        if (cell.dataset.state == 'alive') {
            toggleCellState(cell);
        }
    });
    scoreMap();
}

function simulateAutomata() {
    scoreMap();
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        if (cell.dataset.state == 'alive') {
            const score = cell.dataset.neighborScore;
            if (cell.dataset.state== 'alive') {
                if (score != 2 && score != 3) {
                    toggleCellState(cell);
                }
            }
            else {
                ////console.log(score);
                //console.log(score != 3 && score != 2);
            }
        } 
        else if (cell.dataset.state == 'dead'); {
            const score = cell.dataset.neighborScore;
            if (score == 3 && cell.dataset.state == 'dead') {
                //console.log(cell.dataset.state);
                toggleCellState(cell);
                //console.log("the score is 3 and I'm dead so I'm aliving");
                //console.log(cell.dataset.state)
            }

        }
        ////console.log(score);

    });
    scoreMap();
}

// Initialize the grid
createGrid();

// Example: Toggle cell state when clicked
grid.addEventListener('pointerover', (event) => {
    if (event.target.classList.contains('cell')) {
        toggleCellState(event.target);
    }
});

const intervalSlider = document.getElementById('intervalSlider');
let interval = parseInt(intervalSlider.value);
////console.log(intervalSlider);
////console.log(interval);

function updateInterval() {
    clearInterval(intervalid);
    interval = parseInt(intervalSlider.value);
    intervalid = setInterval(simulateAutomata, interval);

}

intervalSlider.addEventListener('input', updateInterval);

let intervalid = setInterval(simulateAutomata, interval);



const generateNoiseButton = document.getElementById('generateNoiseButton');
generateNoiseButton.addEventListener('click', generateNoise);
const placeSeedButton = document.getElementById('placeSeedButton');
placeSeedButton.addEventListener('click', seed);
const placeBoomerangButton = document.getElementById('placeBoomerangButton');
placeBoomerangButton.addEventListener('click', boomerang);
const placeBlossomButton = document.getElementById('placeBlossomButton');
placeBlossomButton.addEventListener('click', blossom);
const clearMapButton = document.getElementById('clearMapButton');
clearMapButton.addEventListener('click', clearMap);
