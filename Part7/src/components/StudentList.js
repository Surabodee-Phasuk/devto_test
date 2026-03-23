import React, { useState } from "react";
import Student from "./Student";
import "../App.css";

function StudentList({ studentList }) {
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [students, setStudents] = useState(studentList);

  const handleItemClick = (index) => {
    setHighlightedIndex(index);
  };

  const handleSortAlphabet = () => {
    const sortedList = [...students].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    setStudents(sortedList);
    setHighlightedIndex(null); 
  };

  const handleDoubleClick = (index) => {
  setStudents(students.filter((_, i) => i !== index));
  setHighlightedIndex(null);
  };

  return (
    <div>
      <h2>รายชื่อนักศึกษา</h2>
      <button 
        onClick={handleSortAlphabet} 
      >
        เรียงลำดับชื่อตามตัวอักษร
      </button>
      <ul>
        {students.map((student, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(index)}
            className={highlightedIndex === index ? "highlighted" : ""}
            onDoubleClick={() => handleDoubleClick(index)}
          >
            <Student name={student.name} nickname={student.nickname} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;