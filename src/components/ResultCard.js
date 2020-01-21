import React from 'react';

const ResultCard = ({result, index, handleOnClick}) => {
    
    console.log(result.snippet.thumbnails.medium);
    
    return (
        <div className={`result-container`} id={`result-${index}`} alt={result.id.videoId} onClick={handleOnClick}>
            <div className={`result-title`} alt={result.id.videoId}>{result.snippet.title}</div>
            <span className={`result-videoId`} alt={result.id.videoId}>{result.id.videoId}</span>
        </div>
    );
}

export default ResultCard;