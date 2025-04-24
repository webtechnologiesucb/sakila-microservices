const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 8000;

// Create a function to get DB connection
async function getDbConnection() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sakila',
        port: '3306'
    });
}

// GET /countries
app.get('/countries', async (req, res) => {
    try {
        const conn = await getDbConnection();
        const [rows] = await conn.execute('SELECT * FROM country');
        await conn.end();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /countries/:id
app.get('/countries/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const conn = await getDbConnection();
        const [rows] = await conn.execute('SELECT * FROM country WHERE country_id = ?', [id]);
        await conn.end();

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Country not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
