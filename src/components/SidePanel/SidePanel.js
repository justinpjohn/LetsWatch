import React, {useState, useEffect} from 'react';

import Chat from './Chat/Chat';
import Search from './Search/Search';

import useMessages from '../../hooks/useMessages';

const DEFAULT_VIDEO_TIMESTAMP = process.env.REACT_APP_DEFAULT_VIDEO_TIMESTAMP;
const DEFAULT_VIDEO_STATE     = process.env.REACT_APP_DEFAULT_VIDEO_STATE;

let messageCount = 0;

const SidePanel = ({socket, roomName, userName}) => {
    
    const [ unseenMessages, setUnseenMessages ] = useState(0);
    const { messages, addMessage } = useMessages();
    
    useEffect(() => {
        socket.on('chat message', ({authorSocketID, authorUserName, msg}) => {
            console.log(authorSocketID + ' SPACE ' + socket.id);
            if (authorSocketID !== socket.id && !isChatTabFocused()) {
                messageCount += 1;
                setUnseenMessages(messageCount);
            }
            
            addMessage({
                authorSock: authorSocketID, 
                authorUser: authorUserName, 
                text: msg
            });
        });
    }, [socket]);
    
    
    const isChatTabFocused = () => {
        const chatTabDOM = document.getElementById('chat-tab');
        return (chatTabDOM.classList.contains('active'))
    }
    
    const handleOnClick = () => {
        messageCount = 0; 
        setUnseenMessages(0);
    }
    
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
    
    return (
        <div className='col-lg-3 col-12 mh-100' id='side-wrapper' style={{backgroundColor: 'black'}}>
            <div className='row text-center text-uppercase'>
                <ul class="nav nav-tabs col-12 p-0" role="tablist">
                    <li class="nav-item col-6 p-0" onClick={handleOnClick}>
                        <a class="nav-link active h-100" id="chat-tab" data-toggle="tab" href="#chat" role="tab" aria-controls="chat"
                          aria-selected="true" style={{display: 'flex', justifyContent: 'center'}}>
                            { (unseenMessages === 0) ? 
                                <div id='chat-text' className='m-auto'>
                                    <span> Chat </span>
                                </div>
                                :
                                <div id='unseen' className='circle'>
                                    <span className='m-auto'> {(unseenMessages > 9) ? '9+' : unseenMessages} </span>
                                </div>
                            }
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
                        socketID    = { socket.id } 
                        messages    = { messages } 
                        emitMessage = { emitMessage }
                    />
                </div>
                <div class="tab-pane col-12 p-0 mh-100" id="search" role="tabpanel" aria-labelledby="search-tab">
                    <Search emitVideoId={emitVideoId}/>
                </div>
            </div>
        </div>
    )
}

export default SidePanel;