/** @jsx h */
import { h, tw } from "../deps.ts";

export function Header({ as, children }: {
	as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: any;
}) {
	const className = "font-bold";
	let fontSize;
	switch (as) {
		case "h1":
			return (
				<h1 class={tw`text-5xl ${className}`}>
					{children}
				</h1>
			);
		case "h2":
			return (
				<h2 class={tw`text-4xl ${className}`}>
					{children}
				</h2>
			);
		case "h3":
			return (
				<h3 class={tw`text-3xl ${className}`}>
					{children}
				</h3>
			);
		case "h4":
			return (
				<h4 class={tw`text-2xl ${className}`}>
					{children}
				</h4>
			);
		case "h5":
			return (
				<h5 class={tw`text-xl ${className}`}>
					{children}
				</h5>
			);
		case "h6":
			return (
				<h6 class={tw`text-lg ${className}`}>
					{children}
				</h6>
			);
	}
}
