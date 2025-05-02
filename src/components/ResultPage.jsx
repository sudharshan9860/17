import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Accordion, Alert, Spinner } from 'react-bootstrap';
import './ResultPage.css';
import QuestionListModal from './QuestionListModal';
import axiosInstance from '../api/axiosInstance';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQuestionListModal, setShowQuestionListModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [autoCalculatedScore, setAutoCalculatedScore] = useState(null);
  
  const { state } = location;
  const { 
    message, 
    ai_data, 
    actionType, 
    questionList, 
    class_id, 
    subject_id, 
    topic_ids, 
    subtopic,
    questionImage,
    questionNumber
  } = state || {};
  
  const { 
    question, 
    ai_explaination, 
    student_answer, 
    concepts, 
    comment, 
    concepts_used,
    solution, 
    score, 
    obtained_marks, 
    total_marks, 
    question_marks,
    question_image_base64
  } = ai_data || {};

  const formated_concepts_used= Array.isArray(concepts_used)
  ? concepts_used.join(', ')
  : concepts_used || '';

  // Auto-calculate score if none is provided from API
  useEffect(() => {
    // Only auto-calculate for 'submit' and 'correct' actions if no score is provided
    if ((actionType === 'submit' || actionType === 'correct') && 
        student_answer && 
        obtained_marks === undefined && 
        score === undefined) {
      calculateAutoScore();
    }
  }, [ai_data, actionType, student_answer]);

  // Function to calculate score based on student answer
  const calculateAutoScore = async () => {
    if (!student_answer || !question) {
      return;
    }
    
    setIsCalculatingScore(true);
    
    try {
      // Try to use AI to score the answer
      const aiScoringResponse = await axiosInstance.post('/auto-score/', {
        student_answer,
        question,
        expected_solution: ai_explaination || solution || [],
        total_marks: total_marks || question_marks || 10
      }).catch(() => null); // Fail gracefully if endpoint doesn't exist

      if (aiScoringResponse?.data?.score !== undefined) {
        // Use AI-generated score if available
        setAutoCalculatedScore(aiScoringResponse.data.score);
      } else {
        // Fallback to basic keyword matching if AI scoring fails
        const fallbackScore = calculateFallbackScore();
        setAutoCalculatedScore(fallbackScore);
      }
    } catch (error) {
      console.error('Error calculating score:', error);
      // Fallback to basic scoring if API fails
      const fallbackScore = calculateFallbackScore();
      setAutoCalculatedScore(fallbackScore);
    } finally {
      setIsCalculatingScore(false);
    }
  };

  // Fallback scoring method using keyword matching
  const calculateFallbackScore = () => {
    const totalMark = total_marks || question_marks || 10;
    
    // Convert expected solution to string for comparison
    const expectedSolution = Array.isArray(ai_explaination) 
      ? ai_explaination.join(' ') 
      : (Array.isArray(solution) ? solution.join(' ') : '');
    
    if (!expectedSolution) {
      return 0; // No way to score without an expected solution
    }

    // Normalize text for comparison
    const normalizeText = (text) => {
      return text.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .trim();
    };
    
    const normalizedStudentAnswer = normalizeText(student_answer);
    const normalizedSolution = normalizeText(expectedSolution);
    
    // Extract keywords for comparison
    const extractKeywords = (text) => {
      const commonWords = ['the', 'and', 'is', 'in', 'of', 'to', 'for', 'a', 'by', 'with', 'as'];
      const words = text.split(/\s+/);
      return words.filter(word => 
        word.length > 2 && !commonWords.includes(word)
      );
    };
    
    const solutionKeywords = extractKeywords(normalizedSolution);
    const studentKeywords = extractKeywords(normalizedStudentAnswer);
    
    // Count matching keywords
    let matchCount = 0;
    for (const keyword of solutionKeywords) {
      if (studentKeywords.includes(keyword)) {
        matchCount++;
      }
    }
    
    // Calculate percentage match (with minimum score of 1 if any match is found)
    const matchPercentage = solutionKeywords.length > 0 
      ? matchCount / solutionKeywords.length 
      : 0;
    
    // Convert to score out of total marks
    let calculatedScore = Math.round(matchPercentage * totalMark);
    
    // Ensure score is at least 1 if there was some match and answer isn't empty
    if (calculatedScore === 0 && matchCount > 0 && normalizedStudentAnswer.length > 10) {
      calculatedScore = 1;
    }
    
    // Special case: If answer matches nearly exactly, give full marks
    if (matchPercentage > 0.8) {
      calculatedScore = totalMark;
    }
    
    return calculatedScore;
  };

  const handleBackToDashboard = () => {
    navigate('/student-dash');
  };

  const handleShowQuestionList = () => {
    setShowQuestionListModal(true);
  };

  const handleCloseQuestionList = () => {
    setShowQuestionListModal(false);
  };

  const handleQuestionSelect = (selectedQuestion, index, selectedImage) => {
    // Use the index from the selectedQuestions array if it exists,
    // otherwise use the index from the full questionList
    const questionSource = location.state?.selectedQuestions || questionList;
    
    navigate('/solvequestion', { 
      state: { 
        question: selectedQuestion, 
        questionNumber: index + 1, 
        questionList: questionSource, // Pass the selected questions as the questionList
        class_id,
        subject_id,
        topic_ids,
        subtopic,
        image: selectedImage,
        selectedQuestions: location.state?.selectedQuestions // Pass selected questions through
      } 
    });
  };

  const handlePracticeSimilar = () => {
    if (!question) {
      setErrorMessage('No question available for practice');
      return;
    }
  
    navigate('/similar-questions', {
      state: {
        originalQuestion: question,
        class_id,
        subject_id,
        topic_ids,
        subtopic,
        questionImage,
        solution: ai_explaination || solution
      }
    });
  };

  // Display the score with proper formatting
  const renderScore = () => {
    // First try to use the API-provided score
    const scoreFromApi = obtained_marks !== undefined 
                    ? (typeof obtained_marks === 'number' ? obtained_marks : parseInt(obtained_marks, 10))
                    : (score !== undefined 
                        ? (typeof score === 'number' ? score : parseInt(score, 10))
                        : null);
    
     // Get the total marks value
  const totalValue = total_marks !== undefined
  ? (typeof total_marks === 'number' ? total_marks : parseInt(total_marks, 10))
  : (question_marks !== undefined
      ? (typeof question_marks === 'number' ? question_marks : parseInt(question_marks, 10))
      : 10);

// If API score is available, use it
if (scoreFromApi !== null) {
return (
<div className="result-score">
<p><strong>Score:</strong> {scoreFromApi} / {totalValue}</p>
</div>
);
}
    
    // If we're calculating score, show loading spinner
    if (isCalculatingScore) {
      return (
        <div className="result-score calculating">
          <p>
            <Spinner animation="border" size="sm" /> 
            <strong> Calculating Score...</strong>
          </p>
        </div>
      );
    }
    
    // If we have auto-calculated a score, show it
    // if (autoCalculatedScore !== null) {
    //   return (
    //     <div className="result-score auto-calculated">
    //       <p><strong>Auto-Score:</strong> {autoCalculatedScore} / {totalValue}</p>
    //       <span className="score-note">This score was auto-calculated based on your answer</span>
    //     </div>
    //   );
    // }
    
    // // Default case: show zero score
    // return (
    //   <div className="result-score">
    //     <p><strong>Score:</strong> 0 / {totalValue}</p>
    //   </div>
    // );
  };

  // Function to render solution steps with proper formatting
  const renderSolutionSteps = (steps) => {
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return <p>No solution steps available.</p>;
    }
  
    return (
      <div className="solution-steps">
        {steps.map((step, index) => {
          // Check if the step contains a "Step X:" pattern
          const stepMatch = step.match(/^Step\s+(\d+):\s+(.*)/i);
          
          if (stepMatch) {
            const [_, stepNumber, stepContent] = stepMatch;
            return (
              <div key={index} className="solution-step-container">
                <div className="step-title">Step {stepNumber}:</div>
                <div className="step-description">{stepContent}</div>
              </div>
            );
          } else {
            step = step.replace(/["':,`\[\]]/g, "")                     // Remove unwanted characters
             .replace(/step_by_step_solution/g, "")         // Remove specific word
                                      // s
                       // Remove empty lines
                                               // Join back with single newline

            // For steps without explicit "Step X:" format
            return (
              <div key={index} className="solution-step-container">
                {/* <div className="step-title">Step {index + 1}:</div> */}
                <div className="step-description">{step}</div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const formatExampleContent = (example) => {
    if (!example) return null;

    // Separate the initial part (before first Step) and the steps
    const [intro, ...stepParts] = example.split(/Step \d+:/);
    
    return (
      <div className="example-content">
        <p>{intro.trim()}</p>
        <div className="example-steps">
          {stepParts.map((step, index) => (
            <div key={index} className="example-step">
              <strong>{`Step ${index + 1}:`}</strong>{step.trim()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContentBasedOnAction = () => {
    if (!actionType) {
      return <p>No action type provided. Unable to display results.</p>;
    }

    switch (actionType) {
      case 'submit':
        return (
          <>
            <div className="result-explanation">
              <p><strong>Student Answer:</strong></p>
              <div className="student-answer-content">
                {student_answer || "No answer submitted"}
              </div>
            </div>
            {renderScore()}
            {comment && (
              <div className="result-explanation">
                <p><strong>Comments:</strong> {comment}</p>
              </div>
            )}
            {formated_concepts_used && (
              <div className="result-explanation">
                <p><strong>Concepts Used:</strong> {formated_concepts_used}</p>
              </div>
            )}
          </>
        );
      case 'solve':
        return (
          <>
            <div className="result-explanation">
              <p className="solution-header">AI Solution:</p>
              {question_image_base64 && (
                <div className="solution-image-container">
                  <img 
                    src={`data:image/jpeg;base64,${question_image_base64}`}
                    alt="Solution diagram"
                    className="solution-image"
                  />
                </div>
              )}
              {renderSolutionSteps(ai_explaination)}
            </div>
            {comment && (
              <div className="result-explanation">
                <p><strong>Comments:</strong> {comment}</p>
              </div>
            )}
            {formated_concepts_used && (
              <div className="result-explanation">
                <p><strong>Concepts Used:</strong> {formated_concepts_used}</p>
              </div>
            )}
          </>
        );
      case 'correct':
        return (
          <>
            <div className="result-explanation">
              <p><strong>Student Answer:</strong></p>
              <div className="student-answer-content">
                {student_answer || "No answer submitted"}
              </div>
            </div>
            <div className="result-explanation">
              <p className="solution-header">AI Solution:</p>
              {question_image_base64 && (
                <div className="solution-image-container">
                  <img 
                    src={`data:image/jpeg;base64,${question_image_base64}`}
                    alt="Solution diagram"
                    className="solution-image"
                  />
                </div>
              )}
              {renderSolutionSteps(ai_explaination)}
            </div>
            {renderScore()}
            {comment && (
              <div className="result-explanation">
                <p><strong>Comments:</strong> {comment}</p>
              </div>
            )}
            {formated_concepts_used && (
              <div className="result-explanation">
                <p><strong>Concepts Used:</strong> {formated_concepts_used}</p>
              </div>
            )}
          </>
        );
      case 'explain':
        return (
          <>
            {concepts && (
              <Accordion defaultActiveKey="0" className="result-accordion">
                {concepts.map((conceptItem, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index} className="accordion-item">
                    <Accordion.Header>
                      <strong>{`Concept ${index + 1}`}</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="concept-title"><strong>{conceptItem.concept}</strong></p>
                      <p className="chapter-name"><strong>Chapter Name:</strong> {conceptItem.chapter}</p>
                      <div className="example-section">
                        <p className="example-header"><strong>Example:</strong></p>
                        {formatExampleContent(conceptItem['example'])}
                      </div>
                      <p className="explanation"><strong>Explanation:</strong> {conceptItem.explanation}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
            {comment && (
              <div className="result-explanation">
                <p><strong>Comments:</strong> {comment}</p>
              </div>
            )}
            {formated_concepts_used && (
              <div className="result-explanation">
                <p><strong>Concepts Used:</strong> {formated_concepts_used}</p>
              </div>
            )}
          </>
        );
      default:
        return <p>No action type provided. Unable to display results.</p>;
    }
  };

  return (
    <Container className="result-page-container">
      <Row className="justify-content-center">
        <Col md={10} lg={10} className="result-content">
          <h2 className="result-title">Result</h2>
          
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
              {errorMessage}
            </Alert>
          )}
          
          <div className="result-question">
            <p><strong>Question {questionNumber}:</strong> {question}</p>
            {questionImage && (
              <div className="question-image-container">
                <img 
                  src={questionImage}
                  alt="Question"
                  className="question-image"
                />
              </div>
            )}
            {solution && solution.length > 0 && (
              <div className="result-solution">
                <p className="solution-header">Solution:</p>
                {renderSolutionSteps(solution)}
              </div>
            )}
          </div>
          
          {renderContentBasedOnAction()}
          
          <div className="result-buttons">
            <Button 
              variant="primary" 
              onClick={handleShowQuestionList}
              className="next-question-btn"
            >
              Next Questions
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={handleBackToDashboard}
              className="dashboard-btn"
            >
              Dashboard
            </Button>
            <Button 
              variant="primary" 
              onClick={handlePracticeSimilar}
              className="practice-btn"
            >
              Similar Questions
            </Button>
          </div>
        </Col>
      </Row>

      <QuestionListModal 
  show={showQuestionListModal} 
  onHide={handleCloseQuestionList} 
  questionList={location.state?.selectedQuestions || questionList} // Use selected questions if available
  onQuestionClick={handleQuestionSelect} 
/>
    </Container>
  );
};

export default ResultPage;