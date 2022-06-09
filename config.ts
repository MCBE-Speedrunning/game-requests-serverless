import { config } from "./deps.ts";

if (!Deno.env.get("DENO_DEPLOYMENT_ID")) config({ export: true });

export const webhookURL = {
	bedrock: Deno.env.get("BEDROCK"),
	other: Deno.env.get("OTHER"),
	java: Deno.env.get("JAVA"),
};
