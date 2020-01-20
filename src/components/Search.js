import React, {useEffect} from 'react';


const Search = () => {
    
    const useEffect = () => {
        fetch('http://example.com/movies.json')
          .then((response) => {
            return response.json();
          })
          .then((myJson) => {
            console.log(myJson);
          });
    }

    return (
        <div className='h-100 w-100' style={{backgroundColor:'blue'}}>
            Search goes here
        </div>
    );
}


export default Search;