/** @jsx h */
import { h, tx } from "../deps.ts";

export function TextArea(
	{ children, name, placeholder, maxlength, required = false, id }: {
		children?: unknown;
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
			class={tx`
				mt-1
				p-2
				w-full
				block
				rounded-md
				bg-gray-100
				dark:bg-gray-700
				border-2
				focus:border-indigo-300 focus:bg-white focus:text-black focus:ring-0
			`}
		>
			{children}
		</textarea>
	);
}
