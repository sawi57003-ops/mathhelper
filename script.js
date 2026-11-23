// MathHelper — plain math practice site (no agent yet).
// Data + state + operations. The page script is a module that exports App.page
// with a state reader and one method per operation; the page's own buttons call
// the same methods. Operations refuse bad input with {ok:false, reason}.

import { TOPICS } from "./topics.js";

const STORE_KEY = "mathhelper-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { history: s.history || [] };
    }
  } catch (e) { /* corrupted storage: start fresh */ }
  return { history: [] };
}
function saveState(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
  catch (e) { /* storage unavailable (e.g. Node tests, private mode): state stays in memory */ }
}

const state = loadState();
let selectedTopicId = null;

export const App = {};
App.page = {
  getState() {
    const correct = state.history.filter(h => h.correct).length;
    return {
      ok: true,
      topics: TOPICS.map(t => ({ id: t.id, title: t.title, subject: t.subject, blurb: t.blurb, problems: t.problems.length })),
      tried: state.history.length,
      correct,
      history: state.history.slice(-10),
      facts: "MathHelper is a static math practice site. It offers 4 topics (Solving Equations, Fractions of a Number, Percentages in Money, Area & Perimeter), each with a short lesson and 5 practice problems with worked steps. It cannot solve problems outside these four topics, or grade official schoolwork."
    };
  },
  getTopic(topicId) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) return { ok: false, reason: "Unknown topic id: " + topicId + ". Available topics: " + TOPICS.map(x => x.id).join(", ") + "." };
    return { ok: true, id: t.id, title: t.title, subject: t.subject, lesson: t.lesson, problemCount: t.problems.length };
  },
  getPractice(topicId) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) return { ok: false, reason: "Unknown topic id: " + topicId + "." };
    // Problems without answers: the page shows these; answers stay in the data for checking.
    return { ok: true, topicId: t.id, title: t.title, problems: t.problems.map((p, i) => ({ n: i + 1, q: p.q })) };
  },
  checkPracticeAnswer(topicId, problemNumber, userAnswer) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) return { ok: false, reason: "Unknown topic id: " + topicId + "." };
    const n = Number(problemNumber);
    if (!Number.isInteger(n) || n < 1 || n > t.problems.length) return { ok: false, reason: "Problem number must be from 1 to " + t.problems.length + "." };
    const a = Number(userAnswer);
    if (!Number.isFinite(a)) return { ok: false, reason: "Answer must be a number." };
    const p = t.problems[n - 1];
    const correct = Math.abs(a - p.answer) < 1e-9;
    const rec = { topicId: t.id, title: t.title, problem: n, question: p.q, userAnswer: a, correctAnswer: p.answer, correct, at: new Date().toISOString() };
    state.history.push(rec);
    saveState(state);
    renderScore();
    renderHistory();
    return { ok: true, ...rec, steps: p.steps, message: correct ? "Correct! " + p.steps : "Not quite. The answer is " + p.answer + ". " + p.steps };
  },
  getHistory() {
    return { ok: true, history: state.history };
  }
};

// ---- UI rendering (page's own buttons call the same App.page methods) ----
const $ = id => document.getElementById(id);

function renderTopics() {
  const grid = $("topic-grid");
  grid.innerHTML = "";
  TOPICS.forEach(t => {
    const card = document.createElement("div");
    card.className = "topic-card";
    card.innerHTML = "<h3>" + t.title + "</h3><p>" + t.blurb + "</p><div class='meta'>" + t.subject + " · " + t.problems.length + " practice problems</div>";
    card.addEventListener("click", () => showLesson(t.id));
    grid.appendChild(card);
  });
}
function showLesson(topicId) {
  const t = TOPICS.find(x => x.id === topicId);
  if (!t) return;
  selectedTopicId = topicId;
  $("lesson-title").textContent = t.title + " (" + t.subject + ")";
  $("lesson-body").innerHTML = "<ul>" + t.lesson.map(p => "<li>" + p + "</li>").join("") + "</ul>";
  $("practice-list").innerHTML = t.problems.map((p, i) => "<li><strong>" + (i + 1) + ".</strong> " + p.q + "</li>").join("");
  $("answer-problem").max = t.problems.length;
  $("answer-result").innerHTML = "";
  $("lesson").hidden = false;
  $("lesson").scrollIntoView({ behavior: "smooth" });
}
function renderScore() {
  const correct = state.history.filter(h => h.correct).length;
  $("score-line").textContent = correct + " correct / " + state.history.length + " tried";
}
function renderHistory() {
  const d = $("score-history");
  if (!state.history.length) { d.innerHTML = "<p>No problems tried yet.</p>"; return; }
  d.innerHTML = state.history.slice(-10).reverse().map(h =>
    "<p><span class='" + (h.correct ? "correct" : "wrong") + "'>" + (h.correct ? "Correct" : "Wrong") + "</span> — " + h.title + " #" + h.problem + ": " + h.question + " (you answered " + h.userAnswer + ", answer " + h.correctAnswer + ")</p>").join("");
}
$("close-lesson-btn").addEventListener("click", () => { $("lesson").hidden = true; });
$("answer-form").addEventListener("submit", e => {
  e.preventDefault();
  if (!selectedTopicId) return;
  const res = App.page.checkPracticeAnswer(selectedTopicId, $("answer-problem").value, $("answer-value").value);
  if (res.ok) {
    $("answer-result").innerHTML = "<p class='" + (res.correct ? "correct" : "wrong") + "'>" + res.message + "</p>";
  } else {
    $("answer-result").innerHTML = "<p class='wrong'>" + res.reason + "</p>";
  }
});

renderTopics();
renderScore();
renderHistory();
