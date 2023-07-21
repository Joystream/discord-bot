import { CommandInteraction, Client, Permissions } from "discord.js";
import { Command } from "../Command";

export const Role: Command = {
  name: "role",
  description: "role",

  run: async (client: Client, interaction: CommandInteraction) => {
    const { user, options, guild } = interaction;
    let content: string = "role test";

    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
