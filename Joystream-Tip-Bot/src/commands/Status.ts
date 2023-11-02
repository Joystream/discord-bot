import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getTotalPoolData } from "../database/control";
import { encodeAddress } from "../hook/formatAddress";

export const Status: Command = {
  name: "status",
  description:
    "Show version, pool wallet address and total amount of pooled JOY",

  run: async (client: Client, interaction: CommandInteraction) => {
    const amount = await getTotalPoolData();

    const content = `\n
    Bot version : ${process.env.VERSION}\n\nPool Wallet : ${encodeAddress(String(process.env.SERVER_WALLET_ADDRESS), 126)}\n\nPool Amount : ${amount}JOY `;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
