import { Command } from "./Command";
import { Deposit1 } from "./commands/Deposit1";
import { Trasnfer } from "./commands/Transfer";
import { Withdraw } from "./commands/Withdraw";
import { Deposit2 } from "./commands/Deposit2";
import { GetAmount } from "./commands/GetAmount";
import { Help } from "./commands/Help";
import { History } from "./commands/History";

export const Commands: Command[] = [
  Deposit1,
  Trasnfer,
  Withdraw,
  Deposit2,
  GetAmount,
  Help,
  History,
];
