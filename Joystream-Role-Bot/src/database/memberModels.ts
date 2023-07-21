import { model, Schema } from "mongoose";
import { RoleMember } from "src/query/generator/members_generate";

export interface RoleBotData {
  id: string;
  handle: string;
  isFoundingMember: boolean;
  isCouncilMember: boolean;
  isCreator: boolean;
  rootAddress: string;
  roles: RoleMember[];
}

interface RoleSchema {
  groupId: String;
  isLead: Boolean;
}
export const RoleBot = new Schema({
  id: String,
  handle: String,
  isFoundingMember: Boolean,
  isCouncilMember: Boolean,
  isCreator: Boolean,
  rootAddress: String,
  roles: Array<RoleSchema>,
});

export default model<RoleBotData>("memberRole", RoleBot);
