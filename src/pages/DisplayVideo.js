import React from "react";
import '../styles/video-styles.css';
import AdTicker from '../components/AdTicker.js';
import YouTube from 'react-youtube';
import { useParams } from "react-router-dom";
import youtubePlay  from '../assets/youtube.png';
import Footer from '../components/Footer.js';

const DisplayVideo = () => {
    const { id } = useParams();
    return (
      <>
        <AdTicker />
      <div className="youtube-video-wrapper">
          <div className="Video-embed">
            <YouTube id="youtube-video-player" videoId={id} style={{}} />
          </div>
            <a id="youtube-video-player-link-01dj0d1jd1jhfgh" href="https://www.youtube.com/channel/UCmXAEqNsldIpQWK6M8F156g?themeRefresh=1" target="blank">
            <img  id="youtube-play-button" src={youtubePlay} alt="youtube_play_button" style={{height: "14px", marginLeft: "10px", marginTop:"20px"}}/>
            &nbsp;
            <h4 id="youtube-channel-header" style={{color: "var(--green-elements", display: "flex", paddingBottom: "10px"}}>
              @Kick_clipz
            </h4>
            </a>
      </div>
            <Footer />
      </>
    );
};

export default DisplayVideo;
