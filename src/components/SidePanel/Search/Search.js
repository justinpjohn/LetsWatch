import React, { useState, useEffect } from 'react';
import fetch from 'node-fetch';

import SearchResults from './SearchResults';

const SERVER_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:8080';

const Search = ({ emitVideoId, emitQueueAppend }) => {
	const [currQuery, setCurrQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleVideoCardClick = (e, result) => {
		const targetClassName = e.target.className;
		if (targetClassName === 'add-to-queue-btn') {
			emitQueueAppend(result);
		} else {
			//otherwise its a video selection
			emitVideoId(result.videoId);
		}
	};

	const handleKeyPress = (e) => {
		// check if 'Enter' key is pressed
		if (e.charCode === 13) {
			handleSubmitClick(e);
		}
	};

	const handleSubmitClick = (e) => {
		// check if query is not empty or only contains spaces
		if (currQuery.length !== 0 && /\S/.test(currQuery)) {
			searchYoutube(currQuery);
			// setCurrQuery(''); // reset query on submission
		}
	};

	const searchYoutube = (query) => {
		query = query.replace(/ /g, '+');
		const FETCH_URL = SERVER_URL.concat('/api/', `youtube/${query}`);
		console.log(FETCH_URL);

		fetch(FETCH_URL, { method: 'GET' })
			.then((response) => {
				console.log(response);
				return response.json();
			})
			.then((json) => {
				console.log(json);
				setSearchResults(json);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		// console.log('searchResults: ' + JSON.stringify(searchResults));
	}, [searchResults]);

	return (
		<div
			className="h-100 w-100 mw-100 mh-100 p-0 m-0"
			style={{
				backgroundColor: '#181818',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div className="row m-0 py-2 mh-100" id="search-container">
				<div className="col-12 px-3">
					<input
						className="w-100"
						type="text"
						placeholder="Search YouTube..."
						value={currQuery}
						onChange={(e) => setCurrQuery(e.target.value)}
						onKeyPress={handleKeyPress}
					/>
				</div>
			</div>
			<SearchResults
				results={searchResults}
				handleVideoCardClick={handleVideoCardClick}
			/>
		</div>
	);
};

export default Search;
