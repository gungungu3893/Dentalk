// i18n - 다국어 지원 (core)
// ★ window.LANG 전역 선언 — 모든 lang-xx.js 보다 먼저 로드되어야 함
window.LANG = window.LANG || {};

function t(key) { return (LANG[currentLang] && LANG[currentLang][key]) || (LANG.en && LANG.en[key]) || key; }
function tf(key) {
  var s = t(key);
  for (var i = 1; i < arguments.length; i++) s = s.replace('%', String(arguments[i]));
  return s;
}
