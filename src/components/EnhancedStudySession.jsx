import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

const EnhancedStudySession = ({ 
  classes = [], 
  subjects = [], 
  chapters = [], 
  onSubmit, 
  onReplayTutorial 
}) => {
  // State management
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState('');

  // Increase size with larger padding and margins
  const enhancedStyles = {
    card: {
      borderRadius: '15px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
      margin: '20px 0 30px 0',
    },
    cardHeader: {
      background: 'linear-gradient(to right, #00c4d6, #0088b2)',
      color: 'white',
      padding: '18px 25px',
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '1.2rem',
    },
    cardBody: {
      padding: '30px',
      background: 'white',
    },
    formGroup: {
      marginBottom: '25px',
    },
    formLabel: {
      fontSize: '1.05rem',
      fontWeight: '500',
      color: '#1a4488',
      marginBottom: '10px',
      display: 'block',
    },
    formSelect: {
      height: '50px',
      borderRadius: '10px',
      border: '1px solid #ccdbe8',
      padding: '0 15px',
      fontSize: '1rem',
      backgroundColor: '#f8fafc',
      transition: 'all 0.3s ease',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '35px',
    },
    generateButton: {
      background: 'linear-gradient(to right, #2d63d8, #1a4488)',
      border: 'none',
      borderRadius: '10px',
      padding: '14px 30px',
      fontSize: '1.1rem',
      fontWeight: '500',
      boxShadow: '0 4px 15px rgba(45, 99, 216, 0.3)',
      transition: 'all 0.3s ease',
    },
    replayButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      color: 'white',
      borderRadius: '8px',
      padding: '8px 15px',
      fontSize: '0.9rem',
    }
  };

  // Determine if generate button should be enabled
  const isGenerateButtonEnabled = () => {
    return selectedClass && selectedSubject && selectedChapters.length > 0 && questionType;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isGenerateButtonEnabled()) {
      onSubmit({
        classId: selectedClass,
        subjectId: selectedSubject,
        topicIds: selectedChapters,
        questionType
      });
    }
  };

  return (
    <Card style={enhancedStyles.card}>
      <div style={enhancedStyles.cardHeader}>
        <div>
          <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
          AI-Powered Study Session
        </div>
        <Button 
          variant="outline-light" 
          size="sm"
          style={enhancedStyles.replayButton}
          onClick={onReplayTutorial}
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="me-1" />
          Replay Tutorial
        </Button>
      </div>
      <Card.Body style={enhancedStyles.cardBody}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group style={enhancedStyles.formGroup}>
                <Form.Label style={enhancedStyles.formLabel}>
                  <FontAwesomeIcon icon={faSchool} className="me-2" />
                  Class
                </Form.Label>
                <Form.Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={enhancedStyles.formSelect}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.class_code} value={cls.class_code}>
                      {cls.class_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group style={enhancedStyles.formGroup}>
                <Form.Label style={enhancedStyles.formLabel}>
                  <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                  Subject
                </Form.Label>
                <Form.Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={enhancedStyles.formSelect}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_code} value={subject.subject_code}>
                      {subject.subject_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group style={enhancedStyles.formGroup}>
                <Form.Label style={enhancedStyles.formLabel}>
                  <FontAwesomeIcon icon={faListAlt} className="me-2" />
                  Chapters
                </Form.Label>
                <Form.Select
                  value={selectedChapters}
                  onChange={(e) => setSelectedChapters([e.target.value])}
                  style={enhancedStyles.formSelect}
                >
                  <option value="">Select Chapters</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.topic_code} value={chapter.topic_code}>
                      {chapter.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group style={enhancedStyles.formGroup}>
                <Form.Label style={enhancedStyles.formLabel}>
                  <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
                  Question Type
                </Form.Label>
                <Form.Select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  style={enhancedStyles.formSelect}
                >
                  <option value="">Select Question Type</option>
                  <option value="solved">Solved</option>
                  <option value="exercise">Exercise</option>
                  <option value="external">Set of Questions</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div style={enhancedStyles.buttonContainer}>
            <Button
              variant="primary"
              type="submit"
              className="generate-questions-btn"
              style={enhancedStyles.generateButton}
              disabled={!isGenerateButtonEnabled()}
            >
              <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
              Generate Questions
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EnhancedStudySession;