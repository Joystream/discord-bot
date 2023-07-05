## How to use

### **The first step is to do on-chain JOY transfer from your account to the bot pool address.**

After that, you must couple your deposit to your discord handle by running the commands `/verifyDeposit-1` and `/verifyDeposit-2`

If verification is done successfully, you can use the commands `/send` and `/withdraw`

- `/verifyDeposit-1`
    
    Verify that you are the owner of the account that deposited JOY to the bot pool address by starting a signature verification.
    
    **wallet**: The wallet address from which you transferred JOY to the bot pool address.
    
    example: `/register wallet j4Umbxo2oPWGH6o311bMVTZ69WuoyfSdGPjQxT32fwvaeAfGb`
    
    After running this command you will see either of the following messages:
    
    - `Your discord UID is already coupled with the given address. No need to run verifyDeposit-2`
    In this case, your deposit is already verified since it’s not the first time for the discord user to use the given wallet address as deposit wallet.
    - `Go to this URL https://polkadot.js.org/apps/?rpc=wss://rpc.joystream.org:9944#/signing and sign the following data with the given account. hgiejfsbv`
    In this case, it’s your first time to use the given wallet to deposit JOY to the bot pool.
    You must continue verification by following the URL and signing the random string at the and of the message with the deposit account.
    Then you must continue by running the command `/verifyDeposit-2`
    
- `/verifyDeposit-2`
    
    Finish verification of deposit by supplying the resulting signature from the above step.
    
    **signature**: the resulting signature after signing the random string from `/verifyDeposit-1`
    
    example: `/verifyDeposit-2 signature 0xa02c83a75d38674e5b9dfc25678afd726be8a43fff254c15c24357936040a3233368b40a9fb17b80e1a606101b3e3b92ca1705a76432ee856a28102813d3268b`
    
    After running this command, if everything is well, your total JOY balance in the pool will be displayed.
    
- `/getBalance`
    
    Get the amount of JOY you possess in the bot pool
    
- `/send`
    
    Transfer JOY from the bot pool from your possession to another discord user
    
    **receiver**: the discord User ID of the receiver
    
    **amount**: Amount of JOY to send
    
    example: `/send receiver 1027738209942049787 amount 10`
    
- `/withdraw`
Withdraw JOY from the discord pool to the connected Joystream account
**amount**: amount of JOY to withdraw
example: `/withdraw amount 10`

- `/help`
Link the user to this help page.
    
    

## **Setup**

In order to start the discord bot server and connect it to the Joystream discord server, the admin must follow the next steps.

- Setup a mongodb server
- Create a Joystream wallet account. This will serve as the pool for all discord users who use the tipping bot.
- Configure the env file.
MONGO_URI = 'mongo uri'
SERVER_TOKEN = 'discord server token'
SERVER_WALLET_ADDRESS = "wallet address"
SERVER_WALLET_KEY="12 words"
- Start the server