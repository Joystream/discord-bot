import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { setUserIdChallenge } from "../database/control";
import { encodeAddress } from "../hook/formatAddress";

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
  description:
    "Claim Discord roles by linking your discord account to Joystream on-chain membership",
  options: [
    {
      name: "root_account",
      description: "Root account address of your Joystream membership",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    const { options, user } = interaction;

    let content: string = "claim";

    const wallet = String(options.get("root_account")?.value);

    const joystreamAddress = encodeAddress(wallet, 126);

    const key = generateKeyFromSeed();

    await setUserIdChallenge(user.id, joystreamAddress, key);

    content = `Go to this URL https://polkadot.js.org/apps/?rpc=wss://rpc.joystream.org:9944#/signing and sign the following data with the given account. ${key}`;

    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
