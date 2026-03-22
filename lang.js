// i18n - 다국어 지원 (core)
const LANG = {};

function t(key) { return (LANG[currentLang] || LANG.en)[key] || key; }
function tf(key) {
  var s = t(key);
  for (var i = 1; i < arguments.length; i++) s = s.replace('%', String(arguments[i]));
  return s;
}
