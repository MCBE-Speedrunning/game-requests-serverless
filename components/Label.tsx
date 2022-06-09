/** @jsx h */
import { h, tw } from "../deps.ts";

export function Label(
	{ children, htmlFor }: { children: any; htmlFor: string },
) {
	return (
		<label class={tw`block text-2xl font-bold`} htmlFor={htmlFor}>
			{children}
		</label>
	);
}
