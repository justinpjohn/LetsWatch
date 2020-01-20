import React, {useState, useEffect} from 'react';
import fetch from 'node-fetch';


const Search = () => {
  
    const [currQuery, setCurrQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const handleMessageSubmit = (e) => {
        // e.preventDefault();
        if (currQuery.length !== 0 && (/\S/).test(currQuery)) {
            searchYoutube(currQuery);
            setCurrQuery('');
        }
    }
    
    const searchYoutube = (query) => {
        query.replace(' ', '+');
        console.log(query);
        fetch('https://www.googleapis.com/youtube/v3/search?&key=AIzaSyBa-JzGFfw19oswz7L6WV0BwbNMBIZw5Ko&part=snippet&q='+query+'&maxResults=25')
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
        <div className='h-100 w-100' style={{backgroundColor:'blue'}}>
            <input type='text' value={currQuery} onChange={e => setCurrQuery(e.target.value)}/>
            <button type='submit' onClick={handleMessageSubmit}>Search</button>
            Search goes here
        </div>
    );
}


export default Search;