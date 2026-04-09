/** @jsx h */
import { h, tx } from "../deps.ts";

export function Link({
	href,
	target = "_blank",
	children,
}: {
	href: string;
	target?: string;
	children: unknown;
}) {
	return (
		<a
			href={href}
			target={target}
			class={tx`
				text-blue-500
				underline
				rounded-md
				focus:border-indigo-300 focus:outline-offset-4 focus:outline-solid`}
		>
			{children}
		</a>
	);
}
