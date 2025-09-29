import express from "express";
import db from "../db/index.db.js";
import { usersTable, userSessions } from "../db/schema.db.js";
import { eq } from "drizzle-orm";
import { randomBytes, createHmac } from "crypto";

const router = express.Router();

router.get("/", () => {});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select({
      email: usersTable.email,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (existingUser) {
    return res.status(400).json({ error: "Email has already taken" });
  }

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({ status: "success", data: { userid: user.id } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (!existingUser) {
    return res.status(404).json({ error: "user not found" });
  };

  const salt = existingUser.salt;
  const existingHash = existingUser.password;

  const newHash = createHmac("sha256", salt).update(password).digest("hex");

  if (newHash !== existingHash) {
    return res.status(400).json({ error: "Incorrect password" });
  };

  const [session] = await db.insert(userSessions).values({
    userId: existingUser.id,
  }).returning({id: userSessions.id});
  return res.json({ status: "success", sessionId: session.id });
});

export default router;
