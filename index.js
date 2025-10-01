import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.routes.js";
import db from "./db/index.db.js";
import { usersTable, userSessions } from "./db/schema.js";

import { eq } from "drizzle-orm";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(async function (req, res, next) {
  const sessionId = req.headers["session-id"];
  if (!sessionId) {
    return next();
  }

  const [data] = await db
    .select({
      sessionId: userSessions.id,
      id: usersTable.id,
      userId: userSessions.userId,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(userSessions)
    .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
    .where(eq(userSessions.id, sessionId));


  if (!data) {
    return next();
  }

  req.user = data;
  next();
});

app.get("/", (req, res) => {
  return res.json({ status: "Server is Ready" });
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
