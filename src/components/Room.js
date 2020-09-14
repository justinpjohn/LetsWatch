import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Chat from './Chat/Chat';
import Video from './Video';
import Search from './Search/Search';

import useMessages from '../hooks/useMessages';


const socket = io();

let messageCount = 0;

const Room = (props) => {
    
    const userData = props.location.state.userData;
    const DEFAULT_VIDEO_TIMESTAMP = process.env.REACT_APP_DEFAULT_VIDEO_TIMESTAMP;
    const DEFAULT_VIDEO_STATE     = process.env.REACT_APP_DEFAULT_VIDEO_STATE;

    const [ socketID, setSocketID ] = useState('');
    const [ roomName, setRoomName ] = useState(userData["roomName"]);
    const [ userName, setUserName ] = useState(userData["userName"]);
    
    const [ unseenMessages, setUnseenMessages ] = useState(0);
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
        const chatTextDOM = document.getElementById('chat-text');
        const unseenDOM = document.getElementById('unseen');
        console.log(unseenMessages)
        
        if (unseenMessages == 0) {
            chatTextDOM.style.display = 'flex';
            unseenDOM.style.display = 'none';
        } else {
            chatTextDOM.style.display = 'none';
            unseenDOM.style.display = 'flex';
        }
    }, [unseenMessages])

    useEffect(() => {
        socket.emit('room connection', {roomName, userName});
        
        socket.on('socket connection', () => {
            setSocketID(socket.id);
        });
        
        socket.on('room connection', (msg) => {
            addMessage({
                authorSock: 'admin', 
                authorUser: '', 
                text: msg
            });
        });
        
        socket.on('chat message', ({authorSocketID, authorUserName, msg}) => {
            console.log(authorSocketID + ' SPACE ' + socket.id);
            if (authorSocketID !== socketID && !isChatTabFocused()) {
                messageCount += 1;
                setUnseenMessages(messageCount);
            }
            
            addMessage({
                authorSock: authorSocketID, 
                authorUser: authorUserName, 
                text: msg
            });
        });
        
        return () => {
            socket.emit('disconnect', {roomName, userName});
            socket.disconnect();
        }
    }, [socket]);
    
    const isChatTabFocused = () => {
        const chatTabDOM = document.getElementById('chat-tab');
        return (chatTabDOM.classList.contains('active'))
    }
    
    const handleOnClick = () => {
        messageCount = 0; 
        setUnseenMessages(0);
    }

    return (
        <div id='main-container' className="container-fluid m-auto h-100" style={{color: 'white'}}>
            <div id='main-row-nav' className='row'>
                <nav className="navbar navbar-dark bg-dark py-0 w-100">
                    <a className="navbar-brand" href="/">Lets<span style={{color: '#E53A3A'}}>Watch</span></a>
                    <span>{userName}</span>
                </nav>
            </div>
            
            <div id='main-row-body' className='row' id='body-wrapper'>
                <div className='col-lg-9 col-12 mh-100 p-3' id='video-wrapper' style={{backgroundColor: 'black'}}>
                    <Video  
                        socket         = { socket } 
                        roomName       = { roomName } 
                        userName       = { userName } 
                    />
                </div>
                
                <div className='col-lg-3 col-12 mh-100' id='side-wrapper' style={{backgroundColor: 'black'}}>
                    <div className='row text-center text-uppercase'>
                        <ul class="nav nav-tabs col-12 p-0" role="tablist">
                            <li class="nav-item col-6 p-0" onClick={handleOnClick}>
                                <a class="nav-link active h-100" id="chat-tab" data-toggle="tab" href="#chat" role="tab" aria-controls="chat"
                                  aria-selected="true" style={{display: 'flex', justifyContent: 'center'}}>
                                    <div id='chat-text' className='m-auto'>
                                        <span> Chat </span>
                                    </div>
                                    <div id='unseen' className='circle'>
                                        <span className='m-auto'> {(unseenMessages > 9) ? '9+' : unseenMessages} </span>
                                    </div>
                              </a>
                            </li>
                            <li class="nav-item col-6 p-0">
                                <a class="nav-link" id="search-tab" data-toggle="tab" href="#search" role="tab" aria-controls="search"
                                  aria-selected="false">Search</a>
                            </li>
                        </ul>
                    </div>
                    <div className='row tab-content'>
                        <div class="tab-pane show active col-12 p-0" id="chat" role="tabpanel" aria-labelledby="chat-tab">
                            <Chat 
                                roomName    = { roomName } 
                                userName    = { userName } 
                                socketID    = { socketID } 
                                messages    = { messages } 
                                emitMessage = { emitMessage }
                            />
                        </div>
                        <div class="tab-pane col-12 p-0 mh-100" id="search" role="tabpanel" aria-labelledby="search-tab">
                            <Search emitVideoId={emitVideoId}/>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Room;