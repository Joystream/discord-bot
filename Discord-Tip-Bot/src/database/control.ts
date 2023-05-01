import JoyModel from "./models";

export const getJoyData = async (username: string) => {
    const JoyData =
        (await JoyModel.findOne({ userName: username })) ||
        (await JoyModel.create({
            userName: username,
            walletAddress: 0,
            amount: 0,
            day: Date.now(),
            collageAmount: 0,
        }));

    return JoyData;
};

export const updateJoyData = async (userName: string, amount: number) => {
    const joyData = await JoyModel.findOne({ userName: userName });
    if (!joyData) return "You are not registered. Please register now.";

    joyData.amount = amount;
    joyData.day = Date.now();
    joyData.collageAmount ? joyData.collageAmount += amount : joyData.collageAmount = amount;

    joyData.save();
    return `Your deposit is ${amount} JOY`;

};

export const setJoyData = async (userName: string, address: string) => {
    const JoyData =
        (await JoyModel.findOne({ userName: userName })) ||
        (await JoyModel.create({
            userName: userName,
            walletAddress: address,
            amount: 0,
            day: Date.now(),
            collageAmount: 0,
        }));
    JoyData.walletAddress = address;
    return JoyData.save();
};

export const sendJoyToken = async (userName: string, reiceve: string, amount: number) => {
    let error: string;

    const tx = await JoyModel.findOne({ userName: userName });
    if (!tx) return error = "Error : sender's username is unregistered";

    const rx = await JoyModel.findOne({ userName: reiceve });
    if (!rx) return error = "Error : receiver's username is unregistered";


    const sendJoy = await JoyModel.findOne({ userName: userName });
    if (!sendJoy) return

    sendJoy.amount = amount;
    sendJoy.day = Date.now();
    sendJoy.collageAmount -= amount;

    sendJoy.save();

    const recieveJoy = await JoyModel.findOne({ userName: reiceve });
    if (!recieveJoy) return 

    recieveJoy.amount = amount;
    recieveJoy.day = Date.now();
    recieveJoy.collageAmount += amount

    recieveJoy.save();

    return `You have sent ${reiceve} ${amount} JOY`;
};

export const withdrawJoy = async (userName: string, amount: number) => {
    const joyData = await JoyModel.findOne({ userName: userName });

    if (!joyData) return "You are not registered. Please register now.";

    joyData.amount = -amount;
    joyData.day = Date.now();
    joyData.collageAmount -= amount;

    joyData.save();

    return `You have withdrawn ${amount} JOY`;

};
