import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const names = ['text-wrap-mode', 'text-wrap-style'];
const baseline = read('baseline/web-data/data/browsers.css-data.json');
const candidate = read('candidate/web-data/data/browsers.css-data.json');
for (const name of names) {
  const before = baseline.properties.find(p => p.name === name);
  const after = candidate.properties.find(p => p.name === name);
  assert.equal(after.description, before.description.replace('{{CSSXRef("text-wrap")}}', 'text-wrap'));
  after.description = before.description;
}
assert.deepEqual(candidate, baseline);
assert.deepEqual(read('candidate/web-data/data/browsers.html-data.json'), read('baseline/web-data/data/browsers.html-data.json'));
console.log('Generated baseline/candidate data differ only in the two intended descriptions; HTML unchanged.');
