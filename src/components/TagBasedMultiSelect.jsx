import React, { useState, useRef, useEffect } from 'react';
import { Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const TagBasedMultiSelect = ({ 
  chapters = [], 
  selectedChapters = [], 
  setSelectedChapters,
  disabled = false 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
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

  // Add a chapter to selection
  const handleChapterSelect = (chapterCode) => {
    if (!selectedChapters.includes(chapterCode)) {
      setSelectedChapters([...selectedChapters, chapterCode]);
    }
  };

  // Remove a chapter from selection
  const handleRemoveChapter = (chapterCode) => {
    setSelectedChapters(selectedChapters.filter(code => code !== chapterCode));
  };

  // Find chapter name by code
  const getChapterName = (chapterCode) => {
    const chapter = chapters.find(ch => ch.topic_code === chapterCode);
    return chapter ? chapter.name : chapterCode;
  };

  return (
    <Form.Group controlId="formChapters" className="mb-3">
      <Form.Label>
        <FontAwesomeIcon icon={faListAlt} className="me-2" />
        Chapters
      </Form.Label>
      
      <div className="chapter-multiselect-container" ref={dropdownRef}>
        {/* Selected chapters display as badges */}
        <div 
          className="chapter-multiselect-input"
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="selected-chapters">
            {selectedChapters.length === 0 && (
              <span className="placeholder-text">Select Chapters</span>
            )}
            
            {selectedChapters.map(chapterCode => (
              <Badge 
                key={chapterCode} 
                bg="light" 
                text="dark" 
                className="chapter-badge"
              >
                {getChapterName(chapterCode)}
                <span 
                  className="remove-badge" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChapter(chapterCode);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </Badge>
            ))}
          </div>
          
          <div className="dropdown-toggle-icon">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        
        {/* Dropdown options */}
        {isDropdownOpen && !disabled && (
          <div className="chapter-dropdown-menu">
            {chapters.length === 0 ? (
              <div className="no-chapters">No chapters available</div>
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
      </div>    
    </Form.Group>
  );
};

export default TagBasedMultiSelect;     