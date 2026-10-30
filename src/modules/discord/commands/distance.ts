import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { upperCase as _upperCase } from "lodash";
import { calculateDistance, getFormattedSystemName } from "../../../helpers/ed-distance-calc.helper";
import { Log } from "../../logging";

export default {
  data: new SlashCommandBuilder()
    .setName("distance")
    .setDescription("Tells the distance between two Systems")
    .setContexts([InteractionContextType.BotDM, InteractionContextType.PrivateChannel, InteractionContextType.Guild])
    .addStringOption((stringOption) =>
      stringOption
        .setName("origin")
        .setDescription("System name of origin")
        .setMinLength(2)
        .setMaxLength(70)
        .setAutocomplete(false)
        .setRequired(true),
    )
    .addStringOption((stringOption) =>
      stringOption
        .setName("destination")
        .setDescription("System name of destination")
        .setMinLength(2)
        .setMaxLength(70)
        .setAutocomplete(false)
        .setRequired(true),
    )
    .addBooleanOption((booleanOption) =>
      booleanOption.setName("visible").setDescription("Posts the result for everyone to see.").setRequired(false),
    ),

  execute: {
    async execute(interaction: ChatInputCommandInteraction) {
      const systemOrigin = interaction.options.getString("origin", true);
      const systemDestination = interaction.options.getString("destination", true);
      const visible = interaction.options.getBoolean("visible", false);

      await interaction.deferReply({ flags: visible ? [] : MessageFlags.Ephemeral });

      let reply = "";

      try {
        Log.log("DistanceCommand", "Calculating distance", systemOrigin, systemDestination);
        const distanceResult = await calculateDistance(systemOrigin, systemDestination);
        reply = `Distance between **${await getFormattedSystemName(systemOrigin)}** and **${await getFormattedSystemName(
          systemDestination,
        )}**: ${distanceResult.toLocaleString("en")} ly.`;
        Log.log("DistanceCommand", "Calculated distance", systemOrigin, systemDestination, distanceResult);
      } catch (error) {
        if (error === "ERROR-NOTFOUND") {
          reply = "You need to enter two existing System Names";
          Log.log(
            "DistanceCommand",
            "Distance command failed. One or both of the systems entered do not exist",
            systemOrigin,
            systemDestination,
          );
        } else {
          reply = "There was an error while trying to calculate the distance.";
          Log.log("DistanceCommand", "Distance command failed", error);
        }
      }
      await interaction.editReply({ content: reply });
    },
  },
  autocomplete: {
    async autocomplete(interaction: AutocompleteInteraction) {},
  },
};
