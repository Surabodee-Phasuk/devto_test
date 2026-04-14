const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is my home page");
  } 
  else if (req.url === "/members_text") {
    const filePath = path.join(__dirname, "members.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(data);
    });
  } 
  else if (req.url === "/members_html") {
    // ส่วนที่ 2 ข้อ 3 อ่านไฟล์และส่งกลับเป็น HTML
    const filePath = path.join(__dirname, "members.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading members.html");
        return;
      }
      // text/html
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } 
  else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});