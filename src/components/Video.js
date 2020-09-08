import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, userName, videoPlayer, setVideoPlayer}) => {
    
    const DEFAULT_VIDEO_ID = 'nMVFSwfV6wk';
    const DEFAULT_VIDEO_TIMESTAMP = 0;
    const DEFAULT_VIDEO_STATE = 'PLAYING';
    
    const [ initalSync, setInitialSync ] = useState(true);
    const [ receivingSync, setReceivingSync ] = useState(true);
    const [ clientVideoState, setClientVideoState ] = useState({ 
        videoID: DEFAULT_VIDEO_ID,
        videoTS: DEFAULT_VIDEO_TIMESTAMP,
        videoPS: DEFAULT_VIDEO_STATE
    });
    
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        const _player = event.target;
        setVideoPlayer(_player);
        
        socket.on('initial sync', ({serverVideoState}) => {
            if (serverVideoState) {
                const videoID = serverVideoState["videoID"];
                const videoTimestamp = serverVideoState["videoTimestamp"];
                const playerState = serverVideoState["playerState"];
                
                console.log('RECEIVED VIDEO STATE');
                console.log(serverVideoState);
        
                setClientVideoState({
                    videoID: videoID,
                    videoTS: videoTimestamp,
                    videoPS: playerState
                });
            } else {
                setInitialSync(false);
                console.log('Received video state was undefined!');
            }
        });
        
        socket.on('seek', ({requestingUser, serverVideoState}) => {
            const videoTimestamp = serverVideoState["videoTimestamp"];
            setReceivingSync(true);
            _player.seekTo(videoTimestamp);
        });
        
        socket.on('pause', ({requestingUser}) => {
            // console.log('Received pauseSync');
            setReceivingSync(true);
            _player.pauseVideo();
        });
        
        socket.on('play', ({requestingUser}) => {
            // console.log('Received playSync');
            _player.playVideo();
        });
    
        socket.on('select', ({requestingUser, serverVideoState}) => {
            setReceivingSync(true);
            
            const videoID = serverVideoState["videoID"];
            setClientVideoState({
                videoID: videoID,
                videoTS: DEFAULT_VIDEO_TIMESTAMP,
                videoPS: DEFAULT_VIDEO_STATE
            });
        });
    }

    const _onPlay = (event) => {
        if (initalSync) return;
        const videoState = getVideoState();

        if (receivingSync) {
            setReceivingSync(false);
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
    
    const _onPause = (event) => {
        if (initalSync) return;

        if (receivingSync) {
            setReceivingSync(false);
        } else {
            socket.emit('pause', {
                roomName, 
                userName: userName,
                clientVideoState: getVideoState()
            });
        }
    }
    
    useEffect(() => {
        if (videoPlayer) {
            videoPlayer.loadVideoById(clientVideoState["videoID"], clientVideoState["videoTS"]);
            if (clientVideoState["videoPS"] === 'PAUSED') videoPlayer.pauseVideo();
            setInitialSync(false);
        }
    }, [clientVideoState]);

    const getVideoState = () => {
        const isPlaying = (videoPlayer.getPlayerState() === 1);
        return { 
            videoID: clientVideoState["videoID"],
            videoTimestamp : videoPlayer.getCurrentTime(),
            playerState : (isPlaying ? 'PLAYING' : 'PAUSED')
        };
    }
    
    return (
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            <YouTube
                videoId = { DEFAULT_VIDEO_ID }
                opts={
                    {
                        height: '390',
                        width: '640',
                        playerVars: { // https://developers.google.com/youtube/player_parameters
                            autoplay: 1,
                            loop: 1,
                            start: 0,
                        }
                    }
                }
                onPlay  = { _onPlay }
                onPause = { _onPause }
                onReady = { _onReady } 
            />
        </div>  
    );
}

export default Video;