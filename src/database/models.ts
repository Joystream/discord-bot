import { model, Schema } from "mongoose";

export interface JoyBotData {
    userName: String,
    walletAddress: string;
    amount: number;
    day: number;
    collageAmount: number;
}

export const Joybot = new Schema({
    userName: String,
    walletAddress: String,
    amount: Number,
    day: Number,
    collageAmount: Number,
})

export default model<JoyBotData>("joybot", Joybot);