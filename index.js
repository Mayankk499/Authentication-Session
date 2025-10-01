import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.routes.js";
import jwt from "jsonwebtoken";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(async function (req, res, next) {
  try {
    const tokenHeader = req.headers["authorization"];
  
    if (!tokenHeader) {
      return next();
    }
  
    if (!tokenHeader.startsWith("Bearer")) {
      return res
        .status(400)
        .json({ error: "Authorization must be starts with bearer" });
    }
  
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
});

app.get("/", (req, res) => {
  return res.json({ status: "Server is Ready" });
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
