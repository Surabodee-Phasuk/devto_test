
import React from 'react'

const StudentDetail = ({ name, surName, nickName, studentId, hobby }) => {
  return (
    <div className="student">
      <h1>Student Details</h1>
      <p>ชื่อ-นามสกุล: {name} {surName}</p>
      <p>ชื่อเล่น: {nickName}</p>
      <p>รหัสนักศึกษา: {studentId}</p>
      <p>งานอดิเรก: {hobby}</p>
    </div>
  )
}

export default StudentDetail