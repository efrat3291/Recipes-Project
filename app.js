import express from 'express';
import userRouter from './routes/user.router.js';
import { config } from 'dotenv';
import { connectDB } from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';

config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use('/users', userRouter);
app.put('/try/:id', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    console.log(req.headers);
    res.send();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    
    
    
    