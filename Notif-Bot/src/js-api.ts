import "@joystream/types";
import { WsProvider, ApiPromise } from "@polkadot/api";

export const withApi = async <T>(
  fn: (api: ApiPromise) => Promise<T>
): Promise<T> => {
  const provider = new WsProvider("wss://rpc.joystream.org");
  const api = new ApiPromise({ provider, noInitWarn: true });
  await api.isReady;
  const result = await fn(api);
  await api.disconnect();
  return result;
};

const proposalTypeToConstantKey = new Map<string, string>([
  [
    "UpdateChannelPayoutsProposalDetails",
    "updateChannelPayoutsProposalParameters",
  ],
  [
    "UpdatePalletFrozenStatusProposalDetails",
    "setPalletFozenStatusProposalParameters",
  ],
  ["AmendConstitutionProposalDetails", "amendConstitutionProposalParameters"],
  [
    "CancelWorkingGroupLeadOpeningProposalDetails",
    "cancelWorkingGroupLeadOpeningProposalParameters",
  ],
  [
    "CreateWorkingGroupLeadOpeningProposalDetails",
    "createWorkingGroupLeadOpeningProposalParameters",
  ],
  [
    "DecreaseWorkingGroupLeadStakeProposalDetails",
    "decreaseWorkingGroupLeadStakeProposalParameters",
  ],
  [
    "FillWorkingGroupLeadOpeningProposalDetails",
    "fillWorkingGroupOpeningProposalParameters",
  ],
  ["FundingRequestProposalDetails", "fundingRequestProposalParameters"],
  ["RuntimeUpgradeProposalDetails", "runtimeUpgradeProposalParameters"],
  [
    "SetCouncilBudgetIncrementProposalDetails",
    "setCouncilBudgetIncrementProposalParameters",
  ],
  ["SetCouncilorRewardProposalDetails", "setCouncilorRewardProposalParameters"],
  [
    "SetInitialInvitationBalanceProposalDetails",
    "setInitialInvitationBalanceProposalParameters",
  ],
  [
    "SetInitialInvitationCountProposalDetails",
    "setInvitationCountProposalParameters",
  ],
  [
    "SetMaxValidatorCountProposalDetails",
    "setMaxValidatorCountProposalParameters",
  ],
  [
    "SetMembershipLeadInvitationQuotaProposalDetails",
    "setMembershipLeadInvitationQuotaProposalParameters",
  ],
  ["SetMembershipPriceProposalDetails", "setMembershipPriceProposalParameters"],
  ["SetReferralCutProposalDetails", "setReferralCutProposalParameters"],
  [
    "SetWorkingGroupLeadRewardProposalDetails",
    "setWorkingGroupLeadRewardProposalParameters",
  ],
  ["SignalProposalDetails", "signalProposalParameters"],
  [
    "SlashWorkingGroupLeadProposalDetails",
    "slashWorkingGroupLeadProposalParameters",
  ],
  [
    "TerminateWorkingGroupLeadProposalDetails",
    "terminateWorkingGroupLeadProposalParameters",
  ],
  [
    "UpdateWorkingGroupBudgetProposalDetails",
    "updateWorkingGroupBudgetProposalParameters",
  ],
  ["VetoProposalDetails", "vetoProposalProposalParameters"],
  [
    "SetEraPayoutDampingFactorProposalDetails",
    "setEraPayoutDampingFactorProposalParameters",
  ],
  [
    "DecreaseCouncilBudgetProposalDetails",
    "decreaseCouncilBudgetProposalParameters",
  ],
  [
    "UpdateTokenPalletTokenConstraintsProposalDetails",
    "updateTokenPalletTokenConstraints",
  ],
  ["UpdateArgoBridgeConstraintsProposalDetails", "updateArgoBridgeConstraints"],
]);

const cache = new Map<string, number>();

export const getProposalVotingPeriod = async (
  type: string,
  api: ApiPromise
) => {
  if (cache.has(type)) {
    return cache.get(type);
  }
  const constantsKey = proposalTypeToConstantKey.get(type);
  if (!constantsKey) {
    throw new Error(`Unknown proposal type: ${type}`);
  }
  const params = api.consts.proposalsCodex[constantsKey];
  const votingPeriod = (params as any).votingPeriod.toNumber();
  cache.set(type, votingPeriod);
  return votingPeriod;
};
