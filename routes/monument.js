const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Monument = require('../models/monument');

const monumentRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

monumentRouter.post('/populate', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const monuments = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            monuments.push(row);
        })
        .on('end', async () => {
            try {
                await Monument.deleteMany({});
                await Monument.insertMany(monuments);
                fs.unlinkSync(req.file.path);
                res.status(200).send('Monuments populated successfully.');
            } catch (error) {
                res.status(500).send('Error populating monuments: ' + error.message);
            }
        });
});

monumentRouter.get('/', async (req, res) => {
    try {
        const monuments = await Monument.find({});
        res.status(200).send(monuments);
    } catch (error) {
        res.status(500).send('Error fetching monuments: ' + error.message);
    }
});

module.exports = monumentRouter;