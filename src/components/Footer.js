import React from "react";
import '../styles/footer-styles.css'

const Footer = () => {
  const now = new Date();
  return(
    <footer className="footer">
      <p id='footer-time' >Arrival: {now.getHours()}:{now.getUTCMinutes()}:{now.getUTCSeconds()}</p >
      <p id="footer-text">2025 IRLnetwork</p>
    </footer>
  )
}

export default Footer;
