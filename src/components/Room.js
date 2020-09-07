import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Chat from './Chat/Chat';
import Video from './Video';
import Search from './Search/Search';

import useMessages from '../hooks/useMessages';

// const SERVER_URL = 'https://58aab3c90017465bbb8c7cbf0b87d6b3.vfs.cloud9.us-east-2.amazonaws.com';
const SERVER_URL = 'https://9e057b5691a24d17a179648c6553f432.vfs.cloud9.us-east-1.amazonaws.com/';
const SERVER_PORT = '8080';
const SERVER_ENDPOINT = SERVER_URL.concat(':', SERVER_PORT);
console.log(SERVER_ENDPOINT);

let socket = io(SERVER_URL);

const Room = (props) => {
    const newUserInfo = props.location.state.user;

    const [socketID, setSocketID] = useState('');
    const [roomName, setRoomName] = useState(newUserInfo.groupID);
    const [userName, setUserName] = useState(newUserInfo.username);
    const [player, setPlayer] = useState({});
    const { messages, addMessage } = useMessages();
    
    const emitVideoId = (videoID) => {
        // console.log('emitting videoId: ' + videoID);
        const videoState = {
            videoID,
            videoTimestamp : 0,
            playerState : 'PLAYING'
        } 
        socket.emit('video select', {roomName, userName, videoState});
    }
    
    const emitMessage = (msg) => {
        socket.emit('chat message', {roomName, userName, msg});
    }

    useEffect(() => {
        // setRoomName(newUserInfo.groupID);
        // setUserName(newUserInfo.username);
        // console.log({roomName, userName});
        socket.emit('room connection', {roomName, userName});
        
        socket.on('socket connection', () => {
            // console.log('setting socket connection');
            setSocketID(socket.id);
        });
        
        socket.on('room connection', (msg) => {
            // console.log('received room connection' + msg);
            addMessage({authorSock: 'admin', authorUser: '', text: msg});
        });
        
        socket.on('chat message', ({authorSocketID, authorUserName, msg}) => {
            addMessage({authorSock: authorSocketID, authorUser: authorUserName, text: msg});
        });
        
        return () => {
            player.destroy();
            console.log({roomName, userName});
            socket.emit('disconnect', {roomName, userName});
            socket.disconnect();
        }
    }, [socket]);

    return (
        <div className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div className='row'>
                <nav className="navbar navbar-dark bg-dark w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{userName}</span>
                </nav>
            </div>
            
            <div className='row p-3'>
                <div className='col-lg-8 col-12' style={{backgroundColor: 'black'}}>
                    <Video socket={socket} roomName={roomName} user={userName} player={player} setPlayer={setPlayer}/>
                </div>
                
                <div className='col-lg-4 col-12'>
                    <Chat group={roomName} user={userName} socketID={socketID} messages={messages} emitMessage={emitMessage}/>
                </div>
            </div>
            <div className='row p-3'>
                <Search player={player} emitVideoId={emitVideoId}/>
            </div>
        </div> 
    );
}

export default Room;