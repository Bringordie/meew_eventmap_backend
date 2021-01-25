require("dotenv").config();
import express from "express";
import path from "path";
import { ApiError } from "./errors/apiError";

const app = express();
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());

const eventAPIRouter = require("./routes/eventApiDB");
const addressAPIRouter = require("./routes/coordinatesToAddress");
const userAPIRouter = require("./routes/userApiDB");

app.get("/api/dummy", (req, res) => {
  res.json({ msg: "Hello" });
});

app.use("/events", eventAPIRouter);
app.use("/geoaddress", addressAPIRouter);
app.use("/api/users", userAPIRouter);

app.use(function (err: any, req: any, res: any, next: Function) {
  if (err instanceof ApiError) {
    const e = <ApiError>err;
    return res
      .status(e.errorCode)
      .send({ code: e.errorCode, message: e.message });
  }
  next(err);
});

//Server is now started in bin/www.js

export default app;
