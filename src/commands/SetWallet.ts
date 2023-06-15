import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { setJoyData } from '../database/control';

export const SetWallet: Command = {
    name: "register",
    description: "Connect Wallet to discord user",
    options: [
        {
            name: "wallet",
            description: 'The wallet address to connect',
            type: ApplicationCommandOptionType.String,
            required: true,
        }

    ],

    run: async (client: Client, interaction: CommandInteraction) => {

        const { user, options } = interaction;

        const wallet: string = String(options.get("wallet")?.value);
        const content = `Your wallet address is ${wallet}`;

        await interaction.followUp({
            ephemeral: true,
            content
        });

        const setWallet = await setJoyData(user.tag, wallet);
        console.log(setWallet);
    }
};