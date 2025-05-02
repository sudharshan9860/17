import React from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const FixedFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer fixed-footer">
      <Container fluid className="d-flex justify-content-center align-items-center">
        <div className="footer-logo">
          <div className="footer-logo-text">
            <span className="orcalex-brand">ORCALEX</span>
            <span className="ms-2 technologies-text">Technologies</span>
          </div>
          <div className="copyright-text">
            <FontAwesomeIcon icon={faCopyright} className="me-1" />
            {currentYear}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default FixedFooter;