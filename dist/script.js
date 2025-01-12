let mode = 'ms'; // ms or Hz
let decimals = 2; // Default decimal places
let tapTimes = []; // Stores timestamps for tap tempo calculation

// Updates the BPM value and regenerates the table
function updateBPM(value) {
    const bpm = parseFloat(value);
    if (!isNaN(bpm) && bpm > 0) {
        generateTable(bpm);
    }
}

// Generates the table based on the current BPM and mode
function generateTable(bpm) {
    const msPerBeat = 60000 / bpm;
    const noteValues = [
        { name: '1 bar (4 beats)', factor: 4 },
        { name: '1/2 note', factor: 2 },
        { name: '1/4 note', factor: 1 },
        { name: '1/8 note', factor: 0.5 },
        { name: '1/16 note', factor: 0.25 },
        { name: '1/32 note', factor: 0.125 },
        { name: '1/64 note', factor: 0.0625 },
        { name: '1/128 note', factor: 0.03125 },
        { name: '1/256 note', factor: 0.015625 }
    ];

    const table = document.getElementById('results-table');
    table.innerHTML = `
        <tr>
            <th>Note Value</th>
            <th>Dotted (${mode})</th>
            <th>Notes (${mode})</th>
            <th>Triplet (${mode})</th>
        </tr>`;

    noteValues.forEach(note => {
        const regular = mode === 'ms' ? msPerBeat * note.factor : 1000 / (msPerBeat * note.factor);
        const dotted = mode === 'ms' ? regular * 1.5 : regular / 1.5;
        const triplet = mode === 'ms' ? regular / 1.5 : regular * 1.5;

        table.innerHTML += `
            <tr>
                <td>${note.name}</td>
                <td>${dotted.toFixed(decimals)}</td>
                <td>${regular.toFixed(decimals)}</td>
                <td>${triplet.toFixed(decimals)}</td>
            </tr>`;
    });

    // Apply italics styling if mode is Hz
    table.classList.toggle('italic', mode === 'Hz');
    document.getElementById('unit-toggle').classList.toggle('italic', mode === 'Hz');
}

// Toggles between milliseconds and frequency (Hz)
function toggleMode() {
    mode = mode === 'ms' ? 'Hz' : 'ms';
    document.getElementById('unit-toggle').innerText = mode;
    generateTable(parseFloat(document.getElementById('bpm-input').value));
}

// Sets the number of decimal places for the table
function setDecimals(value) {
    decimals = value;
    document.querySelectorAll('.decimal-buttons button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.decimal-buttons button:nth-child(${value + 1})`).classList.add('active');
    generateTable(parseFloat(document.getElementById('bpm-input').value));
}

// Calculates BPM based on tap tempo
function tapTempo() {
    const now = performance.now();
    tapTimes.push(now);

    // Keep only the last 5 taps
    if (tapTimes.length > 5) {
        tapTimes.shift();
    }

    if (tapTimes.length > 1) {
        const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        const bpm = 60000 / avgInterval;
        document.getElementById('bpm-input').value = bpm.toFixed(1);
        generateTable(bpm);
    }
}

// Rounds the BPM to the nearest whole number
function roundBPM() {
    const bpmInput = document.getElementById('bpm-input');
    const roundedBPM = Math.round(parseFloat(bpmInput.value));
    bpmInput.value = roundedBPM;
    generateTable(roundedBPM);
}

// Generate default table on load
generateTable(120);