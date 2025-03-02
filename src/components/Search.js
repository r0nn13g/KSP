import {React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/live-card-styles.css';
import axios from "axios";
import PulsatingDot from './PulsatingDot';
import VideocamOffIcon from '@mui/icons-material/VideocamOffOutlined';
import CancelIcon from '@mui/icons-material/Cancel';

let pfp;
let pfpLive;
let slug;
let kickAvatar = 'https://kick.com/img/default-profile-pictures/default2.jpeg';
let isLive;
let isVerified;
let verified;
let verifiedBadge = 'https://i.imgur.com/quUBzZJ.png';
let verifiedLive;
let channel;
let channelLive;
let followers;
let followerCount;
let followersLive;
let rawViewers;
let viewerCount;
let titleLive;
let streamTitle;
let previousStreamTitle;

const Search = () => {
  const [data, setData] = useState([]);
  const [streamerName, setStreamerName] = useState("");

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      const responseData = response.data;
      console.log(responseData);

      setData((prevData) => {
        if (prevData.length > 0) {
          const combinedData = [...prevData, responseData];
          const onlineStreamers = combinedData.filter(
            (item) => item.livestream && item.livestream.viewer_count_ws > 0
          );
          const offlineStreamers = combinedData.filter(
            (item) => !item.livestream || item.livestream.viewer_count_ws === 0
          );
          const sortedOnlineStreamers = onlineStreamers.sort(
            (a, b) => b.livestream.viewer_count_ws - a.livestream.viewer_count_ws
          );
          return [...sortedOnlineStreamers, ...offlineStreamers];
        } else {
          return [responseData];
        }
      });
    } catch (error) {
      console.log("Softbanned by kick servers & cloudflare");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const slug = streamerName.toLowerCase().replace(/\s/g, "");
    let url = `https://kick.com/api/v1/channels/${slug}`;
    fetchData(url);
    setStreamerName("");
  };

  const deleteStreamer = (slug) => {
    setData((prevData) => {
      const updatedData = prevData.filter((item) => item.slug !== slug);
      return updatedData;
    });
  };

  useEffect(() => {
    fetchData();

    const refreshInterval = 60000;
    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem("streamData", JSON.stringify(data));
  }, [data]);

        return (
          <div className="search">
             <div className="search-input-wrapper" style={{textAlign: "center", color: "var(--gray-elements)", margin: "10px"}}>
              <h1 style={{margin: "20px"}}>
                SEARCH 🔎
              </h1>
              {/* <h4 style={{color: "var(--gray-elements)", textAlign: "center", marginTop: "50px"}}>
               Search for any streamer on Kick
              </h4> */}
          <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={streamerName}
            onChange={(event) => setStreamerName(event.target.value)}
            placeholder="Enter streamer's name"
            />
          <button type="submit">Search</button>
        </form>
      </div>
                     
                      {data.map((item,index) => {
                        //if verified object exists than a channel is verified and the verified variable is set to true
                        if(item.verified !== null){
                            verified = true;
                          } else {
                            verified = false;
                          }
                          //if item exists, set variables for channel name, followers, and previousStream titles
                          if(item && item.user && item.previous_livestreams[0]){
                            pfp = item.user.profile_pic;
                            channel = item.user.username;
                            followerCount = item.followersCount;
                            followers = followerCount.toLocaleString("en-US");
                            previousStreamTitle = item.previous_livestreams[0].session_title
                            slug = item.slug;
                          } else {
                            pfp = item.user.profile_pic;
                            channel = item.user.username;
                            followerCount = item.followersCount;
                            followers = followerCount.toLocaleString("en-US");
                            previousStreamTitle = "No titles yet.";
                            slug = item.slug;
                          };
                          //if channel is live, populate raw viewers, followers, slug and stream title, else if channel is offline set stream title to the last stream title used by channel
                          if(item.livestream){
                            pfp = item.user.profile_pic;
                            channel = item.user.username;
                            console.log("Live:", channel)
                            followerCount = item.followersCount;
                            followers = followerCount.toLocaleString("en-US");
                            rawViewers = item.livestream.viewer_count_ws;
                            viewerCount = rawViewers.toLocaleString("en-US");
                            streamTitle = item.livestream.session_title;
                            slug = item.slug;
                          } else {
                            viewerCount = null;
                            streamTitle = `${previousStreamTitle}`;
                          };
                          //if a profile pic does not exist and channel has never gone live, set channel name, followers, previous stream title, and profile pic to default kick avatar.
                          if(!item.user.profile_pic && !item.livestream ){
                            pfp = kickAvatar;
                          };
                         //if channel is live, display Pulsating dot
                        isLive = item.livestream === null ? <div id='offline-live'><VideocamOffIcon/></div> : <div id='online-live'><PulsatingDot /></div>; 
                        //if channel is partnered with kick display verified badge next to name
                        isVerified = verified === true ? <img id='verified-badge-online' src={verifiedBadge} alt='verification-badge'/> : null ;
                        //if channel is partnered with kick and offline display verified badge with gray scale filter
                        verifiedLive = isVerified !== null && !item.livestream ? <img id='verified-badge-offline' src={verifiedBadge} alt='verification-badge'/> : isVerified;
                        //if channel is live display elements in color, else display in gray scale.
                        channelLive = !item.livestream ? <h6 id='channel-offline'>{channel}{verifiedLive}</h6> : <h6 id='channel-online'>{channel}{isVerified}</h6>;
                        titleLive = !item.livestream ? <h6 id='title-offline'>{streamTitle}</h6> : <h6 id='title-online'>{streamTitle}</h6>;
                        pfpLive = !item.livestream ? <img id='offline-pfp' src={pfp} alt='channel_pfp'/> : <img id='online-pfp' src={pfp} alt='channel_pfp'/>;
                        followersLive = item.livestream === null ? <p id='followers-offline'>{followers}</p> : <p id='followers-online'>{followers}</p>;      
                        //jsx returning live stream card
                        return(
                          <div key={index} className='live-stream-card'>
                              <Link className='channel-pfp-container' to={`https://www.kick.com/${slug}`} target="_blank" path='relative' style={{textDecoration: 'none'}} >
                                <div className="pfp">
                                  {pfpLive}
                                </div>
                              </Link>
                                <div  className='live-stream-details-container'>
                                  <div className='channel-name-container'>
                                    {channelLive}
                                  </div> 
                                  <div className='followed-by-container'>
                                    <div id='followers'>
                                      {followersLive}
                                    </div>
                                  </div>
                                  <Link to={`https://www.kick.com/${slug}/chatroom`} target="_blank" path='relative' style={{textDecoration: 'none'}} >
                                  <div className="stream-title-container">
                                    {titleLive} 
                                  </div>
                                  </Link>
                                  </div>
                                  <div className="is-live">
                                      {isLive}
                                    <Link to={`https://www.kick.com/${slug}/chatroom`} target="_blank" path='relative' style={{textDecoration: 'none'}} >
                                    <div className='live-viewers-count-container'>
                                      {viewerCount} 
                                    </div>
                                </Link>
                                  <CancelIcon key={index} id="delete-from-list" onClick={() => deleteStreamer(item.slug)}/>
                            </div>
                      </div>   
                  )})
                }
      </div>
  );
};

export default Search;
