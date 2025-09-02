// This file contains the main JavaScript logic for the Digital Electronics Calculator.
// It handles user interactions, manages the display of calculators, and integrates the logic gate visualizations.

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Set up event listeners and initial state
    setupEventListeners();
}

function setupEventListeners() {
    // Add event listeners for calculator buttons
    const calculatorButtons = document.querySelectorAll('.list-group-item-action');
    calculatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calculatorType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showCalculator(calculatorType);
        });
    });
}

// --- UI Switching ---
function showGuide(type) {
    switch(type) {
        case 'kmap':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Select number of variables (2-4). Click cells in the K-Map to cycle between 0, 1, and X (don't care).<br>
                The solution, truth table, and logic gate diagram update in real time.
            </div>
            <div class="legend">
                <span class="l0">0</span> = Logic 0 &nbsp;
                <span class="l1">1</span> = Logic 1 &nbsp;
                <span class="lx">X</span> = Don't Care
            </div>`;
        // ...other guides unchanged...
        case 'baseConversion':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter a number and select its base and the base to convert to.<br>
                <b>Valid:</b> 1011 (Binary), 17 (Decimal), 1F (Hex).<br>
                <b>Invalid:</b> Letters in binary, non-numeric in decimal.
            </div>`;
        case 'binaryArithmetic':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter two binary numbers (e.g., 101, 1101) and select an operation.<br>
                <b>Valid:</b> 101, 1101<br>
                <b>Invalid:</b> 12A, 2.1
            </div>`;
        case 'grayCode':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter a binary number to convert to Gray code or vice versa.<br>
                <b>Valid:</b> 1011<br>
                <b>Invalid:</b> 12A, 2.1
            </div>`;
        case 'bcd':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter a decimal number for BCD or a BCD string (groups of 4 bits) for decimal.<br>
                <b>Valid:</b> 123 (Decimal), 0001 0010 0011 (BCD)<br>
                <b>Invalid:</b> Letters, non-binary in BCD
            </div>`;
        case 'truthTable':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter a Boolean expression using variables (A, B, C...), operators (* for AND, + for OR, ' for NOT, ^ for XOR, NAND, NOR, XNOR).<br>
                <b>Valid:</b> A*B + C, AB' + C, A NAND B<br>
                <b>Invalid:</b> Numbers, missing operators, unsupported symbols
            </div>`;
        case 'booleanAlgebra':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter a Boolean expression (e.g., AB + A'B). Use * for AND, + for OR, ' for NOT.<br>
                <b>Valid:</b> AB + A'B<br>
                <b>Invalid:</b> Numbers only, unsupported symbols
            </div>`;
        case 'flipFlops':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Select flip-flop type and enter input sequence (e.g., 0110).<br>
                <b>Valid:</b> 0110<br>
                <b>Invalid:</b> Letters, non-binary
            </div>`;
        case 'counters':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter number of bits (1-16) to get max count.<br>
                <b>Valid:</b> 4<br>
                <b>Invalid:</b> 0, 17, letters
            </div>`;
        case 'registers':
            return `<div class="alert alert-info p-2 mb-2">
                <b>Guide:</b> Enter number of bits (1-64) to get max value.<br>
                <b>Valid:</b> 8<br>
                <b>Invalid:</b> 0, 65, letters
            </div>`;
    }
    return '';
}

function showCalculator(type) {
    const container = document.getElementById('calculatorContainer');
    const title = document.getElementById('calculatorTitle');
    const content = document.getElementById('calculatorContent');
    container.style.display = 'block';
    let guide = showGuide(type);
    switch(type) {
        case 'kmap':
            title.textContent = 'Karnaugh Map (K-Map) Interactive';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <label for="kmapVars" class="form-label">Number of Variables (2-4):</label>
                    <select class="form-select mb-2" id="kmapVars" onchange="renderInteractiveKMap()">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4" selected>4</option>
                    </select>
                    <div id="kmapInteractive"></div>
                    <div id="kmapRealtimeResult" class="mt-3"></div>
                    <div id="kmapTruthTable" class="mt-3"></div>
                    <div id="kmapLogicDiagram" class="mt-3"></div>
                </div>
            `;
            setTimeout(renderInteractiveKMap, 0);
            break;
        // --- other calculators unchanged ---
        case 'baseConversion':
            title.textContent = 'Base Conversion Calculator';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="text" class="form-control" id="numberInput" placeholder="Enter number" required>
                    <select class="form-select mt-2" id="fromBase">
                        <option value="2">Binary</option>
                        <option value="8">Octal</option>
                        <option value="10">Decimal</option>
                        <option value="16">Hexadecimal</option>
                    </select>
                    <select class="form-select mt-2" id="toBase">
                        <option value="2">Binary</option>
                        <option value="8">Octal</option>
                        <option value="10">Decimal</option>
                        <option value="16">Hexadecimal</option>
                    </select>
                    <button class="btn btn-primary mt-2" onclick="convertBase()">Convert</button>
                    <div id="result" class="mt-3"></div>
                    <div id="steps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'binaryArithmetic':
            title.textContent = 'Binary Arithmetic Calculator';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="text" class="form-control mb-2" id="bin1" placeholder="Enter first binary number" required>
                    <input type="text" class="form-control mb-2" id="bin2" placeholder="Enter second binary number" required>
                    <select class="form-select mb-2" id="binOp">
                        <option value="add">Addition</option>
                        <option value="sub">Subtraction</option>
                        <option value="mul">Multiplication</option>
                        <option value="div">Division</option>
                    </select>
                    <button class="btn btn-primary" onclick="binaryArithmetic()">Calculate</button>
                    <div id="binaryResult" class="mt-3"></div>
                    <div id="binarySteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'grayCode':
            title.textContent = 'Gray Code Converter';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="text" class="form-control mb-2" id="grayInput" placeholder="Enter binary number" required>
                    <button class="btn btn-primary" onclick="toGrayCode()">To Gray Code</button>
                    <button class="btn btn-secondary ms-2" onclick="fromGrayCode()">Gray to Binary</button>
                    <div id="grayResult" class="mt-3"></div>
                    <div id="graySteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'bcd':
            title.textContent = 'BCD Converter';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="text" class="form-control mb-2" id="bcdInput" placeholder="Enter decimal number" required>
                    <button class="btn btn-primary" onclick="toBCD()">To BCD</button>
                    <button class="btn btn-secondary ms-2" onclick="fromBCD()">BCD to Decimal</button>
                    <div id="bcdResult" class="mt-3"></div>
                    <div id="bcdSteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'truthTable':
            title.textContent = 'Truth Table Generator';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="text" class="form-control mb-2" id="truthExpr" placeholder="Enter Boolean Expression (e.g., A*B + C)" required>
                    <button class="btn btn-primary" onclick="generateTruthTable()">Generate</button>
                    <div id="truthResult" class="mt-3"></div>
                    <div id="truthSteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'booleanAlgebra':
            title.textContent = 'Boolean Algebra Simplifier';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="text" class="form-control mb-2" id="boolExpr" placeholder="Enter Boolean Expression (e.g., AB + A'B)" required>
                    <button class="btn btn-primary" onclick="simplifyBoolean()">Simplify</button>
                    <div id="boolResult" class="mt-3"></div>
                    <div id="boolSteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'flipFlops':
            title.textContent = 'Flip-Flop Calculator';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <select class="form-select mb-2" id="ffType">
                        <option value="SR">SR Flip-Flop</option>
                        <option value="JK">JK Flip-Flop</option>
                        <option value="D">D Flip-Flop</option>
                        <option value="T">T Flip-Flop</option>
                    </select>
                    <input type="text" class="form-control mb-2" id="ffInput" placeholder="Enter input sequence (e.g., 0110)" required>
                    <button class="btn btn-primary" onclick="calculateFlipFlop()">Calculate</button>
                    <div id="ffResult" class="mt-3"></div>
                    <div id="ffSteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'counters':
            title.textContent = 'Counter Calculator';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="number" class="form-control mb-2" id="counterBits" placeholder="Number of bits" min="1" max="16" required>
                    <button class="btn btn-primary" onclick="calculateCounter()">Calculate</button>
                    <div id="counterResult" class="mt-3"></div>
                    <div id="counterSteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
        case 'registers':
            title.textContent = 'Register Calculator';
            content.innerHTML = guide + `
                <div class="mb-3">
                    <input type="number" class="form-control mb-2" id="registerBits" placeholder="Number of bits" min="1" max="64" required>
                    <button class="btn btn-primary" onclick="calculateRegister()">Calculate</button>
                    <div id="registerResult" class="mt-3"></div>
                    <div id="registerSteps" class="mt-2 text-secondary"></div>
                </div>
            `;
            break;
    }
}

// --- K-Map State ---
let kmapState = [];

// --- Render Interactive K-Map ---
function renderInteractiveKMap() {
    const vars = parseInt(document.getElementById('kmapVars').value);
    const size = Math.pow(2, vars);

    // Gray code order for columns/rows
    function gray(n) { return n ^ (n >> 1); }
    function bin(n, w) { return n.toString(2).padStart(w, '0'); }

    // Build grid mapping
    let grid = [];
    let rowLabels = [], colLabels = [];
    if (vars === 2) {
        rowLabels = ['0','1'];
        colLabels = ['0','1'];
        grid = [[0,1],[2,3]];
    } else if (vars === 3) {
        rowLabels = ['0','1'];
        colLabels = ['00','01','11','10'];
        grid = [
            [0,1,3,2],
            [4,5,7,6]
        ];
    } else if (vars === 4) {
        rowLabels = ['00','01','11','10'];
        colLabels = ['00','01','11','10'];
        grid = [
            [0,1,3,2],
            [4,5,7,6],
            [12,13,15,14],
            [8,9,11,10]
        ];
    }

    // Initialize state if needed
    if (!kmapState[vars]) {
        kmapState[vars] = Array(size).fill(0);
    }
    let state = kmapState[vars];

    // Build table
    let html = `<table class="kmap-table"><thead><tr><th></th>`;
    colLabels.forEach(l=>html+=`<th>${l}</th>`);
    html += `</tr></thead><tbody>`;
    for(let i=0;i<grid.length;i++) {
        html += `<tr><th>${rowLabels[i]}</th>`;
        for(let j=0;j<grid[i].length;j++) {
            let idx = grid[i][j];
            let val = state[idx];
            let display = val === 2 ? 'X' : val;
            let cellClass = val === 1 ? 'active-cell' : val === 2 ? 'dontcare-cell' : 'inactive-cell';
            html += `<td class="${cellClass}" onclick="toggleKMapCell(${vars},${idx})" id="kcell-${idx}">${display}</td>`;
        }
        html += `</tr>`;
    }
    html += `</tbody></table>`;
    document.getElementById('kmapInteractive').innerHTML = html;
    updateKMapRealtime(vars);
}

// --- Toggle K-Map Cell ---
function toggleKMapCell(vars, idx) {
    // 0 -> 1 -> X (2) -> 0
    let val = kmapState[vars][idx];
    kmapState[vars][idx] = (val === 0) ? 1 : (val === 1) ? 2 : 0;
    renderInteractiveKMap();
}

// --- Update K-Map Realtime (with Steps) ---
function updateKMapRealtime(vars) {
    // 1. Get minterms and don't cares
    let minterms = [], dontcares = [];
    for (let i = 0; i < kmapState[vars].length; i++) {
        if (kmapState[vars][i] === 1) minterms.push(i);
        if (kmapState[vars][i] === 2) dontcares.push(i);
    }
    // 2. Minimal SOP
    let sop = getMinimalSOP(minterms, vars, dontcares);
    let steps = `<b>Step 1:</b> Marked minterms: ${minterms.length ? minterms.join(', ') : 'None'}<br>`;
    if (dontcares.length) steps += `<b>Step 2:</b> Don't cares: ${dontcares.join(', ')}<br>`;
    steps += `<b>Step 3:</b> Group cells in K-Map for minimization.<br>`;
    steps += `<b>Step 4:</b> Minimal SOP: <b>${sop || '0'}</b>`;
    document.getElementById('kmapRealtimeResult').innerHTML =
        `<div class="sop-expression">Minimal SOP: ${sop || '0'}</div>`;
    // Show steps
    if (document.getElementById('kmapSteps')) {
        document.getElementById('kmapSteps').innerHTML = steps;
    }
    // 3. Truth Table
    document.getElementById('kmapTruthTable').innerHTML = renderTruthTableFromKMap(vars, kmapState[vars]);
    // 4. Logic Gate Diagram
    document.getElementById('kmapLogicDiagram').innerHTML = renderLogicGateSVG(sop, vars);
}

// --- Render Truth Table from K-Map State ---
function renderTruthTableFromKMap(vars, state) {
    let html = `<table class="table table-bordered truth-table"><thead><tr>`;
    for (let i = 0; i < vars; i++) html += `<th>${String.fromCharCode(65+i)}</th>`;
    html += `<th>Output</th></tr></thead><tbody>`;
    for (let i = 0; i < state.length; i++) {
        let binStr = i.toString(2).padStart(vars, '0');
        html += `<tr>`;
        for (let j = 0; j < vars; j++) html += `<td>${binStr[j]}</td>`;
        let out = state[i] === 2 ? 'X' : state[i];
        html += `<td>${out}</td></tr>`;
    }
    html += `</tbody></table>`;
    return html;
}

// --- Quine-McCluskey Minimizer with Don't Cares ---
function getMinimalSOP(minterms, numVars, dontcares=[]) {
    if (!minterms.length) return '0';
    if (minterms.length === Math.pow(2, numVars)) return '1';
    // Group minterms and dontcares for minimization
    let all = minterms.concat(dontcares);
    // Group by number of 1s
    let groups = {};
    all.forEach(m => {
        let ones = m.toString(2).split('').filter(x=>x==='1').length;
        if (!groups[ones]) groups[ones] = [];
        groups[ones].push({bits: m.toString(2).padStart(numVars, '0'), minterms: [m], dash: 0, isDontCare: dontcares.includes(m)});
    });
    let primeImplicants = [];
    let used = {};
    let nextGroups;
    do {
        used = {};
        nextGroups = {};
        let keys = Object.keys(groups).map(Number).sort((a,b)=>a-b);
        for (let i = 0; i < keys.length-1; i++) {
            let g1 = groups[keys[i]], g2 = groups[keys[i+1]];
            for (let a of g1) for (let b of g2) {
                let diff = 0, pos = -1;
                for (let k = 0; k < numVars; k++) {
                    if (a.bits[k] !== b.bits[k]) { diff++; pos = k; }
                }
                if (diff === 1) {
                    let newBits = a.bits.split('');
                    newBits[pos] = '-';
                    let newKey = newBits.join('');
                    if (!nextGroups[keys[i]]) nextGroups[keys[i]] = [];
                    let already = nextGroups[keys[i]].find(x=>x.bits===newKey);
                    if (!already) nextGroups[keys[i]].push({
                        bits: newKey,
                        minterms: [...a.minterms, ...b.minterms].sort((x,y)=>x-y).filter((v,i,arr)=>!i||v!==arr[i-1]),
                        dash: a.dash+1,
                        isDontCare: a.isDontCare && b.isDontCare
                    });
                    used[a.bits] = true;
                    used[b.bits] = true;
                }
            }
        }
        // Add unused to prime implicants
        for (let g in groups) for (let x of groups[g]) {
            if (!used[x.bits]) primeImplicants.push(x);
        }
        groups = nextGroups;
    } while (Object.keys(groups).length);
    // Prime implicant chart (only for minterms, not don't cares)
    let chart = {};
    minterms.forEach(m => chart[m] = []);
    primeImplicants.forEach(pi => pi.minterms.forEach(m => {
        if (minterms.includes(m)) chart[m].push(pi);
    }));
    // Essential prime implicants
    let essential = [];
    let covered = {};
    for (let m in chart) {
        if (chart[m].length === 1) {
            let pi = chart[m][0];
            if (!essential.includes(pi)) essential.push(pi);
            pi.minterms.forEach(x=>covered[x]=true);
        }
    }
    // Cover remaining minterms (greedy)
    let restPis = primeImplicants.filter(pi=>!essential.includes(pi));
    while (Object.keys(covered).length < minterms.length) {
        let best = null, bestCount = 0;
        for (let pi of restPis) {
            let count = pi.minterms.filter(m=>!covered[m] && minterms.includes(m)).length;
            if (count > bestCount) { best = pi; bestCount = count; }
        }
        if (!best) break;
        essential.push(best);
        best.minterms.forEach(x=>covered[x]=true);
        restPis = restPis.filter(pi=>pi!==best);
    }
    function bitsToTerm(bits, numVars) {
        let term = '';
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '-') continue;
            term += String.fromCharCode(65+i); // A, B, C, D
            if (bits[i] === '0') term += "'";
        }
        return term || '1';
    }
    return essential.map(pi=>bitsToTerm(pi.bits, numVars)).join(' + ');
}

// --- Render Logic Gate Diagram using logic-circuit-diagram library ---
/**
 * Draws a logic gate diagram for a minimal SOP expression using D3.js.
 * Supports up to 4 variables, AND/OR/NOT gates.
 */
function renderLogicGateSVG(sop, vars) {
    if (!sop || sop === '0') return `<div class="text-danger">No output (always 0)</div>`;
    if (sop === '1') return `<div class="text-success">Output always 1</div>`;

    // Parse SOP: e.g. A'B + AB'
    let terms = sop.split(/\s*\+\s*/);
    let inputVars = [];
    for (let t of terms) {
        for (let i = 0; i < t.length; i++) {
            let v = t[i];
            if (/[A-D]/.test(v) && !inputVars.includes(v)) inputVars.push(v);
        }
    }
    inputVars.sort();

    // Prepare container
    let id = 'd3logic-' + Math.random().toString(36).substr(2, 8);
    setTimeout(() => drawLogicDiagramD3(id, terms, inputVars), 0);
    return `<div id="${id}" style="min-height:260px"></div>`;
}

// Helper: Draw the diagram using D3.js
function drawLogicDiagramD3(containerId, terms, inputVars) {
    const width = 420, height = Math.max(220, 60 + 60 * terms.length);
    d3.select(`#${containerId}`).html(""); // Clear previous

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Layout
    const inputX = 30, andX = 120, orX = 260, outputX = 370;
    const inputY = inputVars.map((v, i) => 60 + i * 40);
    const andY = terms.map((t, i) => 60 + i * 60);
    const orY = andY.length === 1 ? andY[0] : (andY[0] + andY[andY.length - 1]) / 2;

    // Draw input lines and labels
    inputVars.forEach((v, i) => {
        svg.append("line")
            .attr("x1", inputX - 20).attr("y1", inputY[i])
            .attr("x2", inputX).attr("y2", inputY[i])
            .attr("stroke", "#1976d2").attr("stroke-width", 2);
        svg.append("text")
            .attr("x", inputX - 25).attr("y", inputY[i] + 5)
            .attr("font-size", 16).text(v);
    });

    // Draw AND gates and connections
    terms.forEach((term, ti) => {
        let y = andY[ti];
        let inputs = [];
        for (let i = 0; i < inputVars.length; i++) {
            let v = inputVars[i];
            let re = new RegExp(v + "'?");
            let m = term.match(re);
            if (m) {
                let isNot = term.includes(v + "'");
                let x1 = inputX, y1 = inputY[i], x2 = andX - 30, y2 = y;
                // Input line to NOT (if needed) or AND
                svg.append("line")
                    .attr("x1", x1).attr("y1", y1)
                    .attr("x2", x2).attr("y2", y2)
                    .attr("stroke", "#888").attr("stroke-width", 1.5);
                if (isNot) {
                    // Draw NOT gate (triangle + bubble)
                    svg.append("polygon")
                        .attr("points", `${x2-10},${y2-10} ${x2},${y2} ${x2-10},${y2+10}`)
                        .attr("fill", "#fff").attr("stroke", "#333").attr("stroke-width", 1);
                    svg.append("circle")
                        .attr("cx", x2+5).attr("cy", y2).attr("r", 4)
                        .attr("fill", "#fff").attr("stroke", "#333").attr("stroke-width", 1);
                    svg.append("line")
                        .attr("x1", x2+9).attr("y1", y2)
                        .attr("x2", andX-10).attr("y2", y2)
                        .attr("stroke", "#888").attr("stroke-width", 1.5);
                } else {
                    svg.append("line")
                        .attr("x1", x2).attr("y1", y2)
                        .attr("x2", andX-10).attr("y2", y2)
                        .attr("stroke", "#888").attr("stroke-width", 1.5);
                }
                inputs.push(y2);
            }
        }
        // Draw AND gate (D shape)
        svg.append("path")
            .attr("d", `M${andX},${y-20} h30 a20,20 0 0,1 0,40 h-30 z`)
            .attr("fill", "#fff").attr("stroke", "#388e3c").attr("stroke-width", 2);
        svg.append("text")
            .attr("x", andX+15).attr("y", y+7)
            .attr("font-size", 18).attr("fill", "#388e3c").attr("text-anchor", "middle").text("AND");
        // Output line from AND to OR
        svg.append("line")
            .attr("x1", andX+40).attr("y1", y)
            .attr("x2", orX-10).attr("y2", y)
            .attr("stroke", "#333").attr("stroke-width", 2);
    });

    // Draw OR gate (curved shape)
    svg.append("path")
        .attr("d", `M${orX},${orY-30} Q${orX+30},${orY} ${orX},${orY+30} Q${orX+20},${orY} ${orX},${orY-30}`)
        .attr("fill", "#fff").attr("stroke", "#d32f2f").attr("stroke-width", 2);
    svg.append("text")
        .attr("x", orX+10).attr("y", orY+6)
        .attr("font-size", 18).attr("fill", "#d32f2f").text("OR");

    // Connect AND outputs to OR gate
    terms.forEach((term, ti) => {
        let y = andY[ti];
        svg.append("line")
            .attr("x1", orX-10).attr("y1", y)
            .attr("x2", orX).attr("y2", orY-20 + 40*ti/terms.length)
            .attr("stroke", "#888").attr("stroke-width", 1.5);
    });

    // Output line from OR gate
    svg.append("line")
        .attr("x1", orX+30).attr("y1", orY)
        .attr("x2", outputX).attr("y2", orY)
        .attr("stroke", "#1976d2").attr("stroke-width", 2);
    svg.append("text")
        .attr("x", outputX+5).attr("y", orY+5)
        .attr("font-size", 16).attr("fill", "#1976d2").text("F");
}

// --- Base Conversion with Steps ---
function convertBase() {
    const number = document.getElementById('numberInput').value;
    const fromBase = parseInt(document.getElementById('fromBase').value);
    const toBase = parseInt(document.getElementById('toBase').value);
    let steps = '';
    try {
        const decimal = parseInt(number, fromBase);
        if (isNaN(decimal)) throw new Error();
        const result = decimal.toString(toBase).toUpperCase();

        steps += `<b>Step 1:</b> Interpret "${number}" as base ${fromBase}.<br>`;
        steps += `<b>Step 2:</b> Convert to decimal: ${decimal}.<br>`;
        steps += `<b>Step 3:</b> Convert decimal ${decimal} to base ${toBase}: <b>${result}</b>.`;

        document.getElementById('result').innerHTML = `Result: ${result}`;
        document.getElementById('steps').innerHTML = steps;
    } catch(e) {
        document.getElementById('result').innerHTML = 'Invalid input';
        document.getElementById('steps').innerHTML = '';
    }
}

// --- Binary Arithmetic with Steps ---
function binaryArithmetic() {
    const bin1 = document.getElementById('bin1').value;
    const bin2 = document.getElementById('bin2').value;
    const op = document.getElementById('binOp').value;
    let n1 = parseInt(bin1, 2);
    let n2 = parseInt(bin2, 2);
    let steps = '';
    if (isNaN(n1) || isNaN(n2)) {
        document.getElementById('binaryResult').innerHTML = 'Invalid binary input';
        document.getElementById('binarySteps').innerHTML = '';
        return;
    }
    let result;
    switch(op) {
        case 'add':
            result = (n1 + n2).toString(2);
            steps = `<b>Step 1:</b> Convert ${bin1} and ${bin2} to decimal: ${n1} + ${n2}.<br>
                     <b>Step 2:</b> Add: ${n1} + ${n2} = ${n1 + n2}.<br>
                     <b>Step 3:</b> Convert ${n1 + n2} back to binary: <b>${result}</b>.`;
            break;
        case 'sub':
            result = (n1 - n2).toString(2);
            steps = `<b>Step 1:</b> Convert ${bin1} and ${bin2} to decimal: ${n1} - ${n2}.<br>
                     <b>Step 2:</b> Subtract: ${n1} - ${n2} = ${n1 - n2}.<br>
                     <b>Step 3:</b> Convert ${n1 - n2} back to binary: <b>${result}</b>.`;
            break;
        case 'mul':
            result = (n1 * n2).toString(2);
            steps = `<b>Step 1:</b> Convert ${bin1} and ${bin2} to decimal: ${n1} × ${n2}.<br>
                     <b>Step 2:</b> Multiply: ${n1} × ${n2} = ${n1 * n2}.<br>
                     <b>Step 3:</b> Convert ${n1 * n2} back to binary: <b>${result}</b>.`;
            break;
        case 'div':
            if (n2 === 0) {
                result = 'Division by zero';
                steps = '';
            } else {
                result = Math.floor(n1 / n2).toString(2);
                steps = `<b>Step 1:</b> Convert ${bin1} and ${bin2} to decimal: ${n1} ÷ ${n2}.<br>
                         <b>Step 2:</b> Divide: ${n1} ÷ ${n2} = ${Math.floor(n1 / n2)}.<br>
                         <b>Step 3:</b> Convert ${Math.floor(n1 / n2)} back to binary: <b>${result}</b>.`;
            }
            break;
    }
    document.getElementById('binaryResult').innerHTML = `Result: ${result}`;
    document.getElementById('binarySteps').innerHTML = steps;
}

// --- Gray Code with Steps ---
function toGrayCode() {
    const bin = document.getElementById('grayInput').value;
    let steps = '';
    if (!/^[01]+$/.test(bin)) {
        document.getElementById('grayResult').innerHTML = 'Invalid binary input';
        document.getElementById('graySteps').innerHTML = '';
        return;
    }
    let gray = bin[0];
    steps += `<b>Step 1:</b> The MSB is copied: ${gray}<br>`;
    for (let i = 1; i < bin.length; i++) {
        let g = (bin[i-1] ^ bin[i]);
        gray += g;
        steps += `<b>Step ${i+1}:</b> XOR bit ${i-1} (${bin[i-1]}) and bit ${i} (${bin[i]}): ${g}<br>`;
    }
    document.getElementById('grayResult').innerHTML = `Gray Code: <b>${gray}</b>`;
    document.getElementById('graySteps').innerHTML = steps;
}
function fromGrayCode() {
    const gray = document.getElementById('grayInput').value;
    let steps = '';
    if (!/^[01]+$/.test(gray)) {
        document.getElementById('grayResult').innerHTML = 'Invalid gray code input';
        document.getElementById('graySteps').innerHTML = '';
        return;
    }
    let bin = gray[0];
    steps += `<b>Step 1:</b> The MSB is copied: ${bin}<br>`;
    for (let i = 1; i < gray.length; i++) {
        let b = (bin[i-1] ^ gray[i]);
        bin += b;
        steps += `<b>Step ${i+1}:</b> XOR previous binary bit (${bin[i-1]}) and gray bit ${i} (${gray[i]}): ${b}<br>`;
    }
    document.getElementById('grayResult').innerHTML = `Binary: <b>${bin}</b>`;
    document.getElementById('graySteps').innerHTML = steps;
}

// --- BCD Conversion with Steps ---
function toBCD() {
    const dec = document.getElementById('bcdInput').value;
    let steps = '';
    if (!/^\d+$/.test(dec)) {
        document.getElementById('bcdResult').innerHTML = 'Invalid decimal input';
        document.getElementById('bcdSteps').innerHTML = '';
        return;
    }
    let bcd = '';
    for (let i = 0; i < dec.length; i++) {
        let d = dec[i];
        let b = ('0000' + parseInt(d).toString(2)).slice(-4);
        bcd += b + ' ';
        steps += `<b>Step ${i+1}:</b> Convert digit ${d} to 4-bit binary: ${b}<br>`;
    }
    document.getElementById('bcdResult').innerHTML = `BCD: <b>${bcd.trim()}</b>`;
    document.getElementById('bcdSteps').innerHTML = steps;
}
function fromBCD() {
    const bcd = document.getElementById('bcdInput').value.replace(/\s+/g, '');
    let steps = '';
    if (!/^[01]+$/.test(bcd) || bcd.length % 4 !== 0) {
        document.getElementById('bcdResult').innerHTML = 'Invalid BCD input';
        document.getElementById('bcdSteps').innerHTML = '';
        return;
    }
    let dec = '';
    for (let i = 0; i < bcd.length; i += 4) {
        let group = bcd.substr(i, 4);
        let d = parseInt(group, 2).toString();
        dec += d;
        steps += `<b>Step ${i/4+1}:</b> Convert group ${group} to decimal: ${d}<br>`;
    }
    document.getElementById('bcdResult').innerHTML = `Decimal: <b>${dec}</b>`;
    document.getElementById('bcdSteps').innerHTML = steps;
}

// --- Truth Table Generator (Corrected) ---
function generateTruthTable() {
    const expr = document.getElementById('truthExpr').value.trim();
    const vars = Array.from(new Set(expr.match(/[A-Z]/gi))).sort();
    let steps = '';
    if (!vars.length) {
        document.getElementById('truthResult').innerHTML = 'Invalid expression';
        document.getElementById('truthSteps').innerHTML = '';
        return;
    }
    let html = `<table class="table table-bordered"><thead><tr>`;
    vars.forEach(v => html += `<th>${v}</th>`);
    html += `<th>Output</th></tr></thead><tbody>`;
    const rows = Math.pow(2, vars.length);
    for (let i = 0; i < rows; i++) {
        let vals = {};
        let bin = i.toString(2).padStart(vars.length, '0');
        vars.forEach((v, idx) => vals[v] = bin[idx]);
        let out = '?';
        let evalStep = '';
        try {
            out = evalBooleanExpr(expr, vals);
            evalStep = `<b>Row ${i+1}:</b> Substitute ${JSON.stringify(vals)} into "${expr}" → <b>${out}</b><br>`;
        } catch { out = '?'; }
        let outClass = out === 1 ? 'tt-one' : out === 0 ? 'tt-zero' : '';
        html += `<tr>${vars.map(v => `<td>${vals[v]}</td>`).join('')}<td class="${outClass}">${out}</td></tr>`;
        steps += evalStep;
    }
    html += `</tbody></table>`;
    document.getElementById('truthResult').innerHTML = html;
    document.getElementById('truthSteps').innerHTML = steps;
}

// --- Boolean Algebra Simplifier (Corrected) ---
function simplifyBoolean() {
    const expr = document.getElementById('boolExpr').value.trim();
    const vars = Array.from(new Set(expr.match(/[A-Z]/gi))).sort();
    let steps = '';
    if (!vars.length || vars.length > 4) {
        document.getElementById('boolResult').innerHTML = 'Enter 1-4 variables (A-D) only';
        document.getElementById('boolSteps').innerHTML = '';
        return;
    }
    let minterms = [];
    const rows = Math.pow(2, vars.length);
    for (let i = 0; i < rows; i++) {
        let vals = {};
        let bin = i.toString(2).padStart(vars.length, '0');
        vars.forEach((v, idx) => vals[v] = bin[idx]);
        try {
            if (evalBooleanExpr(expr, vals)) {
                minterms.push(i);
                steps += `<b>Row ${i+1}:</b> ${JSON.stringify(vals)} → 1 (minterm ${i})<br>`;
            } else {
                steps += `<b>Row ${i+1}:</b> ${JSON.stringify(vals)} → 0<br>`;
            }
        } catch {}
    }
    if (!minterms.length) {
        document.getElementById('boolResult').innerHTML = 'Simplified: 0';
        document.getElementById('boolSteps').innerHTML = steps;
        return;
    }
    if (minterms.length === rows) {
        document.getElementById('boolResult').innerHTML = 'Simplified: 1';
        document.getElementById('boolSteps').innerHTML = steps;
        return;
    }
    let sop = getMinimalSOP(minterms, vars.length);
    steps += `<b>Minimal SOP:</b> <b>${sop}</b>`;
    document.getElementById('boolResult').innerHTML = `Simplified: <b>${sop}</b>`;
    document.getElementById('boolSteps').innerHTML = steps;
}

/**
 * Robust Boolean expression parser and evaluator.
 * Supports: A, B, C, D, ', *, +, ^, NAND, NOR, XNOR, parentheses.
 * vals: {A: '0'|'1', ...}
 */
function evalBooleanExpr(expr, vals) {
    // Remove spaces
    let e = expr.replace(/\s+/g, '');

    // Replace NOT (A') with !A
    e = e.replace(/([A-Za-z])'/g, '!$1');

    // Replace NAND, NOR, XNOR (case-insensitive)
    e = e.replace(/NAND/gi, ' nand ');
    e = e.replace(/NOR/gi, ' nor ');
    e = e.replace(/XNOR/gi, ' xnor ');

    // Insert explicit AND for cases like AB -> A*B
    e = e.replace(/([A-Za-z0-9\)])([A-Za-z\(])/g, '$1*$2');

    // Replace * with &&, + with ||, ^ with ^
    e = e.replace(/\*/g, '&&');
    e = e.replace(/\+/g, '||');
    e = e.replace(/\^/g, '^');

    // Replace variables with their values
    for (const v in vals) {
        e = e.replace(new RegExp(v, 'g'), vals[v]);
    }

    // Custom NAND, NOR, XNOR handling
    function customOps(str) {
        // NAND
        str = str.replace(/([01])\s*nand\s*([01])/g, (m,a,b) => (a==='1'&&b==='1')?'0':'1');
        // NOR
        str = str.replace(/([01])\s*nor\s*([01])/g, (m,a,b) => (a==='0'&&b==='0')?'1':'0');
        // XNOR
        str = str.replace(/([01])\s*xnor\s*([01])/g, (m,a,b) => (a===b)?'1':'0');
        // XOR
        str = str.replace(/([01])\s*\^\s*([01])/g, (m,a,b) => (a!==b)?'1':'0');
        // AND
        str = str.replace(/([01])\s*&&\s*([01])/g, (m,a,b) => (a==='1'&&b==='1')?'1':'0');
        // OR
        str = str.replace(/([01])\s*\|\|\s*([01])/g, (m,a,b) => (a==='1'||b==='1')?'1':'0');
        // NOT
        str = str.replace(/!([01])/g, (m,a) => (a==='1')?'0':'1');
        return str;
    }

    // Evaluate recursively until only 0 or 1 remains
    let prev = '';
    while (e !== prev) {
        prev = e;
        // Parentheses
        e = e.replace(/\(([01])\)/g, '$1');
        e = customOps(e);
    }
    if (e.trim() === '1') return 1;
    if (e.trim() === '0') return 0;
    throw new Error('Invalid expression');
}

// --- Flip-Flop Calculator Logic ---
function calculateFlipFlop() {
    const type = document.getElementById('ffType').value;
    const input = document.getElementById('ffInput').value.trim();
    let steps = '';
    if (!/^[01]+$/.test(input)) {
        document.getElementById('ffResult').innerHTML = 'Invalid input sequence';
        document.getElementById('ffSteps').innerHTML = '';
        return;
    }
    let q = 0, table = `<table class="table table-bordered"><thead><tr><th>Clk</th><th>Input</th><th>Q</th></tr></thead><tbody>`;
    for (let i = 0; i < input.length; i++) {
        let inp = input[i];
        let showInp = inp;
        let prevQ = q;
        switch(type) {
            case 'D':
                q = parseInt(inp);
                steps += `<b>Step ${i+1}:</b> D=${inp}, Q(next)=D → Q=${q}<br>`;
                break;
            case 'T':
                if (inp === '1') q = q ? 0 : 1;
                steps += `<b>Step ${i+1}:</b> T=${inp}, Q(t)=${prevQ}, Q(next)=${q}<br>`;
                break;
            case 'JK':
                // For simplicity, assume input is two bits per clock: J and K
                if (input.length < 2*(i+1)) {
                    showInp = 'Invalid';
                    q = '?';
                    steps += `<b>Step ${i+1}:</b> Not enough bits for JK input<br>`;
                    break;
                }
                let j = parseInt(input[2*i]);
                let k = parseInt(input[2*i+1]);
                showInp = `J=${j},K=${k}`;
                if (j === 0 && k === 0) ; // no change
                else if (j === 0 && k === 1) q = 0;
                else if (j === 1 && k === 0) q = 1;
                else if (j === 1 && k === 1) q = q ? 0 : 1;
                steps += `<b>Step ${i+1}:</b> J=${j}, K=${k}, Q(t)=${prevQ}, Q(next)=${q}<br>`;
                break;
            case 'SR':
                // For simplicity, assume input is two bits per clock: S and R
                if (input.length < 2*(i+1)) {
                    showInp = 'Invalid';
                    q = '?';
                    steps += `<b>Step ${i+1}:</b> Not enough bits for SR input<br>`;
                    break;
                }
                let s = parseInt(input[2*i]);
                let r = parseInt(input[2*i+1]);
                showInp = `S=${s},R=${r}`;
                if (s === 0 && r === 0) ; // no change
                else if (s === 0 && r === 1) q = 0;
                else if (s === 1 && r === 0) q = 1;
                else if (s === 1 && r === 1) q = 'Invalid';
                steps += `<b>Step ${i+1}:</b> S=${s}, R=${r}, Q(t)=${prevQ}, Q(next)=${q}<br>`;
                break;
        }
        table += `<tr><td>${i+1}</td><td>${showInp}</td><td>${q}</td></tr>`;
        // For JK and SR, increment i by 1 extra (since two bits per clock)
        if ((type === 'JK' || type === 'SR')) i++;
    }
    table += `</tbody></table>`;
    document.getElementById('ffResult').innerHTML = table;
    document.getElementById('ffSteps').innerHTML = steps;
}

// --- Counter Calculator Logic (Corrected) ---
function calculateCounter() {
    const bits = parseInt(document.getElementById('counterBits').value);
    let steps = '';
    if (isNaN(bits) || bits < 1 || bits > 16) {
        document.getElementById('counterResult').innerHTML = 'Invalid number of bits';
        document.getElementById('counterSteps').innerHTML = '';
        return;
    }
    let max = Math.pow(2, bits) - 1;
    steps = `<b>Step 1:</b> Formula for max count: 2^n - 1<br>
             <b>Step 2:</b> Substitute n=${bits}: 2^${bits} - 1 = ${max}`;
    document.getElementById('counterResult').innerHTML = `Max Count: <b>${max}</b>`;
    document.getElementById('counterSteps').innerHTML = steps;
}

// --- Register Calculator Logic (Corrected) ---
function calculateRegister() {
    const bits = parseInt(document.getElementById('registerBits').value);
    let steps = '';
    if (isNaN(bits) || bits < 1 || bits > 64) {
        document.getElementById('registerResult').innerHTML = 'Invalid number of bits';
        document.getElementById('registerSteps').innerHTML = '';
        return;
    }
    let max = Math.pow(2, bits) - 1;
    steps = `<b>Step 1:</b> Formula for max value: 2^n - 1<br>
             <b>Step 2:</b> Substitute n=${bits}: 2^${bits} - 1 = ${max}`;
    document.getElementById('registerResult').innerHTML = `Max Value: <b>${max}</b>`;
    document.getElementById('registerSteps').innerHTML = steps;
}