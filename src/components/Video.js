import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, userName}) => {
    
    const DEFAULT_VIDEO_ID    = process.env.REACT_APP_DEFAULT_VIDEO_ID;
    const DEFAULT_VIDEO_STATE = process.env.REACT_APP_DEFAULT_VIDEO_STATE;
    const DEFAULT_VIDEO_TIMESTAMP = process.env.REACT_APP_DEFAULT_VIDEO_TIMESTAMP;
    
    const [ videoPlayerDOM, setVideoPlayerDOM ] = useState(null);
   
    let videoID = DEFAULT_VIDEO_ID
    let firstPlayOccurred = false;
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
                            start: Number(Math.ceil(initialVideoState["videoTS"])),
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
        // upon initialization, the video player will pause then play. 
        // we do not want to emit anything when this happens - it throws off
        // synchronization
        if (firstPlayOccurred === false) {
            firstPlayOccurred = true;
            return;
        };

        const videoState = getVideoState(e.target);
        
        if (receivingSync) {
            receivingSync = false;
        } else {
            socket.emit('seek', {
                roomName, 
                userName: userName,
                clientVideoState: videoState
            });
        }
        socket.emit('play', {
            roomName, 
            userName: userName,
            clientVideoState: videoState
        });
    }
    
    const _onPause = (e) => {
        // upon initialization, the video player will pause then play. 
        // we do not want to emit anything when this happens - it throws off
        // synchronization
        if (firstPlayOccurred === false) {
            return;
        }
        
        if (!receivingSync) {
            socket.emit('pause', {
                roomName, 
                userName: userName,
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
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            { videoPlayerDOM }
        </div>  
    );
}

export default Video;