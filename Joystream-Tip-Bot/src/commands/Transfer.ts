import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { getJoyData, sendJoyToken } from "../database/control";
import { isNumberObject } from "util/types";

export const Trasnfer: Command = {
  name: "send",
  description: "send JOY to other discord users",
  options: [
    {
      name: "receiver",
      description: "discord ID of receiver",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "amount",
      description: "amount of JOY to send",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const { user, options } = interaction;

    const avariableAmount = await getJoyData(user.id);
    let content;

    const amount = Number(options.get("amount")?.value);
    if (isNaN(amount)) {
      content = "Amount value invalid!";
    } else if (avariableAmount.collageAmount < amount)
      content = "Amount value exceeds deposit!";
    else {
      const recieve = String(options.get("receiver")?.value);
      const sendValue = await sendJoyToken(user.id, recieve, amount);
      content = `${sendValue}`;
    }
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
