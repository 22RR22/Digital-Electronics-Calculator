// This file is responsible for integrating a JavaScript library to create advanced visual representations of logic gates.

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('logicDiagramCanvas');
    const context = canvas.getContext('2d');

    function drawANDGate(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 50, y);
        context.lineTo(x + 50, y + 25);
        context.quadraticCurveTo(x + 50, y + 50, x, y + 50);
        context.lineTo(x, y + 25);
        context.closePath();
        context.fillStyle = '#4a90e2';
        context.fill();
        context.stroke();
    }

    function drawORGate(x, y) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 50, y);
        context.quadraticCurveTo(x + 75, y + 25, x + 50, y + 50);
        context.lineTo(x, y + 50);
        context.closePath();
        context.fillStyle = '#f39c12';
        context.fill();
        context.stroke();
    }

    function drawNOTGate(x, y) {
        context.beginPath();
        context.moveTo(x, y + 10);
        context.lineTo(x + 30, y);
        context.lineTo(x + 30, y + 40);
        context.lineTo(x, y + 30);
        context.closePath();
        context.fillStyle = '#e74c3c';
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(x + 30, y + 20, 5, 0, Math.PI * 2);
        context.fillStyle = '#fff';
        context.fill();
        context.stroke();
    }

    function drawLogicDiagram(gateType) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        switch (gateType) {
            case 'AND':
                drawANDGate(50, 50);
                break;
            case 'OR':
                drawORGate(50, 50);
                break;
            case 'NOT':
                drawNOTGate(50, 50);
                break;
            default:
                console.error('Unknown gate type');
        }
    }

    // Example usage
    drawLogicDiagram('AND'); // Change this to 'OR' or 'NOT' to draw different gates
});