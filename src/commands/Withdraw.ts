import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { getJoyData, withdrawJoy } from '../database/control';
import { transferBalance } from '../transaction/transferJoy'

export const Withdraw: Command = {

    name: "withdraw",
    description: "withdraw JOY to my connected wallet",
    options: [
        {
            name: "amount",
            description: 'withdraw amount',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client: Client, interaction: CommandInteraction) => {
        let content = "Hello withdraw!";

        const { user, options } = interaction;

        const amount = await getJoyData(user.tag);
        const collageAmount = amount.collageAmount;
        const address = amount.walletAddress;
        const withdrawAmount = Number(options.get("amount")?.value);

        if (collageAmount < withdrawAmount) {
            content = "Error : Your deposit is less then withdraw amount."
        } else {
            const seed = process.env.SERVER_WALLET_KEY;
            const transfer = await transferBalance(seed!, address, withdrawAmount * 10000000000)
            if (transfer) {
                const withdraw = await withdrawJoy(user.tag, withdrawAmount);
                content = `${withdraw}`
            } else {
                content = "Error : withdraw error"
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};

