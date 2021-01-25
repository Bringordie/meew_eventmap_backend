const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });
const debug = require("debug")("facade-with-db");
import * as mongo from "mongodb";
import { ApiError } from "../errors/apiError";
import IEvent from "../interfaces/Event";
let eventCollection: mongo.Collection;

export default class EventFacade {
  static dbIsReady = false;

  static isDbReady() {
    if (!EventFacade.dbIsReady) {
      throw new Error(
        `######## initDB MUST be called BEFORE using this facade ########`
      );
    }
  }

  static async initDB(db: mongo.Db) {
    //Setup the Facade
    eventCollection = db.collection("events");
    EventFacade.dbIsReady = true;
  }

  static async createEvent(event: IEvent) {
    EventFacade.isDbReady();
    const result = await eventCollection.insertOne(event);
    return "Event was created";
  }

  static async getEvents() {
    EventFacade.isDbReady();
    const today = new Date();
    const result = eventCollection.find({
      eventSchedule: { $gt: today },
    });
    return result.toArray();
  }
}
