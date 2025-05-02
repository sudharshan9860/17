import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./TeacherDash.css";
import axiosInstance from "../api/axiosInstance";
import QuestionListModal from "./QuestionListModal";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tutorial from "./Tutorial";
import { useTutorial } from "../contexts/TutorialContext";
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

function TeacherDash() {
  const navigate = useNavigate();

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  // State for selections
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [questionLevel, setQuestionLevel] = useState("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  // Enhanced tutorial usage
  const {
    shouldShowTutorialForPage,
    markPageCompleted,
    resetTutorial,
    setCurrentPage,
    continueTutorialFlow,
    restartTutorialForPage,
  } = useTutorial();

  // Update current page when component mounts
  useEffect(() => {
    setCurrentPage("teacherDash");
  }, [setCurrentPage]);

  const tutorialSteps = [
    {
      target: "#formClass",
      content: "Start by selecting your class",
      disableBeacon: true,
    },
    
  ];

  // Determine if generate button should be enabled
  

  // Handle tutorial completion for this component
  const handleTutorialComplete = () => {
    console.log("Tutorial steps in TeacherDash completed");
  };

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
      external: questionType === "external" ? questionLevel : null,
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

      // Continue tutorial flow to QuestionListModal before showing the modal
      continueTutorialFlow("teacherDash", "questionListModal");

      // Show the modal after setting up tutorial flow
      setShowQuestionList(true);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  const handleQuestionClick = (question, index, image) => {
    navigate("/solvequestion", {
      state: {
        question,
        questionNumber: index + 1,
        questionList,
        class_id: selectedClass,
        subject_id: selectedSubject,
        topic_ids: selectedChapters,
        subtopic: "",
        image, // Make sure to include the image
      },
    });
  };

  // Reset Question Level when Question Type changes
  useEffect(() => {
    if (questionType !== "external") {
      setQuestionLevel("");
    }
  }, [questionType]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {shouldShowTutorialForPage("teacherDash") && (
        <Tutorial steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}
      <main className="flex-fill d-flex justify-content-center align-items-center">
        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            <div className="restart-tutorial-btn-container mb-3 text-right">
              <Button
                variant="outline-info"
                className="restart-tutorial-btn"
                onClick={() => {
                  console.log("Restarting tutorial on teacherDash page...");
                  restartTutorialForPage("teacherDash");
                }}
                size="sm"
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                Replay Tutorial
              </Button>
            </div>

            
              
                <Form.Group controlId="formClass">
                  <Form.Label>
                    <FontAwesomeIcon icon={faSchool} className="me-2" />
                    Class
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.class_code} value={cls.class_code}>
                        {cls.class_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              
            

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                className="btn-generate mt-3"
                disabled={!selectedClass}
              >
                Generate Question Paper
              </Button>
            </div>
          </Form>
        </div>
      </main>


    </div>
  );
}

export default TeacherDash;
