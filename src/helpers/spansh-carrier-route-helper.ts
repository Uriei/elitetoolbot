import { APIEmbed, JSONEncodable } from "discord.js";
import { ISpanshCarrierRoute } from "../modules/models/spansh-carrier-route.model";
import { wait } from "../modules/utils";
import { Log } from "../modules/logging";

const SPANSH_API_FLEETCARRIER_ROUTE = "https://www.spansh.co.uk/api/fleetcarrier/route";
const SPANSH_API_FLEETCARRIER_RESULT = "https://www.spansh.co.uk/api/results/";

export async function calculateCarrierRoute(
  origin: string,
  destination: string,
  capacity = 25000,
  mass = 25000,
  capacityUsed = 0,
  calculateStartingFuel = true,
): Promise<ISpanshCarrierRoute> {
  const body = new FormData();
  body.append("source", origin);
  body.append("destinations", destination);
  body.append("capacity", String(capacity));
  body.append("mass", String(mass));
  body.append("capacity_used", String(capacityUsed));
  body.append("calculate_starting_fuel", calculateStartingFuel ? "1" : "0");
  const jobQueue: ISpanshCarrierRoute = await fetch(SPANSH_API_FLEETCARRIER_ROUTE, { method: "POST", body }).then((res) => res.json());
  const job = jobQueue.job;
  let result: ISpanshCarrierRoute = jobQueue;
  await wait(3000);
  while (result.status === "queued") {
    result = await fetch(`${SPANSH_API_FLEETCARRIER_RESULT}${job}`, { method: "GET" }).then((res) => res.json());
    if (result.status === "queued") {
      await wait(2000);
    }
  }
  return result;
}

export function formatCarrierRouteForDiscord(spanshCarrierRoute: ISpanshCarrierRoute): (APIEmbed | JSONEncodable<APIEmbed>)[] {
  let embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] = [];
  let embed: APIEmbed | JSONEncodable<APIEmbed> = { color: 2721484 };
  embed.title = "**Fleet Carrier Route Results**";

  if (spanshCarrierRoute?.status === "ok" && spanshCarrierRoute.result) {
    const totalJumps = spanshCarrierRoute.result.jumps.length - 1;
    let descriptionEmbed = `**Total ${totalJumps} jumps.**\n`;
    let tritiumUsage = spanshCarrierRoute.result.jumps.map((j) => j.fuel_used).reduce((partialSum, a) => partialSum + a, 0);
    descriptionEmbed = descriptionEmbed.concat(`**Estimated Tritium fuel needed: *${tritiumUsage}*t.**\n\n`);

    let extraJumps = -1;
    for (let index = 0; index < spanshCarrierRoute.result.jumps.length; index++) {
      const jump = spanshCarrierRoute.result.jumps[index];
      if (index < 10) {
        if (index === 0) {
          descriptionEmbed = descriptionEmbed.concat(`📍 `);
        } else if (index + 1 === spanshCarrierRoute.result.jumps.length) {
          descriptionEmbed = descriptionEmbed.concat(`🎯 `);
        } else {
          descriptionEmbed = descriptionEmbed.concat(`🚀 `);
        }
        descriptionEmbed = descriptionEmbed.concat(`\`${jump.name}\``);
        descriptionEmbed = descriptionEmbed.concat(
          `\t\t📏\t\t${jump.distance.toFixed(2)}ly / ${jump.distance_to_destination.toFixed(2)}ly`,
        );

        descriptionEmbed = descriptionEmbed.concat("\n");
      } else {
        extraJumps += 1;
      }
    }

    if (spanshCarrierRoute.result.jumps.length >= 10) {
      descriptionEmbed = descriptionEmbed.concat(`-# *... [${extraJumps}] more jumps ...*\n`);
      descriptionEmbed = descriptionEmbed.concat(
        `🎯 \`${spanshCarrierRoute.result.jumps[spanshCarrierRoute.result.jumps.length - 1].name}\`\n`,
      );
    }
    descriptionEmbed = descriptionEmbed.concat(
      `\nYou can check your full route here: [Spansh.co.uk](https://www.spansh.co.uk/fleet-carrier/results/${spanshCarrierRoute.job})`,
    );
    embed.description = descriptionEmbed;
  } else {
    Log.log("SpanshCarrierRouteHelper", "Fleet Carrier route calculation failed\n", JSON.stringify(spanshCarrierRoute, null, 2));
    embed.color = 13369344;
    embed.description =
      `Sorry, the route couldn't be calculated.\n\nSpansh returned: ${spanshCarrierRoute.error}\n` +
      `Please check the Star System spelling.`;
  }

  embeds.push(embed);
  return embeds;
}
