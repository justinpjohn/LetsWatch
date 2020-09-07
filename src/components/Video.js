import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, user, player, setPlayer}) => {
    
    const [receivingSync, setReceivingSync] = useState(false);
    const [videoID, setVideoID] = useState('5qap5aO4i9A'); //originally EEIk7gwjgIM
    const [videoOptions, setVideoOptions] = useState( 
        {
          height: '390',
          width: '640',
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            loop: 1,
            start: 0,
          }
        }
    );
    
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        let _player = event.target;
        setPlayer(_player);
        
        socket.on('video state', ({roomVideoState}) => {
           if (roomVideoState !== undefined && roomVideoState !== null) {
                console.log(roomVideoState);
                const videoID = roomVideoState["videoID"];
                const playerState = roomVideoState["playerState"];
                
                let videoTimestamp = roomVideoState["videoTimestamp"];
                if (playerState !== 'PAUSED') {
                    console.log('PLAYING');
                    const timeElapsedInMilli = Date.now() - videoTimestamp;
                    console.log('elapsed milli: ' + timeElapsedInMilli);
                    const timeElapsedInSeconds = Math.ceil(timeElapsedInMilli / 1000);
                    console.log('elapsed seconds: ' + timeElapsedInMilli);
                    // console.log(roomVideoState);
                    // console.log(timeElapsedInSeconds); 
                    videoTimestamp = timeElapsedInSeconds;
                }
                console.log('RECEIVED TIMESTAMP: ' + videoTimestamp); 

                setVideoID(videoID);
                _player.loadVideoById({
                    'videoId': videoID,
                    'startSeconds': videoTimestamp
                });
                if (playerState === 'PAUSED') _player.pauseVideo();
            } else {
                console.log('Received video state was undefined!');
            }
        });
        
        socket.on('seekSync', ({requestingUser, reqUserVideoPos}) => {
            console.log('Seeking Position: ' + reqUserVideoPos);
            setReceivingSync(true);
            _player.seekTo(reqUserVideoPos);
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
        
        socket.on('video select', ({requestingUser, requestingVideoID}) => {
            console.log('received video id: ' + requestingVideoID);
            setReceivingSync(true);
            setVideoID(requestingVideoID);
        });
    }
    
    const _onPlay = (event) => {
        const videoState = getVideoState();
        
        if (receivingSync) {
            // console.log('playSync: ' + player.getCurrentTime());
            setReceivingSync(false);
        } else {
            // console.log('Emiting seekSync to: ' + player.getCurrentTime());
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
            // console.log('pauseSync: ' + player.getCurrentTime());
            setReceivingSync(false);
        } else {
            // console.log('Emiting pauseSync');
            socket.emit('pauseSync', {
                roomName, 
                userName: user,
                videoState
            });
        }
    }
    
    const getVideoState = () => {
        return { 
            videoID,
            videoTimestamp : player.getCurrentTime(),
            playerState : ((player.getPlayerState() == 1) ? 'PLAYING' : 'PAUSED')
        };
    }
    
    return (
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            <YouTube
                videoId={videoID}
                opts={videoOptions}
                onReady={_onReady}
                onPlay={_onPlay}
                onPause={_onPause}
            />
        </div>  
    );
}

export default Video;