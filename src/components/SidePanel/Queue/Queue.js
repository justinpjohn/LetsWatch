import React, {useContext} from 'react';

import {QueueContext} from '../../../QueueContext';

const Queue = () => {
    const {queue, setQueue} = useContext(QueueContext);
    
    return (
            <div className='d-flex flex-column h-100 w-100'>
                {Object.keys(queue).length ? console.log(JSON.stringify(queue)) : 'hello'}
            </div>    
    );
}

export default Queue;