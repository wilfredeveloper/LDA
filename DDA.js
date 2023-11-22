// ddaline.js

function drawDDALine(x1, y1, x2, y2, result) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xIncrement = dx / steps;
    let yIncrement = dy / steps;

    let x = x1,
        y = y1;

    // Store the coordinates in the result array
    for (let k = 0; k < steps; k++) {
        result.push([Math.round(x), Math.round(y)]);
        x += xIncrement;
        y += yIncrement;
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.length !== 4) {
        console.error("Usage: node DDA.js x1 y1 x2 y2");
        process.exit(1);
    }

    const x1 = parseInt(args[0]);
    const y1 = parseInt(args[1]);
    const x2 = parseInt(args[2]);
    const y2 = parseInt(args[3]);

    const result = [];
    drawDDALine(x1, y1, x2, y2, result);

    // Output the coords to an external file in a format readable by matplotlib
    const fs = require('fs');
    const outputFile = fs.createWriteStream('output/DDA_coordinates.txt');
    result.forEach(coord => {
        outputFile.write(`${coord[0]} ${coord[1]}\n`);
    });
    outputFile.close();

    process.exit(0);
}

main();