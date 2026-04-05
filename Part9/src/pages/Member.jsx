import React from "react";
import { Link } from "react-router-dom";

const Member = () => {
  const memberArr = [
    {
      name: "ศุภณัฐ",
      surName: "ตั้งกิจวุฒิกุล",
      nickName: "โปโล",
      studentId: 6609650665,
    },
    {
      name: "ภูวฤทธิ์",
      surName: "เจริญพล",
      nickName: "เติร์ด",
      studentId: 6609650590,
    },
    {
      name: "จุติณัฏฐ์",
      surName: "รัตนะมงคลกุล",
      nickName: "บอมบ์",
      studentId: 6609650228,
    },
    {
      name: "รพินทร์",
      surName: "นะราช",
      nickName: "เอม",
      studentId: 6609650624,
    },
    {
      name: "สุทธิพจน์",
      surName: "ประทุมทอง",
      nickName: "เอม",
      studentId: 6609650699,
    },
    {
      name: "สุรบดี",
      surName: "ผาสุข",
      nickName: "ไม้",
      studentId: 6609650707,
    },
  ];

  return (
    <div className="member-container">
      <div className="member">
        <div className="member-header">Member</div>
        <div>
          <div className="members-container">
            {memberArr.map((item, index) => (
              <div className="members" key={index}>
                <Link to={`/student/${item.studentId}`} className="student-id">
                  <div>{item.name}</div>
                </Link>
                <div>{item.surName}</div>
                <div>{item.nickName}</div>
                <Link to={`/student/${item.studentId}`} className="student-id">
                  <div>{item.studentId}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
