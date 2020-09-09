import React, {useState, useEffect} from 'react';
import fetch from 'node-fetch';

import SearchResults from './SearchResults';

// const SERVER_URL = 'https://9e057b5691a24d17a179648c6553f432.vfs.cloud9.us-east-1.amazonaws.com';
// const SERVER_PORT = '8080';

const SERVER_URL = 'https://letswatch9897.herokuapp.com';
const SERVER_PORT = process.env.PORT || 8080;
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);


const Search = ({emitVideoId}) => {
  
    const [ currQuery, setCurrQuery ] = useState('');
    const [ searchResults, setSearchResults ] = useState([]);
    
    const handleResultClick = (videoId) => {
        emitVideoId(videoId);
    }
    
    const handleKeyPress = (e) => {
        // check if 'Enter' key is pressed
        if (e.charCode === 13){
            handleSubmitClick(e);
        } 
    }
    
    const handleSubmitClick = (e) => {
        // e.preventDefault();
        // check if query is not empty or only contains spaces
        if (currQuery.length !== 0 && (/\S/).test(currQuery)) {
            searchYoutube(currQuery);
            // setCurrQuery(''); // reset query on submission
        }
    }
    
    const searchYoutube = (query) => {
        query = query.replace(/ /g, '+');
        console.log(query);
                
        const URL = SERVER_ENDPOINT.concat('/', `youtube/query=${query}`);
        console.log(URL);
        
        fetch(URL, { method: 'GET' })
            .then((response) => {
                console.log('received response from server');
                console.log(response)
              return response.json();
            })
            .then((json) => {
                console.log('received json from server');
                console.log(json);
                setSearchResults(json.items);
            })
            .catch((error) => {
                console.log(error);
            });
    }
      
    useEffect(() => {
        // console.log('fetching youtube search');
        // console.log(searchResults);
    }, [searchResults]);

    return (
        <div className='container'>
            <div className='row justify-content-center m-auto py-2' id='search-container'>
                <div className='col-11 px-0'>
                    <input type='text' placeholder="Search youtube..." value={currQuery} onChange={e => setCurrQuery(e.target.value)} onKeyPress={handleKeyPress}/>
                </div>
                <div className='col-1 pl-0'>
                    <button type='submit' className='btn btn-danger' onClick={handleSubmitClick}>Search</button>
                </div>
            </div>
            <SearchResults results={searchResults} handleResultClick={handleResultClick}/>
        </div>
    );
}


export default Search;