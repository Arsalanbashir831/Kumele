const express = require('express')
const PORT = require('./config').PORT;
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use('/api', routes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})