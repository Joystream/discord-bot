import { Command } from "./Command";
import { Claim } from "./commands/Claim";
import { Solve } from "./commands/Solve";
import { Role } from "./commands/Role";
import { Help } from "./commands/Help";

export const Commands: Command[] = [Claim, Solve, Help, Role];
