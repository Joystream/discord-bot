import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { getMembersOfRole } from "../database/control";

export const ListRoleMembers: Command = {
  name: "list_role_members",
  description: "List the discord usernames who have the specified discord role",
  options: [
    {
      name: "discord_role",
      description: "The command will display users with this role",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    const { options, guild } = interaction;

    const discordRole = String(options.get("discord_role")?.value);
    const roleId = discordRole?.replace(/[<@&!>]/g, "");

    let content: string = "list role members";

    // const role = guild?.roles.cache.find((role) => roleId === role.id);
    const members = await getMembersOfRole(roleId);

    if (members && members.length !== 0) {
      const users = await Promise.all(
        members.map(async (id) => {
          const user = await client.users.fetch(id);
          return user.username;
        })
      );

      const username = users.join(", ");

      content = discordRole + " : " + username;
    } else {
      content =
        discordRole + " : " + "There is not already register and verify.";
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
