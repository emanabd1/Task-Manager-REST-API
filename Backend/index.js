const express = require('express');
const cors = require('cors');
const { port, appName } = require('./config/env');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send(`${appName} is running...`);
});


app.listen(port, () => {
  console.log(`${appName} is running at http://localhost:${port}`);
});