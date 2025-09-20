// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const tasks = require('./routes/tasks.js');
const checksheet =  require('./routes/checksheet.js');
const code =  require('./routes/code.js');
const task = require('./routes/task.js')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// router list
app.use('/api/checksheet', checksheet);
app.use('/api/code', code);
app.use('/api/tasks', tasks);
app.use('/api/task', task);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
