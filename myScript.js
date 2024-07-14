// myScript.js

// Constants
const numRows = 20; // Number of rows
const numCols = 20; // Number of columns
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

            // Combine x and y coordinates into a single key
            const coordinateKey = `${row},${col}`;
            cell.dataset.ck = coordinateKey;
            map[coordinateKey] = cell.dataset.state;

            grid.appendChild(cell);
        }
    }
}
//function checkNeighbors(cell) {
//    const currentLocation = 
//}
// Toggle cell state (alive/dead)
function toggleCellState(cell) {
    const currentState = cell.dataset.state;
    cell.dataset.state = currentState === 'alive' ? 'dead' : 'alive';
    cell.classList.toggle('alive', currentState === 'dead');
    map[cell.dataset.ck] = cell.dataset.state;
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
    //console.log(neighborhoodScore);
    return neighborhoodScore;
}
// Simulate cellular automata (randomly toggle cells)

function simulateAutomata() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        score = getScore(cell);
        if (cell.dataset.state == 'alive') {
            if (score < 1) {
                toggleCellState(cell);
            }
            else if (score > 3) {
                toggleCellState(cell);
            }
        }
        else if (cell.dataset.state == 'dead'); {
            if (score == 3) {
                toggleCellState(cell);
            }

        }
        //console.log(score);
    });
}

// Initialize the grid
createGrid();
generateNoise();

// Example: Toggle cell state when clicked
grid.addEventListener('pointerover', (event) => {
    if (event.target.classList.contains('cell')) {
        toggleCellState(event.target);
    }
});

const intervalSlider = document.getElementById('intervalSlider');
let interval = parseInt(intervalSlider.value);
//console.log(intervalSlider);
//console.log(interval);

function updateInterval() {
    clearInterval(intervalid);
    interval = parseInt(intervalSlider.value);
    intervalid = setInterval(simulateAutomata, interval);

}

intervalSlider.addEventListener('input', updateInterval);

let intervalid = setInterval(simulateAutomata, interval);

const generateNoiseButton = document.getElementById('generateNoiseButton');
console.log(generateNoiseButton);
function generateNoise() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        if (Math.random() < 0.35) {
            toggleCellState(cell);
        }
    });
}
generateNoiseButton.addEventListener('click', generateNoise);