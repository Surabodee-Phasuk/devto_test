const path = require('path');

// ข้อ 1.3
function printModulePath() {
    //a
    console.log("Directory name:", path.dirname(__filename));
    console.log("Basename:", path.basename(__filename));
    console.log("File extension:", path.extname(__filename));
    //b
    const myPath = path.join('home', 'users', 'cs369', 'resource.txt');
    console.log("Joined Path:", myPath);
    //c
    const normalPath = path.normalize('/home/user//docs/../project/index.js');
    console.log("Normalized Path:", normalPath);
}

module.exports = { printModulePath };