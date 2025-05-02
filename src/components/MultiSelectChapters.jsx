// MultiSelectChapters.jsx
import React from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';

const MultiSelectChapters = ({ 
  chapters, 
  selectedChapters, 
  setSelectedChapters, 
  disabled 
}) => {
  const handleChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedChapters(selectedOptions);
  };

  return (
    <Form.Group controlId="formChapters">
      <Form.Label>
        <FontAwesomeIcon icon={faListAlt} className="me-2" />
        Chapters
      </Form.Label>
      <div className="chapter-multi-select">
        <Form.Select
          multiple
          value={selectedChapters}
          onChange={handleChange}
          disabled={disabled}
          className="form-select-enhanced"
          style={{ height: "120px" }}
        >
          {chapters.map((chapter) => (
            <option
              key={chapter.topic_code}
              value={chapter.topic_code}
            >
              {chapter.name}
            </option>
          ))}
        </Form.Select>
        <small className="text-muted">Hold Ctrl (or Cmd) to select multiple chapters</small>
      </div>
    </Form.Group>
  );
};

export default MultiSelectChapters;