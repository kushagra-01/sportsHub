// index.js
const express = require('express');
const bodyParser = require('body-parser');
const connect = require('./config/connection');
const bookingController = require('./controllers/bookingController');

const cors =require('cors');
const app = express();
const port = 3000;
app.use(cors())
app.use(bodyParser.json());
app.use('', bookingController);

app.listen(port, async () => {
    await connect()
  console.log(`Server is running on port ${port}`);
});
