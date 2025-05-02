import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Select from 'react-select';
import ExpandedChapterDropdown from './ExpandedChapterDropdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faQuestionCircle,
  faTrophy,
  faCalendarAlt,
  faChartLine,
  faStar,
  faGraduationCap,
  faCheckCircle,
  faHourglassHalf,
  faClock,
  faExternalLinkAlt,
  faHistory,
  faVideo,
  faFileAlt,
  faStickyNote,
  faBook,
  faLandmark,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../components/AuthContext";
import { ProgressContext } from "../contexts/ProgressContext";
import { useTutorial } from "../contexts/TutorialContext";
import Tutorial from "./Tutorial";
import QuestionListModal from "./QuestionListModal";
import "./StudentDash.css";
import "./ExpandedChapterDropdown.css"; // Import the CSS for the new dropdown

function StudentDash() {
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);
  const { getProgressSummary } = useContext(ProgressContext);
  const progressData = getProgressSummary();

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subTopics, setSubTopics] = useState([]);

  // State for selections
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [questionLevel, setQuestionLevel] = useState("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Animation effect for cards
  const [animateCards, setAnimateCards] = useState(false);

  // Enhanced tutorial usage
  const {
    shouldShowTutorialForPage,
    restartTutorialForPage,
    setCurrentPage
  } = useTutorial();

  // Recent activities data (this would typically come from an API)
  const recentActivities = [
    { 
      id: 1, 
      type: 'quiz', 
      title: 'Mathematics Quiz', 
      score: '85%', 
      timeAgo: '2 hours ago',
      icon: faChartLine 
    },
    { 
      id: 2, 
      type: 'topic', 
      title: 'Science: Forces and Motion', 
      score: '', 
      timeAgo: '5 hours ago',
      icon: faCheckCircle
    },
    { 
      id: 3, 
      type: 'essay', 
      title: 'English Essay', 
      score: '', 
      timeAgo: 'Yesterday',
      icon: faFileAlt
    },
    { 
      id: 4, 
      type: 'quiz', 
      title: 'History Revision Quiz', 
      score: '45%', 
      timeAgo: '3 days ago',
      icon: faHistory
    }
  ];

  // Recommended resources
  const recommendedResources = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      type: 'video',
      icon: faVideo
    },
    {
      id: 2,
      title: 'Chemical Reactions Guide',
      type: 'document',
      icon: faFileAlt
    },
    {
      id: 3,
      title: 'English Literature Notes',
      type: 'notes',
      icon: faStickyNote
    }
  ];

  // Subject progress data
  const subjectProgress = [
    { name: 'Mathematics', progress: 78, icon: faChartLine },
    { name: 'Science', progress: 65, icon: faBook },
    { name: 'English', progress: 92, icon: faBookOpen },
    { name: 'History', progress: 45, icon: faLandmark }
  ];

  // Learning summary data (would typically come from the API)
  const learningSummary = {
    overallCompletion: 72,
    completedTasks: 24,
    inProgressTasks: 7,
    badges: 12,
    rating: 4.8,
    improvement: 12
  };

  // Update current page when component mounts
  useEffect(() => {
    setCurrentPage("studentDash");

    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateCards(true);
    }, 100);
  }, [setCurrentPage]);

  // Tutorial steps with enhanced descriptions
  const tutorialSteps = [
    {
      target: ".study-session-section",
      content: "This is your AI-powered study session generator. Select a class, subject, and chapters to generate personalized study questions that adapt to your learning pace.",
      disableBeacon: true,
    },
    {
      target: ".recent-activities-section",
      content: "Track your recent learning activities here. See your quiz scores, completed topics, and other learning progress at a glance.",
    },
    {
      target: ".progress-overview-section",
      content: "This section provides an overview of your learning journey across all subjects. The progress bars show how far you've advanced in each subject.",
    },
    {
      target: ".recommended-resources-section",
      content: "ORCALEX's AI recommends personalized resources based on your learning patterns and areas that need improvement. Click on any resource to start learning.",
    }
  ];

  // Load classes when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const classResponse = await axiosInstance.get("/classes/");
        const classesData = classResponse.data.data;
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    }
    fetchData();
  }, []);

  // Load subjects when class is selected
  useEffect(() => {
    async function fetchSubjects() {
      if (selectedClass) {
        try {
          const subjectResponse = await axiosInstance.post("/subjects/", {
            class_id: selectedClass,
          });
          setSubjects(subjectResponse.data.data);
          // Reset dependent fields when class changes
          setSelectedSubject("");
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        }
      }
    }
    fetchSubjects();
  }, [selectedClass]);

  // Load chapters when subject is selected
  useEffect(() => {
    async function fetchChapters() {
      if (selectedSubject && selectedClass) {
        try {
          const chapterResponse = await axiosInstance.post("/chapters/", {
            subject_id: selectedSubject,
            class_id: selectedClass,
          });
          setChapters(chapterResponse.data.data);
          // Reset dependent fields when subject changes
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
        } catch (error) {
          console.error("Error fetching chapters:", error);
          setChapters([]);
        }
      }
    }
    fetchChapters();
  }, [selectedSubject, selectedClass]);

  // Add this to the useEffect section in StudentDash.jsx
  useEffect(() => {
    const handleScroll = () => {
      const scrollButton = document.querySelector('.scroll-to-top');
      if (scrollButton) {
        if (window.scrollY > 300) {
          scrollButton.classList.add('show');
        } else {
          scrollButton.classList.remove('show');
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Load subtopics for external question type
  useEffect(() => {
    async function fetchSubTopics() {
      if (
        questionType === "external" &&
        selectedClass &&
        selectedSubject &&
        selectedChapters.length > 0
      ) {
        try {
          const response = await axiosInstance.post("/question-images/", {
            classid: selectedClass,
            subjectid: selectedSubject,
            topicid: selectedChapters[0], // Assuming single chapter selection
            external: true,
          });
          setSubTopics(response.data.subtopics);
        } catch (error) {
          console.error("Error fetching subtopics:", error);
          setSubTopics([]);
        }
      }
    }
    fetchSubTopics();
  }, [questionType, selectedClass, selectedSubject, selectedChapters]);

  // Generate questions when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isGenerateButtonEnabled()) {
      console.error("Please select all required fields");
      return;
    }

    const requestData = {
      classid: Number(selectedClass),
      subjectid: Number(selectedSubject),
      topicid: selectedChapters,
      solved: questionType === "solved",
      exercise: questionType === "exercise",
      subtopic: questionType === "external" ? questionLevel : null,
    };

    try {
      const response = await axiosInstance.post(
        "/question-images/",
        requestData
      );
      
      // Process questions with images
      const questionsWithImages = response.data.questions.map((question) => ({
        ...question,
        question: question.question,
        image: question.question_image
          ? `data:image/png;base64,${question.question_image}`
          : null,
      }));

      setQuestionList(questionsWithImages);
      setSelectedQuestions([]);

      // Show the modal after setting up tutorial flow
      setShowQuestionList(true);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  // Check if generate button should be enabled
  const isGenerateButtonEnabled = () => {
    // If external question type is selected, also check question level
    if (questionType === "external") {
      return (
        selectedClass !== "" &&
        selectedSubject !== "" &&
        selectedChapters.length > 0 &&
        questionType !== "" &&
        questionLevel !== ""
      );
    }

    // For other question types, just check the main 4 categories
    return (
      selectedClass !== "" &&
      selectedSubject !== "" &&
      selectedChapters.length > 0 &&
      questionType !== ""
    );
  };

  // Handle question selection
  const handleQuestionClick = (question, index, image) => {
    navigate("/solvequestion", {
      state: {
        question,
        questionNumber: index + 1,
        questionList,
        class_id: selectedClass,
        subject_id: selectedSubject,
        topic_ids: selectedChapters,
        subtopic: questionType === "external" ? questionLevel : "",
        image,
        selectedQuestions: selectedQuestions,
      },
    });
  };

  // Handle multiple question selection
  const handleMultipleSelectSubmit = (selectedQuestionsData) => {
    setSelectedQuestions(selectedQuestionsData);
    setShowQuestionList(false);

    // Navigate to SolveQuestion with the first selected question
    const firstQuestion = selectedQuestionsData[0];
  navigate("/solvequestion", {
    state: {
      question: firstQuestion.question,
      questionNumber: firstQuestion.index + 1,
      questionList, // The full question list is still needed for reference
      class_id: selectedClass,
      subject_id: selectedSubject,
      topic_ids: selectedChapters,
      subtopic: questionType === "external" ? questionLevel : "",
      image: firstQuestion.image,
      selectedQuestions: selectedQuestionsData, // The selected questions subset
    },
  });
};

  // Navigate to view all activities
  const handleViewAllActivities = () => {
    navigate("/progress-dashboard");
  };

  // Navigate to resource library
  const handleResourceLibrary = () => {
    // This would typically navigate to a resource library page
    navigate("/resources");
  };

  // Open a resource
  const handleOpenResource = (resource) => {
    // This would typically open the resource
    alert(`Opening resource: ${resource.title}`);
  };

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    console.log("Tutorial completed for StudentDash");
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="student-dash-container">
      {shouldShowTutorialForPage("studentDash") && (
        <Tutorial steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}

      <div className="welcome-header">
        <h2 className={`welcome-title ${animateCards ? 'animate-fade-in' : ''}`}>Welcome to Your Learning Journey</h2>
      </div>

      <Row className="mx-0">
        {/* Left Column - Study Session & Progress Overview */}
        <Col lg={12} className="mb-4">
          {/* AI-Powered Study Session Section */}
          <Card className={`study-session-section mb-4 ${animateCards ? 'animate-card' : ''}`} style={{'--animation-order': 1}}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                AI-Powered Study Session
              </div>
              <Button 
                variant="outline-light" 
                size="sm"
                className="replay-tutorial-btn"
                onClick={() => restartTutorialForPage("studentDash")}
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="me-1" />
                Replay Tutorial
              </Button>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formClass">
                      <Form.Label>
                        <FontAwesomeIcon icon={faSchool} className="me-2" />
                        Class
                      </Form.Label>
                      <Form.Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="form-select-enhanced"
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
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formSubject">
                      <Form.Label>
                        <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                        Subject
                      </Form.Label>
                      <Form.Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        disabled={!selectedClass}
                        className="form-select-enhanced"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option
                            key={subject.subject_code}
                            value={subject.subject_code}
                          >
                            {subject.subject_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

<Row>
  <Col md={6} className="mb-3 chapter-dropdown" style={{ position: 'relative', zIndex: 9999 }}>
    {/* Replace the old chapters selection with our new ExpandedChapterDropdown component with higher z-index */}
    <ExpandedChapterDropdown
      chapters={chapters}
      selectedChapters={selectedChapters}
      setSelectedChapters={setSelectedChapters}
      disabled={!selectedSubject}
      questionType={questionType}
    />
  </Col>
  <Col md={6} className="mb-3">
    <Form.Group controlId="formQuestionType">
      <Form.Label>
        <FontAwesomeIcon
          icon={faClipboardQuestion}
          className="me-2"
        />
        Question Type
      </Form.Label>
      <Form.Select
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
        disabled={selectedChapters.length === 0}
        className="form-select-enhanced"
      >
        <option value="">Select Question Type</option>
        <option value="solved">Solved</option>
        <option value="exercise">Exercise</option>
        <option value="external">Set of Questions</option>
      </Form.Select>
    </Form.Group>
  </Col>
</Row>

{/* Add a larger gap to prevent content overlap if dropdown expands */}
<div style={{ height: '30px', clear: 'both' }}></div>

{questionType === "external" && (
  <Row>
    <Col md={6} className="mb-3">
      <Form.Group controlId="formQuestionLevel">
        <Form.Label>
          <FontAwesomeIcon
            icon={faClipboardQuestion}
            className="me-2"
          />
          Select The Set
        </Form.Label>
        <Form.Select
          value={questionLevel}
          onChange={(e) => setQuestionLevel(e.target.value)}
          className="form-select-enhanced"
        >
          <option value="">Select The Set</option>
          {subTopics.map((subTopic, index) => (
            <option key={subTopic} value={subTopic}>
              {`Exercise ${index + 1}`}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>
  </Row>
)}

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className="generate-questions-btn"
                    disabled={!isGenerateButtonEnabled()}
                  >
                    <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
                    Generate Questions
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Add a section separator to ensure proper spacing */}
          <div className="section-separator"></div>

          {/* Learning Progress Overview Section */}
          <Card className={`progress-overview-section ${animateCards ? 'animate-card' : ''}`} style={{'--animation-order': 2}}>
            <Card.Header>
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              Learning Progress Overview
            </Card.Header>
            <Card.Body>
              <div className="overall-completion mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="fs-4 mb-0">Overall Completion</h3>
                  <div className="improvement-badge">
                    <FontAwesomeIcon icon={faArrowUp} className="me-1 text-success" />
                    <span className="text-success">{learningSummary.improvement}% from last week</span>
                  </div>
                </div>
                <h2 className="fs-1 fw-bold mb-3 completion-percentage">{learningSummary.overallCompletion}%</h2>
              </div>

              {/* Subject Progress Bars */}
              <div className="subject-progress-bars">
                {subjectProgress.map((subject, index) => (
                  <div key={index} className="subject-progress-item mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div>
                        <FontAwesomeIcon icon={subject.icon || faBook} className="me-2" />
                        {subject.name}
                      </div>
                      <span>{subject.progress}%</span>
                    </div>
                    <ProgressBar 
                      now={subject.progress} 
                      variant={
                        subject.progress >= 80 ? "success" : 
                        subject.progress >= 60 ? "info" :
                        subject.progress >= 40 ? "warning" : "danger"
                      }
                      className="animated-progress-bar"
                    />
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              <Row className="stats-summary text-center mt-4">
                <Col xs={6} md={3} className="stats-item">
                  <div className="stats-icon completed">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div className="stats-label">Completed</div>
                  <div className="stats-value">{learningSummary.completedTasks}</div>
                </Col>
                <Col xs={6} md={3} className="stats-item">
                  <div className="stats-icon in-progress">
                    <FontAwesomeIcon icon={faHourglassHalf} />
                  </div>
                  <div className="stats-label">In Progress</div>
                  <div className="stats-value">{learningSummary.inProgressTasks}</div>
                </Col>
                <Col xs={6} md={3} className="stats-item">
                  <div className="stats-icon badges">
                    <FontAwesomeIcon icon={faTrophy} />
                  </div>
                  <div className="stats-label">Badges</div>
                  <div className="stats-value">{learningSummary.badges}</div>
                </Col>
                <Col xs={6} md={3} className="stats-item">
                  <div className="stats-icon rating">
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <div className="stats-label">Rating</div>
                  <div className="stats-value">{learningSummary.rating}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mx-0 mt-4">
        <Col lg={6} className="mb-4">
          {/* Recent Activities Section */}
          <Card className={`recent-activities-section ${animateCards ? 'animate-card' : ''}`} style={{'--animation-order': 3}}>
            <Card.Header>
              <FontAwesomeIcon icon={faClock} className="me-2" />
              Recent Activities
            </Card.Header>
            <Card.Body>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <FontAwesomeIcon icon={activity.icon} />
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-time text-muted">{activity.timeAgo}</div>
                    </div>
                    {activity.score && (
                      <div className={`activity-score ${
                        parseInt(activity.score) >= 70 ? 'text-success' : 
                        parseInt(activity.score) >= 50 ? 'text-warning' : 'text-danger'
                      }`}>
                        {activity.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-3">
                <Button 
                  variant="link" 
                  className="view-all-link"
                  onClick={handleViewAllActivities}
                >
                  View All Activities
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {/* Recommended Resources Section */}
          <Card className={`recommended-resources-section ${animateCards ? 'animate-card' : ''}`} style={{'--animation-order': 4}}>
            <Card.Header>
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              Recommended Resources
            </Card.Header>
            <Card.Body>
              <div className="resource-list">
                {recommendedResources.map((resource) => (
                  <div key={resource.id} className="resource-item" onClick={() => handleOpenResource(resource)}>
                    <div className="resource-icon">
                      <FontAwesomeIcon icon={resource.icon} />
                    </div>
                    <div className="resource-details">
                      <div className="resource-title">{resource.title}</div>
                      <div className="resource-type">{resource.type}</div>
                    </div>
                    <div className="resource-action">
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="resource-search mt-4">
                <p className="text-center mb-2">Looking for specific study materials?</p>
                <div className="text-center">
                  <Button 
                    variant="outline-primary"
                    onClick={handleResourceLibrary}
                    className="resource-library-btn"
                  >
                    Search Resource Library
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Scroll to top button */}
      <div className={`scroll-to-top ${animateCards ? 'show' : ''}`} onClick={scrollToTop}>
        <FontAwesomeIcon icon={faArrowUp} />
      </div>

      {/* Question List Modal */}
      <QuestionListModal
        show={showQuestionList}
        onHide={() => setShowQuestionList(false)}
        questionList={questionList}
        onQuestionClick={handleQuestionClick}
        isMultipleSelect={questionType === "external"}
        onMultipleSelectSubmit={handleMultipleSelectSubmit}
      />
    </div>
  );
}

export default StudentDash;