import * as z from "zod/v4";
import { projectIdInput, publicIdInput } from "./schemas.js";
const date = z.iso
  .datetime({ precision: 3 })
  .refine(
    (value) =>
      Number.isFinite(Date.parse(value)) &&
      new Date(value).toISOString() === value &&
      Date.parse(value) >= 0,
  );
const project = {
  project_id: projectIdInput,
  monitor_id: publicIdInput("lmn").describe("Public identifier of the retained Local monitor."),
  as_of: date.optional().describe("Frozen UTC selection time with milliseconds."),
};
const run = {
  ...project,
  run_id: publicIdInput("lmr").describe("Public identifier of the original retained Local run."),
};
const point = {
  ...run,
  target_id: publicIdInput("lmt").describe(
    "Public identifier of the original captured Local measurement target.",
  ),
};
const history = {
  from: date.optional().describe("Inclusive occurrence-created window start."),
  to: date.optional().describe("Inclusive occurrence-created window end, no later than as_of."),
  cursor: z
    .string()
    .min(1)
    .max(8000)
    .optional()
    .describe("Opaque signed history cursor; preserve selection and original point scope."),
};
export const localMonitorSchemas = {
  listLocalMonitorRuns: z.object({ ...project, ...history }).strict(),
  getLocalMonitorRunResults: z.object(run).strict(),
  listLocalMonitorPointListings: z.object(point).strict(),
  listLocalMonitorPointHistory: z.object({ ...point, ...history }).strict(),
  exportLocalMonitorRun: z
    .object({
      ...run,
      version: z
        .literal("1")
        .optional()
        .describe("Local point report version 1; returns normalized retained JSON only."),
    })
    .strict(),
};
