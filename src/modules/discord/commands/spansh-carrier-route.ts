import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import { calculateCarrierRoute, formatCarrierRouteForDiscord } from "../../../helpers/spansh-carrier-route-helper";
import { Log } from "../../logging";

export default {
  data: new SlashCommandBuilder()
    .setName("plot-carrier-route")
    .setDescription("Plot a Fleet Carrier route from Origin to Destination")
    .setContexts([InteractionContextType.BotDM, InteractionContextType.PrivateChannel, InteractionContextType.Guild])
    .addStringOption((stringOption) => stringOption.setName("origin").setDescription("System Origin").setRequired(true))
    .addStringOption((stringOption) => stringOption.setName("destination").setDescription("System Destination").setRequired(true))
    .addNumberOption((numberOption) =>
      numberOption
        .setName("capacity-used")
        .setDescription("Amount of tons currently in use in your carrier. Will be used to calculate Tritium needs. default=0")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(60000),
    )
    .addBooleanOption((booleanOption) =>
      booleanOption.setName("squadron-carrier").setDescription("Is it a Squadron Carrier? default=false").setRequired(false),
    )
    .addBooleanOption((booleanOption) =>
      booleanOption.setName("visible").setDescription("Posts the result for everyone to see. default=false").setRequired(false),
    ),

  execute: {
    async execute(interaction: ChatInputCommandInteraction) {
      const origin = interaction.options.getString("origin", true);
      const destination = interaction.options.getString("destination", true);
      const capacityUsed = interaction.options.getNumber("capacity-used") || 0;
      const squadronCarrier = interaction.options.getBoolean("squadron-carrier") || false;
      const capacity = squadronCarrier ? 60000 : 25000;
      const mass = squadronCarrier ? 15000 : 25000;
      const visible = interaction.options.getBoolean("visible") || false;
      Log.log(
        "SpanshCarrierRouteCommand",
        "Calculating Fleet Carrier route",
        origin,
        destination,
        capacity,
        mass,
        capacityUsed,
        squadronCarrier,
      );
      await interaction.deferReply({ flags: visible ? [] : MessageFlags.Ephemeral });
      const spanshCarrierRoute = await calculateCarrierRoute(origin, destination, capacity, mass, capacityUsed);
      const embeds = formatCarrierRouteForDiscord(spanshCarrierRoute);
      Log.log(
        "SpanshCarrierRouteCommand",
        "Fleet Carrier route",
        origin,
        destination,
        `https://www.spansh.co.uk/fleet-carrier/results/${spanshCarrierRoute.job}`,
      );
      await interaction.followUp({
        embeds: embeds,
      });
    },
  },
  autocomplete: {
    async autocomplete(interaction: AutocompleteInteraction) {},
  },
};
