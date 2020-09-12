import React, { useState, useEffect } from 'react';

import Message from './Message';

const Chat = ({roomName, userName, socketID, messages, emitMessage}) => {
    
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
            <div id='chat-navbar' className='text-center py-2' style={{backgroundColor: '#343a40', borderBottom: 'solid 1px #E53A3A', marginBottom: '5px'}}>
                <b>{roomName}</b>
            </div>
            
            <div id='chat-area' className='d-flex flex-column'>
                {messages.map((content, index) => {
                    return <Message messageInfo={ {currUserSockID: socketID, message: {content, index}} }/>
                })}
            </div>
            <div id='chat-input-container' className='d-flex flex-column'>
                <div> 
                    <hr className='mb-0' style={{backgroundColor: '#C4C4C4'}}/>
                </div>
                
                <div className='d-flex align-items-center mt-2'>
                    <div id='chat-input' className='flex-grow-1 ml-2'>
                        <input type="text" placeholder="Say something..." 
                            value      = { currMessage } 
                            onKeyPress = { handleKeyPress } 
                            onChange   = { e => setCurrMessage(e.target.value) } 
                            style      = { {width: '95%'} }
                            maxlength  = { MAX_CHAR_LIMIT }
                        />
                    </div>
                    <div className='mr-2 mb-2'>
                        <button id='chat-send' className='btn btn-primary' style={{backgroundColor: '#E53A3A', borderColor: '#E53A3A'}} onClick={handleMessageSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;