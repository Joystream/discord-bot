import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";

export async function transferBalance(
  sendKey: string,
  recipient: string,
  amount: number
) {
  let result: boolean = true;

  const wsProvider = new WsProvider("wss://rpc.joystream.org:9944");
  const api = await ApiPromise.create({ provider: wsProvider });
  const keyring = new Keyring({ type: "sr25519" });

  const sender = keyring.addFromUri(sendKey);

  const transfer = api.tx.balances.transferKeepAlive(recipient, amount);

  try {
    await transfer.signAndSend(sender, ({ events = [], status }) => {
      console.log("Transaction status:", status.type);

      if (status.isInBlock) {
        console.log("Included at block hash", status.asInBlock.toHex());
        console.log("Events:");

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(
            "\t",
            phase.toString(),
            `: ${section}.${method}`,
            data.toString()
          );
        });
      }
    });
  } catch (error) {
    result = false;
  }

  return result;
}
