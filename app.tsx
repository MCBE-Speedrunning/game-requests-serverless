#!/usr/bin/env -S deno run --allow-net --allow-env=BEDROCK,OTHER,JAVA,DENO_DEPLOYMENT_ID --allow-read=.env,.env.defaults --no-check --watch
/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Helmet, ssr, tw } from "./nanossr.ts";
import { formSelect } from "https://esm.sh/@twind/forms@0.1.4";
import * as log from "https://deno.land/std@0.125.0/log/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import {
	serve,
	Status,
	STATUS_TEXT,
} from "https://deno.land/std@0.128.0/http/mod.ts";

if (!Deno.env.get("DENO_DEPLOYMENT_ID")) config({ export: true });

const webhookURL = {
	bedrock: Deno.env.get("BEDROCK"),
	other: Deno.env.get("OTHER"),
	java: Deno.env.get("JAVA"),
};

const twConfig = {
	plugins: {
		"form-select": formSelect,
	},
};

function Input(
	{ name, maxlength, required = false, id }: {
		name: string;
		maxlength: string | number;
		required?: boolean;
		id?: string;
	},
) {
	return (
		<input
			type="text"
			name={name}
			maxlength={maxlength}
			required={required}
			class={tw`
				mt-1
				block
				w-fit
				rounded-md
				bg-gray-100
				border-2
				focus:border-black focus:bg-white focus:ring-0 focus:w-full
			`}
		/>
	);
}

function Label({ children, htmlFor }: { children: any; htmlFor: string }) {
	return (
		<label class={tw`block text-2xl font-bold`} htmlFor={htmlFor}>
			{children}
		</label>
	);
}

function TextArea(
	{ children, name, placeholder, maxlength, required = false, id }: {
		children?: any;
		name: string;
		placeholder?: string;
		maxlength: number | string;
		required?: boolean;
		id?: string;
	},
) {
	return (
		<textarea
			id={id}
			name={name}
			maxlength={maxlength}
			placeholder={placeholder}
			required={required}
			class={tw`
					mt-1
					block
					w-fit
					rounded-md
					bg-gray-100
					border-2
					focus:border-black focus:bg-white focus:ring-0 focus:w-full

			`}
		>
			{children}
		</textarea>
	);
}

function Form({ message }: { message?: string }) {
	return (
		<>
			<Helmet>
				<html lang="en" />
				<body class={tw`m-0 bg-white text-black`} />
				<title>
					Minecraft Leaderboard Request Form
				</title>

				<meta
					property="og:title"
					content="Minecraft Leaderboard Request Form"
				/>
				<meta
					name="description"
					content="A form for submitting new minecraft games and maps to speedrun.com"
				/>
				<meta
					property="og:description"
					content="A form for submitting new minecraft games and maps to speedrun.com"
				/>
				<meta property="og:locale" content="en_US" />
				<meta property="og:site_name" content="Minecraft speedrunning form" />
				<meta name="theme-color" content="#199C77" />
			</Helmet>

			<div
				class={tw`container md:mx-auto md:px-96 px-4 py-8`}
			>
				{message
					? (
						<h1 class={tw`text-green-600 text-4xl py-4`}>
							{message}
						</h1>
					)
					: ""}

				<h1 class={tw`text-5xl`}>
					Minecraft Leaderboard Request Form
				</h1>

				<a
					href="https://github.com/MCBE-Speedrunning/game-requests-serverless"
					target="_blank"
					class={tw`
						text-blue-500
						no-underline
						transition-all
						ease-in-out
						duration-300
						py-4
						text-lg
						inline-block
						hover:underline`}
				>
					Git Repository
				</a>
				<hr />

				<form action="/" method="POST">
					<Label htmlFor="edition">
						Minecraft Edition

						<select
							id="edition"
							name="edition"
							required
							class={tw`
								block
								mt-1
								rounded-md
								border-gray-300
								shadow-sm
								form-select
								focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
							`}
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
							{webhookURL.java
								? (
									<option value="java">
										Java Edition
									</option>
								)
								: ""}
						</select>
					</Label>

					<br />

					<Label htmlFor="game">
						Game/Map name

						<Input
							id="game"
							name="game"
							maxlength="1024"
							required
						/>
					</Label>
					<Label htmlFor="releasedate">
						Release Date in any region
						<input
							type="date"
							id="releasedate"
							name="releasedate"
							required
							pattern="\d{4}-\d{2}-\d{2}"
						/>
					</Label>

					<Label htmlFor="website">
						Download/Website link
						<Input
							id="website"
							name="website"
							maxlength="1024"
							required
						/>
					</Label>

					<Label htmlFor="rules">
						Proposed categories and rules
						<TextArea
							id="rules"
							name="rules"
							maxlength="1024"
							placeholder="When timing starts/ends Additional restrictions"
							required
						/>
					</Label>

					<Label htmlFor="video">
						Video of a completed run
						<Input
							id="video"
							name="video"
							maxlength="1024"
							required
						/>
					</Label>

					<Label htmlFor="author">
						Your discord tag and/or speedrun.com username or other ways to
						contact you.
						<Input
							id="author"
							name="author"
							maxlength="1024"
							required
						/>
					</Label>

					<Label htmlFor="aboutme">
						A bit about yourself
						<TextArea
							id="aboutme"
							name="aboutme"
							placeholder="A message about yourself. "
							maxlength="1024"
							required
						/>
					</Label>

					<Label htmlFor="notes">
						Additional notes
						<TextArea
							id="notes"
							name="notes"
							maxlength="1024"
							required
							placeholder="No additional notes provided"
						/>
					</Label>

					<Label htmlFor="math">
						What's 9+10?
						<Input id="math" name="math" maxlength="10" required />
					</Label>

					<br />
					<button
						class={tw`rounded-full bg-gray-100 px-4 py-2 w-fit`}
						type="submit"
					>
						Submit
					</button>
				</form>
				<script>
					{/** Prevent a refresh from re-submitting the form */}
					{`if ( window.history.replaceState ) {
						window.history.replaceState( null, null, window.location.href );
					}`}
				</script>
			</div>
		</>
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
		body.has("author") &&
		body.has("releasedate")
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
