import React, {useEffect} from 'react';


const SearchResults = ({results, handleResultClick}) => {
    
    const handleContainerClick = (e) => {
        e.persist();
        
        let videoId = e.target.attributes.alt.value;
        
        console.log(videoId);
        handleResultClick(videoId);
    }
    
    return (
      <div>
        {results.map((result, index) => {
            // console.log(result);
            return (
                <div className={`result-container`} id={`result-${index}`} alt={result.id.videoId} onClick={handleContainerClick}>
                    <div className={`result-title`} alt={result.id.videoId}>{result.snippet.title}</div>
                    <span className={`result-videoId`} alt={result.id.videoId}>{result.id.videoId}</span>
                </div>
            );
        })}
      </div>
    );
}

export default SearchResults;