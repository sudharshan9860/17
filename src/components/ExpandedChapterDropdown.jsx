import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ExpandedChapterDropdown = ({ 
  chapters = [], 
  selectedChapters = [], 
  setSelectedChapters,
  disabled = false,
  questionType = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Handle chapter selection
  const handleChapterSelect = (chapterCode) => {
    if (questionType === "external") {
      // Single selection for external question type
      setSelectedChapters([chapterCode]);
      setIsDropdownOpen(false);
    } else {
      // Toggle selection for multi-select
      if (selectedChapters.includes(chapterCode)) {
        setSelectedChapters(selectedChapters.filter(code => code !== chapterCode));
      } else {
        setSelectedChapters([...selectedChapters, chapterCode]);
      }
    }
  };

  // Get display text for selected chapter(s)
  const getDisplayText = () => {
    if (selectedChapters.length === 0) {
      return "Select Chapters";
    } else if (questionType === "external" || selectedChapters.length === 1) {
      const chapter = chapters.find(c => c.topic_code === selectedChapters[0]);
      return chapter ? chapter.name : "Selected Chapter";
    } else {
      return `${selectedChapters.length} chapters selected`;
    }
  };

  return (
    <div className="expanded-chapter-dropdown-container" ref={dropdownRef}>
      <Form.Group controlId="formChapters">
        <Form.Label>
          <FontAwesomeIcon icon={faListAlt} className="me-2" />
          Chapters
        </Form.Label>
        
        {/* Custom dropdown trigger */}
        <div 
          className={`custom-select-control ${isDropdownOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={toggleDropdown}
        >
          <div className="selected-value">
            {getDisplayText()}
          </div>
          <div className="dropdown-arrow">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        
        {/* Improved Dropdown Menu - Always shows the full height of chapters */}
        {isDropdownOpen && (
          <div className="chapter-dropdown-menu" style={{ maxHeight: '350px' }}>
            {chapters.length === 0 ? (
              <div className="chapter-option">No chapters available</div>
            ) : (
              chapters.map(chapter => (
                <div 
                  key={chapter.topic_code}
                  className={`chapter-option ${selectedChapters.includes(chapter.topic_code) ? 'selected' : ''}`}
                  onClick={() => handleChapterSelect(chapter.topic_code)}
                >
                  {chapter.name}
                </div>
              ))
            )}
          </div>
        )}
        
        <small className="form-text text-muted mt-1">
          {questionType === "external" 
            ? "Select a chapter (scroll to see all options)" 
            : "Select one or more chapters (scroll to see all options)"}
        </small>
      </Form.Group>
    </div>
  );
};

export default ExpandedChapterDropdown;