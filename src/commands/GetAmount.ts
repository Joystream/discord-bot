import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getJoyData } from '../database/control';

export const GetAmount: Command = {

    name: "get_balance",
    description: "get JOY balance in discord",

    run: async (client: Client, interaction: CommandInteraction) => {

        const { user } = interaction;

        const amount = await getJoyData(user.tag);

        console.log(user.tag)

        const content = `Your JOY balance is ${amount.collageAmount}`;

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};