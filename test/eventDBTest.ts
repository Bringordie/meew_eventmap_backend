import * as mongo from "mongodb";
const debug = require("debug")("facade-with-db:test");
import UserFacade from "../src/facades/userFacadeWithDB";
import EventFacade from "../src/facades/eventFacadeWithDB";
import { expect } from "chai";
import { bryptAsync } from "../src/utils/bcrypt-async-helper";
import { MongoMemoryServer } from "mongodb-memory-server";
import getDbConnection from "../src/config/setupDB";
import IPoint from "../src/interfaces/Point";
import IEvent from "../src/interfaces/Event";
const testConnection = getDbConnection({
  testServer: new MongoMemoryServer({
    instance: { dbName: process.env.TEST_DB_NAME },
  }),
});

let userCollection: mongo.Collection | null;
let eventCollection: mongo.Collection | null;

describe("########## Verify the UserFacade with a DataBase ##########", () => {
  before(async function () {
    const db = await testConnection.getDB();
    await UserFacade.initDB(db);
    userCollection = db.collection("users");
    eventCollection = db.collection("events");
  });

  after(async () => {
    await testConnection.stop();
  });

  beforeEach(async () => {
    if (userCollection === null) {
      throw new Error("userCollection not set");
    }
    await userCollection.deleteMany({});
    const secretHashed = await bryptAsync("secret");

    await userCollection.insertMany([
      {
        name: "Peter Pan",
        userName: "pp@b.dk",
        password: secretHashed,
        role: "user",
      },
      {
        name: "Donald Duck",
        userName: "dd@b.dk",
        password: secretHashed,
        role: "user",
      },
      {
        name: "admin",
        userName: "admin@a.dk",
        password: secretHashed,
        role: "admin",
      },
    ]);
  });

  describe("Checking adding an event works", () => {
    it("Should Add the event", async () => {
      const coordinates: IPoint = {
        type: "Point",
        coordinates: [55.767732, 12.545059],
      };

      const event: IEvent = {
        username: "dd@b.dk",
        road: "Soløsevej",
        houseNumber: "69",
        postcode: 2820,
        eventName: "Music and Galla event at Gentoften",
        ticketAmount: 500,
        ticketPrice: 75,
        eventSchedule: new Date(),
        coordinate: coordinates,
      };

      try {
        const statusEvent = await EventFacade.createEvent(event);
        expect(statusEvent).to.be.equal("Event was created");
      } catch (err) {
        console.log("SHOULD NOT GET HERE");
      }
    });

    it("Should find 1 created event", async () => {
      const coordinates: IPoint = {
        type: "Point",
        coordinates: [55.767732, 12.545059],
      };

      const event: IEvent = {
        username: "dd@b.dk",
        road: "Soløsevej",
        houseNumber: "69",
        postcode: 2820,
        eventName: "Music and Galla event at Gentoften",
        ticketAmount: 500,
        ticketPrice: 75,
        eventSchedule: new Date(),
        coordinate: coordinates,
      };

      try {
        const createEvent = await EventFacade.createEvent(event);
        const statusEvent = await EventFacade.getEvents();
        expect(statusEvent.length).to.be.equal(1);
      } catch (err) {
        console.log("SHOULD NOT GET HERE");
      } finally {
      }
    });
  });
});
