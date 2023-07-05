import { model, Schema } from "mongoose";

export interface JoyBotData {
  userName: string;
  walletAddress: string;
  amount: number;
  day: string;
  collageAmount: number;
  challenge: string;
  challengeAddress: string;
}

export const Joybot = new Schema({
  userName: String,
  walletAddress: String,
  amount: Number,
  day: Number,
  collageAmount: Number,
  challenge: String,
  challengeAddress: String,
});

export default model<JoyBotData>("joybot", Joybot);
