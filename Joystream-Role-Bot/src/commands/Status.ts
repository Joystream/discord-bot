import { CommandInteraction, Client, Permissions } from "discord.js";
import { Command } from "../Command";
import { blockCalculation } from "../hook/blockCalc";
import { getEmptyRole } from "../database/control";

export const Status: Command = {
  name: "status",
  description: "status",

  run: async (client: Client, interaction: CommandInteraction) => {
    const block = blockCalculation();
    const emptyRole = await getEmptyRole();
    const roles = emptyRole.join(", ");
    let content: string = `
    Empty Roles: ${roles}\nVersion : ${
      process.env.VERSION
    } \nBlock : ${block.toFixed(0)}`;

    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
