import React, { useState } from 'react';

const Chat = ({group, user, socketID, messages, emitMessage}) => {
    
    const [currMessage, setCurrMessage] = useState('');

    const handleMessageSubmit = (e) => {
        // e.preventDefault();
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

    return (
        <div id='chat-container' className='d-flex flex-column h-100' style={{backgroundColor: '#252526'}}>
            <div className='text-center py-2' style={{backgroundColor: '#343a40', borderBottom: 'solid 1px #E53A3A', marginBottom: '5px'}}>
                <b>{group}</b> Chatroom
            </div>
            
            <div id='chat-area' className='' style={{height: '90%'}}>
                {messages.map((value, index) => {
                    let className = 'msg-container';
                    let justify = 'start';
                    if (socketID === value.sockID) {
                        justify = 'end';
                        className = 'msg-container-send';
                    } else if (value.sockID === 'admin') {
                        className = 'msg-container-admin';
                    }
                    return (
                        <div className={`d-flex justify-content-${justify} mb-3`}>
                            <div className={className}>
                                <div className={`d-flex justify-content-${justify} msg-header pl-1 pr-1`}>{value.user}</div>
                                <span id={`msg-${index}`}>{value.msg}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div id='chat-input-container' className='d-flex flex-column'>
                <div> 
                    <hr className='mb-0' style={{backgroundColor: '#C4C4C4'}}/>
                </div>
                
                <div className='d-flex align-items-center mt-2'>
                    <div id='chat-input' className='flex-grow-1 ml-2'>
                        <input type="text" placeholder="Say something..." value={currMessage} onKeyPress={handleKeyPress} onChange={e => setCurrMessage(e.target.value)} style={{width: '95%'}}/>
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