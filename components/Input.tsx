/** @jsx h */
import { h, tx } from "../deps.ts";

export function Input({
	name,
	maxlength,
	required = false,
	id,
}: {
	name: string;
	maxlength: string | number;
	required?: boolean;
	id?: string;
}) {
	return (
		<input
			type="text"
			id={id}
			name={name}
			maxlength={maxlength}
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
		/>
	);
}
