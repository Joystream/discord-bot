import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { getHistoryData } from "../database/control";

export const History: Command = {
  name: "history",
  description: "See transaction history of a given user",
  options: [
    {
      name: "user_name",
      description:
        "Discord handle of the user you wish to see the transaction history of",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    const { options } = interaction;

    const discordHandle: string = String(options.get("user_name")?.value);
    const userId = discordHandle.replace(/[<@!>]/g, "");

    const history = await getHistoryData(userId);
    let content: string = "history";
    console.log(history);

    if (history || history) {
      content = "String(history)";
    } else {
      content = "There is no history for this user";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
