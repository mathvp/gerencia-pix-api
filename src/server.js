require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ?  '.env.test' : '.env'
});
const express = require('express');
const cors = require('cors');

require('./database');

const app = express();

app.use(cors());
app.use(express.json());

require('./routes/bank.routes')(app);
require('./routes/user.routes')(app);
require('./routes/pixKey.routes')(app);

const HOSTNAME = '127.0.0.1';
const PORT     = 8080;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}`);
});