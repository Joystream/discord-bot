import { CommandInteraction, Client, ApplicationCommandOptionData, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { updateJoyData } from '../database/control';
import { transferBalance } from '../transaction/transferJoy'

export const Deposit: Command = {

    name: "deposit",
    description: "deposit JOY tokens",
    options: [
        {
            name: "seed",
            description: 'Secret seed',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'amount',
            description: 'The amount of JOY tokens to deposit',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    run: async (client: Client, interaction: CommandInteraction) => {
        const { options, user } = interaction;

        let content: string;

        const amount = Number(options.get("amount")?.value);
        if (isNaN(amount)) {
            content = "Amount value invalid!";
        }
        else {
            const seed = String(options.get("seed")?.value);
            const recipient = process.env.SERVER_WALLET_ADDRESS;
            const transfer = await transferBalance(seed, recipient!, amount * 10000000000)
            if (transfer) {
                const updateData = await updateJoyData(user.tag, amount);
                content = `${updateData}!`;
            } else {
                content = 'Error : Deposit error'
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content,
        });


    }
};
