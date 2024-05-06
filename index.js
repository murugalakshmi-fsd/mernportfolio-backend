const express = require ('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const  app =express()
require('dotenv').config();

const dbconfig=require('./config/dbconfig');
const portfolioroute=require('./routes/portfolioroute');

app.use(cors()); 
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/portfolio",portfolioroute)
const port=process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log("Server running on port",port)
});

