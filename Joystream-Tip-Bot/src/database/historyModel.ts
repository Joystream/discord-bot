import { model, Schema } from "mongoose";

export interface JoyTipBotHistoryData {
  sendAddress: string;
  receiveAddress: string;
  amount: number;
  dateAndTime: Date;
}

export const JoyTipbotHistory = new Schema({
  sendAddress: String,
  receiveAddress: String,
  amount: Number,
  dateAndTime: Date,
});

export default model<JoyTipBotHistoryData>("tipbothistory", JoyTipbotHistory);
