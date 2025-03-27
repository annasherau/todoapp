const express = require('express');    // Enables use of express.js
const mongoose = require('mongoose');  // Enables use of MongoDB Database
const cors = require('cors');  // This is used when deploying front end and backend on different servers
const path = require('path'); // This enables the backend server to connect to the the front end and serve the HTML pages
const bcrypt = require('bcrypt');  // enables the hashing of passwords
const axios = require('axios');  // This enables the fetching of external API's (from other servers)
require('dotenv').config(); //Enables the use of .env file - to store sensitive data
const port = 3000;  // Port number the app is running on: http://localhost:3000

const app = express();  // Allows you to use the express.js framework for running the app (API's etc.)



app.use(express.json()); // middleware - translates incoming JSON formats to easy-to-read Javascript objects example: from JSON { "example": "This is an example" } → to Javascript Object { example: "This is an example"}
app.use(cors("*"));


//connecting to mongodb database password lnTP1XqTB9VeI2pI
mongoose.connect("mongodb+srv://annasherau:Monday1239@todoapp.o9hkj.mongodb.net/?retryWrites=true&w=majority&appName=ToDoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))   //Logging the connection
    .catch(err => console.error('MongoDB Connection Error: ', err)); //Logging the error if unable to connect



//Database schema (MongoDB)

//Defining data structure withing DB

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, required: true }
});

const Task = mongoose.model("Task", taskSchema);



//-----------------------------------below Page serving/display----------------------SSR server side rendering---------------------

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/features', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/features.html'));
});

app.get('/pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pricing.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});


//---------------------------below Routes-------------------------------------------------
//------------------------TASk Handling---------------------------------------------

app.post('/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, completed } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({ Error: 'All fields are required' });
        }

        const taskData = { title, description, dueDate, completed };
        const createTask = new Task(taskData);
        const saveTask = await createTask.save();

        res.status(200).json({ message: 'Save successful', task: saveTask });


    } catch (error) {
        console.error('Error: ', error)
        res.status(500).json();
    }
});



app.listen(port, () => {
    console.log(`To Do App listening on port: ${port}`);  // To Do App listening on port: 3000
});

