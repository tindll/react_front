const express = require ('express');
const mongoose = require("mongoose")
const app = express();
const authR = require('./routes/auth')
var cors = require("cors");

const  dbURI = "mongodb://work.zjamsty.com/blocksi_app/nodeAPI/testusers12345"
app.use(cors());
app.use(express.json())
app.use('/api/auth',authR)

mongoose.connect(dbURI , {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on("error", (err)=>{console.error(err)})
db.once("open", () => {console.log("DB started successfully")})

app.listen (8080, () => console.log("live on http://work.zjamsty.com/blocksi_app/nodeAPI"))