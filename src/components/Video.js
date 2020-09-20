import React, {useState, useEffect, useContext} from 'react';
import YouTube from 'react-youtube';

import {UserContext} from '../UserContext'; 

const DEFAULT_VIDEO_ID    = process.env.REACT_APP_DEFAULT_VIDEO_ID;
const DEFAULT_VIDEO_STATE = process.env.REACT_APP_DEFAULT_VIDEO_STATE;
const DEFAULT_VIDEO_TIMESTAMP = process.env.REACT_APP_DEFAULT_VIDEO_TIMESTAMP;

const Video = ({socket}) => {
    const {user} = useContext(UserContext);

    const [ videoPlayerDOM, setVideoPlayerDOM ] = useState(null);
    const [ loadPlayerDOM, setLoadPlayerDOM ] = useState(
        <div className="overlay">
            <div className="loader"></div>
        </div>
    )
   
    let videoID = DEFAULT_VIDEO_ID
    let videoPS = DEFAULT_VIDEO_STATE;
    let receivingSync = false;

    socket.on('initial sync', ({serverVideoState}) => {
        let initialVideoState = {
            videoID: DEFAULT_VIDEO_ID,
            videoTS: DEFAULT_VIDEO_TIMESTAMP,
            videoPS: DEFAULT_VIDEO_STATE
        }
        
        if (serverVideoState) {
            const videoID = serverVideoState["videoID"];
            const videoTimestamp = serverVideoState["videoTimestamp"];
            const playerState = serverVideoState["playerState"];
    
            initialVideoState = {
                videoID: videoID,
                videoTS: videoTimestamp,
                videoPS: playerState
            };
        }
        videoID = initialVideoState["videoID"];
        videoPS = initialVideoState["videoPS"];
        console.log('received video state: ' + JSON.stringify(initialVideoState));

        setLoadPlayerDOM(null);
        setVideoPlayerDOM(
            <YouTube
                videoId = { initialVideoState["videoID"] }
                opts={
                    {
                        height: '390',
                        width: '640',
                        playerVars: { // https://developers.google.com/youtube/player_parameters
                            autoplay: 1,
                            loop: 1,
                            start: Number(Math.round(initialVideoState["videoTS"])),
                        }
                    }
                }
                onPlay  = { _onPlay }
                onPause = { _onPause }
                onReady = { _onReady } 
            /> 
        );
    });
    
    const _onReady = (e) => {
        // access to player in all event handlers via event.target
        const player = e.target;
        if (videoPS === 'PAUSED') {
            player.pauseVideo();
        }
        
        socket.on('seek', ({requestingUser, serverVideoState}) => {
            receivingSync = true;
            player.seekTo(serverVideoState["videoTimestamp"]);
        });
        
        socket.on('pause', ({requestingUser}) => {
            receivingSync = true;
            player.pauseVideo();
        });
        
        socket.on('play', ({requestingUser}) => {
            player.playVideo();
        });
    
        socket.on('select', ({requestingUser, serverVideoState}) => {
            receivingSync = true;
            videoID = serverVideoState["videoID"];
            
            player.loadVideoById(
                serverVideoState["videoID"], 
                serverVideoState["videoPS"]
            );
            
            if (serverVideoState["videoPS"] === 'PAUSED') {
                player.pauseVideo();
            }
        });
    }

    const _onPlay = (e) => {
        const videoState = getVideoState(e.target);
        
        if (receivingSync) {
            receivingSync = false;
        } else {
            socket.emit('seek', {
                user,
                clientVideoState: videoState
            });
        }
        socket.emit('play', {
            user,
            clientVideoState: videoState
        });
    }
    
    const _onPause = (e) => {
        if (!receivingSync) {
            socket.emit('pause', {
                user,
                clientVideoState: getVideoState(e.target)
            });
        }
    }

    const getVideoState = (player) => {
        const isPlaying = (player.getPlayerState() === 1);
        
        const state = { 
            videoID: videoID,
            videoTimestamp : player.getCurrentTime(),
            playerState : (isPlaying ? 'PLAYING' : 'PAUSED')
        };
        return state;
    }
    
    const parseVideoID = (videoURL) => {
        var queryParams = new global.URLSearchParams(videoURL);
        const videoID = queryParams.get("v");
        
        return videoID
    }
    
    return (
        <div className='col-lg-9 col-12 mh-100 p-3' id='video-wrapper' style={{backgroundColor: 'black'}}>
            { loadPlayerDOM }
            { videoPlayerDOM }
        </div>  
    );
}

export default Video;