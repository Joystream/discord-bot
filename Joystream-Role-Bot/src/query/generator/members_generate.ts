import { RoleSelectMenuBuilder } from "@discordjs/builders";
import { GraphQLClient } from "graphql-request";

export interface MemberFieldFragment {
  id: string;
  handle: string;
  isFoundingMember: boolean;
  isCouncilMember: boolean;
  rootAccount: string;
  roles: [
    {
      status:
        | {
            __typename: string;
          }
        | {
            __typename: "WorkerStatusActive";
          }
        | {
            __typename: "WorkerStatusLeaving";
          }
        | {
            __typename: "WorkerStatusLeft";
          }
        | {
            __typename: "WorkerStatusTerminated";
          };
      groupId: string;
      isLead: boolean;
    }
  ];
}

export interface RoleMember {
  groupId?: string;
  inLead?: boolean;
}

export interface Member {
  id: string;
  handle: string;
  isFoundingMember: boolean;
  isCouncilMember: boolean;
  rootAccount: string;
  roles: RoleMember[];
}

export const asMember = (member: MemberFieldFragment): Member => {
  return {
    id: member.id,
    handle: member.handle,
    isFoundingMember: member.isFoundingMember,
    isCouncilMember: member.isCouncilMember,
    rootAccount: member.rootAccount,
    roles: member.roles.map((role) => {
      if (role.status.__typename === "WorkerStatusActive")
        return {
          groupId: role.groupId,
          inLead: role.isLead,
        };

      return {
        groupId: undefined,
        inLead: undefined,
      };
    }),
  };
};

export async function getMembers() {
  const graphQLClient = new GraphQLClient(
    process.env.QUERY_NODE || "https://query.joystream.org/graphql"
  );

  const query = `
    query getMembers {
        memberships(limit: 50000) {
          id
          handle
          isFoundingMember
          isCouncilMember
          rootAccount
          roles {
            status {
              ... on WorkerStatusActive {
                __typename
              }
              ... on WorkerStatusLeaving {
                __typename
              }
              ... on WorkerStatusLeft {
                __typename
              }
              ... on WorkerStatusTerminated {
                __typename
              }
            }
            groupId
            isLead
          }
        }
    }
  `;

  const variables = {};
  try {
    const data: any = await graphQLClient.request(query, variables);
    const members = data.memberships.map((membership: MemberFieldFragment) => {
      return asMember(membership);
    });
    return members;
  } catch (error) {
    console.error(error);
    return [];
  }
}
