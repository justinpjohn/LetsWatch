import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, userName, videoPlayer, setvideoPlayer}) => {
    
    const DEFAULT_VIDEO_URL = 'nMVFSwfV6wk';
    
    const [receivingSync, setReceivingSync] = useState(true);
    const [initalSync, setInitialSync] = useState(true);
    
    // const [videoPlayer, setVideoPlayer] = useState(null);
    const [videoData, setVideoData] = useState({ 
        videoID: DEFAULT_VIDEO_URL,
        videoTS: 0,
        videoPS: 'PLAYING'
    });
    
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        const _player = event.target;
        // setVideoPlayer(_player)
        setvideoPlayer(_player);
        
        socket.on('video state', ({roomVideoState}) => {
            if (roomVideoState !== undefined && roomVideoState !== null) {
                const videoID = roomVideoState["videoID"];
                const videoTimestamp = roomVideoState["videoTimestamp"];
                const playerState = roomVideoState["playerState"];
                
                console.log('RECEIVED VIDEO STATE');
                console.log(roomVideoState);
        
                setVideoData({
                    videoID: videoID,
                    videoTS: videoTimestamp,
                    videoPS: playerState
                });
            } else {
                console.log('Received video state was undefined!');
            }
        });
        
        socket.on('seekSync', ({requestingUser, videoState}) => {
            const videoTimestamp = videoState["videoTimestamp"];
            setReceivingSync(true);
            _player.seekTo(videoTimestamp);
        });
        
        socket.on('pauseSync', ({requestingUser}) => {
            // console.log('Received pauseSync');
            setReceivingSync(true);
            _player.pauseVideo();
        });
        
        socket.on('playSync', ({requestingUser}) => {
            // console.log('Received playSync');
            _player.playVideo();
        });
    
        socket.on('video select', ({requestingUser, videoState}) => {
            // console.log('received video state: ');
            // console.log(videoState);
            setReceivingSync(true);
            
            const videoID = videoState["videoID"];
            setVideoData({
                videoID: videoID,
                videoTS: 0,
                videoPS: 'PLAYING'
            });
        });
    }

    const _onPlay = (event) => {
        if (initalSync) return;
        const videoState = getVideoState();

        if (receivingSync) {
            setReceivingSync(false);
        } else {
            socket.emit('seekSync', {
                roomName, 
                userName: userName,
                videoState
            });
        }
        socket.emit('playSync', {
            roomName, 
            userName: userName,
            videoState
        });
    }
    
    const _onPause = (event) => {
        if (initalSync) return;
        const videoState = getVideoState();

        if (receivingSync) {
            setReceivingSync(false);
        } else {
            socket.emit('pauseSync', {
                roomName, 
                userName: userName,
                videoState
            });
        }
    }
    
    useEffect(() => {
        console.log("USE EFFECT");
        if (videoPlayer !== null) {
            // console.log(videoData);
            videoPlayer.loadVideoById(videoData["videoID"], videoData["videoTS"]);
            if (videoData["videoPS"] === 'PAUSED') videoPlayer.pauseVideo();
            setInitialSync(false);
        } else {
            console.log('player is null');
        }
    }, [videoData]);

    const getVideoState = () => {
        const isPlaying = (videoPlayer.getPlayerState() === 1);
        return { 
            videoID: videoData["videoID"],
            videoTimestamp : videoPlayer.getCurrentTime(),
            playerState : (isPlaying ? 'PLAYING' : 'PAUSED')
        };
    }
    
    return (
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            <YouTube
                videoId={DEFAULT_VIDEO_URL}
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
                onReady={_onReady}
                onPlay={_onPlay}
                onPause={_onPause}
            />
        </div>  
    );
}

export default Video;