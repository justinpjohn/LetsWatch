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

const socket = io(SERVER_URL);


const Room = (props) => {
    
    const userData = props.location.state.userData;
    const DEFAULT_VIDEO_TIMESTAMP = 0;
    const DEFAULT_VIDEO_STATE = 'PLAYING';

    const [ socketID, setSocketID ] = useState('');
    const [ roomName, setRoomName ] = useState(userData["roomName"]);
    const [ userName, setUserName ] = useState(userData["userName"]);
    const [ videoPlayer, setVideoPlayer ] = useState(null);
    const { messages, addMessage } = useMessages();
    
    //this is here because i didn't think the Chat component should have access to socket
    const emitVideoId = (videoID) => {
        const videoState = {
            videoID,
            videoTimestamp : DEFAULT_VIDEO_TIMESTAMP,
            playerState : DEFAULT_VIDEO_STATE
        } 
        socket.emit('select', {roomName, userName, clientVideoState: videoState});
    }
    
    const emitMessage = (msg) => {
        socket.emit('chat message', {roomName, userName, msg});
    }

    useEffect(() => {
        socket.emit('room connection', {roomName, userName});
        
        socket.on('socket connection', () => {
            setSocketID(socket.id);
        });
        
        socket.on('room connection', (msg) => {
            addMessage({authorSock: 'admin', authorUser: '', text: msg});
        });
        
        socket.on('chat message', ({authorSocketID, authorUserName, msg}) => {
            addMessage({authorSock: authorSocketID, authorUser: authorUserName, text: msg});
        });
        
        return () => {
            videoPlayer.destroy();
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
                    <Video  
                        socket         = { socket } 
                        roomName       = { roomName } 
                        userName       = { userName } 
                        videoPlayer    = { videoPlayer } 
                        setVideoPlayer = { setVideoPlayer }
                    />
                </div>
                
                <div className='col-lg-4 col-12'>
                    <Chat 
                        roomName    = { roomName } 
                        userName    = { userName } 
                        socketID    = { socketID } 
                        messages    = { messages } 
                        emitMessage = { emitMessage }
                    />
                </div>
            </div>
            <div className='row p-3'>
                <Search emitVideoId={emitVideoId}/>
            </div>
        </div> 
    );
}

export default Room;