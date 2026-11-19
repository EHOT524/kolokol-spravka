// Общее для игр: Telegram, предмет и режим из адреса (?s=rus&mode=9), рекорды на телефоне, загрузка заданий.
"use strict";
function telegram(event, data = {}) {
  try {
    if (window.TelegramWebviewProxy) window.TelegramWebviewProxy.postEvent(event, JSON.stringify(data));
    else if (window.parent !== window) window.parent.postMessage(JSON.stringify({eventType: event, eventData: data}), "*");
  } catch (e) {}
}
telegram("web_app_ready");
telegram("web_app_expand");
function initTelegram() {  // тема Telegram, если его скрипт успел загрузиться (без него страница работает так же)
  const tg = window.Telegram && Telegram.WebApp;
  if (tg && tg.initData && tg.colorScheme) document.documentElement.dataset.theme = tg.colorScheme;
}
if (window.Telegram) initTelegram();  // скрипт Telegram загрузился раньше этого файла

const $ = id => document.getElementById(id);
const pick = list => list[Math.floor(Math.random() * list.length)];
const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const params = new URLSearchParams(location.search);
const SUBJECTS = ["hist", "soc", "rus", "lit", "bio", "geo"];
const subject = SUBJECTS.includes(params.get("s")) ? params.get("s") : "hist";
const mode = /^(5|6|7|8|9|10|11|oge|ege)$/.test(params.get("mode") || "") ? params.get("mode") : "";
const MODE_TITLE = mode === "oge" ? "ОГЭ" : mode === "ege" ? "ЕГЭ" : mode ? mode + " класс" : "все классы";

// m = [класс, ОГЭ, ЕГЭ]: в N классе — всё до N класса включительно, в экзамене — то, что в экзамене
function fits(m) {
  if (!mode) return true;
  if (mode === "oge") return !!m[1];
  if (mode === "ege") return !!m[2];
  return m[0] <= +mode;
}

function plural(n, one, few, many) {
  const a = n % 10, b = n % 100;
  return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many;
}
const points = n => `${n} ${plural(n, "очко", "очка", "очков")}`;

function records(game) {
  const key = game + ":best";
  const load = () => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } };
  return {
    get: id => load()[subject + ":" + id] || 0,
    save(id, score) {
      const all = load();
      if (score <= (all[subject + ":" + id] || 0)) return false;
      all[subject + ":" + id] = score;
      try { localStorage.setItem(key, JSON.stringify(all)); } catch (e) {}
      return true;
    },
  };
}

function loadData(done, fail) {
  const s = document.createElement("script");
  s.src = `data/games-${subject}.js`;
  s.onload = () => done(window.GAME_DATA);
  s.onerror = fail;
  document.head.append(s);
}

function show(id) {
  for (const x of ["home", "game", "over"]) $(x).hidden = x !== id;
  scrollTo(0, 0);
}

// Опыт за партию: копится в браузере (bot-xp.js), кнопка на экране итогов отправляет его в бота
function claimXP(game, units) {
  BotXP.add(game, subject, units);
  BotXP.button($("claim"), game, subject);
  $("claimnote").hidden = $("claim").hidden;
}

function errorList(map) {
  $("errors").replaceChildren(...[...map.values()].map(t => { const li = document.createElement("li"); li.textContent = t; return li; }));
  $("errbox").hidden = !map.size;
}
