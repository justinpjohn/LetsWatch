import React from 'react';

const Chat = (props) => {
    const group = props.group;
    
    return (
        <div id='chat-container' className='d-flex flex-column h-100' style={{backgroundColor: '#252526'}}>
            <div className='text-center py-2' style={{backgroundColor: '#343a40', borderBottom: 'solid 1px #E53A3A'}}>
                <b>{group}</b> Chatroom
            </div>
            
            <div id='chat-area' className='' style={{height: '90%'}}>
                
            </div>
            <div id='chat-input-container' className='d-flex flex-column'>
                <div> 
                    <hr className='mb-0' style={{backgroundColor: '#C4C4C4'}}/>
                </div>
                
                <div className='d-flex align-items-center mt-2'>
                    <div id='chat-input' className='flex-grow-1 ml-2'>
                        <input type="text" placeholder="Say something..." style={{width: '95%'}}/>
                    </div>
                    <div className='mr-2 mb-2'>
                        <button id='chat-send' class='btn btn-primary'>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;