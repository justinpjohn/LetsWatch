import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Chat from './Chat';
import Video from './Video';
import Search from './Search';

import useMessages from './hooks/useMessages';

const SERVER_URL = 'https://frozen-harbor-81702.herokuapp.com';
const SERVER_PORT = '8081';
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);

let socket = io(SERVER_ENDPOINT);

const Room = (props) => {
    const newUserInfo = props.location.state.user;

    const [socketID, setSocketID] = useState('');
    const [roomName, setRoomName] = useState(newUserInfo.groupID);
    const [user, setUser] = useState(newUserInfo.username);
    const [player, setPlayer] = useState({});
    const { messages, addMessage } = useMessages();
    
    const emitVideoId = (videoId) => {
        // console.log('Emiting video select: ' + videoId);
        socket.emit('video select', {roomName, user, videoId});
    }
    
    const emitMessage = (msg) => {
        socket.emit('chat message', {roomName, socketID, user, msg});
    }

    useEffect(() => {
        setRoomName(newUserInfo.groupID);
        setUser(newUserInfo.username);
        socket.emit('room connection', {roomName, user});
        
        socket.on('socket connection', (msg) => {
            // console.log("Socket ID: " + socket.id);
            setSocketID(socket.id);
        });
        
        socket.on('room connection', (msg) => {
            // console.log('received room connection' + msg);
            addMessage({authorSock: 'admin', authorUser: '', text: msg});
        });
        
        socket.on('chat message', ({sockID, user, msg}) => {
            // console.log(socket);
            // console.log({user, msg});
            addMessage({authorSock: sockID, authorUser: user, text: msg});
        });
        
        return () => {
            player.destroy();
            socket.emit('disconnect');
            socket.disconnect();
        }
    }, [socket]);

    return (
        <div className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div className='row'>
                <nav className="navbar navbar-dark bg-dark w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{user}</span>
                </nav>
            </div>
            
            <div className='row p-3'>
                <div className='col-lg-8 col-12' style={{backgroundColor: 'black'}}>
                    <Video socket={socket} roomName={roomName} user={user} player={player} setPlayer={setPlayer}/>
                </div>
                
                <div className='col-lg-4 col-12'>
                    <Chat group={roomName} user={user} socketID={socketID} messages={messages} emitMessage={emitMessage}/>
                </div>
            </div>
            <div className='row p-3'>
                <Search player={player} emitVideoId={emitVideoId}/>
            </div>
        </div> 
    );
}

export default Room;