import React, {useEffect, useState, useContext} from 'react';

import VideoCard from '../VideoCard';

import {SocketContext} from '../../../contexts/SocketContext'; 

const Queue = ({emitVideoId, emitQueueRemove}) => {
    const [queue, setQueue] = useState([]);
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        // console.log('queue: ' + JSON.stringify(queue))
        socket.on('queue update', ({requestingUser, serverQueueState}) => {
            console.log('update q: ' + JSON.stringify(serverQueueState));
            setQueue(serverQueueState);
        });
    },[]);
    
    const handleVideoCardClick = (e, result) => {
        const targetIndexKey = e.currentTarget.dataset.index;
        const targetClassName = e.target.className;
        emitQueueRemove(targetIndexKey);
        
        if (targetClassName !== 'add-to-queue-btn') {
            emitVideoId(result.id.videoId);   
        }
    }
    
    return (
            <div className='d-flex flex-column h-100 w-100'>
                {queue.length  ? 
                    queue.map((result, index) => {
                        return (
                            <VideoCard 
                                result={result} 
                                index={index} 
                                handleVideoCardClick={handleVideoCardClick}
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