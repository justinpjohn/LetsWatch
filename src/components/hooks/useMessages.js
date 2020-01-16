import { useState } from 'react';

const useMessages = () => {
    const [ messages, setMessages ] = useState([]);
    
    const addMessage = (msg) => {
        setMessages([...messages, msg]);
    }
    
    return {
        messages, 
        addMessage,
    }
};

export default useMessages;