// Опыт за игры и тренажёр уходит в бота ссылкой t.me/…?start=g_…: сайт статичный, а игры открываются кнопкой под
// сообщением, откуда Telegram не даёт отправить данные боту иначе. Заработанное копится в браузере, пока ученик не нажмёт
// «Забрать опыт»; после нажатия кнопка пишет «Передано в бота», игра остаётся открытой.
// Сколько XP дать и дневной предел решает бот (app/games.py, GAME_RATES; app/handlers/user.py).
// Подпись защищает только от ссылки, набранной руками: страница открытая. Настоящая защита — дневной предел в боте.
const BotXP = (() => {
  const BOT = "Kolokolgame", KEY = "botxp:pending", SALT = "kolokol-rings-1147";
  const LETTER = { hist: "h", soc: "s", rus: "r", lit: "l", bio: "b", geo: "g" };

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(all) { try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {} }
  function hash(text) {  // FNV-1a, тот же расчёт в боте (game_sign)
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36);
  }
  function newId() { return Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36).padStart(2, "0"); }

  /** Запомнить n верных ответов игры game ("b", "j", "k", "t") по предмету. */
  function add(game, subject, n) {
    if (!(n > 0) || !LETTER[subject]) return;
    const all = load(), slot = game + LETTER[subject], old = all[slot] || { n: 0, id: newId() };
    all[slot] = { n: Math.min(999, old.n + n), id: old.id };
    save(all);
  }
  function pending(game, subject) { return (load()[game + LETTER[subject]] || {}).n || 0; }

  function link(game, subject) {
    const slot = game + LETTER[subject], p = load()[slot];
    if (!p) return "";
    const body = `g_${slot}_${p.n}_${p.id}`;
    return `/${BOT}?start=${body}_${hash(body + SALT)}`;
  }

  function claim(game, subject) {
    const path = link(game, subject), all = load();
    if (!path) return;
    delete all[game + LETTER[subject]];
    save(all);
    try {
      if (window.TelegramWebviewProxy) return window.TelegramWebviewProxy.postEvent("web_app_open_tg_link", JSON.stringify({ path_full: path }));
      if (window.parent !== window) return window.parent.postMessage(JSON.stringify({ eventType: "web_app_open_tg_link", eventData: { path_full: path } }), "*");
    } catch (e) {}
    location.href = "https://t.me" + path;
  }

  /** Кнопка «Забрать опыт»: видна, только когда есть что забирать. */
  function button(el, game, subject) {
    const n = pending(game, subject);
    el.hidden = !n;
    el.disabled = false;
    el.textContent = "🔔 Забрать опыт в боте";
    el.onclick = () => { el.disabled = true; el.textContent = "✅ Передано в бота"; claim(game, subject); };
  }

  /** Один раз в день за каждое задание (тренажёр): true, если сегодня его ещё не засчитывали. */
  function firstToday(id) {
    const key = "botxp:done", day = new Date().toISOString().slice(0, 10);
    let done;
    try { done = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { done = {}; }
    if (done.day !== day) done = { day, ids: [] };
    if (done.ids.includes(id)) return false;
    done.ids.push(id);
    try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {}
    return true;
  }

  return { add, pending, link, claim, button, hash, firstToday };
})();
