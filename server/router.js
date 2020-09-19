const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const path = require('path');

const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;

router.get('/youtube/:query', (req, res) => {
    const query = req.params.query;

    fetch(`https://www.googleapis.com/youtube/v3/search?&key=${YT_API_KEY}&part=snippet&q=${query}&maxResults=20&type=video`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
            res.json(json);
    });
});

router.get('*', (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname+'/..'), 'build', 'index.html'));
});

module.exports = router;