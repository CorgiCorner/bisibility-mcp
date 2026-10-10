import type { BisibilityClient } from "@bisibility/sdk";
import { aiTrackingSchemas } from "./ai-tracking-schemas.js";
import { type BisibilityToolClient, registerTool } from "./tools.js";

export function registerAiTrackingCatalogTools(
  registration: Parameters<typeof registerTool>[0],
  client: BisibilityToolClient,
) {
  registerTool(
    registration,
    "list_ai_tracking_topics",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.listAiTrackingTopics,
      publishClosedSchema: true,
      title: "List ai tracking topics",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.listAiTrackingTopics(
        input.project_id,
        payload as Parameters<BisibilityClient["listAiTrackingTopics"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "create_ai_tracking_topic",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.createAiTrackingTopic,
      publishClosedSchema: true,
      title: "Create ai tracking topic",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.createAiTrackingTopic(
        input.project_id,
        payload as Parameters<BisibilityClient["createAiTrackingTopic"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "update_ai_tracking_topic",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.updateAiTrackingTopic,
      publishClosedSchema: true,
      title: "Update ai tracking topic",
    },
    async (input) => {
      const { project_id, topic_id, ...payload } = input;
      return client.updateAiTrackingTopic(
        input.project_id,
        input.topic_id,
        payload as Parameters<BisibilityClient["updateAiTrackingTopic"]>[2],
      );
    },
  );
  registerTool(
    registration,
    "archive_ai_tracking_topic",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: true,
      inputSchema: aiTrackingSchemas.archiveAiTrackingTopic,
      publishClosedSchema: true,
      title: "Archive ai tracking topic",
    },
    async (input) => {
      return client.archiveAiTrackingTopic(input.project_id, input.topic_id);
    },
  );
  registerTool(
    registration,
    "list_ai_tracking_prompts",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.listAiTrackingPrompts,
      publishClosedSchema: true,
      title: "List ai tracking prompts",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.listAiTrackingPrompts(
        input.project_id,
        payload as Parameters<BisibilityClient["listAiTrackingPrompts"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "create_ai_tracking_prompt",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.createAiTrackingPrompt,
      publishClosedSchema: true,
      title: "Create ai tracking prompt",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.createAiTrackingPrompt(
        input.project_id,
        payload as Parameters<BisibilityClient["createAiTrackingPrompt"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "update_ai_tracking_prompt",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.updateAiTrackingPrompt,
      publishClosedSchema: true,
      title: "Update ai tracking prompt",
    },
    async (input) => {
      const { project_id, prompt_id, ...payload } = input;
      return client.updateAiTrackingPrompt(
        input.project_id,
        input.prompt_id,
        payload as Parameters<BisibilityClient["updateAiTrackingPrompt"]>[2],
      );
    },
  );
  registerTool(
    registration,
    "archive_ai_tracking_prompt",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: true,
      inputSchema: aiTrackingSchemas.archiveAiTrackingPrompt,
      publishClosedSchema: true,
      title: "Archive ai tracking prompt",
    },
    async (input) => {
      return client.archiveAiTrackingPrompt(input.project_id, input.prompt_id);
    },
  );
  registerTool(
    registration,
    "list_ai_tracking_schedules",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.listAiTrackingSchedules,
      publishClosedSchema: true,
      title: "List ai tracking schedules",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.listAiTrackingSchedules(
        input.project_id,
        payload as Parameters<BisibilityClient["listAiTrackingSchedules"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "create_ai_tracking_schedule",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.createAiTrackingSchedule,
      publishClosedSchema: true,
      title: "Create ai tracking schedule",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.createAiTrackingSchedule(
        input.project_id,
        payload as Parameters<BisibilityClient["createAiTrackingSchedule"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "update_ai_tracking_schedule",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.updateAiTrackingSchedule,
      publishClosedSchema: true,
      title: "Update ai tracking schedule",
    },
    async (input) => {
      const { project_id, schedule_id, ...payload } = input;
      return client.updateAiTrackingSchedule(
        input.project_id,
        input.schedule_id,
        payload as Parameters<BisibilityClient["updateAiTrackingSchedule"]>[2],
      );
    },
  );
  registerTool(
    registration,
    "archive_ai_tracking_schedule",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: true,
      inputSchema: aiTrackingSchemas.archiveAiTrackingSchedule,
      publishClosedSchema: true,
      title: "Archive ai tracking schedule",
    },
    async (input) => {
      return client.archiveAiTrackingSchedule(input.project_id, input.schedule_id);
    },
  );
}
