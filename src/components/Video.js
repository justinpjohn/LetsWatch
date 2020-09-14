import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, userName}) => {
    
    const DEFAULT_VIDEO_ID    = 'qsdzdUYl5c0';
    const DEFAULT_VIDEO_STATE = 'PLAYING'
    const DEFAULT_VIDEO_TIMESTAMP = 0;
    
    const [ videoPlayerDOM, setVideoPlayerDOM ] = useState(null);
    const [ videoPlayer, setVideoPlayer ] = useState(null);
    // const [ initialPlay, setInitialPlay ] = useState(false);
    
    
    let initialPlay = false;
    let receivingSync = false;
    
    
    const [ initialSync, setInitialSync ] = useState(true);
    // const [ receivingSync, setReceivingSync ] = useState(false);
    const [ clientVideoState, setClientVideoState ] = useState(null);
    
    // useEffect(() =>{
    //     console.log('player change');
    // }, [videoPlayer]);
    
    // useEffect(() =>{
    //     console.log('dom change');
    // }, [videoPlayerDOM]);
    
    
    useEffect(() => {
        if (!initialSync) {
            console.log(clientVideoState);
            setVideoPlayerDOM(
                <YouTube
                    videoId = { clientVideoState["videoID"] }
                    opts={
                        {
                            height: '390',
                            width: '640',
                            playerVars: { // https://developers.google.com/youtube/player_parameters
                                autoplay: 1,
                                loop: 1,
                                start: Number(Math.ceil(clientVideoState["videoTS"])),
                            }
                        }
                    }
                    onPlay  = { _onPlay }
                    onPause = { _onPause }
                    onReady = { _onReady } 
                />    
            );
        }
    }, [initialSync]);
    
    
    useEffect(() => {
        console.log('changing video state');
        console.log(clientVideoState);
        
        if (clientVideoState && initialSync) {
            console.log('flip initialSync');
            setInitialSync(false);
        }
        
        if (clientVideoState && videoPlayer) {
            console.log('load video by id');
            videoPlayer.loadVideoById(clientVideoState["videoID"], clientVideoState["videoTS"]);
            if (clientVideoState["videoPS"] === 'PAUSED') videoPlayer.pauseVideo();
        }
    }, [clientVideoState]);
    
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

        setClientVideoState(Object.assign({}, initialVideoState));
    });
    
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        const player = event.target;
        setVideoPlayer(player);
        
        socket.on('seek', ({requestingUser, serverVideoState}) => {
            console.log('received seek');
            const videoTimestamp = serverVideoState["videoTimestamp"];
            receivingSync = true;
            player.seekTo(videoTimestamp);
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
            
            const videoID = serverVideoState["videoID"];
            setClientVideoState({
                videoID: videoID,
                videoTS: DEFAULT_VIDEO_TIMESTAMP,
                videoPS: DEFAULT_VIDEO_STATE
            });
        });
    }

    const _onPlay = (event) => {
        if (initialPlay === false) {
            initialPlay = true;
            return;
        };

        const videoState = getVideoState(event.target);
        
        if (receivingSync) {
            receivingSync = false;
        } else {
            console.log('emitting seek');
            socket.emit('seek', {
                roomName, 
                userName: userName,
                clientVideoState: videoState
            });
        }
        console.log('emitting play');
        socket.emit('play', {
            roomName, 
            userName: userName,
            clientVideoState: videoState
        });
    }
    
    const _onPause = (event) => {
        if (initialPlay === false) {
            return;
        }
        
        if (!receivingSync) {
            console.log('emitting pause');
            socket.emit('pause', {
                roomName, 
                userName: userName,
                clientVideoState: getVideoState(event.target)
            });
        }
    }

    const getVideoState = (player) => {
        const isPlaying = (player.getPlayerState() === 1);
        
        const state = { 
            videoID: clientVideoState["videoID"],
            videoTimestamp : player.getCurrentTime(),
            playerState : (isPlaying ? 'PLAYING' : 'PAUSED')
        };
        // console.log(state);
        return state;
    }
    
    return (
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            { videoPlayerDOM }
        </div>  
    );
}

export default Video;