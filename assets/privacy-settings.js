/* Google Privacy & messaging API. This never grants consent. */
(() => {
'use strict';
const labels={"en": ["Privacy", "Privacy settings"], "fi": ["Tietosuoja", "Tietosuoja-asetukset"], "de": ["Datenschutz", "Datenschutzeinstellungen"], "fr": ["Confidentialité", "Paramètres de confidentialité"], "nl": ["Privacy", "Privacy-instellingen"], "it": ["Privacy", "Impostazioni privacy"], "es": ["Privacidad", "Configuración de privacidad"], "pl": ["Prywatność", "Ustawienia prywatności"], "el": ["Απόρρητο", "Ρυθμίσεις απορρήτου"], "ja": ["プライバシー", "プライバシー設定"]};
const locale=(document.documentElement.lang||'en').split('-')[0];
const lang=Object.hasOwn(labels,locale)?locale:'en';
document.querySelectorAll('a[data-privacy-link],footer a[href="/privacy/"]').forEach(a=>{a.href=lang==='en'?'/privacy/':`/privacy/${lang}/`;a.textContent=labels[lang][0];});
document.querySelectorAll('[data-privacy-settings]').forEach(button=>{
 button.textContent=labels[lang][1];
 button.addEventListener('click',()=>{
  window.googlefc=window.googlefc||{};
  window.googlefc.callbackQueue=window.googlefc.callbackQueue||[];
  window.googlefc.callbackQueue.push(()=>{if(typeof window.googlefc.showRevocationMessage==='function')window.googlefc.showRevocationMessage();});
 });
});
})();
