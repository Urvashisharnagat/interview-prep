require('dotenv').config()
const app = require('./src/app')
const ConnectToDB = require('./src/config/database')
const generateInterviewReport = require('./src/services/ai.service')
const {resume,selfDiscription,jobDiscription} = require('./src/services/temp')


ConnectToDB()
// generateInterviewReport({resume,selfDiscription,jobDiscription})


app.listen(3000,()=>{
    console.log("server is running on port 3000");
    
})