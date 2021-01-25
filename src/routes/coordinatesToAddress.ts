import express, { json } from "express";
const debug = require("debug")("user-endpoint");
const router = express.Router();
import { ApiError } from "../errors/apiError";
const fetch = require("node-fetch");

router.get("/", async function (req, res, next) {
  res.json({ msg: "geoAddress API" });
});

router.get("/converter/:lon/:lat", async function (req, res, next) {
  try {
    const lon = Number(req.params.lon);
    const lat = Number(req.params.lat);
    debug(lat);
    debug(lon);

    //https://locationiq.com/docs-html/index.html?shell#reverse_usage
    const APIKEY = process.env.locationiqAPIKEY;
    const url = `https://eu1.locationiq.com/v1/reverse.php?key=${APIKEY}&lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url, {
      method: "GET",
    }).then((res: any) => res.json());
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
