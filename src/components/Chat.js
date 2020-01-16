import React, { useState, useEffect } from 'react';

const Chat = ({group, messages, emitMessage}) => {
    
    const [currMessage, setCurrMessage] = useState('');

    const handleMessageSubmit = (e) => {
        // e.preventDefault();
        emitMessage(currMessage);
        setCurrMessage('');
    }

    return (
        <div id='chat-container' className='d-flex flex-column h-100' style={{backgroundColor: '#252526'}}>
            <div className='text-center py-2' style={{backgroundColor: '#343a40', borderBottom: 'solid 1px #E53A3A'}}>
                <b>{group}</b> Chatroom
            </div>
            
            <div id='chat-area' className='' style={{height: '90%'}}>
                <ul>
                  {messages.map((value, index) => {
                    return <li key={index}>{value}</li>
                  })}
                </ul>
            </div>
            <div id='chat-input-container' className='d-flex flex-column'>
                <div> 
                    <hr className='mb-0' style={{backgroundColor: '#C4C4C4'}}/>
                </div>
                
                <div className='d-flex align-items-center mt-2'>
                    <div id='chat-input' className='flex-grow-1 ml-2'>
                        <input type="text" placeholder="Say something..." value={currMessage} onChange={e => setCurrMessage(e.target.value)} style={{width: '95%'}}/>
                    </div>
                    <div className='mr-2 mb-2'>
                        <button id='chat-send' className='btn btn-primary' onClick={handleMessageSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;