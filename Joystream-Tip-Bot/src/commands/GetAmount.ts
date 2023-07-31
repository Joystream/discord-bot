import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { getJoyData } from "../database/control";

export const GetAmount: Command = {
  name: "getbalance",
  description: "get your JOY balance in the discord pool",
  options: [
    {
      name: "user_name",
      description: "Discord handle of the user you wish to see the balance of",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const { options } = interaction;

    const discordHandle: string = String(options.get("user_name")?.value);
    const userId = discordHandle.replace(/[<@!>]/g, "");

    const amount = await getJoyData(userId);

    const content = `${discordHandle} balance is ${amount.collageAmount}JOY`;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
