import JoyModel from "./models";
import HistoryModel from "./historyModel";

export const getJoyData = async (username: string) => {
  const JoyData =
    (await JoyModel.findOne({ userName: username })) ||
    (await JoyModel.create({
      userName: username,
      walletAddress: 0,
      amount: 0,
      day: Date.now() - 3600000,
      collageAmount: 0,
    }));

  return JoyData;
};

export const updateJoyData = async (
  userName: string,
  amount: number,
  wallet: string
) => {
  const joyData = await JoyModel.findOne({ userName: userName });
  if (!joyData) return "You are not registered. Please register now.";

  joyData.amount = amount;
  joyData.day = Date.now().toString();
  joyData.collageAmount
    ? (joyData.collageAmount += amount)
    : (joyData.collageAmount = amount);
  joyData.walletAddress = wallet;

  joyData.save();

  return `Your deposit is ${amount} JOY`;
};

export const setJoyData = async (
  userName: string,
  address: string,
  challenge: string
) => {
  const JoyData = await JoyModel.findOne({ userName: userName });

  if (!JoyData) {
    await JoyModel.create({
      userName: userName,
      walletAddress: 0,
      amount: 0,
      day: Date.now() - 3600000,
      collageAmount: 0,
      challenge: challenge,
      challengeAddress: address,
    });
  } else {
    if (JoyData.userName === userName && JoyData.walletAddress === address) {
      return true;
    }
    if (JoyData) {
      JoyData.challenge = challenge;
      JoyData.challengeAddress = address;
    }
  }

  JoyData?.save();

  return false;
};

export const sendJoyToken = async (
  userName: string,
  reiceve: string,
  amount: number
) => {
  let error: string;

  const tx = await JoyModel.findOne({ userName: userName });
  if (!tx) return (error = "Error : sender's username is unregistered");

  const rx = await JoyModel.findOne({ userName: reiceve });
  if (!rx) return (error = "Error : receiver's username is unregistered");

  const sendJoy = await JoyModel.findOne({ userName: userName });
  if (!sendJoy) return;

  await HistoryModel.create({
    sendAddress: userName,
    receiveAddress: reiceve,
    amount: amount,
    dateAndTime: Date.now(),
  });

  sendJoy.amount = amount;
  sendJoy.collageAmount -= amount;

  sendJoy.save();

  const recieveJoy = await JoyModel.findOne({ userName: reiceve });
  if (!recieveJoy) return;

  recieveJoy.amount = amount;
  recieveJoy.collageAmount += amount;

  recieveJoy.save();

  return `You have sent <@${reiceve}> ${amount} JOY`;
};

export const withdrawJoy = async (userName: string, amount: number) => {
  const joyData = await JoyModel.findOne({ userName: userName });

  if (!joyData) return "You are not registered. Please register now.";

  joyData.amount = -amount;
  joyData.collageAmount -= amount;

  joyData.save();

  return `You have withdrawn ${amount - 0.01} JOY`;
};

export interface Challenge {
  name?: string;
  wallet?: string;
  challenge?: string;
}

export const getChallengeData = async (
  username: string
): Promise<Challenge | Boolean> => {
  const JoyData = await JoyModel.findOne({ userName: username });
  if (!JoyData) {
    return false;
  }
  const val: Challenge = {
    challenge: JoyData?.challenge,
    name: JoyData?.userName,
    wallet: JoyData?.challengeAddress,
  };

  return val;
};

export const getHistoryData = async (id: string) => {
  const historyData = await HistoryModel.find({
    $or: [{ sendAddress: id }, { receiveAddress: id }],
  });

  if (!historyData || historyData.length === 0) {
    return false;
  }

  return historyData;
};
