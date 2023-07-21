import { Client, Guild, GuildMember, Role } from "discord.js";
import MemberModel from "./memberModels";
import IdModel from "./idModels";
import { getMembers } from "../query/generator/members_generate";
import { encodeAddress } from "../hook/formatAddress";
import { RoleAddress } from "../RoleConfig";

export const setMemberDB = async (client: Client): Promise<void> => {
  const qnData = await getMembers();

  await MemberModel.deleteMany();
  await MemberModel.create(qnData);

  console.log("Database update finish!");

  const users = await IdModel.find();

  users.map(async (data) => {
    if (data.verifyState) {
      const encodeAccount = encodeAddress(data.rootAccount, 126);
      await MemberModel.findOne({ rootAccount: encodeAccount }).then(
        async (d) => {
          const guild: Guild | undefined = client.guilds.cache.get(
            process.env.SERVER_ID || ""
          );

          if (guild) {
            try {
              const member: GuildMember = await guild.members.fetch(
                data.discordHandle
              );

              addRole(
                RoleAddress.councilMember,
                guild,
                member,
                "Council Member Role",
                d?.isCouncilMember
              );
              addRole(
                RoleAddress.foundingMember,
                guild,
                member,
                "Founding Member Role",
                d?.isFoundingMember
              );
              addRole(
                RoleAddress.creator,
                guild,
                member,
                "Creator Role",
                d?.isCreator
              );

              d?.roles.map((rol) => {
                if (rol.groupId) {
                  const status: boolean =
                    rol.status.__typename === "WorkerStatusActive"
                      ? true
                      : false;
                  groupIdToRolePara(
                    status,
                    rol.groupId,
                    rol.isLead,
                    guild,
                    member
                  );
                }
              });
            } catch (error) {
              console.log(`Member not found`);
            }
          }
        }
      );
    }
    return data;
  });
};

const groupIdToRolePara = (
  status: boolean | undefined,
  groupId: string,
  isLead: boolean | undefined,
  guild: Guild,
  member: GuildMember
) => {
  switch (groupId) {
    case "contentWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.contentWorkingGroupLead,
            guild,
            member,
            "Content Lead",
            status
          )
        : addRole(
            RoleAddress.contentWorkingGroup,
            guild,
            member,
            "Content Worker",
            status
          );

      break;
    case "forumWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.forumWorkingGroupLead,
            guild,
            member,
            "Forum Lead",
            status
          )
        : addRole(
            RoleAddress.forumWorkingGroup,
            guild,
            member,
            "Forum Worker",
            status
          );

      break;
    case "appWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.appWorkingGroupLead,
            guild,
            member,
            "App Lead",
            status
          )
        : addRole(
            RoleAddress.appWorkingGroup,
            guild,
            member,
            "App Worker",
            status
          );

      break;
    case "membershipWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.membershipWorkingGroupLead,
            guild,
            member,
            "Membership Lead",
            status
          )
        : addRole(
            RoleAddress.membershipWorkingGroup,
            guild,
            member,
            "Membership Worker",
            status
          );

      break;
    case "distributionWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.distributionWorkingGroupLead,
            guild,
            member,
            "Distribution Lead",
            status
          )
        : addRole(
            RoleAddress.distributionWorkingGroup,
            guild,
            member,
            "Distribution Worker",
            status
          );

      break;
    case "storageWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.storageWorkingGroupLead,
            guild,
            member,
            "Storage Lead",
            status
          )
        : addRole(
            RoleAddress.storageWorkingGroup,
            guild,
            member,
            "Storage Worker",
            status
          );

      break;
    case "operationsWorkingGroupAlpha":
      isLead
        ? addRole(
            RoleAddress.operationsWorkingGroupAlphaLead,
            guild,
            member,
            "Builder Lead",
            status
          )
        : addRole(
            RoleAddress.operationsWorkingGroupAlpha,
            guild,
            member,
            "Builder Worker",
            status
          );

      break;
    case "operationsWorkingGroupBeta":
      isLead
        ? addRole(
            RoleAddress.operationsWorkingGroupBetaLead,
            guild,
            member,
            "HR Lead",
            status
          )
        : addRole(
            RoleAddress.operationsWorkingGroupBeta,
            guild,
            member,
            "HR Worker",
            status
          );

      break;
    case "operationsWorkingGroupGamma":
      isLead
        ? addRole(
            RoleAddress.operationsWorkingGroupGammaLead,
            guild,
            member,
            "Marketing Lead",
            status
          )
        : addRole(
            RoleAddress.operationsWorkingGroupGamma,
            guild,
            member,
            "Marketing Worker",
            status
          );

      break;
    case "contentWorkingGroup":
      isLead
        ? addRole(
            RoleAddress.contentWorkingGroupLead,
            guild,
            member,
            "Content Lead",
            status
          )
        : addRole(
            RoleAddress.contentWorkingGroup,
            guild,
            member,
            "Content Worker",
            status
          );

      break;

    default:
      break;
  }
};

const addRole = async (
  roleId: string,
  guild: Guild,
  member: GuildMember,
  roleName: string,
  state: boolean | undefined
) => {
  const role = await guild.roles.fetch(roleId);
  if (role) {
    state ? await member.roles.add(role) : await member.roles.remove(role);
    console.log(
      `The role ${role.name} has been ${state ? "added" : "delete"} to ${
        member.user.tag
      }`
    );
  } else {
    console.log(`${roleName} Role not found`);
  }
};
export const setUserIdChallenge = async (
  userName: string,
  wallet: string,
  challenge: string
) => {
  const UserId = await IdModel.findOne({ discordHandle: userName });

  if (!UserId) {
    await IdModel.create({
      discordHandle: userName,
      challenge: challenge,
      rootAccount: wallet,
      verifyState: false,
    });
  } else {
    if (UserId.discordHandle === userName && UserId.rootAccount === wallet) {
      return true;
    }
    if (UserId) {
      UserId.challenge = challenge;
      UserId.rootAccount = wallet;
      UserId.verifyState = false;
    }
  }
  UserId?.save();
  return false;
};

export interface Challenge {
  name?: string;
  wallet?: string;
  challenge?: string;
}

export const getChallengeData = async (
  username: string
): Promise<Challenge | Boolean> => {
  const UserData = await IdModel.findOne({ discordHandle: username });

  if (!UserData) {
    return false;
  }

  const val: Challenge = {
    challenge: UserData?.challenge,
    name: UserData?.discordHandle,
    wallet: UserData?.rootAccount,
  };

  return val;
};

export const setChallengeVerify = async (
  username: string
): Promise<Challenge | Boolean> => {
  const UserData = await IdModel.findOne({ discordHandle: username });

  if (!UserData) {
    return false;
  }

  UserData.verifyState = true;
  UserData.save();

  return true;
};
