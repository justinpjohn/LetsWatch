import React, {useState, useEffect} from 'react';
import fetch from 'node-fetch';

import SearchResults from './SearchResults';

const SERVER_URL = 'https://letswatch9897.herokuapp.com';

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
        // check if query is not empty or only contains spaces
        if (currQuery.length !== 0 && (/\S/).test(currQuery)) {
            searchYoutube(currQuery);
            // setCurrQuery(''); // reset query on submission
        }
    }
    
    const searchYoutube = (query) => {
        query = query.replace(/ /g, '+');
        const FETCH_URL = SERVER_URL.concat('/', `youtube/${query}`);
        
        fetch(FETCH_URL, { method: 'GET' })
            .then((response) => {
              return response.json();
            })
            .then((json) => {
                setSearchResults(json.items);
            })
            .catch((error) => {
                console.log(error);
            });
    }
      
    useEffect(() => {
        
    }, [searchResults]);

    return (
        <div className='h-100 w-100 mw-100 mh-100 p-0 m-0' style={{backgroundColor: "#181818"}}> 
            <div className='row m-0 py-2 mh-100' id='search-container'>
                <div className='col-12 px-3'>
                    <input className='w-100' type='text' placeholder="Search youtube..." value={currQuery} onChange={e => setCurrQuery(e.target.value)} onKeyPress={handleKeyPress}/>
                </div>
            </div>
            <SearchResults results={searchResults} handleResultClick={handleResultClick}/>
        </div>
    );
}


export default Search;