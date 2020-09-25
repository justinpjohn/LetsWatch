import React, {useContext, useState} from 'react';
import fetch from 'node-fetch';

import {SocketContext} from '../../../contexts/SocketContext'; 
import {UserContext} from  '../../../contexts/UserContext';

// https://www.youtube.com/watch?v=qckUFfMeSI4
// https://www.youtube.com/watch?v=j6TsX_7xlkU&list=PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu&index=21
const SERVER_URL = 'https://letswatch9897.herokuapp.com';

const URLDrop = () => {
    const {user} = useContext(UserContext);
    const socket = useContext(SocketContext);
    const [url, setURL] = useState('');
    
     const handleKeyPress = (e) => {
        // check if 'Enter' key is pressed
        if (e.charCode === 13){
            handleSubmitClick(e);
        } 
    }
    
    const handleSubmitClick = (e) => {
        // check if query is not empty or only contains spaces
        if (url.length !== 0 && (/\S/).test(url)) {
            const {type, id} = retrieveYoutubeID(url);
            
            if (type === 'playlist') {
                retrieveYoutubePlaylist(id);
            } else if (type === 'video') {
                retrieveYoutubeVideo(id);
            }
            
            setURL(''); // reset query on submission
        }
    }
    
    const retrieveYoutubeVideo = (videoID) => {
        const FETCH_URL = SERVER_URL.concat('/', `youtube/video/${videoID}`);
        
        fetch(FETCH_URL, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                //batch append query
                socket.emit('batch append', {user, videos: json})
            })
            .catch((error) => {
                console.log(error);
            }
        );
    };
    
    const retrieveYoutubePlaylist = (playlistID) => {
        const FETCH_URL = SERVER_URL.concat('/', `youtube/playlist/${playlistID}`);
        
        fetch(FETCH_URL, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                //batch append query
                socket.emit('batch append', {user, videos: json})
            })
            .catch((error) => {
                console.log(error);
            }
        );
    };
    
    //playlist: list=PLAYLIST_ID
    //video: v=VIDEO_ID
    const retrieveYoutubeID = (fullURL) => {
        const paramString = fullURL.substring(fullURL.lastIndexOf('?'));
        var queryParams = new global.URLSearchParams(paramString);
        
        let id = ''
        let type = '';
        let vParam = queryParams.get("v");
        let listParam = queryParams.get("list");
        console.log('v: ' + vParam + ' l: ' + listParam);
        
        if (listParam) {
            type = 'playlist';
            id = listParam;
        } else if (vParam) {
            type = 'video';
            id = vParam;
        }
        
        return {type, id}
    }
    
    return (
        <div id='queue-input-container' className='px-3 py-2'>
            <input className='w-100' type='text' placeholder="Paste YouTube Video/Playlist URL..." 
                value={url} onChange={e => setURL(e.target.value)} onKeyPress={handleKeyPress}
            />
        </div>
    );
}

export default URLDrop;