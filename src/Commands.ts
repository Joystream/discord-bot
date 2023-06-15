import { Command } from "./Command";
import { Deposit } from "./commands/Deposit";
import { Trasnfer } from "./commands/Transfer";
import { Withdraw } from "./commands/Withdraw";
import { SetWallet } from "./commands/SetWallet";
import { GetAmount } from "./commands/GetAmount";

export const Commands: Command[] = [Deposit, Trasnfer, Withdraw, SetWallet, GetAmount];