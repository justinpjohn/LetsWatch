import { useState, useEffect } from 'react';

const useMessages = () => {
    const [ messages, setMessages ] = useState([]);
    
    const addMessage = (msg) => {
        setMessages(prevMessages => ([...prevMessages, msg]));
    }
    
    useEffect(() => {
        // console.log(messages);
    }, [messages]);
    
    return {
        messages, 
        addMessage,
    }
};

export default useMessages;