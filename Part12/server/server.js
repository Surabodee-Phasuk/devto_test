
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs').promises

app.use(express.json())
app.use(cors())

app.get('/api/products/all', async(req, res)=>{
    const data = await fs.readFile('./it-gadgets.json', 'utf-8')
    const parseData = JSON.parse(data)

    return res.status(200).send(parseData.items)
})
app.get('/api/product/:id', async(req, res) => {
    
        const targetId = req.params.id;
        const data = await fs.readFile('./it-gadgets.json', 'utf-8');
        const parseData = JSON.parse(data);

        const foundItem = parseData.items.find(item => String(item.id) === targetId);
        if (!foundItem) {
            return res.status(404).send({ message: "ไม่พบข้อมูล" });
        }
        return res.status(200).send(foundItem);

});

// Post
app.post('/api/products/add', async (req, res) => {
    try {
        const newProduct = req.body;

        if (!newProduct || Object.keys(newProduct).length === 0) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        const data = await fs.readFile('./it-gadgets.json', 'utf-8');
        const parseData = JSON.parse(data);

        parseData.items.push(newProduct);
        parseData.totalItems = parseData.items.length;

        await fs.writeFile('./it-gadgets.json', JSON.stringify(parseData, null, 2));

        return res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// 1.4 การอัปเดต (PUT)
app.put('/api/product/:id', async (req, res) => {
    try {
        // รับ id จาก parameter
        const targetId = req.params.id;
        // รับข้อมูลที่จะอัปเดตจาก Body
        const updateData = req.body;

        const data = await fs.readFile('./it-gadgets.json', 'utf-8');
        const parseData = JSON.parse(data);

        const index = parseData.items.findIndex(item => String(item.id) === targetId);

        if (index === -1) {
            return res.status(404).json({ message: "ไม่พบไอเท็มที่ต้องการอัปเดต (Not Found)" });
        }

 
        parseData.items[index] = { 
            ...parseData.items[index], 
            ...updateData,
            id: parseData.items[index].id
        };

        // บันทึกข้อมูลกลับลงไปในไฟล์
        await fs.writeFile('./it-gadgets.json', JSON.stringify(parseData, null, 2));

        // ส่ง Response กลับไปพร้อม Status 200
        return res.status(200).json({
            message: "อัปเดตข้อมูลสำเร็จ",
            product: parseData.items[index]
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete
app.delete('/api/product/:id', async (req, res) => {
    try {
        const targetId = req.params.id;
        const data = await fs.readFile('./it-gadgets.json', 'utf-8');
        const parseData = JSON.parse(data);

        const index = parseData.items.findIndex(item => String(item.id) === targetId);
        if (index === -1) {
            return res.status(404).json({ message: "Product not found" });
        }

        const deleted = parseData.items.splice(index, 1)[0];
        parseData.totalItems = parseData.items.length;

        await fs.writeFile('./it-gadgets.json', JSON.stringify(parseData, null, 2));

        return res.status(200).json({
            message: "Product deleted successfully",
            deleted: deleted
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


app.listen(3001, ()=>{
    console.log('Server on port 3001')
})
