const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });
const debug = require("debug")("facade-with-db");
import IUser from "../interfaces/User";
import { bryptAsync, bryptCheckAsync } from "../utils/bcrypt-async-helper";
import * as mongo from "mongodb";
import { ApiError } from "../errors/apiError";
import setupDB from "../config/setupDB";
let userCollection: mongo.Collection;

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

  static async checkUser(userName: string, password: string): Promise<boolean> {
    UserFacade.isDbReady();
    let userPassword = "";
    let user;
    user = await UserFacade.getUser(userName);
    if (user == null) {
      return Promise.reject(false);
    }
    userPassword = user.password;
    const status = await bryptCheckAsync(password, userPassword);
    return status;
  }
}
