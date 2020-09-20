import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

import Video from './Video';
import SidePanel from './SidePanel/SidePanel'

import {UserContext} from '../UserContext'; 

const Room = () => {
    const socket = io();
    const {user} = useContext(UserContext);

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
                <Video  
                    socket = {socket} 
                />
                <SidePanel
                    socket = {socket} 
                />
            </div>
        </div> 
    );
}

export default Room;