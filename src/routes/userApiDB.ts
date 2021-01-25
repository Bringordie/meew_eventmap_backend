import express, { json } from "express";
import userFacade from "../facades/userFacadeWithDB";
const debug = require("debug")("user-endpoint");
const router = express.Router();
import { ApiError } from "../errors/apiError";
import app from "../app";

let facadeInitialized = false;
router.use(async (req, res, next) => {
  if (!facadeInitialized) {
    const db = await app.get("database");
    await userFacade.initDB(db);
  }
  next();
});

router.post("/", async function (req, res, next) {
  try {
    let newUser = req.body;
    newUser.role = "user"; //Even if a hacker tried to "sneak" in his own role, this is what you get
    const status = await userFacade.addUser(newUser);
    res.json({ status });
  } catch (err) {
    JSON.stringify(err);
    next(new ApiError(err.message, 400));
  }
});

module.exports = router;
