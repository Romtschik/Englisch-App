import { words, documents, topics } from "./content.js";
import { checkAnswer, uniqueAttempts, reviewStates, queueFor, completedDocuments, validAttempt } from "./learning.js";

const $ = selector => document.querySelector(selector);
const main = $("#main");
const icons = {
  menu: '<path d="M5 7h14M5 12h14M5 17h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20 15A8.5 8.5 0 0 1 9 4a8.5 8.5 0 1 0 11 11Z"/>',
  cards: '<rect x="4" y="6" width="14" height="14" rx="3"/><path d="M8 3h10a4 4 0 0 1 4 4v8M8 11h6m-6 4h4"/>',
  doc: '<path d="M6 3h8l4 4v14H6zm8 0v5h4M9 12h6m-6 4h6"/>',
  chart: '<path d="M4 19h16M7 16v-4m5 4V8m5 8V4"/>',
  arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>'
};
const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + "</svg>";
const escape = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const key = "rail-english-v1";
function read(name, fallback) {
  try { return JSON.parse(localStorage.getItem(name)) ?? fallback; }
  catch { return fallback; }
}
function write(name, value) {
  try { localStorage.setItem(name, JSON.stringify(value)); return true; }
  catch { return false; }
}
function storedAttempts(value) {
  return Array.isArray(value) ? value.filter(event => validAttempt(event, words, documents)) : [];
}
let account = null;
let attempts = storedAttempts(read(key, []));
let syncStatus = "";
let syncing;
let syncAgain = false;
let noticeTimer;
let theme = read(key + "-theme", "auto");
let motion = read(key + "-motion", false);
let mode = "de-en";
let topic = "";
let session;
let route;
const documentDrafts = new Map();
const wordById = new Map(words.map(word => [word.id, word]));
const signIn = "/signin-with-chatgpt?return_to=" + encodeURIComponent("/#fortschritt");
const signOut = "/signout-with-chatgpt?return_to=" + encodeURIComponent("/#fortschritt");

function updateTheme() {
  const dark = theme === "dark" || (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("meta[name=theme-color]").content = dark ? "#141413" : "#faf9f5";
  $("#theme").innerHTML = icon(dark ? "sun" : "moon");
  $("#theme").setAttribute("aria-label", dark ? "Hellen Modus wählen" : "Dunklen Modus wählen");
}
$("#theme").addEventListener("click", () => {
  theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  write(key + "-theme", theme);
  updateTheme();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
updateTheme();

function updateMotion() {
  document.documentElement.dataset.motion = motion ? "reduce" : "full";
  $("#motion").textContent = motion ? "Bewegung einschalten" : "Bewegung reduzieren";
}
function animateOpen(element, origin) {
  if (motion || matchMedia("(prefers-reduced-motion: reduce)").matches || !element.animate) return;
  const from = origin.getBoundingClientRect();
  const to = element.getBoundingClientRect();
  const x = from.x + from.width / 2 - to.x;
  const y = from.y + from.height / 2 - to.y;
  const radius = Math.hypot(Math.max(x, to.width - x), Math.max(y, to.height - y));
  element.animate(
    [{ clipPath: "circle(22px at " + x + "px " + y + "px)" },
     { clipPath: "circle(" + radius + "px at " + x + "px " + y + "px)" }],
    { duration: 320, easing: "cubic-bezier(.22,.82,.23,1)" }
  );
}
$("#motion").addEventListener("click", () => {
  motion = !motion;
  write(key + "-motion", motion);
  updateMotion();
});
updateMotion();
const menuButton = $("#menu-button");
const menu = $("#menu");
menuButton.innerHTML = icon("menu");
function setMenu(open, returnFocus = false) {
  menu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  if (open) animateOpen(menu, menuButton);
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener("click", () => setMenu(menu.hidden));
document.addEventListener("click", event => {
  if (!menu.hidden && !event.target.closest(".controls")) setMenu(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !menu.hidden) setMenu(false, true);
});
function notify(message, origin) {
  const notice = $("#notice");
  clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.hidden = false;
  if (origin) animateOpen(notice, origin);
  noticeTimer = setTimeout(() => { notice.hidden = true; }, 3500);
}

const currentKey = () => account ? key + ":" + account.id : key;
function record(kind, item, rating, answerMode) {
  const id = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(18)), byte => byte.toString(16).padStart(2, "0")).join("");
  attempts.push({ id, at: Date.now(), kind, item, rating, mode: answerMode });
  const saved = write(currentKey(), attempts);
  if (!saved && !account) notify("Der Browser konnte deinen Lernstand nicht speichern.");
  if (account) synchronize();
}
function renderSync() {
  const box = $("#sync");
  if (!box) return;
  box.innerHTML = account
    ? '<p class="caption" role="status">' + escape(syncStatus) + '</p><div class="actions"><button class="button secondary" id="sync-now">Jetzt synchronisieren</button><a class="button link-button" target="_top" href="' + signOut + '">Abmelden</a></div>'
    : '<p class="caption">Als Gast bleibt dein Lernstand in diesem Browser. Melde dich auf beiden Geräten mit demselben ChatGPT-Konto an, um ihn zu synchronisieren.</p><div class="actions"><a class="button secondary" target="_top" href="' + signIn + '">Mit ChatGPT anmelden</a></div>';
  $("#sync-now")?.addEventListener("click", () => synchronize());
}
function synchronize() {
  if (!account) return Promise.resolve();
  if (syncing) {
    syncAgain = true;
    return syncing;
  }
  syncing = (async () => {
    syncStatus = "Synchronisiere …";
    renderSync();
    try {
      const response = await fetch("/api/progress", { cache: "no-store" });
      if (!response.ok) throw Error("Download failed");
      const remote = storedAttempts((await response.json()).events);
      const remoteIds = new Set(remote.map(event => event.id));
      const guest = storedAttempts(read(key, []));
      const merged = uniqueAttempts([...remote, ...attempts, ...guest]);
      const pending = merged.filter(event => !remoteIds.has(event.id));
      for (let index = 0; index < pending.length; index += 40) {
        const upload = await fetch("/api/progress", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: pending.slice(index, index + 40) })
        });
        if (!upload.ok) throw Error("Upload failed");
      }
      const count = attempts.length;
      attempts = uniqueAttempts([...merged, ...attempts]);
      if (write(currentKey(), attempts)) {
        const migrated = new Set(guest.map(event => event.id));
        write(key, storedAttempts(read(key, [])).filter(event => !migrated.has(event.id)));
      }
      syncStatus = "Lernstand synchronisiert.";
      if (route === "fortschritt" || (route === "heute" && count !== attempts.length)) render();
    } catch {
      syncStatus = "Synchronisierung fehlgeschlagen. Versuche es erneut.";
    }
    renderSync();
  })().finally(() => {
    syncing = null;
    if (syncAgain) { syncAgain = false; synchronize(); }
  });
  return syncing;
}

async function connect() {
  try {
    const response = await fetch("/api/session", { cache: "no-store" });
    if (!response.ok) return;
    account = (await response.json()).user;
    if (!account) return;
    attempts = uniqueAttempts([...storedAttempts(read(currentKey(), [])), ...attempts]);
    renderSync();
    await synchronize();
  } catch { /* Guest mode works without a session endpoint. */ }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && account) synchronize();
});
window.addEventListener("online", () => { if (account) synchronize(); });
window.addEventListener("storage", event => {
  if (event.key !== currentKey()) return;
  attempts = uniqueAttempts([...attempts, ...storedAttempts(read(currentKey(), []))]);
  if (route === "heute" || route === "fortschritt") render();
});

const page = (title, intro) => '<div class="page-head"><h1>' + title + '</h1><p class="lede">' + intro + '</p></div>';
const badge = (name, color = "") => '<span class="icon ' + color + '">' + icon(name) + '</span>';
function counts() {
  const states = reviewStates(attempts);
  const learned = new Set(attempts.filter(event => event.kind === "word" && event.rating >= 2).map(event => event.item));
  const due = [...states.values()].filter(state => state.due <= Date.now()).length;
  return { states, learned, due, done: completedDocuments(documents, attempts) };
}
function today() {
  const { due, learned, done } = counts();
  const nextDocument = documents.find(doc => !done.includes(doc)) ?? documents[0];
  return '<section class="hero"><div class="hero-copy"><p class="eyebrow">Technisches Berufsenglisch</p><h1>Englisch für die Betriebseinführung.</h1>' +
    '<p class="lede">Fachbegriffe, technische Dokumente und Formulierungen für deine Projektarbeit.</p><div class="actions"><a class="button primary" href="#vokabeln/trainieren">Vokabeln trainieren ' + icon("arrow") + '</a><a class="button link-button" href="#dokumente/' + nextDocument.id + '">Zum nächsten Fall</a></div></div>' +
    '<div class="hero-art"><div class="hero-note"><span class="note-label">Aus dem Wortschatz</span><strong lang="en">entry into<br>service</strong><span>Aufnahme des Betriebs</span><a href="#vokabeln/betrieb" class="note-link">Betriebseinführung ' + icon("arrow") + '</a></div></div></section>' +
    '<div class="overview"><section class="panel"><div class="panel-heading"><h2>Dein Lernstand</h2>' + badge("chart","green") + '</div><div class="metrics">' +
    [[due,"Fällige Karten"],[learned.size,"Begriffe geübt"],[done.length,"Fälle bearbeitet"]].map(([value,label]) => '<div class="metric"><strong>' + value + '</strong><span>' + label + '</span></div>').join("") +
    '</div></section><section class="panel"><div class="panel-heading"><h2>Deine nächste Einheit</h2></div><ul class="plan"><li><a href="#vokabeln/trainieren">Fachbegriffe wiederholen <small>5 Min.</small></a></li><li><a href="#dokumente/' + nextDocument.id + '">Dokument lesen &amp; anwenden <small>10 Min.</small></a></li></ul></section></div>' +
    '<h2 class="section-title">Lernbereiche</h2><div class="tiles">' +
    [["vokabeln","cards","Vokabeln",words.length + " Begriffe und Wendungen aus sechs Themenfeldern.",""],
     ["dokumente","doc","Dokumente","Prüfbericht, RAM-Klausel und Ersatzteil-Spezifikation.","blue"],
     ["fortschritt","chart","Fortschritt","Fälligkeiten, Fehlerliste und Lernstand auf beiden Geräten.","green"]]
      .map(([link, symbol, title, text, color]) => '<a class="tile" href="#' + link + '"><div class="tile-heading">' + badge(symbol,color) + '<span class="arrow" aria-hidden="true">↗</span></div><h3>' + title + '</h3><p>' + text + '</p></a>').join("") + '</div>';
}

function begin(force = false) {
  const pool = topic ? words.filter(word => word.topic === topic) : words;
  const states = reviewStates(attempts);
  const due = queueFor(pool, states, mode);
  const chosen = force ? pool : due;
  session = { cards: chosen.slice(0, 8), index: 0, answer: null, correct: null, rated: 0, force };
  if (location.hash !== "#vokabeln/trainieren") location.hash = "vokabeln/trainieren";
  else render();
}
function vocabulary(part) {
  if (part === "trainieren" && !session) {
    const pool = topic ? words.filter(word => word.topic === topic) : words;
    session = { cards: queueFor(pool, reviewStates(attempts), mode).slice(0, 8), index: 0, answer: null, correct: null, rated: 0 };
  }
  if (part === "trainieren") return training();
  if (part === "betrieb") topic = "Betriebseinführung";
  const filtered = topic ? words.filter(word => word.topic === topic) : words;
  return page("Fachwortschatz", "Übe Begriffe in beide Richtungen und wiederhole schwierige Karten gezielt.") +
    '<div class="toolbar"><label>Thema<select class="field" id="topic"><option value="">Alle Themen</option>' +
    topics.map(name => '<option ' + (name === topic ? "selected" : "") + '>' + name + '</option>').join("") +
    '</select></label><label>Richtung<select class="field" id="direction"><option value="de-en"' + (mode === "de-en" ? " selected" : "") + '>Deutsch → Englisch</option><option value="en-de"' + (mode === "en-de" ? " selected" : "") + '>Englisch → Deutsch</option></select></label>' +
    '<button class="button primary" id="start">Training starten ' + icon("arrow") + '</button><button class="button secondary" id="practice">Frei üben</button></div>' +
    '<div class="tiles">' + filtered.map(word => '<article class="tile"><span class="tag">' + word.topic + '</span><h3 lang="en">' + escape(word.en) + '</h3><p>' + escape(word.de) + '</p><p lang="en">' + escape(word.example) + '</p></article>').join("") + '</div>';
}
function training() {
  const word = session.cards[session.index];
  if (!word) return '<div class="study"><a class="back" href="#vokabeln">← Fachwortschatz</a><section class="panel"><h1>' +
    (session.rated ? "Einheit abgeschlossen" : "Alles wiederholt") + '</h1><p class="lede">' +
    (session.rated ? session.rated + " Karten bewertet." : "In dieser Auswahl sind gerade keine Karten fällig.") +
    '</p><div class="actions"><button id="start" class="button primary">Nächste fällige Karten</button><button id="practice" class="button secondary">Frei üben</button><a href="#dokumente" class="button link-button">Zum Dokumententraining</a></div></section></div>';
  const hasAnswer = session.answer !== null;
  const result = !hasAnswer ? "" : '<div class="answer" id="word-feedback" tabindex="-1"><p class="feedback ' +
    (session.correct ? "" : "try") + '">' + (session.correct ? "Richtig" : session.answer ? "Musterlösung vergleichen" : "Lösung") + '</p><p><strong lang="en">' + escape(word.en) +
    '</strong> · ' + escape(word.de) + '</p><p>' + escape(word.explanation) + '</p><p lang="en">' + escape(word.example) + '</p><p class="caption">' + escape(word.translation) +
    '</p></div><div class="ratings" aria-label="Wie sicher warst du?">' +
    ["Nicht gewusst","Unsicher","Gut","Sicher"].map((label, index) => '<button class="button ' + ((session.correct ? 2 : 0) === index ? "primary" : "secondary") + '" data-rating="' + index + '">' + label + '</button>').join("") + '</div>';
  return '<div class="study"><a class="back" href="#vokabeln">← Fachwortschatz</a><section class="panel"><div class="progress-head"><span class="tag">' + word.topic + '</span><span class="caption">' +
    (session.index + 1) + ' / ' + session.cards.length + '</span></div><h2 lang="' + (mode === "en-de" ? "en" : "de") + '">' + escape(mode === "en-de" ? word.en : word.de) +
    '</h2><p class="caption">' + (mode === "en-de" ? "Englisch → Deutsch" : "Deutsch → Englisch") + '</p>' +
    '<form id="word-form"><label for="answer">Deine Übersetzung</label><input class="field" id="answer" name="answer" spellcheck="false" autocomplete="off" value="' +
    escape(session.answer ?? "") + '"' + (hasAnswer ? " readonly" : " required") + '>' +
    (hasAnswer ? "" : '<div class="actions"><button class="button primary">Antwort prüfen</button><button type="button" id="reveal" class="button secondary">Lösung anzeigen</button></div>') + '</form>' +
    result + '</section></div>';
}

function documentPage(part) {
  const doc = documents.find(item => item.id === part);
  if (!doc) return page("Dokumententraining", "Lies einen technischen Text und finde Fristen, Zuständigkeiten und Anforderungen.") +
    '<div class="tiles">' + documents.map(item => '<a class="tile" href="#dokumente/' + item.id + '"><div class="tile-heading">' + badge("doc","blue") +
    '<span class="tag">' + item.level + '</span></div><h3>' + item.title + '</h3><p>' + item.summary + '</p><span class="caption">' + item.type + '</span></a>').join("") + '</div>';
  const questions = doc.questions.map((question,index) => '<fieldset class="question" lang="en"><legend>' + (index + 1) + '. ' + question.text +
    '</legend>' + question.options.map((option, value) => '<label class="choice"><input type="radio" name="' + question.id + '" value="' + value +
    '" required><span>' + option + '</span></label>').join("") + '<div class="response" id="feedback-' + question.id + '" aria-live="polite"></div></fieldset>').join("");
  return '<a class="back" href="#dokumente">← Alle Dokumente</a>' + page(doc.title, doc.summary) +
    '<div class="document-grid"><section class="panel"><div class="panel-heading"><h2>' + doc.type + '</h2><span class="tag">Fiktiv</span></div><div class="document-text" lang="en">' +
    doc.paragraphs.map((text,index) => '<p class="paragraph" id="absatz-' + index + '" tabindex="-1"><b>' + (index + 1) + '</b><span>' + text + '</span></p>').join("") +
    '</div><div class="terms" aria-label="Fachbegriffe">' + doc.terms.map(id => '<button type="button" data-term="' + id + '" lang="en">' + escape(wordById.get(id).en) + '</button>').join("") +
    '</div><div class="answer" id="term-detail" aria-live="polite" hidden></div></section><section class="panel"><h2>Verständnis prüfen</h2><form id="doc-form">' + questions +
    '<button class="button primary">Antworten prüfen</button><p class="response" role="status" id="doc-result"></p></form></section></div>' +
    '<section class="panel transfer"><h2>Im Projekt anwenden</h2><p class="lede" id="transfer-task">' + doc.transfer.task +
    '</p><textarea class="field" id="transfer" aria-labelledby="transfer-task" lang="en" placeholder="Deine Formulierung auf Englisch">' + escape(documentDrafts.get(doc.id) ?? "") +
    '</textarea><details><summary>Musterantwort ansehen</summary><blockquote lang="en">' + doc.transfer.model + '</blockquote></details></section>';
}

function progress() {
  const { states, due, learned, done } = counts();
  const mistakes = words.map(word => {
    const cards = ["en-de","de-en"].map(direction => states.get(word.id + ":" + direction));
    return { word, errors: cards.reduce((sum, card) => sum + (card?.errors ?? 0), 0) };
  }).filter(entry => entry.errors).sort((a,b) => b.errors - a.errors);
  return page("Dein Fortschritt","Sieh nach, was du schon geübt hast und welche Begriffe mehr Wiederholung brauchen.") +
    '<section class="panel"><div class="metrics">' + [[learned.size,"Begriffe geübt"],[due,"Fällige Karten"],[done.length,"Fälle bearbeitet"]].map(([value,label]) => '<div class="metric"><strong>' + value + '</strong><span>' + label + '</span></div>').join("") +
    '</div><div class="actions"><a class="button primary" href="#vokabeln/trainieren">Jetzt wiederholen</a><button class="button secondary" id="export">Lernstand exportieren</button></div></section>' +
    '<div class="overview"><section class="panel"><h2>Nach Themen</h2>' + topics.map(name => {
      const pool = words.filter(word => word.topic === name);
      const count = pool.filter(word => learned.has(word.id)).length;
      return '<div class="progress-row"><div class="progress-head"><span>' + name + '</span><span class="caption">' + count + ' / ' + pool.length + '</span></div><progress aria-label="' + name + '" value="' + count + '" max="' + pool.length + '"></progress></div>';
    }).join("") + '</section><section class="panel"><h2>Fehlerliste</h2>' + (mistakes.length ? '<ul class="error-list">' +
    mistakes.map(({word,errors}) => '<li><strong lang="en">' + escape(word.en) + '</strong> · ' + escape(word.de) + ' <span class="caption">(' + errors + ')</span></li>').join("") + '</ul>' :
    '<p class="lede">Hier erscheinen Begriffe, die du als „Nicht gewusst“ bewertest.</p>') + '</section></div>' +
    '<section class="panel sync"><h2>Auf iPhone und PC lernen</h2><div id="sync" class="actions"></div></section>';
}

function bind(part) {
  $("#topic")?.addEventListener("change", event => {
    topic = event.target.value;
    if (part === "betrieb") location.hash = "vokabeln"; else render();
    $("#topic")?.focus();
  });
  $("#direction")?.addEventListener("change", event => { mode = event.target.value; });
  $("#start")?.addEventListener("click", () => begin());
  $("#practice")?.addEventListener("click", () => begin(true));
  function reveal(value) {
    const word = session.cards[session.index];
    session.answer = value;
    session.correct = checkAnswer(value, mode === "en-de" ? word.answers : [word.en]);
    render();
    $("#word-feedback")?.focus();
  }
  $("#word-form")?.addEventListener("submit", event => {
    event.preventDefault();
    if (session.answer === null) reveal($("#answer").value.trim());
  });
  $("#reveal")?.addEventListener("click", () => reveal($("#answer").value.trim()));
  for (const button of main.querySelectorAll("[data-rating]")) {
    button.addEventListener("click", () => {
      record("word", session.cards[session.index].id, Number(button.dataset.rating), mode);
      session.index += 1;
      session.rated += 1;
      session.answer = null;
      session.correct = null;
      render();
      (matchMedia("(pointer:fine)").matches ? $("#answer") ?? $("#start") : main).focus();
    });
  }
  const doc = documents.find(item => item.id === part);
  if (route === "dokumente" && doc) {
    $("#transfer").addEventListener("input", event => documentDrafts.set(doc.id, event.target.value));
    for (const button of main.querySelectorAll("[data-term]")) {
      button.addEventListener("click", () => {
        const word = wordById.get(button.dataset.term);
        const detail = $("#term-detail");
        detail.innerHTML = '<strong lang="en">' + escape(word.en) + '</strong> · ' + escape(word.de) + '<p>' + escape(word.explanation) + '</p>';
        detail.hidden = false;
      });
    }
    $("#doc-form").addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const values = new FormData(form);
      let score = 0;
      for (const question of doc.questions) {
        const correct = Number(values.get(question.id)) === question.answer;
        score += Number(correct);
        record("document", doc.id + ":" + question.id, correct ? 2 : 0);
        $("#feedback-" + question.id).innerHTML = '<span lang="de"><strong class="feedback ' + (correct ? "" : "try") + '">' +
          (correct ? "Richtig." : "Noch einmal nachlesen.") + '</strong> ' + escape(question.feedback) + ' <button class="button link-button" type="button" data-ref="' +
          question.ref + '">Absatz ' + (question.ref + 1) + ' zeigen</button></span>';
      }
      $("#doc-result").textContent = score + " von " + doc.questions.length + " richtig.";
    });
  }
  $("#export")?.addEventListener("click", event => {
    const blob = new Blob([JSON.stringify({ version: 1, attempts }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rail-english-lernstand.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Export erstellt.", event.currentTarget);
  });
}
main.addEventListener("click", event => {
  const reference = event.target.closest("[data-ref]");
  if (!reference) return;
  main.querySelector(".paragraph.highlight")?.classList.remove("highlight");
  const paragraph = $("#absatz-" + reference.dataset.ref);
  paragraph.classList.add("highlight");
  paragraph.focus({ preventScroll: true });
  paragraph.scrollIntoView({ behavior: motion || matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
});
function render() {
  const [section, part] = location.hash.slice(1).split("/");
  route = ["vokabeln","dokumente","fortschritt"].includes(section) ? section : "heute";
  main.innerHTML = route === "vokabeln" ? vocabulary(part)
    : route === "dokumente" ? documentPage(part) : route === "fortschritt" ? progress() : today();
  for (const link of document.querySelectorAll("nav a")) {
    if (link.hash === "#" + route) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  }
  bind(part);
  renderSync();
}
window.addEventListener("hashchange", () => {
  if (location.hash !== "#vokabeln/trainieren") session = null;
  setMenu(false);
  render();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
});
render();
connect();
