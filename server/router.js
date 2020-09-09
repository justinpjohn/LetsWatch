const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;

// router.get('/', (req, res) => {
//     res.send('Server is up and running');
// });

router.get('/youtube/:query', (req, res) => {
    const query = req.params.query;

    fetch(`https://www.googleapis.com/youtube/v3/search?&key=${YT_API_KEY}&part=snippet&q=${query}&maxResults=10&type=video`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
            res.json(json);
    });
});

module.exports = router;