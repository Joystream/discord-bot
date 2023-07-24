import { CommandInteraction, Client, Permissions } from "discord.js";
import { Command } from "../Command";

export const Status: Command = {
  name: "status",
  description: "status",

  run: async (client: Client, interaction: CommandInteraction) => {
    const { user, options, guild } = interaction;
    let content: string = "role test";

    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
