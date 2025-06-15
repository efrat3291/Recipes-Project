import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.router.js';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware.js';   


config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cors());

app.use('/users', userRouter);

app.use(notFound, errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    
    
    
    