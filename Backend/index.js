const express = require('express');
require("dotenv").config();
const cors = require('cors');
const mongoConnection = require("./util/mongoConnection");
const users = require('./User/UserController');
const posts = require('./Posts/PostController');
const minioConnection = require('./util/minioConnection');

const port = process.env.PORT || 8080;
app = express();

//Middleware
app.use(express.json());
app.use(cors());


//DB connection
mongoConnection();
minioConnection();

//Routes
app.get('/', (req, res) => {
    res.send('server is running');
})

app.use('/api', users);
app.use('/api', posts);

app.listen(port, '0.0.0.0', ()=> console.log(`Server is running on port ${port}...`));