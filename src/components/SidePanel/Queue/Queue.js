import React, {useContext, useEffect} from 'react';

import ResultCard from '../Search/ResultCard';

import {QueueContext} from '../../../QueueContext';

const Queue = () => {
    const {queue, setQueue} = useContext(QueueContext);
    
    useEffect(() => {
        console.log('queue: ' + JSON.stringify(queue))
    },[queue]);
    
    const handleResultClick = (result) => {
        console.log('clicked queue card');
    }
    
    return (
            <div className='d-flex flex-column h-100 w-100'>
                {queue.length  ? 
                    queue.map((result, index) => {
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

export default Queue;