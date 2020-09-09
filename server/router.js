const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const YT_API_KEY = 'AIzaSyBa-JzGFfw19oswz7L6WV0BwbNMBIZw5Ko'

router.get('/', (req, res) => {
    // console.log('hello from server');
    res.send('Server is up and running');
});

router.get('/youtube/:query', (req, res) => {
    const query = req.params.query;
    console.log('received request on server ' + query);
    
    // res.send('hello');
    fetch(`https://www.googleapis.com/youtube/v3/search?&key=${YT_API_KEY}&part=snippet&q=${query}&maxResults=10&type=video`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
            res.json(json);
    });
});

module.exports = router;