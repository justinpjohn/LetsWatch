import React, {useEffect} from 'react';

import ResultCard from './ResultCard';

const SearchResults = ({results, handleResultClick}) => {
    
    const handleContainerClick = (e) => {
        console.log('Clicked!');
        console.log(e.currentTarget);
        // e.persist();
        try {
            let videoId = e.currentTarget.attributes.alt.value;
            handleResultClick(videoId);
        }
        catch(error) {
            console.error(error);
        }
    }
    
    return (
      <div class="card-deck">
        {results.map((result, index) => {
            // console.log(result);
            return (
                <ResultCard result={result} index={index} handleOnClick={handleContainerClick}/>
            );
        })}
      </div>
    );
}

export default SearchResults;

                // <div className={`result-container`} id={`result-${index}`} alt={result.id.videoId} onClick={handleContainerClick}>
                //     <div className={`result-title`} alt={result.id.videoId}>{result.snippet.title}</div>
                //     <span className={`result-videoId`} alt={result.id.videoId}>{result.id.videoId}</span>
                // </div>