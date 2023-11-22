// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ffi = require('ffi-napi');

app.use(bodyParser.json());

// Load the shared library
const ddalineLibrary = ffi.Library('./DDAWrapper', {
    'drawDDALine': ['void', ['int', 'int', 'int', 'int', 'pointer']],
});

app.post('/drawLine', (req, res) => {
    const { x1, y1, x2, y2 } = req.body;

    // Create a buffer to hold the result
    const resultBuffer = Buffer.alloc(8 * Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)));

    // Call the DDA function
    ddalineLibrary.drawDDALine(x1, y1, x2, y2, resultBuffer);

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