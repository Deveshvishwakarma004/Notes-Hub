const connectToMongo = require ('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express()
const port = 5000
app.use(cors())

app.use(express.json()); // Middleware for using json and req.body in our project
mongoose.connect('mongodb+srv://devesh_v4:Devesh@2003@noteshub.rugf9.mongodb.net/Noteshub_test?retryWrites=true&w=majority&appName=Noteshub')
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})
