/** @jsx h */
import { h, tw } from "../deps.ts";
import { Link } from "./Link.tsx";
import { BreakLine } from "./BreakLine.tsx";
import { Header } from "./Header.tsx";

export function Rules() {
	return (
		<div>
			<Header as="h2">
				Rules
			</Header>

			The game request form is used only for requests for new games, maps,
			minigames, servers, and more that do not exist on the site. By requesting
			a game, you will be added as a moderator for the game if it is accepted.
			Moderators for each game are expected to verify runs submitted by users
			following the{" "}
			<Link href="https://www.speedrun.com/moderationrules">
				Moderation Rules
			</Link>. In addition, they are required to set up rules and categories; if
			a game is not set up within two weeks, it is automatically flagged for
			deletion. Leaderboards should be viewed as owned by the community and
			curated by the moderators. A user who requests a leaderboard does not own
			the leaderboard.

			<BreakLine />

			For your request, we require a video of a full-game run played by you. We
			strongly prefer such a run is not a segmented run, and may reject requests
			if they are segmented runs. If a game is heavily based on Individual
			Levels and does not really feature a full-game run, a playlist of an
			overwhelming majority of the IL's for the game is acceptable. Submissions
			which do not meet this criteria will be rejected without being considered.

			<BreakLine />

			We require your SR.C account to be at least 7 days old before you are able
			to submit a game request. We require moderators to have at least 2 social
			media accounts attached to their account such as Discord, Twitter, Twitch,
			etc. If you have one or no contact methods at all attached to your
			profile, your request will be automatically rejected. Please provide the
			correct spelling and capitalization of the game name as it is officially
			known. If the game name is identical to one already existing on the site,
			please include an identifier to differentiate it - as game names and game
			URL's must be unique - and explain the difference in the "Additional
			Notes" field. The "Additional Notes" field is incredibly useful for
			explaining the game and the speedrun to us. Including information about
			the game and the speedrun will help us understand it further. In addition
			to information about the game and the run, examples of other categories
			(and additional videos) can be useful to us. This field is also useful to
			explain difference between the game you are submitting and games that
			already exist on the site, in the case that your game is similar to others
			existing or shares a name with others existing. Please review the{" "}
			<Link href="https://www.speedrun.com/gamerequestrules">
				Detailed Game Request Rules
			</Link>{" "}
			and{" "}
			<Link href="https://www.speedrun.com/moderationrules">
				Moderation Rules
			</Link>{" "}
			for additional information. Note that you cannot change your game request
			after submission, so if you need to make changes submit a new request.

			<BreakLine />

			<Header as="h3">
				What We Do Not Accept
			</Header>

			At this time, we are not adding the following:

			<BreakLine />

			<ul class={tw`list-disc list-inside`}>
				<li>
					<Link href="https://scratch.mit.edu/">
						Scratch Games
					</Link>
				</li>
				<li>
					Unofficial/Extra Category Extensions
				</li>
				<li>
					Short/Trivial Games
				</li>
				<li>
					Generic Puzzle Games
				</li>
				<li>
					Generic Typing Games
				</li>
				<li>
					Geography Games
				</li>
				<li>
					Vocabulary/Math and other Educational Games Quiz Games
				</li>
				<li>
					Generic Sudoku Solvers/Minesweeper Remakes/Rubik's Cube Solvers/etc.
				</li>
				<li>
					Visual Novels/Interactive Movies
				</li>
				<li>
					PvP-Related Activities
				</li>
				<li>
					High-Score Based Submissions
				</li>
				<li>
					Non-Video-Game Activities
				</li>
			</ul>

			<BreakLine />

			We may make an exception for notable commercial releases of otherwise
			generic concepts.

			<BreakLine />

			<Header as="h3">
				Additional Information
			</Header>

			Requests are checked manually by site staff. It may take a couple weeks
			for us to process your request - how long it takes depends on how many
			requests are in the queue and staff availability. Note that it may take
			longer for us to handle requests if there are real-life events occurring,
			such as major marathons or other factors.

			<BreakLine />

			You will get a site notification once your request has been processed if
			your game was accepted telling you that you were added as a moderator.
			Congratulations! If it was rejected, a moderator will reach to you on
			speedrun.com or discord with the reason. If your request was rejected for
			a specific reason that can be fixed, feel free to resubmit once you have
			fixed the issues we raised or tell the moderator who got in touch about
			the changes and they will help sort it out.

			<BreakLine />

			If you have questions, please refer to the{" "}
			<Link href="https://www.speedrun.com/gamerequestrules">
				Game Request Rules
			</Link>{" "}
			as most things are fully described there
		</div>
	);
}
