import React, {useEffect, useState, useContext} from 'react';

import VideoCard from '../VideoCard';
import URLDrop from './URLDrop';

import {SocketContext} from '../../../contexts/SocketContext'; 

const Queue = ({emitVideoId, emitQueueRemove}) => {
    const [queue, setQueue] = useState([]);
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        socket.on('queue update', ({requestingUser, serverQueueState}) => {
            setQueue(serverQueueState);
        });
    },[]);
    
    
    const handleVideoCardClick = (e, result) => {
        const targetIndexKey = e.currentTarget.dataset.index;
        const targetClassName = e.target.className;
        emitQueueRemove(targetIndexKey);
        
        if (targetClassName !== 'remove-from-queue-btn') {
            emitVideoId(result.videoId);   
        }
    }
    
    return (
            <div className='d-flex flex-column h-100 w-100' style={{backgroundColor: 'rgb(24, 24, 24)'}}>
                <URLDrop/>
                <div class="result-container d-flex flex-column mh-100">
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
            </div>    
    );
}

export default Queue;