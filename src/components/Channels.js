import {React, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import '../styles/channel-styles.css';
import axios from "axios";
import { streamers } from "../data/streamers";
import PulsatingDot from './PulsatingDot';
import VideocamOffIcon from '@mui/icons-material/VideocamOffOutlined';
import RotatingSpinner from "../components/RotatingSpinner";

// Declare variables to store data
  let pfp;
  let pfpLive;
  let slug;
  let kickAvatar = 'https://dbxmjjzl5pc1g.cloudfront.net/3b83fba0-3fe7-4538-ae3f-3e95592706ec/images/user-profile-pic.png';
  let isLive;
  let isVerified;
  let verified;
  let verifiedBadge = 'https://i.imgur.com/quUBzZJ.png';
  let verifiedLive;
  let channel;
  let channelLive;
  let streamTitle;
  let titleLive;
  let rawViewers;
  let followers;
  let followerCount;
  let followersLive;
  let viewerCount;
  let previousStreamTitle;

const Channels = () => {
     // State to store the sorted data
     const [data, setData] = useState([]);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       const fetchData = async () => {
         try {
           const responses = await Promise.all(streamers.map(url => axios.get(url)));  
           const responseData = responses.map(urls => urls.data);
           const validResponses = responseData.filter(response => response.status !== null);
            // sorts data area by concurrent viewership
            const sortedData = [...validResponses].sort((a, b) => {
               return (b?.livestream?.viewer_count || 0) - (a?.livestream?.viewer_count || 0);
             });
              setData(sortedData);
              setIsLoading(false); 
          } catch (error) {
            // Ignore 404 response and return null for this URL
            if (error.response && error.response.status === 404) {
              console.error("Banned channel in streamers Array", error);
              setIsLoading(true);
            } else if (error.response === 429) {
              console.error("Too many requests. Please wait and try again later.", error);
              // Handle the 429 status error here
              // You can display an error message to the user, set a retry mechanism, or take any other appropriate action
              // For example, you can set a timeout and call `fetchData` again after a certain interval
            } else {
              throw error; // Throw other errors
            }
          };
         };
         const refreshInterval = 60000;
         fetchData(); 
         setInterval(fetchData, refreshInterval);
       }, []);

        return (
            <div className="live-stream-card-container">
                    {isLoading ? (
                      <RotatingSpinner />
                      ) : (
                        <>
            {data.map((item,index) => {
              console.log(item)
                      //if verified object exists than a channel is verified and the verified variable is set to true
                      if(item.verified !== null){
                        verified = true;
                        console.log("verified user", verified);
                      } else {
                        verified = false;
                        console.log("verified user", verified);
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
              
              //if channel is live, populate raw viewers variable wiith live concurrent viewer count and previous stream title
              if(item.livestream){
                pfp = item.user.profile_pic;
                channel = item.user.username;
                console.log(channel)
                followerCount = item.followersCount;
                followers = followerCount.toLocaleString("en-US");
                rawViewers = item.livestream.viewer_count;
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
                      <Link className='channel-pfp-container' style={{textDecoration: 'none'}} to={`https://www.kick.com/${slug}`} path='relative'>
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
                          <Link style={{textDecoration: 'none'}}  to={`https://www.kick.com/${slug}/chatroom`}>
                          <div className="stream-title-container">
                            {titleLive} 
                          </div>
                          </Link>
                          </div>
                          <div className="is-live">
                              {isLive}
                            <Link style={{textDecoration: 'none'}}  to={`https://www.kick.com/${slug}/chatroom`}>
                            <div className='live-viewers-count-container'>
                              {viewerCount}
                            </div>
                          </Link>
                          </div>
                    </div>   
                       )
                      })
                    }
                    </>
                    )}
           </div>
        );
    };
export default Channels;
