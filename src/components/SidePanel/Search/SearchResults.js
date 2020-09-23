import React, {useEffect} from 'react';

import ResultCard from './ResultCard';

const SearchResults = ({results, handleResultClick}) => {
    
    return (
      <div class="result-container d-flex flex-column mh-100">
        {results ? 
            results.map((result, index) => {
                return (
                    <ResultCard result={result} index={index} handleResultClick={handleResultClick}/>
                );
            }) 
            : 
            null
        }
      </div>
    );
}

export default SearchResults;