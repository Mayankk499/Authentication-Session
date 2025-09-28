import 'dotenv/config';
import express from 'express';
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) =>{
    return res.json({status: 'Server is Ready'});
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
