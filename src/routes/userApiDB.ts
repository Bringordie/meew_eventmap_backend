import express, { json } from "express";
import userFacade from "../facades/userFacadeWithDB";
const debug = require("debug")("user-endpoint");
const router = express.Router();
import { ApiError } from "../errors/apiError";
import app from "../app";
import IJoinEvent from "../interfaces/JoinEvent";

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

router.post("/join/events", async function (req, res, next) {

  try {
    const dateAndTime = req.body.date_time;
    const day = Number(dateAndTime.substr(0, 2));
    //-1 as month start at 0
    const month = Number(dateAndTime.substr(3, 2)) - 1;
    const year = Number(dateAndTime.substr(6, 4));
    const hour = Number(dateAndTime.substr(11, 2));
    const minute = Number(dateAndTime.substr(14, 2));
    const dateObject = new Date(year, month, day, hour, minute);

    const joinEventObj: IJoinEvent = {
      username: req.body.user,
      road: req.body.road,
      houseNumber: req.body.house_number,
      postcode: req.body.postcode,
      eventName:  req.body.event_name,
      ticketAmount: req.body.ticket_amount,
      ticketPrice: req.body.ticket_price,
      eventSchedule: dateObject
    
    }
  } catch (err) {
    console.log("Error", err)
    }
});

module.exports = router;
