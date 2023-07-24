import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
  Role,
  Guild,
  GuildMember,
} from "discord.js";
import { Command } from "../Command";

export const WhoIs: Command = {
  name: "who_is",
  description: "List member id and on-chain roles of the given discord account",
  options: [
    {
      name: "discord_handle",
      description:
        "The discord Usename of which you wish to display information",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = `who is`;
    const { user, options } = interaction;

    const discordHandle: string = String(options.get("discord_handle")?.value);
    const userId = discordHandle.replace(/[<@!>]/g, "");

    const guild = client.guilds.cache.get(String(process.env.SERVER_ID));

    if (guild) {
      try {
        // Fetch the member by their account ID
        const member: GuildMember | null = await guild.members.fetch(userId);

        if (member) {
          const roles: Role[] = Array.from(member.roles.cache.values());
          console.log(roles);
          // Get the roles of the member
          // Loop through the roles and log their names
        } else {
          console.log("Member not found");
        }
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    } else {
      console.log("Guild not found");
    }

    const roles = interaction.member?.roles;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
