import { CommandInteraction, Client, Permissions } from "discord.js";
import { Command } from "../Command";

export const Role: Command = {
  name: "role",
  description: "role",

  run: async (client: Client, interaction: CommandInteraction) => {
    const { user, options, guild } = interaction;
    let content: string = "role test";
    if (guild) {
      const botMember = guild.members.cache.get("1031707386362200195");
      console.log(guild.members.cache);
      //   if (botMember?.permissions.has("ManageRoles")) {
      //     const role = await guild.roles.create({
      //       name: "New Role",
      //       color: "Blue",
      //       permissions: ["ViewChannel"],
      //     });
      //     await interaction.reply(`Role ${role.name} created`);
      //   } else {
      //     await interaction.reply("Bot does not have permission to create roles");
      //   }
    }

    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
