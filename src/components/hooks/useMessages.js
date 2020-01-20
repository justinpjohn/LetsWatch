import { useState, useEffect } from 'react';

const useMessages = () => {
    const [ messages, setMessages ] = useState([]);
    
    const addMessage = (msg) => {
        // console.log(msg);
        setMessages(prevMessages => ([...prevMessages, {sockID: msg.sockID, user: msg.user, msg: msg.msg}]));
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