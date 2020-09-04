import React from 'react';

const ResultCard = ({result, index, handleOnClick}) => {
    
    return (
            <div className="card flex-shrink-0 mx-auto mb-2" key={index} alt={result.id.videoId} onClick={handleOnClick}>
                <div className="row no-gutters">
                    <div className="col-md-4">
                        <img src={result.snippet.thumbnails.medium.url} class="card-img" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <span className="card-title">{result.snippet.title}</span>
                            <p className="card-text"><small className="text-muted">{result.snippet.channelTitle}</small></p>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default ResultCard;