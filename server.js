// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ffi = require('ffi-napi');

app.use(bodyParser.json());

function drawDDALine(x1, y1, x2, y2, resultBuffer) {
    resultBuffer.length = 0;

    let dx = x2 - x1;
    let dy = y2 - y1;

    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xIncrement = dx / steps;
    let yIncrement = dy / steps;

    let x = x1,
        y = y1;

    // Store the coordinates in the buffer
    for (let k = 0; k < steps; k++) {
        resultBuffer.writeInt32LE(Math.round(x), k * 8);
        resultBuffer.writeInt32LE(Math.round(y), k * 8 + 4);
        x += xIncrement;
        y += yIncrement;
    }
}

function drawBresenhamLine(x1, y1, x2, y2, resultBuffer) {
    resultBuffer.length = 0;

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;

    let err = dx - dy;

    // Store the initial coordinates
    resultBuffer.writeInt32LE(x1, 0);
    resultBuffer.writeInt32LE(y1, 4);

    let offset = 8;

    while (x1 !== x2 || y1 !== y2) {
        if (offset + 8 > resultBuffer.length) {
            // Resize the buffer if it's not large enough
            const newBuffer = Buffer.alloc(resultBuffer.length * 2);
            resultBuffer.copy(newBuffer);
            resultBuffer = newBuffer;
        }

        let err2 = 2 * err;

        if (err2 > -dy) {
            err -= dy;
            x1 += sx;
        }

        if (err2 < dx) {
            err += dx;
            y1 += sy;
        }

        // Store the coordinates in the buffer
        resultBuffer.writeInt32LE(x1, offset);
        resultBuffer.writeInt32LE(y1, offset + 4);
        offset += 8;
    }
}


app.post('/DDA', (req, res) => {
    const { x1, y1, x2, y2 } = req.body;

    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Create a buffer to hold the result
    const resultBuffer = Buffer.alloc(8 * Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))));


    // Call the DDA function
    drawDDALine(x1, y1, x2, y2, resultBuffer);

    // Read the result from the buffer
    const result = [];
    for (let i = 0; i < resultBuffer.length; i += 8) {
        result.push({
            x: resultBuffer.readInt32LE(i),
            y: resultBuffer.readInt32LE(i + 4),
        });
    }

    res.json({ coordinates: result });
});


app.post('/bresenham', (req, res) => {
    const { x1, y1, x2, y2 } = req.body;

    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Create a buffer to hold the result
    const resultBuffer = Buffer.alloc(8 * Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))));

    // Call the Bresenham function
    drawBresenhamLine(x1, y1, x2, y2, resultBuffer);
    const result = [];
    for (let i = 0; i < resultBuffer.length; i += 8) {
        result.push({
            x: resultBuffer.readInt32LE(i),
            y: resultBuffer.readInt32LE(i + 4),
        });
    }

    res.json({ coordinates: result });

});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});