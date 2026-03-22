import './App.css';
import StudentList from './components/StudentList';

function App() {

  const studentList = [
    {name: "Thammasat Rakdham", nickname: "Deng"},
    {name: "Sarah Smith", nickname: "Dhum"},
    {name: "Mayuri Booksak", nickname: "Yuri"}
  ];

  const groupMembers = [
    {name: "นายสุรบดี ผาสุข", nickname: "ไม้"},
    {name: "นายจุติณัฏฐ์ รัตนะมงคลกุล", nickname: "บอมบ์"},
    {name: "นายภูวฤทธิ์ เจริญพล", nickname: "เติร์ด"},
    {name: "นายรพินทร์ นะราช", nickname: "เอม"},
    {name: "นายศุภณัฐ ตั้งกจิวุฒิกุล", nickname: "โปโล"},
    {name: "นายสุทธิพจน์ ประทุมทอง", nickname: "เอม"}
  ];

  return (
    <div className="App">
      <StudentList studentList={studentList} />
      <hr style={{ margin: '20px 0' }} />
      {/* Reuse Component */}
      <StudentList studentList={groupMembers} />
    </div>
  );
}

export default App;
