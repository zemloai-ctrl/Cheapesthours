// Run: node tests/minor-unit-calculator.test.cjs
// Extract the production functions so tests exercise the exact inline JS.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../result/index.html'), 'utf8');
const start = html.indexOf('function minorUnit(');
const end = html.indexOf('function fmtUnitPrice(', start);
assert.ok(start > 0 && end > start, 'price helpers exist');
const ctx = vm.createContext({});
vm.runInContext(html.slice(start, end), ctx);
const { minorUnit, majorPrice, symbol } = ctx;

for (const unit of ['c/kWh','p/kWh','ore/kWh','öre/kWh','gr/kWh','C/KWH']) {
  assert.equal(minorUnit(unit), true, unit);
}
for (const unit of ['KRW/kWh','JPY/kWh','MXN/kWh','EUR/MWh','',null]) {
  assert.equal(minorUnit(unit), false, String(unit));
}
assert.equal(majorPrice(65.47, 'ore/kWh'), 0.6547);
assert.equal(majorPrice(65.47, 'öre/kWh'), 0.6547);
assert.equal(majorPrice(65.47, 'gr/kWh'), 0.6547);
assert.equal(majorPrice(65.47, 'c/kWh'), 0.6547);
assert.equal(majorPrice(65.47, 'p/kWh'), 0.6547);
assert.equal(majorPrice(65.47, 'JPY/kWh'), 65.47);
assert.equal(majorPrice(65.47, 'KRW/kWh'), 65.47);
assert.equal(majorPrice(65.47, 'MXN/kWh'), 65.47);
assert.equal(majorPrice(1000, 'EUR/MWh'), 1);
for (const currency of ['SEK','NOK','DKK','PLN']) {
  assert.ok(symbol(currency) && !symbol(currency).includes(currency), currency);
}
// Core returns avg_price on windows and unit/currency on the parent object.
assert.match(html, /candidate\.avg_price/);
assert.match(html, /unit:cheap\.unit, currency:cheap\.currency/);
assert.match(html, /majorPrice\(window\.avg,window\.unit \|\| spot\.unit\)/);
assert.match(html, /majorPrice\(spot\.price,spot\.unit\)/);
assert.match(html, /majorPrice\(spot\.price,spot\.unit\)/);
console.log('Minor-unit calculator regression tests passed');
