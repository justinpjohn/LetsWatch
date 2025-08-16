const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path');

const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;

router.get('/youtube/:query', (req, res) => {
	const query = req.params.query;

	fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${query}&key=${YT_API_KEY}`,
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return {};
		})
		.then((json) => {
			json = sanitizeYoutubeJSON(json);
			res.json(json);
		});
});

router.get('/youtube/video/:id', (req, res) => {
	const id = req.params.id;

	fetch(
		`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${YT_API_KEY}`,
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return {};
		})
		.then((json) => {
			json = sanitizeYoutubeJSON(json, true);
			res.json(json);
		});
});

router.get('/youtube/playlist/:id', (req, res) => {
	const id = req.params.id;

	// TODO: loop through paging and get full queue
	fetch(
		`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${YT_API_KEY}`,
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return {};
		})
		.then((json) => {
			json = sanitizeYoutubeJSON(json, false);
			res.json(json);
		});
});

router.get('*', (req, res) => {
	res.sendFile(
		path.join(path.resolve(__dirname + '/..'), 'build', 'index.html'),
	);
});

const sanitizeYoutubeJSON = (json, isVideoRequest) => {
	if (!json.items) {
		console.log('JSON ITEM FETCH FAILED');
		return;
	}

	let result = [];
	json = json.items;
	for (let i = 0; i < json.length; i++) {
		try {
			const item = json[i];
			const videoObj = {
				source: 'YouTube',
				videoId: isVideoRequest
					? item.id
					: item.id.videoId || item.snippet.resourceId.videoId,
				title: item.snippet.title,
				thumbnail:
					item.snippet.thumbnails.high.url ||
					item.snippet.thumbnails.default.url,
				channelTitle: item.snippet.channelTitle,
			};
			result = [...result, videoObj];
		} catch (e) {
			// probably a private video causing issue
			console.log('ERROR: ' + e);
			continue;
		}
	}
	return result;
};

module.exports = router;
