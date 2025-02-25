// Constants
const numRows = 50; // Number of rows
const numCols = 50; // Number of columns
const grid = document.getElementById('myGrid');
const map = {};

// Theme buttons
const darkThemeBtn = document.getElementById('darkTheme');
const lightThemeBtn = document.getElementById('lightTheme');
const eyeFriendlyBtn = document.getElementById('eyeFriendly');

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
            cell.dataset.neighborScore = 0;
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

// Theme handling
function setTheme(theme) {
    // Remove all theme classes
    document.documentElement.classList.remove('light-mode', 'eye-friendly');
    
    // Add the selected theme class (if not default dark)
    if (theme !== 'dark') {
        document.documentElement.classList.add(theme === 'light' ? 'light-mode' : 'eye-friendly');
    }
    
    // Update active button states
    darkThemeBtn.classList.toggle('active', theme === 'dark');
    lightThemeBtn.classList.toggle('active', theme === 'light');
    eyeFriendlyBtn.classList.toggle('active', theme === 'eye-friendly');
    
    // Save the theme preference
    localStorage.setItem('gameOfLifeTheme', theme);
}

// Pattern generators
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
        if (cell.dataset.ck == '23,24' || cell.dataset.ck == '24,26' || 
            cell.dataset.ck == '24,24' || cell.dataset.ck == '25,25' ||
             cell.dataset.ck == '25,24') {
            toggleCellState(cell);
        }
        if (cell.dataset.ck == '17,18' || cell.dataset.ck == '18,20' || 
            cell.dataset.ck == '18,18' || cell.dataset.ck == '19,19' ||
             cell.dataset.ck == '19,18') {
            toggleCellState(cell);
        }
    });
    scoreMap();
}

function blossom() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
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
    return neighborhoodScore;
}

// Score the map for simulation
function scoreMap() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.dataset.neighborScore = getScore(cell);
    });
}

function clearMap() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        if (cell.dataset.state == 'alive') {
            toggleCellState(cell);
        }
    });
    scoreMap();
}

// Main simulation function
function simulateAutomata() {
    scoreMap();
    const cells = document.querySelectorAll('.cell');
    const cellsToToggle = [];
    
    cells.forEach((cell) => {
        const score = parseInt(cell.dataset.neighborScore);
        const state = cell.dataset.state;
        
        if (state === 'alive' && (score < 2 || score > 3)) {
            cellsToToggle.push(cell);
        } else if (state === 'dead' && score === 3) {
            cellsToToggle.push(cell);
        }
    });
    
    // Apply changes after evaluation to ensure simultaneous update
    cellsToToggle.forEach(cell => toggleCellState(cell));
}

// Initialize
function initialize() {
    // Create the grid
    createGrid();
    
    // Set up event listeners for the grid
    grid.addEventListener('pointerover', (event) => {
        if (event.buttons === 1 && event.target.classList.contains('cell')) {
            toggleCellState(event.target);
        }
    });
    
    grid.addEventListener('click', (event) => {
        if (event.target.classList.contains('cell')) {
            toggleCellState(event.target);
        }
    });
    
    // Set up theme buttons
    darkThemeBtn.addEventListener('click', () => setTheme('dark'));
    lightThemeBtn.addEventListener('click', () => setTheme('light'));
    eyeFriendlyBtn.addEventListener('click', () => setTheme('eye-friendly'));
    
    // Load saved theme preference or use system preference
    const savedTheme = localStorage.getItem('gameOfLifeTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
    
    // Set up control buttons
    document.getElementById('generateNoiseButton').addEventListener('click', generateNoise);
    document.getElementById('placeSeedButton').addEventListener('click', seed);
    document.getElementById('placeBoomerangButton').addEventListener('click', boomerang);
    document.getElementById('placeBlossomButton').addEventListener('click', blossom);
    document.getElementById('clearMapButton').addEventListener('click', clearMap);
    
    // Set up interval slider
    const intervalSlider = document.getElementById('intervalSlider');
    const minDelay = 50;  // Fastest speed (50ms between steps)
    const maxDelay = 2000; // Slowest speed (2000ms between steps)
    
    // Reverse the slider to make right = fast, left = slow
    // This works by inverting the value during calculation
    function calculateInterval(sliderValue) {
        // Invert the value: higher slider value (right side) = lower interval = faster simulation
        return maxDelay - sliderValue + minDelay;
    }
    
    let interval = calculateInterval(parseInt(intervalSlider.value));
    let intervalId = setInterval(simulateAutomata, interval);
    
    intervalSlider.addEventListener('input', function() {
        clearInterval(intervalId);
        interval = calculateInterval(parseInt(this.value));
        document.documentElement.style.setProperty('--slider-value', `${this.value / 20}%`);
        intervalId = setInterval(simulateAutomata, interval);
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);