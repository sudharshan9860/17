import React, { useContext, useState } from 'react';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ProgressContext } from '../contexts/ProgressContext';
import StudyStreak from './StudyStreak';
import SubjectProgress from './SubjectProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faChartLine, 
  faAward, 
  faGift 
} from '@fortawesome/free-solid-svg-icons';

const ProgressDashboard = () => {
  const { 
    getProgressSummary, 
    redeemReward 
  } = useContext(ProgressContext);

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  
  // Safely get progress data with default values
  const progressData = getProgressSummary() || {
    streak: 0,
    longestStreak: 0,
    totalStudyDays: 0,
    weeklySummary: { dailyLogs: {} },
    points: 0,
    badges: [],
    totalQuestions: 0,
    correctQuestions: 0,
    accuracy: 0
  };

  // Transform weekly summary into chart-friendly format
  const chartData = Object.entries(progressData.weeklySummary?.dailyLogs || {})
    .map(([date, data]) => ({
      date,
      studyTime: data?.studyTime || 0,
      questionsAttempted: data?.questionsAttempted || 0
    }));

  const availableRewards = [
    { 
      name: 'Extra Practice Session', 
      cost: 100, 
      description: 'Unlock additional practice questions',
      icon: faChartLine
    },
    { 
      name: 'Hint Token', 
      cost: 50, 
      description: 'Get a helpful hint for challenging questions',
      icon: faAward
    },
    { 
      name: 'Bonus Question', 
      cost: 75, 
      description: 'Earn an extra challenge question',
      icon: faTrophy
    }
  ];

  const handleRedeemReward = (rewardName) => {
    try {
      const redeemedReward = redeemReward(rewardName);
      if (redeemedReward) {
        alert(`Successfully redeemed: ${redeemedReward.name}`);
        setShowRedeemModal(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="progress-page-container">
      {/* Study Streak Section */}
      <div className="streak-card">
        <StudyStreak />
      </div>

      {/* Performance Overview */}
      <div className="performance-card">
        <Card className="h-100">
          <Card.Header>Performance Overview</Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h5>Accuracy</h5>
                <h3 className="text-primary">
                  {progressData.accuracy.toFixed(2)}%
                </h3>
              </div>
              <div>
                <h5>Total Questions</h5>
                <h3 className="text-success">
                  {progressData.totalQuestions}
                </h3>
              </div>
            </div>
            <div className="progress-details text-muted">
              <small>
                Correct Answers: {progressData.correctQuestions}
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Weekly Progress */}
      <div className="weekly-progress-card">
        <Card>
          <Card.Header>Weekly Study Progress</Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="studyTime" 
                  stroke="#8884d8" 
                  name="Study Time (mins)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="questionsAttempted" 
                  stroke="#82ca9d" 
                  name="Questions Attempted" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </div>

      {/* Subject Progress */}
      <div className="subject-progress-section">
        <SubjectProgress />
      </div>

      {/* Badges and Rewards */}
      <div className="row">
        {/* Badges Section */}
        <div className="col-md-8">
          <div className="badges-section">
            <Card>
              <Card.Header>Earned Badges</Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap justify-content-center">
                  {progressData.badges.length > 0 ? (
                    progressData.badges.map((badge, index) => (
                      <div 
                        key={index} 
                        className="badge-item text-center m-2"
                        style={{ width: '120px' }}
                      >
                        <div 
                          className="badge-icon" 
                          style={{ 
                            fontSize: '3rem', 
                            color: badge.type === 'gold' ? '#FFD700' : 
                                   badge.type === 'silver' ? '#C0C0C0' : '#CD7F32'
                          }}
                        >
                          🏆
                        </div>
                        <p>{badge.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center w-100">No badges earned yet</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="col-md-4">
          <div className="rewards-section">
            <Card>
              <Card.Header>
                <FontAwesomeIcon icon={faGift} className="mr-2" />
                Rewards
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h3 className="rewards-title">
                      <span role="img" aria-label="gift">🎁</span> Rewards
                    </h3>
                    <div className="points-display">{progressData.points} Points</div>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="redeem-button"
                    onClick={() => setShowRedeemModal(true)}
                  >
                    Redeem Rewards
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Reward Redemption Modal */}
      <Modal show={showRedeemModal} onHide={() => setShowRedeemModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Redeem Rewards</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {availableRewards.map((reward, index) => (
              <Col key={index} md={4} className="text-center mb-3">
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <FontAwesomeIcon 
                      icon={reward.icon} 
                      className="mb-3 text-primary" 
                      size="2x" 
                    />
                    <h5>{reward.name}</h5>
                    <p className="text-muted small">{reward.description}</p>
                    <p className="font-weight-bold">{reward.cost} Points</p>
                    <Button 
                      variant="outline-primary" 
                      className="mt-auto"
                      disabled={progressData.points < reward.cost}
                      onClick={() => handleRedeemReward(reward.name)}
                    >
                      Redeem
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProgressDashboard;