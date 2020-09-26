import React, { useState, useEffect, useContext } from 'react';

import {UserContext} from '../../../contexts/UserContext';
import {SocketContext} from '../../../contexts/SocketContext';

import Message from './Message';

const Chat = ({messages, emitMessage}) => {
    const {user} = useContext(UserContext);
    const socket = useContext(SocketContext);
    
    const MAX_CHAR_LIMIT = 500;
    const [ currMessage, setCurrMessage ] = useState('');

    const handleMessageSubmit = (e) => {
        if (currMessage.length !== 0 && (/\S/).test(currMessage)) {
            emitMessage(currMessage);
            setCurrMessage('');
        }
    }
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            handleMessageSubmit(e);
        }
    }
    
    useEffect(() => {
        let chatArea = document.getElementById("chat-area");
        chatArea.scrollTop = chatArea.scrollHeight;
    }, [messages]);

    return (
        <div id='chat-container' className='d-flex flex-column h-100 w-100' style={{backgroundColor: '#252526', overflow: 'hidden'}}>
            <div id='chat-navbar' className='text-center py-2'>
                <b>{user.room}</b>
            </div>
            
            <div id='chat-area' className='d-flex flex-column'>
                {messages.map((content, index) => {
                    return <Message key={index} messageInfo={ {currUserSockID: socket.id, message: {content, index}} }/>
                })}
            </div>
            <div id='chat-input-container' className='d-flex flex-column p-1'>
                <div className='d-flex align-items-center'>
                    <div id='chat-input' className='flex-grow-1 ml-2'>
                        <input type="text" placeholder="Say something..." 
                            value      = { currMessage } 
                            onKeyPress = { handleKeyPress } 
                            onChange   = { e => setCurrMessage(e.target.value) } 
                            style      = { {width: '95%'} }
                            maxLength  = { MAX_CHAR_LIMIT }
                        />
                    </div>
                    <div className='m-auto'>
                        <button id='chat-send' className='btn btn-primary' style={{backgroundColor: '#E53A3A', borderColor: '#E53A3A'}} onClick={handleMessageSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;