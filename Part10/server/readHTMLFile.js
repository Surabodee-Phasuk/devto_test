// ส่วนที่ 1 ข้อ 4 อ่านไฟล์โดยใช้fs module 

function readHTML(htmlFileName) {}

const fs = require('fs');

function readHTML(htmlFileName) {
    fs.readFile(htmlFileName, 'utf8', (err, data) => {
        if (err) {
            console.error("Error:", err);
            return;
        }
        console.log(`---${htmlFileName} ---`);
        console.log(data);
    });
}

// Export ฟังก์ชันออกไปให้ไฟล์อื่นเรียกใช้ 
module.exports = { readHTML };