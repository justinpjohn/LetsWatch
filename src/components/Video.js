import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, user, player, setPlayer}) => {
    
    const [receivingSync, setReceivingSync] = useState(true);
    const [initalSync, setInitialSync] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [timestamp, setTimeStamp] = useState(0);
    const [datetime, setDateTime] = useState(Date.now());
    
    const [videoID, setVideoID] = useState('V2hlQkVJZhE'); //originally 5qap5aO4i9A
    const [videoOptions, setVideoOptions] = useState( 
        {
          height: '390',
          width: '640',
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            loop: 1
            // start: 0,
          }
        }
    );
    
    useEffect(() => {
        socket.on('video state', ({roomVideoState}) => {
            if (roomVideoState !== undefined && roomVideoState !== null) {
                const videoID = roomVideoState["videoID"];
                
                let videoTimestamp = roomVideoState["videoTimestamp"];
                console.log('RECEIVED VIDEO STATE');
                console.log(roomVideoState);
            
                setVideoID(videoID);
                
                // setVideoID(videoID);
                // console.log("seeking to: " + videoTimestamp);
                // _player.seekTo(videoTimestamp);
                // if (playerState === 'PAUSED') _player.pauseVideo();
            } else {
                console.log('Received video state was undefined!');
            }
        });
    });
    
    
    
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        let _player = event.target;
        setPlayer(_player);
        _player.pauseVideo();
        
        socket.on('seekSync', ({requestingUser, videoState}) => {
            const videoTimestamp = videoState["videoTimestamp"];
            
            if (initalSync) {
                console.log('INITIAL SYNCING');
                console.log('Seeking Position: ' + videoTimestamp);
                // setVideoID(videoState["videoID"]);
                //  _player.loadVideoById({
                //     'videoId': videoID,
                //     'startSeconds': videoTimestamp
                // });
            }
            
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
        
        socket.on('video select', ({requestingUser, requestingVideoID}) => {
            console.log('received video id: ' + requestingVideoID);
            setReceivingSync(true);
            setVideoID(requestingVideoID);
        });
    }
    
    const _onPlay = (event) => {
        if (initalSync) {
            setInitialSync(false)
            return;
        }
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
        if (initalSync) { 
            return;
        }
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
    
    const isSeek = () => {
        const currTimestamp = player.getCurrentTime();
        const diffTimestamp = Math.abs(timestamp - currTimestamp);
        
        const currDatetime = Date.now();
        const diffDatetime = Math.abs(datetime - currDatetime) / 1000;
        
        if (currTimestamp < timestamp) {
            console.log('seeking');
            setIsSeeking(true);
        } else if (diffTimestamp - diffDatetime > 2) {
            console.log('seeking: ' + (diffTimestamp - diffDatetime));
            setIsSeeking(true);
        } else {
            console.log('not seeking');
            setIsSeeking(false);
        }
        setTimeStamp(player.getCurrentTime());
        setDateTime(Date.now());
    }
    
    const getVideoState = () => {
        const isPlaying = (player.getPlayerState() === 1);
        return { 
            videoID,
            videoTimestamp : player.getCurrentTime(),
            playerState : (isPlaying ? 'PLAYING' : 'PAUSED')
            // videoTimestamp : (isPlaying ? Date.now() : player.getCurrentTime()),
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