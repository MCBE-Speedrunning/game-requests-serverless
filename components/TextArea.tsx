/** @jsx h */
import { h, tw } from "../deps.ts";

export function TextArea(
	{ children, name, placeholder, maxlength, required = false, id }: {
		children?: any;
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
			class={tw`
				mt-1
				w-1/2
				block
				rounded-md
				bg-gray-100
				dark:bg-gray-700
				border-2
				focus:border-black focus:bg-white focus:text-black focus:ring-0 focus:w-full
			`}
		>
			{children}
		</textarea>
	);
}
