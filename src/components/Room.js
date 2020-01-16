import React from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'https://58aab3c90017465bbb8c7cbf0b87d6b3.vfs.cloud9.us-east-2.amazonaws.com';
const SERVER_PORT = '8081';
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);

const Room = (props) => {
    const user = props.location.state.user;
    const socket = io(SERVER_ENDPOINT);
    
    console.log(socket);
    
    return (
        <div style={{color: 'white'}}>
            <nav class="navbar navbar-dark bg-dark">
                <a class="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                <span>{user.username}</span>
            </nav>
        </div> 
          
        // <h1 style={{color: 'white'}}>Hello '{user.username}'! You are in the '{user.groupID}' group.</h1>
    );
}

export default Room;