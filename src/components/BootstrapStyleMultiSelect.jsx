import React, { useState, useRef, useEffect } from 'react';
import { Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const BootstrapStyleMultiSelect = ({ 
  chapters = [], 
  selectedChapters = [], 
  setSelectedChapters,
  disabled = false 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Finds and returns a chapter name by its code
  const getChapterName = (chapterCode) => {
    const chapter = chapters.find(ch => ch.topic_code === chapterCode);
    return chapter ? chapter.name : chapterCode;
  };
  
  // Toggle chapter selection
  const toggleChapterSelection = (chapterCode) => {
    if (selectedChapters.includes(chapterCode)) {
      setSelectedChapters(selectedChapters.filter(code => code !== chapterCode));
    } else {
      setSelectedChapters([...selectedChapters, chapterCode]);
    }
  };
  
  // Remove a chapter from selection
  const removeChapter = (chapterCode, e) => {
    e.stopPropagation(); // Prevent triggering dropdown toggle
    setSelectedChapters(selectedChapters.filter(code => code !== chapterCode));
  };

  return (
    <Form.Group controlId="formChapters" ref={wrapperRef}>
      <Form.Label>
        <FontAwesomeIcon icon={faListAlt} className="me-2" />
        Chapters
      </Form.Label>
      
      <div className="bootstrap-style-multiselect">
        {/* Selected Chapters Display */}
        <div 
          className="form-select-enhanced multiselect-input" 
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
        >
          {selectedChapters.length === 0 ? (
            <div className="placeholder">Select Chapters</div>
          ) : (
            <div className="selected-items">
              {selectedChapters.map(code => (
                <Badge 
                  key={code} 
                  className="chapter-badge"
                >
                  {getChapterName(code)}
                  <span 
                    className="badge-remove" 
                    onClick={(e) => removeChapter(code, e)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </Badge>
              ))}
            </div>
          )}
          <div className="dropdown-arrow">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        
        {/* Dropdown Options */}
        {dropdownOpen && !disabled && (
          <div className="multiselect-dropdown">
            {chapters.length === 0 ? (
              <div className="no-options">No chapters available</div>
            ) : (
              chapters.map(chapter => (
                <div 
                  key={chapter.topic_code}
                  className={`dropdown-item ${selectedChapters.includes(chapter.topic_code) ? 'selected' : ''}`}
                  onClick={() => toggleChapterSelection(chapter.topic_code)}
                >
                  {chapter.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Form.Group>
  );
};

export default BootstrapStyleMultiSelect;