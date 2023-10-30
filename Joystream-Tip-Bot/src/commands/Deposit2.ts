import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import {
  Challenge,
  getChallengeData,
  getJoyData,
  updateJoyData,
} from "../database/control";
import { ClaimVerify, transferChallenge } from "../utils/signAndVerify";
import { useGetTransfers } from "../query/generator/extrinsics";

export const Deposit2: Command = {
  name: "verifydeposit2",
  description:
    "confirm you are the owner of the deposit by running this command after deposit-1",
  options: [
    {
      name: "signature",
      description: "signature of the deposit account",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client: Client, interaction: CommandInteraction) => {
    const { user, options } = interaction;

    const decChallenge: string = String(options.get("signature")?.value);
    let content: string = "verify deposit 2";

    const claimm = await getChallengeData(user.id);

    if (!claimm) {
      content = "You must run verifyDeposit-1 first";
    } else {
      const { challenge, name, wallet } = claimm as Challenge;

      if (challenge && wallet) {
        const verify: ClaimVerify = {
          challenge: challenge,
          decodeChallenge: decChallenge,
          wallet: wallet,
        };
        const confirm = await transferChallenge(verify);

        if (confirm) {
          const dbdata = await getJoyData(user.id);
          const date = new Date(Number(dbdata.day));
          const filter = {
            call: {
              name_eq: "Balances.transfer",
              block: {
                timestamp_gt: date,
              },
            },
          };
          const extrinsics = await useGetTransfers(filter, wallet);

          if (extrinsics.length !== 0) {
            const amount = extrinsics.reduce(
              (a: number, b) => (a += Number(b.value)),
              0
            );

            const updateData = await updateJoyData(
              user.id,
              amount / 10000000000,
              wallet
            );

            content = updateData;
          } else {
            const updateData = await updateJoyData(
              user.id,
              0,
              wallet
            );

            content = updateData;
          }
        } else {
          content = "Your signature is incorrect. Please restart with the /verifyDeposit1 command.";
        }
      }
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
