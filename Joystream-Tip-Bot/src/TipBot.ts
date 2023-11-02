import { Client, ClientOptions } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import * as dotenv from 'dotenv';
import { connectDatabase } from "./database/connectDatabase"
import { validateEnv } from "./utils/validateEnv";

dotenv.config();


const token = process.env.SERVER_TOKEN; // add your token here

console.log("Bot is starting...");

(async () => {
    if (!validateEnv()) return;

    const client = new Client({
        intents: []
    });

    connectDatabase();
    client.login(token);
    ready(client);
    interactionCreate(client);
})();


