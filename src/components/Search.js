import React, {useEffect} from 'react';
import fetch from 'node-fetch';


const Search = () => {
    
    useEffect(() => {
        console.log('fetching youtube search');
        fetch('https://www.googleapis.com/youtube/v3/search?&key=AIzaSyBa-JzGFfw19oswz7L6WV0BwbNMBIZw5Ko&part=snippet&q=kpop&maxResults=25')
          .then((response) => {
            return response.json();
          })
          .then((myJson) => {
            console.log(myJson);
          });
    }, []);

    return (
        <div className='h-100 w-100' style={{backgroundColor:'blue'}}>
            Search goes here
        </div>
    );
}


export default Search;