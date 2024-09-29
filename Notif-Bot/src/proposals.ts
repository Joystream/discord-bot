import { GetProposalsDocument } from "./graphql/generated/graphql";
import { graphqlClient } from "./graphql/client";
import { withApi } from "./js-api";
import { getProposalVotingPeriod } from "./js-api";

export const getProposals = async () => {
  const rawProposals = await graphqlClient.request(GetProposalsDocument);
  const proposals = await withApi(async (api) => {
    const header = await api.rpc.chain.getHeader();
    const currentBlock = header.number.toNumber();
    const currentTime = Date.now();

    const votingProposals = rawProposals.proposals.filter(
      (proposal) => proposal.status.__typename === "ProposalStatusDeciding"
    );

    const promises = votingProposals.map(async (proposal) => {
      const votingPeriod = await getProposalVotingPeriod(
        proposal.details.__typename,
        api
      );
      const expiresAtBlock = proposal.statusSetAtBlock + votingPeriod;
      const blocksUntilExpiry = expiresAtBlock - currentBlock;
      const secondsUntilExpiry = blocksUntilExpiry * 6;
      const expiryDate = new Date(currentTime + secondsUntilExpiry * 1000);
      return {
        id: proposal.id,
        title: proposal.title,
        creator: proposal.creator.handle,
        createdAt: new Date(proposal.createdAt),
        status: proposal.status.__typename,
        statusSetAtBlock: proposal.statusSetAtBlock,
        expiresAtBlock: proposal.statusSetAtBlock + votingPeriod,
        secondsUntilExpiry: secondsUntilExpiry,
        expiryDate: expiryDate,
        type: proposal.details.__typename.replace("ProposalDetails", ""),
      };
    });
    return Promise.all(promises);
  });
  return proposals;
};

export type Proposal = Awaited<ReturnType<typeof getProposals>>[number];
