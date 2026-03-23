import React from 'react';

function Student({ name, nickname }) {
  // 
  return (
    <span>
      <strong>{name}</strong> <span>(ชื่อเล่น: {nickname})</span>
    </span>
  );
}

export default Student;