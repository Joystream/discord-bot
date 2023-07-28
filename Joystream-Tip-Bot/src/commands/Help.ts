import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";

export const Help: Command = {
  name: "help",
  description: "Help page for the tipping bot",

  run: async (client: Client, interaction: CommandInteraction) => {
    const content = `Please follow this link to learn how to use the tipping bot. https://www.notion.so/joystream/JOY-tipping-bot-cc69c748e3994234842d03434facc82c?pvs=4 \n
    
    Bot version : ${process.env.VERSION}\n
    Pool Wallet : ${process.env.SERVER_WALLET_ADDRESS}
    `;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
