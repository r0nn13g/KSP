import axios from "axios";
import '../styles/live-card-styles.css';
import { Link } from "react-router-dom";
import PulsatingDot from './PulsatingDot';
import { gamblers } from "../data/gambaStreamers";
import {React, useState, useEffect} from "react";
import LiveCardSkeleton from "./LiveCardSkeleton.js"
import verifiedBadge from "../assets/verified_badge.png";
import VideoCamOffIcon from '@mui/icons-material/VideocamOffOutlined';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import RotatingSpinner from '../components/RotatingSpinner.js';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

  let pfp;
  let pfpLive;
  let slug;
  let kickAvatar = 'https://dbxmjjzl5pc1g.cloudfront.net/7756bbea-c4f5-4871-8e79-d094e11223db/images/user-profile-pic.png';
  let isLive;
  let isVerified;
  let verified;
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

  const Live = () => {
    const [isLoading, setLoading] = useState(true);
    const [showLive, setShowLive] = useState(true);
    const [randomOrder, setRandomOrder] = useState(false);
    const [sortHighToLow, setSortHighToLow] = useState(true);
    const [onlineStreamers, setOnlineStreamers] = useState([]);
    const [offlineStreamers, setOfflineStreamers] = useState([]);
    const [loadingTimeout, setLoadingTimeout] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const responses = await Promise.all(
            gamblers.map((url) => axios.get(url))
          );
          const responseData = responses.map((urls) => urls.data);
          const validResponses = responseData.filter(
            (response) => response.status !== null
          );

          const onlineStreamers = validResponses.filter(
            (response) =>
              response.livestream && response.livestream.viewer_count >= 0
          );
          const offlineStreamers = validResponses.filter(
            (response) => response.livestream === null
          );

          setOnlineStreamers(onlineStreamers);
          setOfflineStreamers(offlineStreamers);
          setLoading(false);
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
          }
        } catch (error) {
          if (error.response) {
            console.error("Banned channel in streamers Array", error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            setLoading(true);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
          if (!loadingTimeout) {
            setLoadingTimeout(setTimeout(() => {
              setLoading(false);
              console.log("Softbanned by Cloudflare & kick servers. Retrying in a few moments.");
            }, 20000)); 
          }
        }
      };

      fetchData(); //<-----FETCHING CALLS FROM KICK API. 
      const interval = setInterval(fetchData, 40000); //<-- FETCHES EVERY 40 SECONDS
      return () => {
        clearInterval(interval);
      };
    }, [loadingTimeout]); //<--LOADING TIMEOUT DEPENDANCY IMPROVES STABILITY WHEN FETCHING CONSISTENTLY 
    
    const toggleLiveOffline = () => {
      setShowLive((prevMode) => !prevMode);
    };

    const toggleSortOrder = () => {
      setSortHighToLow((prevSortOrder) => !prevSortOrder);
    };

    const toggleShuffle = () => {
      setRandomOrder((prevOrder) => !prevOrder)
    }


    const sortedOnlineStreamers = onlineStreamers.slice().sort((a, b) => {
      if (sortHighToLow) {
        return b.livestream.viewer_count - a.livestream.viewer_count;
      } else {
        return a.livestream.viewer_count - b.livestream.viewer_count;
      }
    });
    
    const getRandomizedStreamers = () => {
      if(randomOrder){
        const randomizedStreamers = [...sortedOnlineStreamers];
        for (let i = randomizedStreamers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomizedStreamers[i], randomizedStreamers[j]] = [
            randomizedStreamers[j],
            randomizedStreamers[i],
          ];
        }
        return randomizedStreamers; 
      } else { 
        return sortedOnlineStreamers;
      }
    };

    const displayStreamers = getRandomizedStreamers();
    
        return (
          <div className="live-stream-card-container">
        <div className="offline-online-switch-container">
        <button id="sort-order-switch" onClick={toggleSortOrder}>
          {sortHighToLow ? <ArrowDownwardIcon style={{color: "white"}}/> : <ArrowUpwardIcon style={{color: "white"}}/>}
        </button>
        <button id="shuffle-button" onClick={toggleShuffle} >
            <b>Shuffle</b>
          </button>
        <button id="online-offline-switch" onClick={toggleLiveOffline}>
          {showLive ? <b>Online</b> : <b>Offline</b>}
        </button>
        </div>
        <div className="live-header-banner-wrapper">
          <div className="video-camera-icon-container">
            <h3 id="live-header-container">
              {showLive ? "Live" : "Offline" }
            </h3>
            {showLive ? <VideoCameraFrontIcon style={{ fill: showLive ? 'var(--gray-elements)' : 'gray' }}/> :  <VideoCamOffIcon style={{fill: showLive ? 'red' : 'gray'}}/> }
          </div>
        </div>
        { loadingTimeout ? (
          <div className="live-stream-card-error" style={{textAlign: "center", margin:"200px 20px 0px 20px"}}>
            <RotatingSpinner />
          <b style={{color: "var(--gray-elements)", fontSize: "30px"}}>
              You are being rate limited. Please retry in a few moments.
          </b>
        </div>
        ) : isLoading ? (
          <LiveCardSkeleton />
          ) : (
            <>
            {showLive ? (
              // Display online streamers
              <>
                {displayStreamers.map((item, index) => {
                  // if verified object exists than a channel is verified and the verified variable is set to true
                  verified = item.verified !== null;

                  // if item exists, set variables for channel name, followers, and previousStream titles
                  pfp = item.user.profile_pic || kickAvatar;
                  channel = item.user.username;
                  followerCount = item.followersCount;
                  followers = followerCount.toLocaleString("en-US");
                  previousStreamTitle = item.previous_livestreams[0]
                  ? item.previous_livestreams[0].session_title
                    : "No titles yet.";
                  slug = item.slug;

                  // if channel is live, populate raw viewers, followers, slug and stream title, else if channel is offline set stream title to the last stream title used by channel
                  rawViewers = item.livestream
                  ? item.livestream.viewer_count
                  : null;
                  viewerCount = rawViewers
                    ? rawViewers.toLocaleString("en-US")
                    : "Live";
                    streamTitle = item.livestream
                    ? item.livestream.session_title
                    : previousStreamTitle;

                  // if a profile pic does not exist and channel has never gone live, set channel name, followers, previous stream title, and profile pic to default kick avatar.
                  pfpLive = item.livestream ? (
                    <img id="online-pfp" src={pfp} alt="channel_pfp" />
                    ) : (
                      <img id="offline-pfp" src={pfp} alt="channel_pfp" />
                  );

                  // if channel is live, display Pulsating dot
                  isLive = item.livestream ? (
                    <div id="online-live">
                      <PulsatingDot />
                    </div>
                  ) : (
                    <div id="offline-live">
                      {/* <VideocamOffIcon /> */}
                    </div>
                  );

                  // if channel is partnered with kick display verified badge next to name
                  isVerified = verified ? (
                    <img
                      id="verified-badge-online"
                      src={verifiedBadge}
                      alt="verification-badge"
                      />
                      ) : null;
                      
                      // if channel is partnered with kick and offline display verified badge with gray scale filter
                      verifiedLive =
                      !item.livestream && isVerified ? (
                        <img
                        id="verified-badge-offline"
                        src={verifiedBadge}
                        alt="verification-badge"
                        />
                    ) : (
                      isVerified
                    );

                  // if channel is live display elements in color, else display in gray scale.
                  channelLive = item.livestream ? (
                    <h6 id="channel-online">
                      {channel}
                      {isVerified}
                    </h6>
                  ) : (
                    <h6 id="channel-offline">
                      {channel}
                      {verifiedLive}
                    </h6>
                  );

                  // Stream title
                  titleLive = item.livestream ? (
                    <h6 id="title-online">{streamTitle}</h6>
                  ) : (
                    <h6 id="title-offline">{streamTitle}</h6>
                  );

                  // Followers
                  followersLive = item.livestream ? (
                    <p id="followers-online">{followers} followers</p>
                    ) : (
                      <p id="followers-offline">{followers} followers</p>
                      );
                      
                      // JSX returning live stream card
                      return (
                        <Link
                          className="channel-pfp-container"
                          to={`https://www.kick.com/${slug}`}
                          target="_blank"
                          path="relative"
                          style={{ textDecoration: "none" }}
                        >
                        <div key={index} className="live-stream-card">
                          <div className="pfp">{pfpLive}</div>
                        <div className="live-stream-details-container">
                          <div className="channel-name-container">
                            {channelLive}
                          </div>
                        <div className="followed-by-container">
                          <div id="followers">{followersLive}</div>
                        </div>
                        <div className="stream-title-container">
                            {titleLive}
                        </div>
                        </div>
                          <div className="is-live">
                            {isLive}        
                          <div className="live-viewers-count-container">
                            {viewerCount}
                          </div>
                          </div>
                        </div>
                      </Link>
                  );
                })}
              </>
            ) : (
              // Display offline streamers
              <>
                {offlineStreamers.map((item, index) => {
                  // if verified object exists than a channel is verified and the verified variable is set to true
                  verified = item.verified !== null;

                  // if item exists, set variables for channel name, followers, and previousStream titles
                  pfp = item.user.profile_pic || kickAvatar;
                  channel = item.user.username;
                  followerCount = item.followersCount;
                  followers = followerCount.toLocaleString("en-US");
                  previousStreamTitle = item.previous_livestreams[0]
                    ? item.previous_livestreams[0].session_title
                    : "No titles yet.";
                  slug = item.slug;

                  // if channel is live, populate raw viewers, followers, slug and stream title, else if channel is offline set stream title to the last stream title used by channel
                  rawViewers = item.livestream
                    ? item.livestream.viewer_count
                    : null;
                  viewerCount = rawViewers
                    ? rawViewers.toLocaleString("en-US")
                    : null;
                  streamTitle = item.livestream
                    ? item.livestream.session_title
                    : previousStreamTitle;

                  // if a profile pic does not exist and channel has never gone live, set channel name, followers, previous stream title, and profile pic to default kick avatar.
                  pfpLive = item.livestream ? (
                    <img id="online-pfp" src={pfp} alt="channel_pfp" />
                  ) : (
                    <img id="offline-pfp" src={pfp} alt="channel_pfp" />
                  );

                  // if channel is live, display Pulsating dot
                  isLive = item.livestream ? (
                    <div id="online-live">
                      <PulsatingDot />
                    </div>
                  ) : (
                    <div id="offline-live">
                      {/* <VideocamOffIcon /> */}
                    </div>
                  );

                  // if channel is partnered with kick display verified badge next to name
                  isVerified = verified ? (
                    <img
                      id="verified-badge-online"
                      src={verifiedBadge}
                      alt="verification-badge"
                    />
                  ) : null;

                  // if channel is partnered with kick and offline display verified badge with gray scale filter
                  verifiedLive =
                    !item.livestream && isVerified ? (
                      <img
                        id="verified-badge-offline"
                        src={verifiedBadge}
                        alt="verification-badge"
                      />
                    ) : (
                      isVerified
                    );

                  // if channel is live display elements in color, else display in gray scale.
                  channelLive = item.livestream ? (
                    <h6 id="channel-online">
                      {channel}
                      {isVerified}
                    </h6>
                  ) : (
                    <h6 id="channel-offline">
                      {channel}
                      {verifiedLive}
                    </h6>
                  );
                  
                  // Stream title
                  titleLive = item.livestream ? (
                    <h6 id="title-online">{streamTitle}</h6>
                  ) : (
                    <h6 id="title-offline">{streamTitle}</h6>
                  );
                  // Followers
                  followersLive = item.livestream ? (
                    <p id="followers-online">{followers} followers</p>
                  ) : (
                    <p id="followers-offline">{followers} followers</p>
                  );

                  // JSX returning live stream card
                  return (
                    <div key={index} className="live-stream-card">
                      <Link
                        className="channel-pfp-container"
                        to={`https://www.kick.com/${slug}`}
                        target="_blank"
                        path="relative"
                      >
                        <div className="pfp">{pfpLive}</div>
                      </Link>
                      <div className="live-stream-details-container">
                        <div className="channel-name-container">
                          {channelLive}
                        </div>
                        <div className="followed-by-container">
                          <div id="followers">{followersLive}</div>
                        </div>
                        <Link
                          to={`https://www.kick.com/${slug}/chatroom`}
                          target="_blank"
                          path="relative"
                          style={{ textDecoration: "none" }}
                        >
                          <div className="stream-title-container">
                            {titleLive}
                          </div>
                        </Link>
                      </div>
                      <div className="is-live">
                        {isLive}
                        <Link
                          to={`https://www.kick.com/${slug}/chatroom`}
                          target="_blank"
                          path="relative"
                          style={{ textDecoration: "none" }}
                        >
                          <div className="live-viewers-count-container">
                            {viewerCount}
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
          )}
      </div>
    );
  };
  
  export default Live;