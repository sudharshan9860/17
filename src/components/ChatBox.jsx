import React, { useState, useRef, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import axiosInstance from "../api/axiosInstance";
import "./ChatBox.css";

const formatMessage = (text) => {
  if (!text) return null;

  // Handle array responses
  if (Array.isArray(text)) {
    return (
      <div className="paragraph-solution">
        {text.map((paragraph, index) => {
          // Remove ALL quotes, colons, commas, and square brackets from each paragraph
          let cleanedText = paragraph;
          if (typeof cleanedText === "string") {
            cleanedText = cleanedText.replace(/["':,\[\]]/g, "");
          }

          return (
            <p key={index} className="solution-paragraph">
              {formatMessageText(cleanedText)}
            </p>
          );
        })}
      </div>
    );
  }

  return formatMessageText(text);
};

const formatMessageText = (text) => {
  if (!text) return null;

  // Remove ALL quotes, colons, commas, and square brackets from non-array text
  if (typeof text === "string") {
    text = text.trim().replace(/["':,\[\]]/g, "");
  }

  // Split text into segments based on math delimiters
  const segments = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return segments.map((segment, index) => {
    if (segment.startsWith("$$") && segment.endsWith("$$")) {
      return <BlockMath key={index}>{segment.slice(2, -2)}</BlockMath>;
    } else if (segment.startsWith("$") && segment.endsWith("$")) {
      return <InlineMath key={index}>{segment.slice(1, -1)}</InlineMath>;
    } else if (segment.startsWith("```") && segment.endsWith("```")) {
      return (
        <pre key={index} className="code-block">
          <code>{segment.slice(3, -3)}</code>
        </pre>
      );
    } else {
      return (
        <span key={index}>
          {segment.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i !== segment.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }
  });
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your questions today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    const userMessageId = Date.now();
    const userMessage = {
      id: userMessageId,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const response = await axiosInstance.post("/chatbot/", {
        message: newMessage,
      });

      // Process the solution data
      let solutionData = response.data.step_by_step_solution;

      // If it's an array, clean each string element by removing ALL quotes
      if (Array.isArray(solutionData)) {
        solutionData = solutionData.map((item) =>
          typeof item === "string" ? item.replace(/["':,\[\]]/g, "") : item
        );
      }

      const aiResponse = {
        id: userMessageId + 1,
        text:
          solutionData ||
          "I'm not sure about that. Could you try rephrasing your question?",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = {
        id: userMessageId + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-box-container">
      <button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        {!isOpen && <span className="chat-label">Ask a question</span>}
      </button>

      <div className={`chat-box ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h5>AI Tutor Assistant</h5>
          <button className="close-btn" onClick={toggleChat}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="message-bubble">
                {formatMessage(message.text)}
              </div>
              <div className="message-time">
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message ai-message">
              <div className="message-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <Form onSubmit={sendMessage} className="chat-input">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type your question..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default ChatBox;
