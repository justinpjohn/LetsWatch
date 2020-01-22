import React from 'react';

const ResultCard = ({result, index, handleOnClick}) => {
    
    return (
        <div className={`result-container row mb-3`} id={`result-${index}`} alt={result.id.videoId} onClick={handleOnClick}>
            <div className={`result-image col-4 pl-0 pr-0`} alt={result.id.videoId}> 
                <img src={result.snippet.thumbnails.medium.url} alt={result.id.videoId}/> 
            </div>
            <div className={`result-content col`} alt={result.id.videoId}>
                <div className={`result-title`} alt={result.id.videoId}>
                    <h4>{result.snippet.title}</h4>
                </div>
                <span className={`result-channel`} alt={result.id.videoId}>{result.snippet.channelTitle}</span>
            </div>
        </div>
    );
}

export default ResultCard;