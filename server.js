const express = require('express');
const path = require('path');
const app = express();
const PORT =  process.env.PORT || 3001;
const fs = require('fs')
var uniqid = require('uniqid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// default route page set to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// button on index.html leads to notes route page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// gets all the notes from the db
app.get('/api/notes', (req, res) => {
    try {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.status(200).json(JSON.parse(data));
            }
        })
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
    
});

// creates new note for database
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if (title && text){
        const newNote = {
            title,
            text,
            id: uniqid()
        };

        const noteString = JSON.stringify(newNote);

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err){
                console.log(err);
                res.sendStatus(500);
            } else {
                const jsonData = JSON.parse(data);
                jsonData.push(newNote);
                const file = JSON.stringify(jsonData);

                fs.writeFile('./db/db.json', file, (err) => {
                    err ? res.sendStatus(500).json(err) : res.status(200).json("Success");  
                })
            }
        })
    }
});

app.listen(PORT, () => console.log('listening on port'));