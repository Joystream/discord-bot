import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getJoyData } from "../database/control";

export const GetAmount: Command = {
  name: "getbalance",
  description: "get your JOY balance in the discord pool",

  run: async (client: Client, interaction: CommandInteraction) => {
    const { user } = interaction;

    const amount = await getJoyData(user.id);

    const content = `Your JOY balance is ${amount.collageAmount}`;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
