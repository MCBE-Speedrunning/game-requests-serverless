/** @jsx h */
import { h, tw } from "../deps.ts";

export function Input(
	{ name, maxlength, required = false, id }: {
		name: string;
		maxlength: string | number;
		required?: boolean;
		id?: string;
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
				w-1/2
				block
				rounded-md
				bg-gray-100
				border-2
				dark:bg-gray-700
				focus:border-black focus:bg-white focus:text-black focus:ring-0 focus:w-full
			`}
		/>
	);
}
