import * as z from "zod/v4";
import { projectIdInput, publicIdInput } from "./schemas.js";
import { type BisibilityToolClient, registerTool } from "./tools.js";

export function registerRankCheckRunTools(
  registration: Parameters<typeof registerTool>[0],
  client: BisibilityToolClient,
) {
  const shared = {
    access: "read" as const,
    group: "rank-history" as const,
    destructive: false,
    publishClosedSchema: true,
    description:
      "Read retained execution states, including cancelled, blocked and deferred outcomes without observations. Does not launch checks, retry provider requests or change schedules.",
  };
  registerTool(
    registration,
    "list_rank_check_runs",
    {
      ...shared,
      title: "List retained rank-check runs",
      inputSchema: z
        .object({
          project_id: projectIdInput,
          segment: z.enum(["history", "planned"]).optional(),
          status: z.string().min(1).optional(),
          limit: z.number().int().min(1).max(200).optional(),
          cursor: z.string().min(1).max(8192).optional(),
        })
        .strict(),
    },
    (input) =>
      client.listRankCheckRuns(input.project_id, {
        ...(input.segment === undefined ? {} : { segment: input.segment }),
        ...(input.status === undefined ? {} : { status: input.status }),
        ...(input.limit === undefined ? {} : { limit: input.limit }),
        ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
      }),
  );
  registerTool(
    registration,
    "get_rank_check_run",
    {
      ...shared,
      title: "Get retained rank-check run",
      inputSchema: z
        .object({
          project_id: projectIdInput,
          run_id: publicIdInput("rcr").describe(
            "Public identifier of the retained rank-check run.",
          ),
        })
        .strict(),
    },
    (input) => client.getRankCheckRun(input.project_id, input.run_id),
  );
}
