/** @jsx h */
import { h, tw } from "../deps.ts";

export function Link({
	href,
	target = "_blank",
	children,
}: {
	href: string;
	target?: string;
	children: any;
}) {
	return (
		<a
			href={href}
			target={target}
			class={tw`
				text-blue-500
				no-underline
				transition-all
				ease-in-out
				duration-300
				inline-block
				hover:underline`}
		>
			{children}
		</a>
	);
}
