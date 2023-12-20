// index.js
const express = require('express');
const bodyParser = require('body-parser');
const connect = require('./config/connection');
const allRoutes = require('./routes');

const cors =require('cors');
const app = express();
const port = 3000;
app.use(cors())
app.use(bodyParser.json());
app.use('/api', allRoutes);

app.listen(port, async () => {
    await connect()
  console.log(`Server is running on port ${port}`)
});
