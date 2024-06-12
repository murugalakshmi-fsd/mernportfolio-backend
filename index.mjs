import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import dbconfig from './config/dbconfig.mjs';
import portfolioroute from './routes/portfolioroute.mjs';
import adminroute from './routes/adminroute.mjs'

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use("/portfolio", portfolioroute);
app.use("/admin",adminroute)

const port = process.env.PORT;
app.listen(port, () => {
    console.log("Server running on port", port);
});
