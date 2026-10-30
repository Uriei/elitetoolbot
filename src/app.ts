import * as dotenv from "dotenv";
dotenv.config();
import { Discord } from "./modules/discord/discord";
import { Log } from "./modules/logging";

let discord: Discord;

async function app() {
  discord = await Discord.getInstance();
  Log.log("Elite Dangerous Toolbot online.");
}

async function shutdown() {
  discord.setPresence("idle");
  Log.log("Closing Elite Dangerous Toolbot.");
  // Stop all timeout intervals
  discord.disconnect();
  clearInterval(discord.discordKeepAliveInterval);

  Log.log("Elite Dangerous Toolbot offline.");
  process.exit(0);
}

process.on("SIGBREAK", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGHUP", shutdown);

app();
