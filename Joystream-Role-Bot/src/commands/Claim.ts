import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { setUserIdChallenge } from "../database/control";

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

export const Claim: Command = {
  name: "claim",
  description: "this is claim",
  options: [
    {
      name: "wallet",
      description: "The wallet address is your rootAccount address.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    const { options, user } = interaction;

    let content: string = "";

    const wallet = String(options.get("wallet")?.value);

    const key = generateKeyFromSeed();

    const claimState = await setUserIdChallenge(user.id, wallet, key);

    if (claimState) {
      content = `You already are verifyed \n Go to this URL https://polkadot.js.org/apps/?rpc=wss://rpc.joystream.org:9944#/signing and sign the following data with the given account. ${key}`;
    } else {
      content = `Go to this URL https://polkadot.js.org/apps/?rpc=wss://rpc.joystream.org:9944#/signing and sign the following data with the given account. ${key}`;
    }
    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
