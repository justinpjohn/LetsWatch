import React, {useEffect} from 'react';

import ResultCard from './ResultCard';

const SearchResults = ({results, handleResultClick}) => {
    
    const _results = results || [];
    
    const handleContainerClick = (e) => {
        try {
            let videoId = e.currentTarget.attributes.alt.value;
            handleResultClick(videoId);
        }
        catch(error) {
            console.error(error);
        }
    }
    
    return (
      <div class="result-container d-flex flex-column mh-100">
        {_results.map((result, index) => {
            return (
                <ResultCard result={result} index={index} handleOnClick={handleContainerClick}/>
            );
        })}
      </div>
    );
}

export default SearchResults;