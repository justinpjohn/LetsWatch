import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';


const Video = ({socket, roomName, user, player, setPlayer}) => {
    
    const [receivingSync, setReceivingSync] = useState(false);
    const [videoId, setVideoId] = useState('5qap5aO4i9A'); //originally EEIk7gwjgIM
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
        
        socket.on('seekSync', ({reqUser, pos}) => {
            // console.log('Received Position: ' + pos);
            setReceivingSync(true);
            _player.seekTo(pos);
        });
        
        socket.on('pauseSync', ({posUser}) => {
            // console.log('Received pauseSync');
            setReceivingSync(true);
            _player.pauseVideo();
        });
        
        socket.on('playSync', ({posUser}) => {
            // console.log('Received playSync');
            // setSyncing(true);
            _player.playVideo();
        });
        
        socket.on('video select', ({user, videoId}) => {
            // console.log('received video id: ' + videoId);
            setReceivingSync(true);
            setVideoId(videoId);
            
        });
    }
    
    const _onPlay = (event) => {
        if (receivingSync) {
            // console.log('playSync: ' + player.getCurrentTime());
            setReceivingSync(false);
        } else {
            // console.log('Emiting seekSync to: ' + player.getCurrentTime());
            socket.emit('seekSync', {roomName, reqUser: user, pos: player.getCurrentTime()});
        }
        socket.emit('playSync', {roomName, reqUser: user});
    }
    
    const _onPause = (event) => {
        if (receivingSync) {
            // console.log('pauseSync: ' + player.getCurrentTime());
            setReceivingSync(false);
        } else {
            // console.log('Emiting pauseSync');
            socket.emit('pauseSync', {roomName, posUser: user});
        }
    }
    
    return (
        <div className='video-wrapper w-100 h-100' style={{backgroundColor: '#E53A3A'}}>
            <YouTube
                videoId={videoId}
                opts={videoOptions}
                onReady={_onReady}
                onPlay={_onPlay}
                onPause={_onPause}
            />
        </div>  
    );
}

export default Video;