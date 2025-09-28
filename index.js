import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.routes.js';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) =>{
    return res.json({status: 'Server is Ready'});
});

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
