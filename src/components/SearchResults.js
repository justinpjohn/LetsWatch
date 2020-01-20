import React from 'react';


const SearchResults = ({results}) => {
    
    return (
      <div>
        {results.map((result, index) => {
            // console.log(result);
            return (
                <div className={``}>
                    <div className={``}>{result.snippet.title}</div>
                    <span id={``}>{result.id.videoId}</span>
                </div>
            );
        })}
      </div>
    );
}

export default SearchResults;