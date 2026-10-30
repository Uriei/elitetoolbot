import { addHours, format, formatDuration, intervalToDuration } from "date-fns";
import { APIEmbed, APIEmbedField, EmbedBuilder } from "discord.js";

const DEFAULT_COLOR = 0x033280;

export function generateMessageEmbed(title: string, description?: string) {
  const embed = new EmbedBuilder().setColor(DEFAULT_COLOR).setTitle(title);
  if (description) {
    embed.setDescription(description);
  }
  return [embed.toJSON()];
}

function formatDateServerTime(date: number): string {
  return format(date, "HHmm");
}

function calculateDuration(init: number, end: number): string {
  return formatDuration(intervalToDuration({ start: init, end: end }), { zero: false });
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
