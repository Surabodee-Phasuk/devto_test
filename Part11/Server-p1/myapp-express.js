const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    res.send('This is my home page');
});

app.get('/members_text', (req, res) => {
    fs.readFile('members.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
});

app.get('/members_html', (req, res) => {
    fs.readFile('members.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
    });
});

// ส่วนที่ 1 ข้อ 4-5: จัดการ GET request /item/XXX
app.get('/item/:id', (req, res) => {
    const itemId = req.params.id; // ดึง id จาก URL

    // อ่านไฟล์ด้วย fs module
    fs.readFile('./it-gadgets.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Error reading file.");
            return;
        }

        // แปลงข้อมูลด้วย JSON.parse
        const gadgetContent = JSON.parse(data);
        
        // เข้าถึง Array ผ่าน gadgetContent.items ตามโครงสร้าง
        const product = gadgetContent.items.find(i => i.id === itemId);

        if (product) {
            res.setHeader('Content-Type', 'text/html');
            res.send(`
                <div style="font-family: Arial, sans-serif; border: 1px solid #ccc; padding: 20px; border-radius: 10px; width: 300px;">
                    <h2 style="color: #0044cc;">${product.name}</h2>
                    <p><strong>Brand:</strong> ${product.brand}</p>
                    <p><strong>Type:</strong> ${product.type}</p>
                    <p><strong>Price:</strong> $${product.priceUSD}</p>
                    <p><strong>Status:</strong> ${product.inStock ? 
                        '<span style="color: green;">In Stock</span>' : 
                        '<span style="color: red;">Out of Stock</span>'}</p>
                </div>
            `);
        } else {
            res.status(404).send("<h3>Item not found</h3>");
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});