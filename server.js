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

app.post('/drawLine', (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});