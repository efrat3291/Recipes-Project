import express from 'express';
import userRouter from './routes/user.router.js';
import recipeRouter from './routes/recipes.router.js';
import { config } from 'dotenv';
import { connectDB } from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';
import { notFound,errorHandler } from './middlewares/errorHandling.middleware.js';

config();
connectDB();
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());
app.use('/users',userRouter);
app.use('/recipes',recipeRouter);
app.use('/categories',recipeRouter);
app.put('/try/:id',(req,res)=>{
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    console.log(req.headers);
    res.send();   
});
app.use(notFound);
app.use(errorHandler);
const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`http://localhost:${port}`);   
})