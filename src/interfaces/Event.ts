import IPoint from "./Point";

export default interface IEvent {
  username: string;
  road: string;
  houseNumber: string;
  postcode: number;
  eventName: string;
  ticketAmount: number;
  ticketPrice: number;
  eventSchedule: Date;
  coordinate: IPoint;
}
