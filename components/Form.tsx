/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Helmet, tw } from "../deps.ts";
import { webhookURL } from "../config.ts";
import { Input } from "./Input.tsx";
import { Label } from "./Label.tsx";
import { TextArea } from "./TextArea.tsx";
import { Rules } from "./Rules.tsx";
import { Link } from "./Link.tsx";
import { Header } from "./Header.tsx";
import { BreakLine } from "./BreakLine.tsx";

export function Form({ message }: { message?: string }) {
	return (
		<>
			<Helmet>
				<html lang="en" />
				<body
					class={tw`m-0 bg-white text-black dark:text-white dark:bg-gray-900`}
				/>
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
				class={tw`container mx-auto xl:px-96 px-4 py-8`}
			>
				{message
					? (
						<h1 class={tw`text-green-600 text-4xl font-bold py-4`}>
							{message}
						</h1>
					)
					: ""}

				<Header as="h1">
					Minecraft Leaderboard Request Form
				</Header>

				<BreakLine />

				<Rules />

				<BreakLine />

				<hr />
				<Link
					href="https://github.com/MCBE-Speedrunning/game-requests-serverless"
					target="_blank"
				>
					Git Repository
				</Link>

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
								bg-gray-100
								w-1/2
								dark:bg-gray-700
								focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:w-full
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

					<BreakLine />

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
							class={tw`
								rounded-md
								block
								w-1/2
								text-black
								bg-gray-100
								border-2
								focus:border-black focus:bg-white focus:text-black focus:ring-0 focus:w-full
								dark:bg-gray-700 dark:text-white`}
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

					<Label htmlFor="captcha">
						Please type the characters below
						<img
							src="/captcha.png"
							alt="Captcha image showing various letters and numbers"
						/>
						<Input id="captcha" name="captcha" maxlength="10" required />
					</Label>

					<BreakLine />

					<button
						class={tw`rounded-full bg-gray-100 px-4 py-2 dark:text-black`}
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
