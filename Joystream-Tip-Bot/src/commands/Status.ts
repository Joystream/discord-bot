import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getTotalPoolData } from "../database/control";

export const Status: Command = {
  name: "status",
  description:
    "Show version, pool wallet address and total amount of pooled JOY",

  run: async (client: Client, interaction: CommandInteraction) => {
    const amount = await getTotalPoolData();

    const content = `\n
    Bot version : ${process.env.VERSION}\n\nPool Wallet : ${process.env.SERVER_WALLET_ADDRESS}\n\nPool Amount : ${amount}JOY `;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
