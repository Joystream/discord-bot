import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { getUserIdtoRoles } from "../database/control";

export const WhoIs: Command = {
  name: "who_is",
  description: "List member id and on-chain roles of the given discord account",
  options: [
    {
      name: "discord_handle",
      description:
        "The discord Username of which you wish to display information",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    let content: string = `who is`;
    const { options } = interaction;

    const discordHandle: string = String(options.get("discord_handle")?.value);
    const userId = discordHandle.replace(/[<@!>]/g, "");

    content =
      options.get("discord_handle")?.value +
      " : " +
      (await getUserIdtoRoles(userId));

    // if (member) {
    //   const roles = member.roles;
    //   console.log(roles);
    // }
    // const guild = client.guilds.cache.get(String(process.env.SERVER_ID));

    // if (guild)
    //   guild.members
    //     .fetch(userId)
    //     .then((member) => {
    //       // member.roles.cache is a collection of roles the member has
    //       console.log(member.roles);
    //       content = String(member.roles);
    //     })
    //     .catch(console.error);
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
