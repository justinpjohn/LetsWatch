import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Video from './Video';
import SidePanel from './SidePanel/SidePanel'

// const SERVER_URL = 'https://58aab3c90017465bbb8c7cbf0b87d6b3.vfs.cloud9.us-east-2.amazonaws.com';
const SERVER_URL = 'https://9e057b5691a24d17a179648c6553f432.vfs.cloud9.us-east-1.amazonaws.com/';
const SERVER_PORT = '8080';
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);

const socket = io(SERVER_URL);

const Room = (props) => {
    
    const userData = props.location.state.userData;

    const [ roomName, setRoomName ] = useState(userData["roomName"]);
    const [ userName, setUserName ] = useState(userData["userName"]);
    
    useEffect(() => {
        socket.emit('room connection', {roomName, userName});

        return () => {
            socket.emit('disconnect', {roomName, userName});
            socket.disconnect();
        }
    }, [socket]);

    return (
        <div id='main-container' className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div id='main-row-nav' className='row'>
                <nav className="navbar navbar-dark bg-dark py-0 w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{userName}</span>
                </nav>
            </div>
            
            <div id='main-row-body' className='row' id='body-wrapper'>
                <Video  
                    socket         = { socket } 
                    roomName       = { roomName } 
                    userName       = { userName } 
                />
                <SidePanel
                    socket         = { socket } 
                    roomName       = { roomName } 
                    userName       = { userName }
                />
            </div>
        </div> 
    );
}

export default Room;