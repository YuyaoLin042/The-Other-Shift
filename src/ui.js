import { act, addDemoPartner, clearSession, createRoom, getSession, joinRoom, loadRoom, saveSession, storageMode } from "./storage.js";

const view = { state: null, session: null, mode: "home", selected: null, busy: false, error: "" };
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

function landing() {
  return `<main class="landing-shell"><div class="grain"></div>
    <nav class="landing-nav"><span class="tiny-sign">OPEN · BETWEEN TIME ZONES</span><span>☼ / ◐</span></nav>
    <section class="landing"><div class="landing-copy"><p class="eyebrow">双人异步随机叙事游戏</p><h1>时差<br>便利店</h1>
      <p class="intro">你关店以后，另一个时区的人继续营业。每次递出的物品，都会让这家店和这座城市变得不太一样。</p>
      <div class="landing-actions"><button class="primary" data-mode="create">开一家新店 <span>→</span></button><button class="text-button" data-mode="join">凭房间码来接班</button></div>
      <p class="mode-note">${storageMode === "cloud" ? "云端房间已连接，可以跨设备接班。" : "当前是本地 Demo 模式；连接数据库后即可跨设备游玩。"}</p>
    </div><div class="store-window" aria-label="夜间便利店插画"><div class="moon">☾</div><div class="awning"><i></i><i></i><i></i><i></i><i></i></div><div class="store-sign">THE OTHER SHIFT<small>24 HOURS, TWO PEOPLE</small></div><div class="window-pane"><span class="shelf shelf-a">☕　▣　☂</span><span class="clerk">◉</span><span class="shelf shelf-b">▤　◌　▥</span></div><div class="door"><span>OPEN</span></div><div class="pavement"></div></div></section>
    ${view.mode === "home" ? "" : entryModal()}
  </main>`;
}

function entryModal() {
  const join = view.mode === "join";
  return `<div class="modal-backdrop"><section class="entry-card"><button class="close" data-mode="home" aria-label="关闭">×</button><p class="eyebrow">${join ? "NEXT SHIFT" : "NEW STORE"}</p><h2>${join ? "找到朋友的便利店" : "给新店挂上灯牌"}</h2>
    <label>你的值班名<input id="name" maxlength="12" placeholder="例如：柚子"></label>
    ${join ? '<label>六位房间码<input id="code" class="code-input" maxlength="6" placeholder="MOON24"></label>' : ""}
    ${view.error ? `<p class="error">${escapeHtml(view.error)}</p>` : ""}<button class="primary wide" id="enter">${view.busy ? "正在亮灯…" : join ? "加入并接班" : "开始第一班"}</button></section></div>`;
}

function stats(state) {
  return [["零钱", `${state.coins}¤`], ["温度", state.warmth], ["怪事", state.oddness], ["口碑", state.reputation]].map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function game() {
  const state = view.state;
  const session = view.session;
  const me = state.players.find((p) => p.id === session.playerId);
  const partner = state.players.find((p) => p.id !== session.playerId);
  const myTurn = state.currentPlayer === session.playerId;
  return `<main class="game-shell"><div class="grain"></div><header class="game-header"><div><p class="eyebrow">THE OTHER SHIFT</p><h1>时差便利店</h1></div><div class="room-chip"><span>房间码</span><strong>${state.code}</strong><button id="copy">复制</button></div><button class="leave" id="leave">离开本机</button></header>
    <section class="shift-strip"><div class="keeper ${state.currentPlayer === "sun" ? "active" : ""}"><span>☼</span><div><small>白昼班</small><strong>${escapeHtml(state.players.find((p) => p.id === "sun")?.name || "等待加入")}</strong></div></div><div class="shift-line"><span>DAY ${state.day}</span><i></i></div><div class="keeper ${state.currentPlayer === "moon" ? "active" : ""}"><span>◐</span><div><small>夜晚班</small><strong>${escapeHtml(state.players.find((p) => p.id === "moon")?.name || "等待加入")}</strong></div></div></section>
    <section class="game-grid"><aside class="left-rail"><div class="panel world-panel"><p class="panel-title">店铺状态</p><div class="stat-grid">${stats(state)}</div><div class="weather"><span>窗外</span><strong>${state.weather}</strong></div></div><div class="panel history-panel"><p class="panel-title">这家店记得的事</p>${state.history.length ? state.history.slice(0, 4).map((entry) => `<article><small>${entry.label}</small><p>${entry.text}</p></article>`).join("") : '<p class="muted">故事还没发生。</p>'}</div></aside>
      <section class="counter-panel">${state.lastOutcome ? `<div class="outcome"><span>上一班留下的变化</span><p>${state.lastOutcome}</p></div>` : ""}${state.note ? `<div class="note-tape"><small>${escapeHtml(partner?.name || "上一班")} 的便签</small><p>“${escapeHtml(state.note)}”</p></div>` : ""}${myTurn ? activeShift() : waiting(partner)}${view.error ? `<p class="error game-error">${escapeHtml(view.error)}</p>` : ""}</section>
      <aside class="right-rail panel"><p class="panel-title">货架</p><div class="inventory-list">${state.inventory.map((item) => `<div class="inventory-row ${item.count ? "" : "empty"}"><span>${item.icon}</span><strong>${item.name}</strong><em>× ${item.count}</em></div>`).join("")}</div><div class="world-rule"><span>随机世界规则</span><p>顾客、天气、库存和旧选择会重新组合。这里没有固定剧本，也没有标准答案。</p></div><small class="turn-count">第 ${state.turn + 1} 次营业 · ${escapeHtml(me?.name)} 的设备</small></aside></section></main>`;
}

function activeShift() {
  const state = view.state;
  return `<div class="visitor-scene"><div class="visitor-halo"></div><div class="visitor-icon">${state.event.visitorIcon}</div><div class="visitor-name"><small>${state.event.title}</small><strong>${state.event.visitor}</strong></div></div><div class="dialogue"><p>“${state.event.line}”</p><small>线索：${state.event.clue}</small></div><div class="choices"><p class="choice-heading">你准备递给对方什么？</p><div class="choice-grid">${state.event.choices.map((id) => { const item = state.inventory.find((x) => x.id === id); return `<button class="item-card ${view.selected === id ? "selected" : ""}" data-item="${id}" ${item.count < 1 ? "disabled" : ""}><span class="item-icon">${item.icon}</span><strong>${item.name}</strong><small>${item.hint}</small><em>店里还有 ${item.count}</em></button>`; }).join("")}</div></div><div class="handoff-box"><label>留给下一班的话 <span id="count">0/20</span></label><div><input id="note" maxlength="20" placeholder="这把伞可能见过海……"><button id="handoff" ${!view.selected || view.busy ? "disabled" : ""}>${view.busy ? "交班中…" : state.players.length < 2 ? "先添加 Demo 伙伴" : "确认选择并交班"}</button></div>${state.players.length < 2 ? '<button class="demo-partner" id="demo-partner">＋ 添加 Demo 伙伴，在本机模拟另一时区</button>' : ""}</div>`;
}

function waiting(partner) {
  const localDemo = storageMode === "local";
  return `<div class="waiting-scene"><div class="clock-orbit"><span>${view.session.playerId === "sun" ? "☼" : "◐"}</span></div><p class="eyebrow">SHIFT HANDED OVER</p><h2>店门在另一个时区亮着</h2><p>${partner ? `现在轮到 ${escapeHtml(partner.name)} 接待下一位客人。` : "把房间码发给朋友，等对方加入夜晚班。"}</p><button class="primary" id="refresh">看看有没有新变化</button>${localDemo && partner ? '<button class="text-button" id="switch-demo">本机切换为另一位店员</button>' : ""}</div>`;
}

function render() {
  document.querySelector("#app").innerHTML = view.state && view.session ? game() : landing();
  bind();
}

function bind() {
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => { view.mode = button.dataset.mode; view.error = ""; render(); }));
  document.querySelector("#enter")?.addEventListener("click", enter);
  document.querySelectorAll("[data-item]").forEach((button) => button.addEventListener("click", () => { view.selected = button.dataset.item; render(); }));
  document.querySelector("#note")?.addEventListener("input", (event) => { document.querySelector("#count").textContent = `${event.target.value.length}/20`; });
  document.querySelector("#handoff")?.addEventListener("click", handoff);
  document.querySelector("#demo-partner")?.addEventListener("click", async () => { view.state = await addDemoPartner(view.session); render(); });
  document.querySelector("#refresh")?.addEventListener("click", refresh);
  document.querySelector("#switch-demo")?.addEventListener("click", switchDemo);
  document.querySelector("#copy")?.addEventListener("click", () => navigator.clipboard?.writeText(view.state.code));
  document.querySelector("#leave")?.addEventListener("click", () => { clearSession(); Object.assign(view, { state: null, session: null, selected: null }); render(); });
}

async function enter() {
  const name = document.querySelector("#name").value.trim();
  const code = document.querySelector("#code")?.value.trim().toUpperCase();
  if (!name || (view.mode === "join" && code.length !== 6)) { view.error = "请填好值班名和六位房间码"; return render(); }
  view.busy = true; render();
  try {
    const result = view.mode === "create" ? await createRoom(name) : await joinRoom(code, name);
    view.state = result.state; view.session = result.session; view.selected = null; view.error = ""; saveSession(result.session);
  } catch (error) { view.error = error.message || "便利店暂时停电了"; }
  view.busy = false; render();
}

async function handoff() {
  if (view.state.players.length < 2) return;
  const note = document.querySelector("#note")?.value || "";
  view.busy = true; render();
  try { view.state = await act(view.session, view.selected, note); view.selected = null; view.error = ""; }
  catch (error) { view.error = error.message || "交班失败"; }
  view.busy = false; render();
}

async function refresh() {
  try { view.state = await loadRoom(view.session); view.error = ""; }
  catch (error) { view.error = error.message; }
  render();
}

async function switchDemo() {
  const other = view.state.players.find((player) => player.id !== view.session.playerId);
  if (!other) return;
  view.session = { code: view.state.code, token: other.token, playerId: other.id };
  saveSession(view.session); render();
}

export async function mountApp() {
  view.session = getSession();
  if (view.session) {
    try { view.state = await loadRoom(view.session); }
    catch { clearSession(); view.session = null; }
  }
  render();
  setInterval(async () => { if (view.session && view.state?.currentPlayer !== view.session.playerId) await refresh(); }, 10000);
}
