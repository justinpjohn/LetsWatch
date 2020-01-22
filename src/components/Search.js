import React, {useState, useEffect} from 'react';
import fetch from 'node-fetch';

import SearchResults from './SearchResults';


const Search = ({player, emitVideoId}) => {
  
    const [currQuery, setCurrQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const handleResultClick = (videoId) => {
        // console.log(videoId);
        emitVideoId(videoId);
        // player.loadVideoById(videoId, 0);
    }
    
    const handleMessageSubmit = (e) => {
        // e.preventDefault();
        if (currQuery.length !== 0 && (/\S/).test(currQuery)) {
            searchYoutube(currQuery);
            setCurrQuery('');
        }
    }
    
    const searchYoutube = (query) => {
        query = query.replace(' ', '+');
        console.log(query);
        fetch('https://www.googleapis.com/youtube/v3/search?&key=AIzaSyBa-JzGFfw19oswz7L6WV0BwbNMBIZw5Ko&part=snippet&q='+query+'&maxResults=10&type=video')
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setSearchResults(json.items);
        });
    }
      
    useEffect(() => {
        console.log('fetching youtube search');
        console.log(searchResults);
    }, [searchResults]);

    return (
        <div className='container'>
            <div className='p-2' style={{backgroundColor:'blue'}}>
                <input type='text' value={currQuery} onChange={e => setCurrQuery(e.target.value)}/>
                <button type='submit' onClick={handleMessageSubmit}>Search</button>
                Search goes here
            </div>
            <SearchResults results={searchResults} handleResultClick={handleResultClick}/>
        </div>
    );
}


export default Search;