import { createClient } from "@supabase/supabase-js";
import { createInitialState, endShift, generateCode, resolveTurn } from "./game.js";

const SESSION_KEY = "other-shift-session";
const ROOMS_KEY = "other-shift-local-rooms";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const cloud = Boolean(supabaseUrl && supabaseKey);
const supabase = cloud ? createClient(supabaseUrl, supabaseKey) : null;

export const storageMode = cloud ? "cloud" : "local";

function localRooms() {
  try { return JSON.parse(localStorage.getItem(ROOMS_KEY) || "{}"); }
  catch { return {}; }
}

function saveLocalRoom(state) {
  const rooms = localRooms();
  rooms[state.code] = state;
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

async function readRoom(code) {
  if (!cloud) return localRooms()[code] || null;
  const { data, error } = await supabase.from("rooms").select("state").eq("code", code).maybeSingle();
  if (error) throw error;
  return data?.state || null;
}

async function writeRoom(state) {
  if (!cloud) return saveLocalRoom(state);
  const { error } = await supabase.from("rooms").upsert({ code: state.code, state, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function saveSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
export function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }
export function clearSession() { localStorage.removeItem(SESSION_KEY); }

export async function createRoom(name) {
  let code = generateCode();
  while (await readRoom(code)) code = generateCode();
  const token = crypto.randomUUID();
  const state = createInitialState(code, name, token);
  await writeRoom(state);
  return { state, session: { code, token, playerId: "sun" } };
}

export async function joinRoom(code, name) {
  const state = await readRoom(code);
  if (!state) throw new Error("没有找到这家店");
  if (state.players.length >= 2) throw new Error("这家店已经有两位店员了");
  const token = crypto.randomUUID();
  state.players.push({ id: "moon", name, token });
  await writeRoom(state);
  return { state, session: { code, token, playerId: "moon" } };
}

export async function loadRoom(session) {
  const state = await readRoom(session.code);
  if (!state) throw new Error("没有找到这家店");
  if (!state.players.some((player) => player.token === session.token)) throw new Error("这台设备没有值班凭证");
  return state;
}

export async function act(session, itemId, action, note, finish = false) {
  const state = await loadRoom(session);
  const next = resolveTurn(state, session.playerId, itemId, action, note, finish);
  await writeRoom(next);
  return next;
}
export async function handOver(session,note){const state=await loadRoom(session);const next=endShift(state,session.playerId,note);await writeRoom(next);return next;}

export async function addDemoPartner(session, name = "欧洲的朋友") {
  const state = await loadRoom(session);
  if (state.players.length < 2) state.players.push({ id: "moon", name, token: crypto.randomUUID() });
  await writeRoom(state);
  return state;
}
