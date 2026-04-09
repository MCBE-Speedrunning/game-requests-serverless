/**
 * Copyright 2022 Aaron <https://github.com/AaronO>
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference lib="dom" />
export * from "@x/nano_jsx";

import { Helmet, renderSSR as nanoRender } from "@x/nano_jsx";
import { stringify, twind, tx, virtual } from "@npm/@twind/core";
import presetTailwind from "@npm/@twind/preset-tailwind";

const tw = twind({ presets: [presetTailwind()] }, virtual());
const customTx = tx.bind(tw);

export { customTx as tx };

function html({
	body,
	head,
	footer,
	styleTag,
	attributes,
}: {
	body: string;
	head: string[];
	footer: string[];
	styleTag: string;
	attributes: {
		html: {
			toString(): string;
		};
		body: {
			toString(): string;
		};
	};
}) {
	return `
<!DOCTYPE html>
<html ${attributes.html.toString()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head}
    ${styleTag}
  </head>
  <body ${attributes.body.toString()}>
    ${body}
    ${footer.join("\n")}
  </body>
</html>
`;
}

export interface SsrOptions {
	pathname?: string;
	clearState?: boolean;
}

export function ssr(render: CallableFunction, options?: SsrOptions) {
	const app = nanoRender(render(), options);
	const { body, head, footer, attributes } = Helmet.SSR(app);
	const styleTag = `<style>${stringify(tw.target)}</style>`;
	return new Response(html({ body, head, styleTag, footer, attributes }), {
		headers: { "content-type": "text/html" },
	});
}

export function memoizedSSR(render: CallableFunction, options?: SsrOptions) {
	let mresp: Response | undefined;
	return () => {
		const resp = mresp ?? (mresp = ssr(render, options));
		return resp.clone();
	};
}
