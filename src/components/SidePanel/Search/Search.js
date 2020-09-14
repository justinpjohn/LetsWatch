import React, {useState, useEffect} from 'react';
import fetch from 'node-fetch';

import SearchResults from './SearchResults';

const SERVER_URL = 'https://letswatch9897.herokuapp.com';

const Search = ({emitVideoId}) => {
  
    const [ currQuery, setCurrQuery ] = useState('');
    const [ searchResults, setSearchResults ] = useState([
  {
    "kind": "youtube#searchResult",
    "etag": "AgEGUKh3g1fPa4t0BB2KmAEXEog",
    "id": {
      "kind": "youtube#video",
      "videoId": "ynUwoHKKSyE"
    },
    "snippet": {
      "publishedAt": "2020-09-02T04:33:13Z",
      "channelId": "UCfoSHkUwUQC8PNIS6Tmv83Q",
      "title": "Naruto vs Pain English Dub Full version",
      "description": "Naruto vs Pain English Dub Full version #Pain #Naruto #NarutovsPain #NarutoEnglishDub.",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/ynUwoHKKSyE/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/ynUwoHKKSyE/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/ynUwoHKKSyE/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Naruto Shippuden",
      "liveBroadcastContent": "none",
      "publishTime": "2020-09-02T04:33:13Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "wLl4tbd3bRzFQWMJT41QiLSkINA",
    "id": {
      "kind": "youtube#video",
      "videoId": "4TAyaDAYTws"
    },
    "snippet": {
      "publishedAt": "2020-09-03T07:00:12Z",
      "channelId": "UCfoSHkUwUQC8PNIS6Tmv83Q",
      "title": "Naruto Shippuden. Fourth Shinobi World War English Dub",
      "description": "Naruto Shippuden. Fourth Shinobi World War English Dub #Naruto #NarutoShippuden #EnglishDub #FourthShinobiWorldWar.",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/4TAyaDAYTws/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/4TAyaDAYTws/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/4TAyaDAYTws/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Naruto Shippuden",
      "liveBroadcastContent": "none",
      "publishTime": "2020-09-03T07:00:12Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "0kgKEo6Jcdb-WyRApDSohEm22NM",
    "id": {
      "kind": "youtube#video",
      "videoId": "jU2i-c6fAfY"
    },
    "snippet": {
      "publishedAt": "2020-03-30T15:15:11Z",
      "channelId": "UCzvLYTQP3R67q6YLZm3UtqA",
      "title": "Naruto Shows Nine Tails Form For Shin Uchiha, Story of Sarada&#39;s Family, Sarada Meets Sasuke EngDub",
      "description": "Naruto Shows Nine Tails Form For Shin Uchiha, Story of Sarada's Family, Sarada Meets Sasuke EngDub.",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/jU2i-c6fAfY/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/jU2i-c6fAfY/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/jU2i-c6fAfY/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Fomica Films",
      "liveBroadcastContent": "none",
      "publishTime": "2020-03-30T15:15:11Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "oL073XlQFy21gm2AuACWmusHFfk",
    "id": {
      "kind": "youtube#video",
      "videoId": "rykJAvv0yCs"
    },
    "snippet": {
      "publishedAt": "2020-08-14T10:39:33Z",
      "channelId": "UCAP-t2h_YmcJzu2hrWpe5pw",
      "title": "SASUKE&#39;S DEATH in anime Boruto - Naruto took Sasuke&#39;s eyes | Boruto Episode Fan Animation",
      "description": "Sasuke and Naruto in the Boruto anime. What will happen to them? What fate awaits them? Especially after Isshiki arrived in Konoha. What will Kawaki do?",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/rykJAvv0yCs/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/rykJAvv0yCs/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/rykJAvv0yCs/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "AniVideo ENG SUB",
      "liveBroadcastContent": "none",
      "publishTime": "2020-08-14T10:39:33Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "EtD0wYRGvwJ9WYgM1Ncmf2k4_R8",
    "id": {
      "kind": "youtube#video",
      "videoId": "63yTuzwdFIA"
    },
    "snippet": {
      "publishedAt": "2020-09-04T19:00:13Z",
      "channelId": "UCfoSHkUwUQC8PNIS6Tmv83Q",
      "title": "Naruto Shippuden. Fourth Shinobi World War English Dub Part 2",
      "description": "Naruto Shippuden. Fourth Shinobi World War English Dub Part 2 #Naruto #NarutoShippuden #EnglishDub #FourthShinobiWorldWar.",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/63yTuzwdFIA/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/63yTuzwdFIA/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/63yTuzwdFIA/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Naruto Shippuden",
      "liveBroadcastContent": "none",
      "publishTime": "2020-09-04T19:00:13Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "j5Rr_8aXZhB8nVYbC3RaPeHcPQg",
    "id": {
      "kind": "youtube#video",
      "videoId": "AXJhXYBRkqM"
    },
    "snippet": {
      "publishedAt": "2020-08-01T19:29:48Z",
      "channelId": "UCoTaplHlqpAktPUQ2BBHnAA",
      "title": "Naruto Vs Pain | Full Fight [English Dub]",
      "description": "This channel is made, just to entertain you guys!! In this channel I'm gonna post some funny, best, compilation and badass moments of an anime. The fight ...",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/AXJhXYBRkqM/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/AXJhXYBRkqM/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/AXJhXYBRkqM/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Anime Addict",
      "liveBroadcastContent": "none",
      "publishTime": "2020-08-01T19:29:48Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "UGtGHgAVpOCfi2SDYDqqO5plBn8",
    "id": {
      "kind": "youtube#video",
      "videoId": "lIzYXcqASb8"
    },
    "snippet": {
      "publishedAt": "2020-09-05T17:02:40Z",
      "channelId": "UC7LnJAhfmQBqKWIYQ7WBpkQ",
      "title": "Goku vs  Naruto Rap Battle REMATCH! Part 2",
      "description": "GokuVsNarutoRapREMATCH Goku vs Naruto Rap Battle REMATCH! Part 2 Thanks for watching my animations and music parodies! My Gaming Channel: ...",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/lIzYXcqASb8/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/lIzYXcqASb8/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/lIzYXcqASb8/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "SSJ9K",
      "liveBroadcastContent": "none",
      "publishTime": "2020-09-05T17:02:40Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "diQ_OMIdaZldBbV5T91ZNy8pqcQ",
    "id": {
      "kind": "youtube#video",
      "videoId": "z5TEiYRv558"
    },
    "snippet": {
      "publishedAt": "2019-11-08T15:44:11Z",
      "channelId": "UCSBVzcZCCTRr7tlWTaaWC2A",
      "title": "Naruto vs Sasuke Full Fight.Naruto And Sasuke Lose Their Arms",
      "description": "",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/z5TEiYRv558/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/z5TEiYRv558/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/z5TEiYRv558/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "ItachiX69",
      "liveBroadcastContent": "none",
      "publishTime": "2019-11-08T15:44:11Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "tDITbQzEGJfxAsWmTXV2r4g7pqs",
    "id": {
      "kind": "youtube#video",
      "videoId": "WxN9m-nUjHU"
    },
    "snippet": {
      "publishedAt": "2020-06-20T10:58:48Z",
      "channelId": "UCzRM78ePHzDO-qob-15OvNg",
      "title": "The Saddest Death In Naruto Shippuden / Top 10 Most Epic-Sad Deaths In Naruto [60FPS] (English Sub)",
      "description": "The Saddest Death In Naruto Shippuden / Top 10 Most Epic-Sad Deaths In Naruto [60FPS] (English Sub) #Naruto #Boruto #ナルト疾風伝.",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/WxN9m-nUjHU/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/WxN9m-nUjHU/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/WxN9m-nUjHU/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Kakashi Hatake",
      "liveBroadcastContent": "none",
      "publishTime": "2020-06-20T10:58:48Z"
    }
  },
  {
    "kind": "youtube#searchResult",
    "etag": "Gx_OmXyTaJIsX3gMytJJAIP99zU",
    "id": {
      "kind": "youtube#video",
      "videoId": "FXYgtGLUSxI"
    },
    "snippet": {
      "publishedAt": "2020-08-13T06:33:34Z",
      "channelId": "UCFWgpWssyEKrzoKYBHLl4Xw",
      "title": "Naruto The Movie 3: Guardians of the Crescent Moon Kingdom",
      "description": "Naruto and his friends are on a mission to protect the prince of the Land of the Moon. Initial release: 5 August 2006 (Japan) ...",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/FXYgtGLUSxI/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/FXYgtGLUSxI/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/FXYgtGLUSxI/hqdefault.jpg",
          "width": 480,
          "height": 360
        }
      },
      "channelTitle": "Solo leveling Movies, anime",
      "liveBroadcastContent": "none",
      "publishTime": "2020-08-13T06:33:34Z"
    }
  }
]);
    
    const handleResultClick = (videoId) => {
        emitVideoId(videoId);
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
            });
    }
      
    useEffect(() => {
        
    }, [searchResults]);

    return (
        <div className='h-100 w-100 mw-100 mh-100 p-0 m-0'> 
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