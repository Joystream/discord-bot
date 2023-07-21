export const GroupIdToRoleParam = {
  contentWorkingGroup: "Content",
  forumWorkingGroup: "Forum",
  appWorkingGroup: "App",
  membershipWorkingGroup: "Membership",
  distributionWorkingGroup: "Distribution",
  storageWorkingGroup: "Storage",
  operationsWorkingGroupAlpha: "Builders",
  operationsWorkingGroupBeta: "HR",
  operationsWorkingGroupGamma: "Marketings",
} as const;

export type GroupIdName = keyof typeof GroupIdToRoleParam;
