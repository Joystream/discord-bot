import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import {
  Challenge,
  getChallengeData,
  setChallengeVerify,
} from "../database/control";
import { ClaimVerify, transferChallenge } from "../utils/signAndVerify";

export const Solve: Command = {
  name: "solve",
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

    let content: string = "";

    const claimm = await getChallengeData(user.id);

    if (!claimm) {
      content = "You must run claim first";
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
          const verify = await setChallengeVerify(user.id);
          if (verify) {
            content = "Successfully verify !";
          } else {
            content = "Database input error!";
          }
        } else {
          content = "Your signature is incorrect";
        }
      }
    }

    await interaction.followUp({
      content,
      ephemeral: true,
    });
  },
};
