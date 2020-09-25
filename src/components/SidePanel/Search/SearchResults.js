import React  from 'react';

import VideoCard from '../VideoCard';

const SearchResults = ({results, handleVideoCardClick}) => {
    
    return (
      <div class="result-container d-flex flex-column mh-100">
        {results ? 
            results.map((result, index) => {
                return (
                    <VideoCard 
                        result={result} 
                        index={index} 
                        handleVideoCardClick={handleVideoCardClick} 
                    />
                );
            }) 
            : 
            null
        }
      </div>
    );
}

export default SearchResults;