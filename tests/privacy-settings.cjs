const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../assets/privacy-settings.js'),'utf8');
for (const lang of ['fi','ja','en','unsupported']) {
  const link = {href:'/privacy/',textContent:'Privacy'};
  const english = {href:'/privacy/',textContent:'English'};
  let click, revoked = 0;
  const button = {addEventListener(type,fn){if(type==='click')click=fn;}};
  const window = {googlefc:{callbackQueue:[],showRevocationMessage(){revoked++;}}};
  const document = {documentElement:{lang},querySelectorAll(selector){
    if(selector==='a[data-privacy-link],footer a[href="/privacy/"]')return [link];
    if(selector==='[data-privacy-settings]')return [button];
    // A broad selector would accidentally rewrite the explicit language switch.
    if(selector.includes('a[href="/privacy/"]'))return [link,english];
    return [];
  }};
  vm.runInNewContext(source,{window,document});
  const supported = ['fi','ja'].includes(lang) ? lang : 'en';
  assert.equal(link.href,supported==='en'?'/privacy/':`/privacy/${supported}/`);
  assert.equal(english.href,'/privacy/');
  assert.equal(english.textContent,'English');
  assert.equal(revoked,0);
  click();
  assert.equal(window.googlefc.callbackQueue.length,1);
  window.googlefc.callbackQueue.shift()();
  assert.equal(revoked,1);
}
console.log('PASS: localized links, explicit English switch, consent-revocation callback and fallback locale');
