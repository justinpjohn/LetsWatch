import React from 'react';

const ResultCard = ({result, index, handleOnClick}) => {
    
    return (
        
        <div class="card" alt={result.id.videoId} onClick={handleOnClick}>
            <img class="card-img-top" src={result.snippet.thumbnails.medium.url} alt="Card image cap"/>
            <div class="card-body">
                  <h5 class="card-title">{result.snippet.title}</h5>
            </div>
            <div class="card-footer">
                <small class="text-muted">{result.snippet.channelTitle}</small>
            </div>
        </div>

    );
}

export default ResultCard;