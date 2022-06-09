#!/usr/bin/env -S deno run --allow-net --allow-env=BEDROCK,OTHER,JAVA,DENO_DEPLOYMENT_ID --allow-read=.env,.env.defaults --no-check --watch

/** @jsx h */
import { Form } from "./components/Form.tsx";
import { webhookURL } from "./config.ts";
import { formSelect, h, log, serve, ssr, Status, STATUS_TEXT } from "./deps.ts";

const twConfig = {
	plugins: {
		"form-select": formSelect,
	},
};

function validateGameRequestBody(body: URLSearchParams): boolean {
	return (
		body.has("edition") &&
		body.has("game") &&
		body.has("website") &&
		body.has("video") &&
		body.has("rules") &&
		body.has("aboutme") &&
		body.has("notes") &&
		body.has("author") &&
		body.has("releasedate")
	);
}

/**
 * Handle the game request
 * @param req A request object
 * @return The response
 */
async function submitForm(req: Request): Promise<Response> {
	let body: URLSearchParams;
	try {
		body = new URLSearchParams(await req.text());
	} catch (err) {
		return new Response(`Bad body :/\n${err}`, {
			status: Status.BadRequest,
			statusText: STATUS_TEXT.get(Status.BadRequest),
		});
	}

	if (body.get("math") != "19") {
		return new Response("you stupid", {
			status: Status.BadRequest,
			statusText: STATUS_TEXT.get(Status.BadRequest),
		});
	}

	if (!validateGameRequestBody(body)) {
		return new Response(
			`Bad body, make sure you have edition
name
website
video
rules
aboutme
notes
author`,
			{
				status: Status.BadRequest,
				statusText: STATUS_TEXT.get(Status.BadRequest),
			},
		);
	}
	const edition = body.get("edition")!;

	if (!(edition in webhookURL)) {
		console.log(webhookURL, edition);
		return new Response(`Bad edition: ${edition}`);
	}

	const game = {
		edition,
		name: body.get("game") || "No game/map provided",
		website: body.get("website") || "No website provided",
		video: body.get("video") || "No video provided",
		rules: body.get("rules") || "No rules provided",
		aboutme: body.get("aboutme") || "No about me provided",
		notes: body.get("notes") || "No additional nodes provided",
		author: body.get("author") || "No author provided",
		releasedate: body.has("releasedate")
			? new Date(body.get("releasedate")!).getTime()
			: "No release date provided",
	};

	const discordResponse = await fetch(
		// @ts-ignore We check above that this is correct.
		webhookURL[game.edition],
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: null,
				embeds: [
					{
						color: 2424603,
						fields: [
							{
								name: "Game/Map Name",
								value: game.name,
								inline: true,
							},
							{
								name: "Release date",
								value: typeof game.releasedate === "number"
									? `<t:${Math.floor(game.releasedate / 1000)}:D>`
									: game.releasedate,
								inline: true,
							},
							{
								name: "Download/Website Link",
								value: `Website: ${game.website}`,
								inline: true,
							},
							{
								name: "Proposed Categories and Rules",
								value: game.rules,
							},
							{
								name: "Video of Completed Run",
								value: `Video: ${game.video}`,
							},
							{
								name: "Player Info",
								value: game.aboutme,
							},
							{
								name: "Additional Notes",
								value: game.notes,
							},
						],
						author: {
							name: `Submitted by ${game.author}`,
						},
					},
				],
			}),
		},
	);

	if (!discordResponse.ok) {
		log.debug(`${discordResponse.status}: ${await discordResponse.text()}`);
		return new Response(
			"Something went wrong and your request was not delivered. Please report this incident to an admin.",
			{
				status: Status.InternalServerError,
				statusText: STATUS_TEXT.get(Status.InternalServerError),
			},
		);
	}

	return ssr(() => <Form message="Form submitted" />, {
		tw: twConfig,
	});
}
let formPageResponse: Response | false = false;

console.log("Listening on http://0.0.0.0:8000");
await serve(async (req: Request) => {
	const url = new URL(req.url);
	const { pathname } = url;
	let response: Response;

	switch (pathname) {
		case "/": {
			if (req.method === "POST") response = await submitForm(req);
			else {
				if (!formPageResponse) {
					formPageResponse = ssr(() => <Form />, {
						tw: twConfig,
					});
				}
				response = formPageResponse.clone();
			}
			break;
		}
		default: {
			response = new Response("Not found", {
				status: Status.NotFound,
				statusText: STATUS_TEXT.get(Status.NotFound),
			});
			break;
		}
	}

	return response;
});
