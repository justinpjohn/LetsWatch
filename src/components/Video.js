import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, user, player, setPlayer}) => {
    
    const [receivingSync, setReceivingSync] = useState(true);
    const [initalSync, setInitialSync] = useState(true);
    
    // for isSeek()
    // const [isSeeking, setIsSeeking] = useState(false);
    // const [timestamp, setTimeStamp] = useState(0);
    // const [datetime, setDateTime] = useState(Date.now());
    
    const [videoPlayer, setVideoPlayer] = useState(null);
    const [videoData, setVideoData] = useState({ 
        videoID: 'V2hlQkVJZhE',
        videoTS: 0
    });
    
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        const _player = event.target;
        setVideoPlayer(_player)
        setPlayer(_player);
        
        socket.on('video state', ({roomVideoState}) => {
            if (roomVideoState !== undefined && roomVideoState !== null) {
                const videoID = roomVideoState["videoID"];
                const videoTimestamp = roomVideoState["videoTimestamp"];
                
                console.log('RECEIVED VIDEO STATE');
                console.log(roomVideoState);
        
                setVideoData({
                    videoID: videoID,
                    videoTS: videoTimestamp
                });
                // if (playerState === 'PAUSED') _player.pauseVideo();
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
            console.log('Received pauseSync');
            setReceivingSync(true);
            _player.pauseVideo();
        });
        
        socket.on('playSync', ({requestingUser}) => {
            console.log('Received playSync');
            _player.playVideo();
        });
    
        socket.on('video select', ({requestingUser, videoState}) => {
            console.log('received video state: ');
            console.log(videoState);
            setReceivingSync(true);
            
            const videoID = videoState["videoID"];
            setVideoData({
                videoID: videoID,
                videoTS: 0
            });
        });
    }

    const _onPlay = (event) => {
        const videoState = getVideoState();
        
        if (receivingSync) {
            setReceivingSync(false);
        } else {
            socket.emit('seekSync', {
                roomName, 
                userName: user,
                videoState
            });
        }
        socket.emit('playSync', {
            roomName, 
            userName: user,
            videoState
        });
    }
    
    const _onPause = (event) => {
        const videoState = getVideoState();
        
        if (receivingSync) {
            setReceivingSync(false);
        } else {
            socket.emit('pauseSync', {
                roomName, 
                userName: user,
                videoState
            });
        }
    }
    
    useEffect(() => {
        console.log("USE EFFECT");
        if (videoPlayer !== null) {
            console.log(videoData);
            videoPlayer.loadVideoById(videoData["videoID"], videoData["videoTS"]);
            // videoPlayer.seekTo(videoData["videoTS"]);
        } else {
            console.log('_player is null');
        }
    }, [videoData]);
    
    
    // const isSeek = () => {
    //     const currTimestamp = player.getCurrentTime();
    //     const diffTimestamp = Math.abs(timestamp - currTimestamp);
        
    //     const currDatetime = Date.now();
    //     const diffDatetime = Math.abs(datetime - currDatetime) / 1000;
        
    //     if (currTimestamp < timestamp) {
    //         console.log('seeking');
    //         setIsSeeking(true);
    //     } else if (diffTimestamp - diffDatetime > 2) {
    //         console.log('seeking: ' + (diffTimestamp - diffDatetime));
    //         setIsSeeking(true);
    //     } else {
    //         console.log('not seeking');
    //         setIsSeeking(false);
    //     }
    //     setTimeStamp(player.getCurrentTime());
    //     setDateTime(Date.now());
    // }
    
    const getVideoState = () => {
        const isPlaying = (player.getPlayerState() === 1);
        return { 
            videoID: videoData["videoID"],
            videoTimestamp : player.getCurrentTime(),
            playerState : (isPlaying ? 'PLAYING' : 'PAUSED')
            // videoTimestamp : (isPlaying ? Date.now() : player.getCurrentTime()),
        };
    }
    
    return (
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            <YouTube
                videoId={'V2hlQkVJZhE'}
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