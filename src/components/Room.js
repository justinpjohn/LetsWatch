import React, { useEffect } from 'react';
import io from 'socket.io-client';

import Chat from './Chat';

import useMessages from './hooks/useMessages';

const SERVER_URL = 'https://58aab3c90017465bbb8c7cbf0b87d6b3.vfs.cloud9.us-east-2.amazonaws.com';
const SERVER_PORT = '8081';
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);

const Room = (props) => {
    const user = props.location.state.user;
    const socket = io(SERVER_ENDPOINT);
    
    const { messages, addMessage } = useMessages();
    
    const emitMessage = (msg) => {
        console.log('Submitted: ' + msg)
        socket.emit('chat message', msg);
    }
    
    useEffect(() => {
        socket.on('chat message', (msg) => {
            console.log('Received: ' + msg);
            addMessage(msg);
        });
    }, [user]);

    return (
        <div className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div className='row'>
                <nav className="navbar navbar-dark bg-dark w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{user.username}</span>
                </nav>
            </div>
            
            <div className='row h-75 p-3'>
                <div className='col-8' style={{backgroundColor: '#E53A3A'}}>
                    Video goes here
                </div>
                
                <div className='col pr-0'>
                    <Chat group={user.groupID} messages={messages} emitMessage={emitMessage}/>
                </div>
            </div>
        </div> 
          
        // <h1 style={{color: 'white'}}>Hello '{user.username}'! You are in the '{user.groupID}' group.</h1>
    );
}

export default Room;