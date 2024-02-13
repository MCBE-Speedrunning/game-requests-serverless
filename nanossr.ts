/**
 * Copyright 2022 Aaron <https://github.com/AaronO>
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference lib="dom" />
export * from "https://deno.land/x/nano_jsx@v0.1.0/mod.ts";
export { tw } from "https://esm.sh/twind@0.16.19?pin=v135&exports=tw,setup";

import {
	Helmet,
	renderSSR as nanoRender,
} from "https://deno.land/x/nano_jsx@v0.0.32/mod.ts";
import { setup } from "https://esm.sh/twind@0.16.19?pin=v135&exports=tw,setup";
import {
	getStyleTag,
	virtualSheet,
} from "https://esm.sh/twind@0.16.19/sheets?pin=v135&exports=getStyleTag,virtualSheet";
import typography from "https://esm.sh/@twind/typography@0.0.2?pin=v86";

let SHEET_SINGLETON: any = null;
function sheet(twOptions = {}) {
	return SHEET_SINGLETON ?? (SHEET_SINGLETON = setupSheet(twOptions));
}

// Setup TW sheet singleton
function setupSheet(twOptions: Record<string, any>) {
	const sheet = virtualSheet();
	setup({
		...twOptions,
		sheet,
		plugins: { ...typography(), ...twOptions?.plugins },
	});
	return sheet;
}

function html({ body, head, footer, styleTag, attributes }: {
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
	return (`
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
`);
}

export function ssr(render: CallableFunction, options?: any) {
	sheet(options?.tw ?? {}).reset();
	const app = nanoRender(render(), options);
	const { body, head, footer, attributes } = Helmet.SSR(app);
	const styleTag = getStyleTag(sheet());
	return new Response(
		html({ body, head, footer, styleTag, attributes }),
		{ headers: { "content-type": "text/html" } },
	);
}

export function memoizedSSR(render: CallableFunction, options?: any) {
	let mresp: Response | undefined;
	return () => {
		const resp = mresp ?? (mresp = ssr(render, options));
		return resp.clone();
	};
}
