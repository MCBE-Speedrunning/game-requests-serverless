#!/usr/bin/env -S deno run --allow-net --allow-env=BEDROCK,OTHER,JAVA,DENO_DEPLOYMENT_ID --no-check --watch
/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Helmet, ssr, tw } from "./nanossr.ts";
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

function Input(
	{ name, maxlength, required = false }: {
		name: string;
		maxlength: string | number;
		required?: boolean;
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

function Label({ children }: { children: any }) {
	return <label class={tw`block text-2xl font-bold`}>{children}</label>;
}

function TextArea(
	{ children, name, placeholder, maxlength, required = false }: {
		children?: any;
		name: string;
		placeholder?: string;
		maxlength: number | string;
		required?: boolean;
	},
) {
	return (
		<textarea
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
				<body class={tw`m-0 bg-white text-black`} />
			</Helmet>
			<div
				class={tw`container md:mx-auto md:px-96 py-4`}
			>
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
					<Label>
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
						dark:text-white
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

					<Label>
						Game/Map name

						<Input
							name="game"
							maxlength="1024"
							required
						/>
					</Label>

					<Label>
						Download/Website link
						<Input
							name="website"
							maxlength="1024"
							required
						/>
					</Label>

					<Label>
						Proposed categories and rules
						<TextArea
							name="rules"
							maxlength="1024"
							placeholder="When timing starts/ends Additional restrictions"
							required
						/>
					</Label>

					<Label>
						Video of a completed run
						<Input
							name="video"
							maxlength="1024"
							required
						/>
					</Label>

					<Label>
						Your discord tag and/or speedrun.com username or other ways to
						contact you.
						<Input
							name="author"
							maxlength="1024"
							required
						/>
					</Label>

					<Label>
						A bit about yourself
						<TextArea
							name="aboutme"
							placeholder="A message about yourself. "
							maxlength="1024"
							required
						/>
					</Label>

					<Label>
						Additional notes
						<TextArea name="notes" maxlength="1024" required>
							No additional notes provided
						</TextArea>
					</Label>

					<Label>
						What's 9+10?
						<Input name="math" maxlength="10" required />
					</Label>

					<br />
					<button
						class={tw`rounded-full bg-gray-100 px-4 py-2 w-fit`}
						type="submit"
					>
						Submit
					</button>
				</form>
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
