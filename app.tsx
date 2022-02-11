#!/usr/bin/env -S deno run --allow-net --allow-env=bedrock,other,java --no-check --watch
/** @jsx h */
import { h, ssr, tw } from "./nanossr.ts";
import formsPlugin, {
	formCheckbox,
	formField,
	formFile,
	formInput,
	formRadio,
	forms,
	formSelect,
	formTextarea,
} from "https://esm.sh/@twind/forms@0.1.4";
import * as log from "https://deno.land/std@0.125.0/log/mod.ts";

const webhookURL = {
	bedrock: Deno.env.get("bedrock"),
	other: Deno.env.get("other"),
	java: Deno.env.get("java"),
};

const twConfig = {
	plugins: {
		forms,
		"form-checkbox": formCheckbox,
		"form-field": formField,
		"form-file": formFile,
		"form-input": formInput,
		"form-radio": formRadio,
		"form-select": formSelect,
		"form-textarea": formTextarea,
	},
};

import {
	serve,
	Status,
	STATUS_TEXT,
} from "https://deno.land/std@0.125.0/http/mod.ts";

function Form({ message }: { message?: string }) {
	return (
		<div class={tw`container mx-auto`}>
			{message
				? (
					<h1 class={tw`text-green-600`}>
						{message}
					</h1>
				)
				: ""}

			<h1 class={tw`text-7xl`}>
				Minecraft Leaderboard Request Form
			</h1>

			<a
				href="https://git.mcbe.wtf/MCBE-Speedrunning/Game-Requests"
				target="_blank"
				class={tw`
					text-blue-500
					no-underline
					transition-all
					ease-in-out
					duration-300
					hover:underline`}
			>
				Git Repository
			</a>
			<hr />

			<form action="/" method="POST">

				<label class={tw`block`}>
					Minecraft Edition

					<select
						name="edition"
						required
						class={tw`
						block
						mt-1
						rounded-md
						border-gray-300
						shadow-sm
						form-select
						focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
					>
						Edition

						{webhookURL.bedrock
							? (
								<option value="bedrock" selected="selected">
									Bedrock Edition
								</option>
							)
							: ""}

						{webhookURL.other
							? (
								<option value="other">
									Other
								</option>
							)
							: ""}

						<option value="java">
							Java Edition
						</option>
					</select>
				</label>

				<br />

				<label class={tw`block`}>
					Game/Map name

					<input
						type="text"
						name="game"
						maxlength="1024"
						required
						class={tw`
						mt-1
						block
						rounded-md
						border-gray-300
						shadow-sm
						focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
						/>
				</label>

				<h2>Download/Website link</h2>
				<input
					type="text"
					name="website"
					maxlength="1024"
					required="required"
				/>

				<h2>Proposed categories and rules</h2>
				<textarea
					name="rules"
					maxlength="1024"
					placeholder="When timing starts/ends Additional restrictions"
					required
					class={tw`
					forms-textarea
					mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
					`}
				>
				</textarea>

				<h2>Video of a completed run</h2>
				<input
					type="text"
					name="video"
					maxlength="1024"
					required="required"
				/>

				<h2>
					Your discord tag and/or speedrun.com username or other ways to contact
					you.
				</h2>
				<input
					type="text"
					name="author"
					maxlength="1024"
					required="required"
				/>

				<h2>A bit about yourself</h2>
				<textarea
					name="aboutme"
					placeholder="A message about yourself. "
					maxlength="1024"
					required="required"
				>
				</textarea>

				<h2>Additional notes</h2>
				<textarea name="notes" maxlength="1024" required="required">
					No additional notes provided
				</textarea>

				<h2>What's 9+10?</h2>
				<input type="text" name="math" maxlength="10" required="required" />

				<br />
				<br />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

function validateGameRequestBody(body: URLSearchParams): boolean {
	return (
		body.has("edition") &&
		body.has("game") &&
		body.has("website") &&
		body.has("video") &&
		body.has("rules") &&
		body.has("aboutme") &&
		body.has("notes") &&
		body.has("author")
	);
}

/**
 * Handle the game request
 * @param body The body from a request
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
		name: body.get("name")!,
		website: body.get("website")!,
		video: body.get("video")!,
		rules: body.get("rules")!,
		aboutme: body.get("aboutme")!,
		notes: body.get("notes")!,
		author: body.get("author")!,
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
								value: game.name || "No name provided",
								inline: true,
							},
							{
								name: "Download/Website Link",
								value: `Website: ${game.website}`,
								inline: true,
							},
							{
								name: "Proposed Categories and Rules",
								value: game.rules || "No rules provided",
							},
							{
								name: "Video of Completed Run",
								value: `Video: ${game.video}`,
							},
							{
								name: "Player Info",
								value: game.aboutme || "No info provided",
							},
							{
								name: "Additional Notes",
								value: game.notes || "No Additional notes provided",
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

serve(async (req) => {
	const url = new URL(req.url);
	const { pathname } = url;
	let response: Response;

	switch (pathname) {
		case "/": {
			if (req.method === "POST") response = await submitForm(req);
			else {
				response = ssr(() => <Form />, {
					tw: twConfig,
				});
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
