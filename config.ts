import { load } from "./deps.ts";

if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
	await load({ export: true });
}

export const webhookURL = {
	bedrock: Deno.env.get("BEDROCK"),
	other: Deno.env.get("OTHER"),
	java: Deno.env.get("JAVA"),
} as const;
