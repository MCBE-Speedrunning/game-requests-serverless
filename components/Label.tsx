/** @jsx h */
import { h, tx } from "../deps.ts";

export function Label(
	{ children, htmlFor }: { children: unknown; htmlFor: string },
) {
	return (
		<label class={tx`block text-2xl font-bold`} htmlFor={htmlFor}>
			{children}
		</label>
	);
}
