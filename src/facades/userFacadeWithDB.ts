const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });
const debug = require("debug")("facade-with-db");
import IUser from "../interfaces/User";
import { bryptAsync, bryptCheckAsync } from "../utils/bcrypt-async-helper";
import * as mongo from "mongodb";
import { ApiError } from "../errors/apiError";
import setupDB from "../config/setupDB";
import IJoinEvent from "../interfaces/JoinEvent";
import IEvent from "../interfaces/Event";
let userCollection: mongo.Collection;
let eventCollection: mongo.Collection;

export default class UserFacade {
  static dbIsReady = false;

  static isDbReady() {
    if (!UserFacade.dbIsReady) {
      throw new Error(
        `######## initDB MUST be called BEFORE using this facade ########`
      );
    }
  }

  static async initDB(db: mongo.Db) {
    //Setup the Facade
    userCollection = db.collection("users");
    eventCollection = db.collection("events");
    UserFacade.dbIsReady = true;
    
  }

  static async addUser(user: IUser): Promise<string> {
    UserFacade.isDbReady();
    const hash = await bryptAsync(user.password);
    let newUser = { ...user, password: hash };
    const result = await userCollection.insertOne(newUser);
    return "User was added";
  }

  static async getUser(userName: string, proj?: object): Promise<any> {
    UserFacade.isDbReady();
    const user = await userCollection.findOne({ userName });
    return user;
  }



  static async joinEvents(joinEvent: IJoinEvent, eventID: any): Promise<any> {
    UserFacade.isDbReady();

    try {
      const event: IEvent | any = await eventCollection.findOne({
        _id: new mongo.ObjectID(eventID),
      });

      const updateTicket = event.ticketAmount - joinEvent.ticketAmountBought;
      if(updateTicket < 0){
        return "Tickets out of stock"
      }
      const updateEvent = await eventCollection.updateOne(event, {
        $set: { ticketAmount: updateTicket },
      });
      return "Event Updated!"
    } catch (e) {
      return "Error: " + e.message
    }
  }
  
  static async checkUser(userName: string, password: string): Promise<boolean> {
    UserFacade.isDbReady();
    let userPassword = "";
    let user;
    user = await UserFacade.getUser(userName);
    if (user == null) {
      return false;
    }
    userPassword = user.password;
    const status = await bryptCheckAsync(password, userPassword);
    return status;
  }
}