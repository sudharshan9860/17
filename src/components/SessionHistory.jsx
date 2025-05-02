import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faClock, faCheck, faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const SessionHistory = () => {
  const [expanded, setExpanded] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Load session history from localStorage
    const sessionData = localStorage.getItem('sessionHistory') || '[]';
    const parsedSessions = JSON.parse(sessionData);
    
    // Sort sessions by date (most recent first)
    const sortedSessions = parsedSessions.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    setSessions(sortedSessions);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  return (
    <Card className="session-history-card mb-4">
      <Card.Header 
        className="d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <FontAwesomeIcon icon={faHistory} className="me-2" />
          Session History
        </div>
        <div>
          <FontAwesomeIcon 
            icon={expanded ? faChevronUp : faChevronDown} 
            className="dropdown-toggle-icon"
          />
        </div>
      </Card.Header>
      
      {expanded && (
        <Card.Body className="p-0">
          {sessions.length > 0 ? (
            <ListGroup variant="flush">
              {sessions.slice(0, 10).map((session, index) => (
                <ListGroup.Item key={index} className="py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="session-title fw-bold">
                        {session.subject} - Chapter {session.chapter}
                      </div>
                      <div className="session-details small text-muted">
                        {formatDate(session.date)}
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Badge bg="info" className="me-2">
                        <FontAwesomeIcon icon={faClock} className="me-1" />
                        {formatDuration(session.studyTime)}
                      </Badge>
                      {session.isCorrect ? (
                        <Badge bg="success">
                          <FontAwesomeIcon icon={faCheck} className="me-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge bg="warning">
                          <FontAwesomeIcon icon={faTimes} className="me-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="p-3 text-center">
              <p className="mb-0">No session history available</p>
            </div>
          )}
          
          {sessions.length > 10 && (
            <div className="text-center py-2">
              <a href="/progress-dashboard" className="view-all-link">View all sessions</a>
            </div>
          )}
        </Card.Body>
      )}
    </Card>
  );
};

export default SessionHistory;