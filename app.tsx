#!/usr/bin/env -S deno run --allow-net --allow-env=BEDROCK,OTHER,JAVA,CAPTCHA_PREFIX,DENO_DEPLOYMENT_ID --allow-read=.env,.env.defaults --no-check --watch

/** @jsx h */
import { Form } from "./components/Form.tsx";
import { webhookURL } from "./config.ts";
import {
	createCaptcha,
	encodeHex,
	formSelect,
	getCookies,
	h,
	setCookie,
	ssr,
	STATUS_CODE,
	STATUS_TEXT,
} from "./deps.ts";

// Minecraft was released on May 13, 2009
// We are setting the limit to 01/01/2009 to give some leanway
const minimumReleaseDate = new Date(2009, 0, 1).getTime();
const captchaPrefix = Deno.env.get("CAPTCHA_PREFIX") ?? "captcha-prefix";
const textEncoder = new TextEncoder();

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

async function hashCaptcha(captcha: string) {
	const hashBuffer = await crypto.subtle.digest(
		"SHA-256",
		textEncoder.encode(captchaPrefix + captcha.toUpperCase()),
	);
	return encodeHex(hashBuffer);
}

function addSecurityHeaders(headers: Headers) {
	headers.set(
		"Content-Security-Policy",
		"img-src 'self' data:; script-src-elem 'unsafe-inline'",
	);
	headers.set("Cross-Origin-Opener-Policy", "same-origin");
	headers.set("Cross-Origin-Resource-Policy", "same-origin");
	headers.set(
		"Permissions-Policy",
		"accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=()",
	);
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("X-Frame-Options", "SAMEORIGIN");
	headers.set("Content-Language", "en-US");
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
			status: STATUS_CODE.BadRequest,
			statusText: STATUS_TEXT[STATUS_CODE.BadRequest],
		});
	}

	const { captcha } = getCookies(req.headers);
	const captchaHash = await hashCaptcha(body.get("captcha")?.trim() ?? "");

	if (captchaHash !== captcha) {
		return new Response("Captcha failed, please try again.", {
			status: STATUS_CODE.BadRequest,
			statusText: STATUS_TEXT[STATUS_CODE.BadRequest],
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
				status: STATUS_CODE.BadRequest,
				statusText: STATUS_TEXT[STATUS_CODE.BadRequest],
			},
		);
	}

	const edition = body.get("edition")!;

	if (!(edition in webhookURL)) {
		return new Response(`Bad edition: ${edition}`, {
			status: STATUS_CODE.BadRequest,
			statusText: STATUS_TEXT[STATUS_CODE.BadRequest],
		});
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

	if (
		typeof game.releasedate === "number" &&
		game.releasedate < minimumReleaseDate
	) {
		return new Response(`Invalid date: ${new Date(game.releasedate)}`, {
			status: STATUS_CODE.BadRequest,
			statusText: STATUS_TEXT[STATUS_CODE.BadRequest],
		});
	}

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
				thread_name: game.name,
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
		console.debug(`${discordResponse.status}: ${await discordResponse.text()}`);
		return new Response(
			"Something went wrong and your request was not delivered. Please report this incident to an admin.",
			{
				status: STATUS_CODE.InternalServerError,
				statusText: STATUS_TEXT[STATUS_CODE.InternalServerError],
			},
		);
	}

	return ssr(() => <Form message="Form submitted" />, {
		tw: twConfig,
	});
}
let formPageResponse: Response | false = false;

Deno.serve(async (req: Request) => {
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
		case "/captcha.png": {
			const captcha = createCaptcha({
				height: 100,
				width: 300,
				captcha: {
					characters: 6,
					size: 40,
					font: "Sans",
					skew: true,
					colors: [],
					rotate: 5,
					color: "#32cf7e",
					opacity: 0.8,
				},
				decoy: {
					color: "#646566",
					font: "Sans",
					size: 10,
					opacity: 0.5,
					total: 10,
				},
				trace: {
					size: 5,
					color: "#32cf7e",
					opacity: 1,
				},
			});
			const captchaCookie = await hashCaptcha(captcha.text);
			const headers = new Headers();
			setCookie(headers, {
				name: "captcha",
				value: captchaCookie,
				httpOnly: true,
				maxAge: 3600,
				path: "/",
				sameSite: "Strict",
			});
			headers.set("Content-Type", "image/png");

			response = new Response(captcha.image, {
				headers,
			});
			break;
		}
		default: {
			response = new Response("Not found", {
				status: STATUS_CODE.NotFound,
				statusText: STATUS_TEXT[STATUS_CODE.NotFound],
			});
			break;
		}
	}
	addSecurityHeaders(response.headers);

	return response;
});
