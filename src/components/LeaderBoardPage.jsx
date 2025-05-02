import React, { useContext, useState, useMemo } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Nav, 
  Button, 
  Modal 
} from 'react-bootstrap';
import { LeaderboardContext } from '../contexts/LeaderboardContext';
import { AuthContext } from '../components/AuthContext';
import ShootingStars from './ShootingStars';
import '../styles/LeaderboardAnimation.css';

const LeaderboardPage = () => {
  // Context hooks
  const { leaderboard, currentUserEntry } = useContext(LeaderboardContext);
  const { username } = useContext(AuthContext);

  // State management
  const [activeTab, setActiveTab] = useState('overall');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Memoized top entries to optimize performance
  const topEntries = useMemo(() => leaderboard.getTopEntries(10), [leaderboard]);

  // Render rank badge with styling
  const renderRankBadge = (rank) => {
    let badgeClass = 'rank-badge';
    if (rank <= 3) {
      badgeClass += ` ${rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze'}`;
    }
    return (
      <span className={badgeClass}>
        {rank}
      </span>
    );
  };

  // Show user details modal
  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Render leaderboard table
  const renderLeaderboardTable = () => (
    <div className="leaderboard-container p-3">
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Total Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {topEntries.map((entry) => (
            <tr 
              key={entry.userId} 
              className={`leaderboard-entry ${entry.username === username ? 'table-active' : ''}`}
            >
              <td>
                {renderRankBadge(entry.rank)}
                {entry.rank <= 3 && (
                  <div className={`top-three-badge ${
                    entry.rank === 1 ? 'gold' : 
                    entry.rank === 2 ? 'silver' : 
                    'bronze'
                  }`}>
                    🏆
                  </div>
                )}
              </td>
              <td>{entry.username}</td>
              <td>
                <span className="points-shine">{entry.totalPoints} pts</span>
              </td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handleShowDetails(entry)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Render user details modal
  const renderUserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser.username}'s Leaderboard Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="mb-3">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5>
                  Rank: {renderRankBadge(selectedUser.rank)}
                </h5>
                <h5 className="points-shine">
                  Total Points: {selectedUser.totalPoints}
                </h5>
              </div>
            </Card.Header>
            <Card.Body>
              <h6 className="mb-3">Points Breakdown</h6>
              <Row>
                {Object.entries(selectedUser.pointBreakdown).map(([category, points]) => (
                  <Col key={category} md={6} className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>{category.replace(/_/g, ' ').toUpperCase()}</span>
                      <strong>{points} Points</strong>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {selectedUser.badges && selectedUser.badges.length > 0 && (
            <Card>
              <Card.Header>Earned Badges</Card.Header>
              <Card.Body>
                <Row>
                  {selectedUser.badges.map((badge, index) => (
                    <Col key={index} xs={4} className="text-center mb-2">
                      <div 
                        className="badge-icon" 
                        style={{ 
                          fontSize: '2rem', 
                          color: badge.type === 'gold' ? '#FFD700' : 
                                 badge.type === 'silver' ? '#C0C0C0' : '#CD7F32'
                        }}
                      >
                        🏆
                      </div>
                      <p>{badge.name}</p>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container fluid className="leaderboard-page">
      {/* Shooting stars background */}
      <ShootingStars />
      
      {/* Page Title */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-center glow-text">Leaderboard</h2>
        </Col>
      </Row>

      {/* Current User's Rank */}
      {currentUserEntry && (
        <Row className="mb-4">
          <Col>
            <Card className="float-animation">
              <Card.Body className="text-center">
                <h4>Your Current Ranking</h4>
                <div className="d-flex justify-content-center align-items-center">
                  <h3 className="mr-3">
                    {renderRankBadge(currentUserEntry.rank)} 
                  </h3>
                  <div className="ml-3">
                    <h5>{username}</h5>
                    <p className="points-shine">
                      Total Points: {currentUserEntry.totalPoints}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Leaderboard Navigation */}
      <Row className="mb-3">
        <Col>
          <Nav variant="tabs" defaultActiveKey="overall">
            <Nav.Item>
              <Nav.Link 
                eventKey="overall" 
                active={activeTab === 'overall'}
                onClick={() => setActiveTab('overall')}
              >
                Overall
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="weekly" 
                active={activeTab === 'weekly'}
                onClick={() => setActiveTab('weekly')}
              >
                Weekly
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Leaderboard Table */}
      <Row>
        <Col>
          {renderLeaderboardTable()}
        </Col>
      </Row>

      {/* User Details Modal */}
      {renderUserDetailsModal()}
    </Container>
  );
};

export default LeaderboardPage;