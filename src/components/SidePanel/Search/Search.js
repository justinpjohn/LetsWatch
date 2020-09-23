import React, {useState, useEffect, useContext} from 'react';
import fetch from 'node-fetch';

import SearchResults from './SearchResults';
import {QueueContext} from '../../../QueueContext';

const SERVER_URL = 'https://letswatch9897.herokuapp.com';

const Search = ({emitVideoId}) => {
    const {queue, setQueue} = useContext(QueueContext);
    const [ currQuery, setCurrQuery ] = useState('');
    const [ searchResults, setSearchResults ] = useState([
   {
      "kind":"youtube#searchResult",
      "etag":"AgEGUKh3g1fPa4t0BB2KmAEXEog",
      "id":{
         "kind":"youtube#video",
         "videoId":"ynUwoHKKSyE"
      },
      "snippet":{
         "publishedAt":"2020-09-02T04:33:13Z",
         "channelId":"UCfoSHkUwUQC8PNIS6Tmv83Q",
         "title":"Naruto vs Pain English Dub Full version",
         "description":"Naruto vs Pain English Dub Full version #Pain #Naruto #NarutovsPain #NarutoEnglishDub.",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/ynUwoHKKSyE/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/ynUwoHKKSyE/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/ynUwoHKKSyE/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"Naruto Shippuden",
         "liveBroadcastContent":"none",
         "publishTime":"2020-09-02T04:33:13Z"
      }
   },
   {
      "kind":"youtube#searchResult",
      "etag":"0kgKEo6Jcdb-WyRApDSohEm22NM",
      "id":{
         "kind":"youtube#video",
         "videoId":"jU2i-c6fAfY"
      },
      "snippet":{
         "publishedAt":"2020-03-30T15:15:11Z",
         "channelId":"UCzvLYTQP3R67q6YLZm3UtqA",
         "title":"Naruto Shows Nine Tails Form For Shin Uchiha, Story of Sarada&#39;s Family, Sarada Meets Sasuke EngDub",
         "description":"Naruto Shows Nine Tails Form For Shin Uchiha, Story of Sarada's Family, Sarada Meets Sasuke EngDub.",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/jU2i-c6fAfY/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/jU2i-c6fAfY/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/jU2i-c6fAfY/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"Fomica Films",
         "liveBroadcastContent":"none",
         "publishTime":"2020-03-30T15:15:11Z"
      }
   },
   {
      "kind":"youtube#searchResult",
      "etag":"LXmyLJhMXAZbRanDHRRbbCDVYxo",
      "id":{
         "kind":"youtube#video",
         "videoId":"eLDEZ9YNa8o"
      },
      "snippet":{
         "publishedAt":"2020-09-22T18:05:53Z",
         "channelId":"UCTPFCnuQScej06PXba4bNZg",
         "title":"Naruto: Cosas que no tienen RESPUESTAS respondidas POR FIN / Naruto Shippuden",
         "description":"AL FIN RESPUESTAS.... FACE: https://www.facebook.com/AnthonysJoker/ Twister: https://twitter.com/Anthonysjoker1 - DISCLAIMER - I do not own the anime, ...",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/eLDEZ9YNa8o/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/eLDEZ9YNa8o/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/eLDEZ9YNa8o/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"A. Joker Tv",
         "liveBroadcastContent":"none",
         "publishTime":"2020-09-22T18:05:53Z"
      }
   },
   {
      "kind":"youtube#searchResult",
      "etag":"V1UAA-ayfIdL-g1F8k4aGg9ZT8A",
      "id":{
         "kind":"youtube#video",
         "videoId":"yX1RIZESHBY"
      },
      "snippet":{
         "publishedAt":"2020-09-13T17:27:23Z",
         "channelId":"UCpCZu1uhGTWskC9Apidnvzg",
         "title":"Naruto shocked everyone with his true power / Naruto vs Neji ( Eng sub / 1080p )",
         "description":"Naruto shocked everyone with his true power / Naruto vs Neji ( Eng sub / 1080p )",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/yX1RIZESHBY/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/yX1RIZESHBY/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/yX1RIZESHBY/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"Rin Nohara",
         "liveBroadcastContent":"none",
         "publishTime":"2020-09-13T17:27:23Z"
      }
   },
   {
      "kind":"youtube#searchResult",
      "etag":"wLl4tbd3bRzFQWMJT41QiLSkINA",
      "id":{
         "kind":"youtube#video",
         "videoId":"4TAyaDAYTws"
      },
      "snippet":{
         "publishedAt":"2020-09-03T07:00:12Z",
         "channelId":"UCfoSHkUwUQC8PNIS6Tmv83Q",
         "title":"Naruto Shippuden. Fourth Shinobi World War English Dub",
         "description":"Naruto Shippuden. Fourth Shinobi World War English Dub #Naruto #NarutoShippuden #EnglishDub #FourthShinobiWorldWar.",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/4TAyaDAYTws/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/4TAyaDAYTws/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/4TAyaDAYTws/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"Naruto Shippuden",
         "liveBroadcastContent":"none",
         "publishTime":"2020-09-03T07:00:12Z"
      }
   },
   {
      "kind":"youtube#searchResult",
      "etag":"zL-WCam5xpEDGkTYVzUWH05OViw",
      "id":{
         "kind":"youtube#video",
         "videoId":"EdftBpCpZsw"
      },
      "snippet":{
         "publishedAt":"2020-09-22T16:19:33Z",
         "channelId":"UCq6AFuOlY6EB6WrxNJrQrpA",
         "title":"¿Que hubiera pasado si naruto era un Uchiha? Capítulo 1",
         "description":"Que hubiera pasado si naruto era un Uchiha? Capítulo 1 Link para entrar a mi grupo de discord : https://discord.gg/mJhUycj.",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/EdftBpCpZsw/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/EdftBpCpZsw/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/EdftBpCpZsw/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"Señor Triple Z",
         "liveBroadcastContent":"none",
         "publishTime":"2020-09-22T16:19:33Z"
      }
   },
   {
      "kind":"youtube#searchResult",
      "etag":"oL073XlQFy21gm2AuACWmusHFfk",
      "id":{
         "kind":"youtube#video",
         "videoId":"rykJAvv0yCs"
      },
      "snippet":{
         "publishedAt":"2020-08-14T10:39:33Z",
         "channelId":"UCAP-t2h_YmcJzu2hrWpe5pw",
         "title":"SASUKE&#39;S DEATH in anime Boruto - Naruto took Sasuke&#39;s eyes | Boruto Episode Fan Animation",
         "description":"Sasuke and Naruto in the Boruto anime. What will happen to them? What fate awaits them? Especially after Isshiki arrived in Konoha. What will Kawaki do?",
         "thumbnails":{
            "default":{
               "url":"https://i.ytimg.com/vi/rykJAvv0yCs/default.jpg",
               "width":120,
               "height":90
            },
            "medium":{
               "url":"https://i.ytimg.com/vi/rykJAvv0yCs/mqdefault.jpg",
               "width":320,
               "height":180
            },
            "high":{
               "url":"https://i.ytimg.com/vi/rykJAvv0yCs/hqdefault.jpg",
               "width":480,
               "height":360
            }
         },
         "channelTitle":"AniVideo ENG SUB",
         "liveBroadcastContent":"none",
         "publishTime":"2020-08-14T10:39:33Z"
      }
   }
]);
    
    const handleResultClick = (result) => {
        console.log('clicked video: ' + JSON.stringify(result));
        setQueue([result, ...queue]);
        emitVideoId(result.id.videoId);
    }
    
    const handleKeyPress = (e) => {
        // check if 'Enter' key is pressed
        if (e.charCode === 13){
            handleSubmitClick(e);
        } 
    }
    
    const handleSubmitClick = (e) => {
        // check if query is not empty or only contains spaces
        if (currQuery.length !== 0 && (/\S/).test(currQuery)) {
            searchYoutube(currQuery);
            // setCurrQuery(''); // reset query on submission
        }
    }
    
    const searchYoutube = (query) => {
        query = query.replace(/ /g, '+');
        const FETCH_URL = SERVER_URL.concat('/', `youtube/${query}`);
        
        fetch(FETCH_URL, { method: 'GET' })
            .then((response) => {
              return response.json();
            })
            .then((json) => {
                setSearchResults(json.items);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }
      
    useEffect(() => {
        
    }, [searchResults]);

    return (
        <div className='h-100 w-100 mw-100 mh-100 p-0 m-0' style={{backgroundColor: "#181818", display: 'flex', flexDirection: 'column'}}> 
            <div className='row m-0 py-2 mh-100' id='search-container'>
                <div className='col-12 px-3'>
                    <input className='w-100' type='text' placeholder="Search youtube..." value={currQuery} onChange={e => setCurrQuery(e.target.value)} onKeyPress={handleKeyPress}/>
                </div>
            </div>
            <SearchResults results={searchResults} handleResultClick={handleResultClick}/>
        </div>
    );
}


export default Search;