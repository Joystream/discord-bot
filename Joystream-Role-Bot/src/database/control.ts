import MemberModel from "./memberModels";
import IdModel from "./idModels";
import { getMembers } from "../query/generator/members_generate";

export const setMemberDB = async () => {
  const qnData = await getMembers();

  await MemberModel.deleteMany();
  await MemberModel.create(qnData);

  console.log("Database update finish!");
};

export const getJoyData = async (username: string) => {
  const JoyData = await IdModel.findOne({ userName: username });

  return JoyData;
};

export const updateJoyData = async (
  userName: string,
  amount: number,
  wallet: string
) => {
  const joyData = await IdModel.findOne({ userName: userName });
  if (!joyData) return "You are not registered. Please register now.";

  return `Your deposit is ${amount} JOY`;
};

export const setUserIdChallenge = async (
  userName: string,
  wallet: string,
  challenge: string
) => {
  const UserId = await IdModel.findOne({ discordHandle: userName });

  if (!UserId) {
    await IdModel.create({
      discordHandle: userName,
      challenge: challenge,
      rootAddress: wallet,
      verifyState:false
    });
  } else {
    if (UserId.discordHandle === userName && UserId.rootAddress === wallet) {
      return true;
    }
    if (UserId) {
      UserId.challenge = challenge;
      UserId.rootAddress = wallet;
      UserId.verifyState = false;
    }
  }
  UserId?.save();
  return false;
};


export interface Challenge {
  name?: string;
  wallet?: string;
  challenge?: string;
}

export const getChallengeData = async (
  username: string
): Promise<Challenge | Boolean> => {

  const UserData = await IdModel.findOne({ discordHandle: username });

  if (!UserData) {
    return false;
  }

  const val: Challenge = {
    challenge: UserData?.challenge,
    name: UserData?.discordHandle,
    wallet: UserData?.rootAddress,
  };
  
  return val;
};

export const setChallengeVerify = async (
  username: string
): Promise<Challenge | Boolean> => {

  const UserData = await IdModel.findOne({ discordHandle: username });

  if (!UserData) {
    return false;
  }

  UserData.verifyState=true;
  UserData.save();
  
  return true;
};