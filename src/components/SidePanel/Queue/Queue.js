import React, {useEffect, useState} from 'react';

import ResultCard from '../Search/ResultCard';


const Queue = ({socket}) => {
    const [queue, setQueue] = useState([]);
    
    
    useEffect(() => {
        // console.log('queue: ' + JSON.stringify(queue))
        socket.on('queue update', ({requestingUser, serverQueueState}) => {
            console.log('update q: ' + JSON.stringify(serverQueueState));
            setQueue(serverQueueState);
        });
    },[]);
    
    return (
            <div className='d-flex flex-column h-100 w-100'>
                {queue.length  ? 
                    queue.map((result, index) => {
                        return (
                            <ResultCard 
                                result={result} 
                                index={index} 
                                handleVideoCardClick={() => console.log('hello')}
                                queue={true}
                            />
                        );
                    }) 
                    : 
                    null
                }
            </div>    
    );
}

export default Queue;