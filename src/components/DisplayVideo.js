import React from "react";
import '../styles/video-styles.css';
import AdTicker from '../components/AdTicker.js';
import YouTube from 'react-youtube';
import { useParams } from "react-router-dom";
import youtubePlay  from '../assets/youtube.png';

const DisplayVideo = () => {
    const { id } = useParams();
    return (
      <div className="youtube-video-wrapper">
        <AdTicker />
          <div className="youtube-video-container">
          <h3 style={{color: "var(--white-elements", textAlign: "center",  borderBottom: "2px solid var(--gray-elements"}}>
            YOUTUBE 
          </h3>
            <YouTube id="youtube-video-player" videoId={id} style={{paddingTop: "100px"}} />
          </div>
            <a id="youtube-video-player-link-01dj0d1jd1jhfgh" href="https://www.youtube.com/channel/UCmXAEqNsldIpQWK6M8F156g?themeRefresh=1" target="blank">
            <img  id="youtube-play-button" src={youtubePlay} alt="youtube_play_button" style={{height: "20px", marginLeft: "10px", marginTop:"20px"}}/>
            <h3 id="youtube-channel-header" style={{color: "var(--green-elements", display: "flex", marginBottom: "10px", paddingBottom: "20px"}}>
              @kick_clipz
            </h3>
            </a>
      </div>
    );
};

export default DisplayVideo;
