import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-section">
          <h4>Education</h4>
          <ul>
            <li>Department of Computer Science</li>
            <li>Faculty of Science and Technology</li>
            <li>
              <a 
                href="https://maps.google.com/?q=Thammasat+University+Rangsit" 
                target="_blank" 
                rel="noopener noreferrer"
                title="View on Google Maps"
              >
                Thammasat University
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Project</h4>
          <ul>
            <li>Lab 10 - Group 05</li>
            <li>
              <a href="https://github.com/phuwalit6609650590/CSTU-CS363" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Created By</h4>
          <ul>
            <li>React</li>
            <li>
              <img src="/react_original_wordmark_logo_icon_146375.png" alt="React Logo" className="react-logo-img" />
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;