const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'airquality'
})


app.get('/', (re, res) => {
    return res.json("From BackEnd Side")
})


app.get('/sensors', (req, res) => {
    const sql = "SELECT * FROM sensors";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})



app.listen(8081, ()=> {
    console.log("Listening to Port 8081");
})