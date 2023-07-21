import { model, Schema } from "mongoose";

export interface IdModelData {
  discordHandle: string;
  rootAddress: string;
  challenge: string;
  verifyState: boolean;
}

export const IdModel = new Schema({
  discordHandle: String,
  rootAddress: String,
  challenge: String,
  verifyState: Boolean,
});

export default model<IdModelData>("roleID", IdModel);
