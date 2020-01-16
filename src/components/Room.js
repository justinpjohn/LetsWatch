import React from 'react';
import io from 'socket.io-client';

import Chat from './Chat';

const SERVER_URL = 'https://58aab3c90017465bbb8c7cbf0b87d6b3.vfs.cloud9.us-east-2.amazonaws.com';
const SERVER_PORT = '8081';
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);

const Room = (props) => {
    const user = props.location.state.user;
    const socket = io(SERVER_ENDPOINT);
    
    console.log(socket);
    
    return (
        <div className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div className='row'>
                <nav className="navbar navbar-dark bg-dark w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{user.username}</span>
                </nav>
            </div>
            
            <div className='row h-50 p-3'>
                <div className='col-8' style={{backgroundColor: '#E53A3A'}}>
                    Video goes here
                </div>
                
                <div className='col pr-0'>
                    <Chat group={user.groupID}/>
                </div>
            </div>
        </div> 
          
        // <h1 style={{color: 'white'}}>Hello '{user.username}'! You are in the '{user.groupID}' group.</h1>
    );
}

export default Room;