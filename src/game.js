export const ITEM_LIBRARY = [
  { id: "coffee", name: "热咖啡", icon: "☕", hint: "杯壁一直很暖", tags: ["warm", "awake", "memory"], price: 4 },
  { id: "umbrella", name: "红雨伞", icon: "☂", hint: "伞尖沾着盐粒", tags: ["shelter", "sea", "hiding"], price: 6 },
  { id: "battery", name: "旧电池", icon: "▣", hint: "还有微弱电流", tags: ["light", "machine", "lost"], price: 5 },
  { id: "sardine", name: "沙丁鱼罐头", icon: "◇", hint: "来自没有标记的海域", tags: ["food", "sea", "animal"], price: 5 },
  { id: "thread", name: "蓝色线团", icon: "◉", hint: "拉开后似乎没有尽头", tags: ["repair", "memory", "path"], price: 3 },
  { id: "salt", name: "一小袋盐", icon: "△", hint: "在月光下有点亮", tags: ["food", "protection", "sea"], price: 2 },
  { id: "match", name: "防风火柴", icon: "╱", hint: "一盒只有三根", tags: ["light", "warm", "signal"], price: 4 },
  { id: "ticket", name: "过期车票", icon: "▤", hint: "终点站被擦掉了", tags: ["path", "lost", "memory"], price: 1 },
];

const VISITORS = [
  { name: "鞋子全湿的邮差", icon: "♟", title: "没有收件地址", lines: ["我有一封信要送到明天，但末班车刚刚开走。", "这封信越来越轻了。再找不到路，它就会消失。"], needs: ["path", "signal", "lost"], strange: 2 },
  { name: "戴潜水镜的小女孩", icon: "♙", title: "头发还在滴水", lines: ["海底那家店今天没开门。你们这里卖可以呼吸的东西吗？", "有一条鱼托我买点东西，但我忘了它怕冷还是怕黑。"], needs: ["sea", "warm", "animal"], strange: 5 },
  { name: "没有影子的上班族", icon: "♜", title: "影子还没下班", lines: ["我的影子留在公司加班了，我得给它带点能找到家的东西。", "请给我一样不会在镜子里出现的东西。"], needs: ["light", "path", "hiding"], strange: 4 },
  { name: "反复看表的狐狸", icon: "♞", title: "比时钟快七分钟", lines: ["冬天提前到了，我答应给洞里带晚饭。", "我只停三十秒，但想买一段很长的路。"], needs: ["food", "warm", "path"], strange: 3 },
  { name: "生锈的送货机器人", icon: "♝", title: "胸口传来海浪声", lines: ["导航说这里是港口。请帮我重新亮起来。", "我的收货人已经搬走二十年了，但包裹还在呼吸。"], needs: ["machine", "light", "sea"], strange: 4 },
  { name: "带着空鱼缸的老人", icon: "♚", title: "鱼缸里像在下雨", lines: ["我养的云跑出去了，留下的洞越来越冷。", "这里面曾经有一场暴雨。我想记得它。"], needs: ["warm", "memory", "repair"], strange: 3 },
  { name: "穿礼服的乌鸦", icon: "♛", title: "来参加迟到的婚礼", lines: ["新郎不知道自己是一座灯塔，我需要一件能提醒他的礼物。", "婚礼在退潮后开始。请给我一样不会被海水带走的东西。"], needs: ["signal", "sea", "memory"], strange: 5 },
  { name: "停电街区的邻居", icon: "♧", title: "怀里抱着一盆植物", lines: ["整条街都黑了，只有它还醒着。", "它好像记得太阳，你有没有能让它放心的东西？"], needs: ["light", "warm", "protection"], strange: 1 },
  { name: "带雪进门的旅人", icon: "♤", title: "地图上没有来处", lines: ["我走过的路正在身后消失。可以卖给我一样不会忘记方向的东西吗？", "外面不是冬天，雪却只跟着我。"], needs: ["path", "memory", "warm"], strange: 4 },
];

const WEATHERS = ["薄雾贴着玻璃", "雨正横着落", "月亮异常地近", "风把招牌吹得轻响", "远处似乎在退潮", "街灯一盏接一盏熄灭", "空气里有烤面包味"];
const NEED_NAMES = { warm: "温暖", awake: "清醒", memory: "记忆", shelter: "遮蔽", sea: "海", hiding: "隐藏", light: "光", machine: "机器", lost: "迷路", food: "食物", animal: "动物", repair: "修补", path: "道路", protection: "保护", signal: "信号" };
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (value) => Math.max(0, Math.min(99, value));

export function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function makeEvent(state) {
  let pool = VISITORS;
  if (state?.oddness > 45) pool = VISITORS.filter((visitor) => visitor.strange >= 4);
  if (state?.warmth < 30) pool = VISITORS.filter((visitor) => visitor.needs.includes("warm") || visitor.needs.includes("light"));
  const visitor = pick(pool.length ? pool : VISITORS);
  const need = pick(visitor.needs);
  const available = (state?.inventory || ITEM_LIBRARY.map((item) => ({ ...item, count: 2 }))).filter((item) => item.count > 0);
  const matching = available.filter((item) => item.tags.includes(need));
  const choices = new Set();
  if (matching.length) choices.add(pick(matching).id);
  while (choices.size < Math.min(3, available.length)) choices.add(pick(available).id);
  return { visitor: visitor.name, visitorIcon: visitor.icon, title: visitor.title, line: pick(visitor.lines), clue: `对方似乎需要与「${NEED_NAMES[need]}」有关的东西`, need, strange: visitor.strange, choices: [...choices] };
}

export function createInitialState(code, name, token) {
  const state = {
    code, day: 1, turn: 0, currentPlayer: "sun",
    players: [{ id: "sun", name, token }],
    coins: 24, warmth: 58, oddness: 7, reputation: 10,
    weather: pick(WEATHERS),
    inventory: ITEM_LIBRARY.map((item, index) => ({ ...item, count: index < 6 ? 2 : 1 })),
    event: null, note: "", lastOutcome: "", history: [],
  };
  state.event = makeEvent(state);
  return state;
}

function makeOutcome(event, item, matched, state) {
  const good = [
    `${event.visitor}接过${item.name}，像是早就知道你会这样选。门外的${state.weather}短暂停了一下。`,
    `${item.name}刚碰到柜台，${event.visitor}便露出放心的神情。对方留下几枚陌生硬币，转身走进街灯照不到的地方。`,
    `${event.visitor}把${item.name}仔细收好。几分钟后，店里的旧收音机自动报出了明天的天气。`,
  ];
  const odd = [
    `${event.visitor}盯着${item.name}看了很久，还是把它带走了。第二天，货架上多出了一样一模一样的东西。`,
    `${item.name}似乎并非对方真正需要的东西，但${event.visitor}笑了。门外从此多了一串走向墙里的脚印。`,
    `${event.visitor}没有付钱，只在柜台上留下一粒会发热的沙。没人知道这算不算一笔好生意。`,
  ];
  return pick(matched ? good : odd);
}

export function resolveTurn(state, actorId, itemId, note) {
  const next = structuredClone(state);
  const actor = next.players.find((player) => player.id === actorId);
  const item = next.inventory.find((candidate) => candidate.id === itemId);
  if (!actor || next.currentPlayer !== actorId) throw new Error("现在是另一位店员的班次");
  if (!item || item.count < 1) throw new Error("货架上已经没有这件东西了");
  const matched = item.tags.includes(next.event.need);
  const outcome = makeOutcome(next.event, item, matched, next);
  item.count -= 1;
  next.coins += matched ? item.price + 2 : Math.max(1, item.price - 1);
  next.warmth = clamp(next.warmth + (matched ? 3 : -3));
  next.reputation = clamp(next.reputation + (matched ? 4 : -1));
  next.oddness = clamp(next.oddness + next.event.strange + (matched ? 0 : 3));
  next.lastOutcome = outcome;
  next.note = note.slice(0, 20);
  next.history.unshift({ id: crypto.randomUUID(), label: `第 ${next.day} 天 · ${actor.name}`, text: outcome });
  next.history = next.history.slice(0, 12);
  next.turn += 1;
  next.currentPlayer = next.currentPlayer === "sun" ? "moon" : "sun";
  if (next.currentPlayer === "sun") next.day += 1;
  if (Math.random() < 0.55) next.weather = pick(WEATHERS);
  const empty = next.inventory.filter((candidate) => candidate.count < 1);
  if (empty.length && Math.random() < 0.7) pick(empty).count += 1;
  else if (Math.random() < 0.35) pick(next.inventory).count += 1;
  next.event = makeEvent(next);
  return next;
}

export function safeState(state) {
  return { ...state, players: state.players.map(({ id, name }) => ({ id, name })), inventory: state.inventory.map(({ tags, price, ...item }) => item), event: (({ need, strange, ...event }) => event)(state.event) };
}
