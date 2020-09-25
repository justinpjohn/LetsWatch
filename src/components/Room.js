import React, {useEffect, useContext} from 'react';
import io from 'socket.io-client';

import Video from './Video';
import SidePanel from './SidePanel/SidePanel'

import {UserContext} from '../contexts/UserContext'; 
import {SocketContext} from '../contexts/SocketContext';

const SERVER_URL = 'https://9e057b5691a24d17a179648c6553f432.vfs.cloud9.us-east-1.amazonaws.com/';

const Room = () => {
    const {user} = useContext(UserContext);
    const socket = io(SERVER_URL);

    useEffect(() => {
        socket.emit('room connection', {user});

        return () => {
            socket.emit('disconnect', {user});
            socket.disconnect();
        }
    }, [socket]);

    return (
        <div id='main-container' className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div id='main-row-nav' className='row'>
                <nav className="navbar navbar-dark bg-dark py-0 w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{user.name}</span>
                </nav>
            </div>
            
            <div id='main-row-body' className='row' id='body-wrapper'>
                <SocketContext.Provider value={socket}>
                    <Video/>
                    <SidePanel/>
                </SocketContext.Provider>
            </div>
        </div> 
    );
}

export default Room;