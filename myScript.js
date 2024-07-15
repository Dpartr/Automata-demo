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
            cell.textContent = null;

            // Combine x and y coordinates into a single key
            const coordinateKey = `${row},${col}`;
            cell.dataset.ck = coordinateKey;
            cell.dataset.neighborScore = 0
            map[coordinateKey] = cell.dataset.state;

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
function scoreMap() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.dataset.neighborScore = getScore(cell);
        cell.textContent = cell.dataset.neighborScore;
    });
}
function simulateAutomata() {
    scoreMap();
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        if (cell.dataset.state == 'alive') {
            const score = cell.dataset.neighborScore;
            if (score < 2 || score > 3 && cell.dataset.state == 'alive') {
                toggleCellState(cell);
            }
        } 
        else if (cell.dataset.state == 'dead'); {
            const score = cell.dataset.neighborScore;
            if (score == 3 && cell.dataset.state == 'dead') {
                toggleCellState(cell);
            }

        }
        //console.log(score);
    });
    scoreMap();
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
function generateNoise() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        if (Math.random() < 0.51) {
            toggleCellState(cell);
        }
    });
}
generateNoiseButton.addEventListener('click', generateNoise);