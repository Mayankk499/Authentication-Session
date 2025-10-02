import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.routes.js";
import adminRouter from './routes/admin.routes.js';
import {authMiddleware} from './middlewares/auth.middleware.js';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(authMiddleware);

app.get("/", (req, res) => {
  return res.json({ status: "Server is Ready" });
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
