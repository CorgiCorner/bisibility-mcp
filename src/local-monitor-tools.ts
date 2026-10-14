import type { LocalMonitorHistoryOptions } from "@bisibility/sdk";
import { localMonitorSchemas as schemas } from "./local-monitor-schemas.js";
import { type BisibilityToolClient, registerTool } from "./tools.js";
function options(input: {
  as_of?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  cursor?: string | undefined;
}): LocalMonitorHistoryOptions {
  return {
    ...(input.as_of === undefined ? {} : { asOf: input.as_of }),
    ...(input.from === undefined ? {} : { from: input.from }),
    ...(input.to === undefined ? {} : { to: input.to }),
    ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
  };
}
export function registerLocalMonitorTools(
  registration: Parameters<typeof registerTool>[0],
  client: BisibilityToolClient,
) {
  const shared = {
    access: "read" as const,
    group: "rank-history" as const,
    destructive: false,
    publishClosedSchema: true,
    description:
      "Read original retained Local evidence and honest quality/cost uncertainty. This never launches provider work, schedules, or accounting writes.",
  };
  registerTool(
    registration,
    "list_local_monitor_runs",
    { ...shared, title: "List local monitor runs", inputSchema: schemas.listLocalMonitorRuns },
    (input) => client.listLocalMonitorRuns(input.project_id, input.monitor_id, options(input)),
  );
  registerTool(
    registration,
    "get_local_monitor_run_results",
    {
      ...shared,
      title: "Get local monitor run results",
      inputSchema: schemas.getLocalMonitorRunResults,
    },
    (input) =>
      client.getLocalMonitorRunResults(
        input.project_id,
        input.monitor_id,
        input.run_id,
        options(input),
      ),
  );
  registerTool(
    registration,
    "list_local_monitor_point_listings",
    {
      ...shared,
      title: "List local monitor point listings",
      inputSchema: schemas.listLocalMonitorPointListings,
    },
    (input) =>
      client.listLocalMonitorPointListings(
        input.project_id,
        input.monitor_id,
        input.run_id,
        input.target_id,
        options(input),
      ),
  );
  registerTool(
    registration,
    "list_local_monitor_point_history",
    {
      ...shared,
      title: "List local monitor point history",
      inputSchema: schemas.listLocalMonitorPointHistory,
    },
    (input) =>
      client.listLocalMonitorPointHistory(
        input.project_id,
        input.monitor_id,
        input.run_id,
        input.target_id,
        options(input),
      ),
  );
  registerTool(
    registration,
    "export_local_monitor_run",
    { ...shared, title: "Export local monitor run", inputSchema: schemas.exportLocalMonitorRun },
    (input) =>
      client.exportLocalMonitorRun(input.project_id, input.monitor_id, input.run_id, {
        ...options(input),
        version: "1",
        format: "json",
      }),
  );
}
