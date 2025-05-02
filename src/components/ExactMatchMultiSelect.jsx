import React, { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ExactMatchMultiSelect = ({ 
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

  // Format chapter code for display (like CHAPTER_8_TRIANGLES)
  const formatChapterCode = (chapterCode) => {
    if (!chapterCode) return '';
    
    // If it's already in the desired format, return it
    if (chapterCode.includes('CHAPTER_')) {
      return chapterCode;
    }
    
    // Otherwise, get the name and convert it to the desired format
    const chapterName = getChapterName(chapterCode);
    return 'CHAPTER_' + chapterCode + '_' + chapterName.replace(/\s/g, '_').toUpperCase();
  };

  return (
    <Form.Group controlId="formChapters" ref={wrapperRef}>
      <Form.Label>
        <FontAwesomeIcon icon={faListAlt} className="me-2" />
        Chapters
      </Form.Label>
      
      <div className="exact-match-multiselect">
        {/* Selected Chapters Display */}
        <div 
          className="form-select-enhanced multiselect-input" 
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
        >
          {selectedChapters.length === 0 ? (
            <div className="placeholder">Select Chapters</div>
          ) : (
            <div className="selected-chapters-container">
              {selectedChapters.map(code => (
                <div key={code} className="chapter-tag">
                  {formatChapterCode(code)}
                  <span 
                    className="tag-remove" 
                    onClick={(e) => removeChapter(code, e)}
                  >
                    ×
                  </span>
                </div>
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

export default ExactMatchMultiSelect;