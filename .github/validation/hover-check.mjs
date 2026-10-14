import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const [consumerPath, dataPath, expected] = process.argv.slice(2);
const { getCSSLanguageService, newCSSDataProvider } = await import(pathToFileURL(`${consumerPath}/lib/esm/cssLanguageService.js`));
const { TextDocument } = await import(pathToFileURL(`${consumerPath}/node_modules/vscode-languageserver-textdocument/lib/esm/main.js`));
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const ls = getCSSLanguageService({ useDefaultDataProvider: false, customDataProviders: [newCSSDataProvider(data)] });
for (const property of ['text-wrap-mode', 'text-wrap-style']) {
  const text = `.a { ${property}: normal; }`;
  const doc = TextDocument.create('file:///a.css', 'css', 1, text);
  const hover = ls.doHover(doc, doc.positionAt(text.indexOf(property) + 3), ls.parseStylesheet(doc));
  assert.ok(hover);
  const value = hover.contents.value;
  assert.equal(value.includes('CSSXRef'), expected === 'baseline');
  if (expected !== 'baseline') assert.ok(value.includes(String.raw`text\-wrap shorthand`));
  console.log(JSON.stringify({ property, description: value.split('\n\n')[0], rawMacro: value.includes('CSSXRef') }));
}
