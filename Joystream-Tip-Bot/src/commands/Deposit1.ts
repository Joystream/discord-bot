import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { getJoyData, setJoyData, updateJoyData } from "../database/control";
import { useGetTransfers } from "../query/generator/extrinsics";

function generateKeyFromSeed() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export const Deposit1: Command = {
  name: "verifydeposit1",
  description:
    "After depositing JOY to the pool address, confirm deposit by running this command",
  options: [
    {
      name: "wallet",
      description: "The wallet address from which you have deposited",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    const { options, user } = interaction;

    let content: string = "";

    const wallet = String(options.get("wallet")?.value);

    const key = generateKeyFromSeed();

    const claimState = await setJoyData(user.id, wallet, key);
    if (claimState) {
      content =
        "Your discord UID is already coupled with the given address. No need to run verifyDeposit-2";
      const dbdata = await getJoyData(user.id);

      const date = new Date(dbdata.day);

      const filter = {
        call: {
          name_eq: "Balances.transfer",
          block: {
            timestamp_gt: date,
          },
        },
      };

      const extrinsics = await useGetTransfers(filter, wallet);

      if (extrinsics.length !== 0) {
        const amount = extrinsics.reduce(
          (a: number, b) => (a += Number(b.value)),
          0
        );
        const updateData = await updateJoyData(
          user.id,
          amount / 10000000000,
          wallet
        );
        content = updateData;
      } else {
        content = "There is no deposit from the given address";
      }
    } else {
      content = `Go to this URL https://polkadot.js.org/apps/?rpc=wss://rpc.joystream.org:9944#/signing and sign the following data with the given account. ${key}`;
    }
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
