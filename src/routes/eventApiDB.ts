import express from "express";
import eventFacade from "../facades/eventFacadeWithDB";
import userFacade from "../facades/userFacadeWithDB";
const debug = require("debug")("user-endpoint");
const router = express.Router();
import { ApiError } from "../errors/apiError";
const fetch = require("node-fetch");
import utf8 from "utf8";
import IPoint from "../interfaces/Point";
import IEvent from "../interfaces/Event";
import authMiddleware from "../middleware/basic-auth";

import app from "../app";

const USE_AUTHENTICATION = process.env.SKIP_AUTHENTICATION === "false";
let dbInitialized = false;

router.use(async (req, res, next) => {
  if (!dbInitialized) {
    const db = await app.get("database");
    await eventFacade.initDB(db);
    await userFacade.initDB(db);
  }
  next();
});

router.post("/create", async function (req, res, next) {
  try {
    const username = req.body.user;
    const road = req.body.road;
    const house_number = req.body.house_number;
    const postcode = req.body.postcode;
    const eventName = req.body.event_name;
    const ticketAmount = req.body.ticket_amount;
    const ticketPrice = req.body.ticket_price;
    const dateAndTime = req.body.date_time;

    //https://locationiq.com/docs-html/index.html#forward_usage
    const APIKEY = process.env.locationiqAPIKEY;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${APIKEY}&street=${road}%20${house_number}&postalcode=${postcode}&format=json`;

    //utf8 encode fix for fetch to handle æøå
    const response = await fetch(utf8.encode(url)).then((res: any) =>
      res.json()
    );

    let lat = Number(response[0].lat);
    let lon = Number(response[0].lon);

    const day = Number(dateAndTime.substr(0, 2));
    //-1 as month start at 0
    const month = Number(dateAndTime.substr(3, 2)) - 1;
    const year = Number(dateAndTime.substr(6, 4));
    const hour = Number(dateAndTime.substr(11, 2));
    const minute = Number(dateAndTime.substr(14, 2));

    const dateObject = new Date(year, month, day, hour, minute);

    const coordinates: IPoint = { type: "Point", coordinates: [lat, lon] };

    const event: IEvent = {
      username: username,
      road: road,
      houseNumber: house_number,
      postcode: postcode,
      eventName: eventName,
      ticketAmount: ticketAmount,
      ticketPrice: ticketPrice,
      eventSchedule: dateObject,
      coordinate: coordinates,
    };

    const createEvent = await eventFacade.createEvent(event);
    return res.json(createEvent);
  } catch (err) {
    next(err);
  }
});

//All router calls below are authenticated requests
if (USE_AUTHENTICATION) {
  router.use(authMiddleware);
}

router.get("/all", async function (req, res, next) {
  debug(USE_AUTHENTICATION);
  try {
    const events = await eventFacade.getEvents();
    return res.json(events);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
