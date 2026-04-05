import React from "react";
import { useParams } from "react-router-dom";
import StudentDetail from "../components/StudentDetail";

const Student = () => {
  const { id } = useParams();

  const memberArr = [
    {
      name: "ศุภณัฐ",
      surName: "ตั้งกิจวุฒิกุล",
      nickName: "โปโล",
      studentId: 6609650665,
      hobby: "เล่นฟุตบอล",
    },
    {
      name: "ภูวฤทธิ์",
      surName: "เจริญพล",
      nickName: "เติร์ด",
      studentId: 6609650590,
      hobby: "",
    },
    {
      name: "จุติณัฏฐ์",
      surName: "รัตนะมงคลกุล",
      nickName: "บอมบ์",
      studentId: 6609650228,
      hobby: "ต่อ Gunpla",
    },
    {
      name: "รพินทร์",
      surName: "นะราช",
      nickName: "เอม",
      studentId: 6609650624,
      hobby: "ดูซีรีส์",
    },
    {
      name: "สุทธิพจน์",
      surName: "ประทุมทอง",
      nickName: "เอม",
      studentId: 6609650699,
      hobby: "เล่นเกม",
    },
    {
      name: "สุรบดี",
      surName: "ผาสุข",
      nickName: "ไม้",
      studentId: 6609650707,
      hobby: "ฟังเพลง",
    },
  ];

  const student = memberArr.find((item) => item.studentId === Number(id));

  return (
    <StudentDetail
      name={student.name}
      surName={student.surName}
      nickName={student.nickName}
      studentId={student.studentId}
      hobby={student.hobby}
    />
  );
};

export default Student;
