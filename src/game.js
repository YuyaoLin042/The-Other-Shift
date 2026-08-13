export const ITEM_LIBRARY = [
  { id: "noodles", name: "老坛方便面", icon: "🍜", hint: "留学生夜宵爆款", price: 3 },
  { id: "laoganma", name: "辣椒酱", icon: "🌶️", hint: "本地邻居也会上瘾", price: 5 },
  { id: "dumplings", name: "速冻饺子", icon: "🥟", hint: "华人家庭必囤", price: 7 },
  { id: "milk_tea", name: "珍珠奶茶", icon: "🧋", hint: "年轻顾客最爱拍照", price: 6 },
  { id: "hotpot", name: "火锅底料", icon: "🍲", hint: "周末聚会畅销品", price: 9 },
  { id: "rice", name: "东北大米", icon: "🍚", hint: "利润不高但很稳", price: 12 },
];

const EVENTS = [
  { type:"sale", icon:"👩‍🎓", who:"赶论文的中国留学生", title:"还有十分钟宿舍就关门", text:"老板！给我来点能熬过今晚的，越快越好！", goal:"卖出夜宵", choices:[
    {id:"noodles",label:"泡面 + 辣椒酱",icon:"🍜",detail:"便宜、稳妥，学生会再来",cash:18,fame:5,risk:0},
    {id:"milk_tea",label:"奶茶加双份珍珠",icon:"🧋",detail:"利润更高，但不太顶饿",cash:22,fame:2,risk:0},
    {id:"rice",label:"推荐一袋东北大米",icon:"🍚",detail:"她显然没时间做饭",cash:10,fame:-3,risk:0},
  ]},
  { type:"sale", icon:"👵", who:"第一次进中超的英国奶奶", title:"拿着一张孙女写的购物单", text:"请问“老干妈”是一位很厉害的女士吗？我想买她做的酱。", goal:"帮她买对商品", choices:[
    {id:"laoganma",label:"递上经典辣椒酱",icon:"🌶️",detail:"解释吃法，再送一张菜谱",cash:26,fame:8,risk:0},
    {id:"hotpot",label:"推荐麻辣火锅底料",icon:"🍲",detail:"可能太辣，但利润不错",cash:30,fame:-2,risk:0},
    {id:"dumplings",label:"请她试吃煎饺",icon:"🥟",detail:"少赚一点，可能带来新客",cash:16,fame:10,risk:0},
  ]},
  { type:"street", icon:"🧥", who:"街区里收“清洁费”的人", title:"两个人堵在后门卸货区", text:"新店开张，总得有人帮你照看货车。每周五十镑，大家都省事。", goal:"处理街区麻烦", choices:[
    {id:"pay",label:"先付一次，套他们的话",icon:"💷",detail:"损失现金，但获得街区线索",cash:-35,fame:0,risk:-4,intel:2},
    {id:"alliance",label:"联系隔壁店主一起拒绝",icon:"🤝",detail:"抱团更安全，也赢得口碑",cash:-8,fame:12,risk:5,intel:1},
    {id:"police",label:"保存监控并报警",icon:"📹",detail:"合法稳妥，但他们可能记住你",cash:0,fame:5,risk:10,intel:2},
  ]},
  { type:"supply", icon:"🚚", who:"深夜抵达的冷链货车", title:"司机说海关耽误了六小时", text:"饺子开始解冻。现在收货能半价，不收就要空一周货架。", goal:"决定是否冒险进货", choices:[
    {id:"reject",label:"拒收问题冷冻货",icon:"🛑",detail:"守住食品安全，暂时少赚钱",cash:-5,fame:8,risk:-5},
    {id:"inspect",label:"现场测温，只收合格箱",icon:"🌡️",detail:"花时间检查，风险和收益平衡",cash:28,fame:5,risk:2},
    {id:"cheap",label:"全部半价收下",icon:"📦",detail:"利润巨大，食品风险也巨大",cash:65,fame:-8,risk:18},
  ]},
  { type:"explore", icon:"🗺️", who:"合伙人的夜间踩点", title:"地铁末班车前还能去一个地方", text:"今晚去哪里寻找下一家店的机会？", goal:"探索伦敦街区", choices:[
    {id:"chinatown",label:"唐人街餐馆后巷",icon:"🏮",detail:"容易找到便宜供应商",cash:18,fame:3,risk:7,intel:2},
    {id:"campus",label:"大学城学生公寓",icon:"🎓",detail:"调查年轻人的口味",cash:8,fame:10,risk:1,intel:2},
    {id:"warehouse",label:"东区废弃仓库",icon:"🏭",detail:"可能找到低价铺面，也可能遇上麻烦",cash:38,fame:0,risk:13,intel:3},
  ]},
];

const pick = a => a[Math.floor(Math.random()*a.length)];
const clamp = (n,min=0,max=100)=>Math.max(min,Math.min(max,n));
export function generateCode(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from({length:6},()=>pick(a)).join("");}
function levelFor(cash){return cash>=1200?4:cash>=600?3:cash>=260?2:1;}
export function makeEvent(state){
  let pool=EVENTS;
  if(state.turn<2) pool=EVENTS.filter(e=>e.type==="sale");
  else if(state.currentPlayer==="moon") pool=EVENTS.filter(e=>e.type!=="sale");
  return structuredClone(pick(pool));
}
export function createInitialState(code,name,token){const s={version:2,code,day:1,turn:0,currentPlayer:"sun",players:[{id:"sun",name,token}],cash:120,fame:5,risk:8,intel:0,level:1,city:"伦敦 · 东区",storeName:"好运来食品店",inventory:ITEM_LIBRARY.map(x=>({...x,count:3})),event:null,note:"",lastOutcome:"",history:[]};s.event=makeEvent(s);return s;}
export function migrateState(old){
  if(old?.version===2)return old;
  const s=createInitialState(old.code,old.players?.[0]?.name||"店长",old.players?.[0]?.token);
  s.players=old.players||s.players;s.currentPlayer=old.currentPlayer||"sun";s.day=old.day||1;s.turn=old.turn||0;s.cash=Math.max(120,(old.coins||0)*5);return s;
}
export function resolveTurn(raw,actorId,choiceId,note){
  const next=structuredClone(migrateState(raw));const actor=next.players.find(p=>p.id===actorId);
  if(!actor||next.currentPlayer!==actorId)throw new Error("现在轮到另一位合伙人值班");
  const choice=next.event.choices.find(c=>c.id===choiceId);if(!choice)throw new Error("请先选择一个行动");
  next.cash=Math.max(0,next.cash+choice.cash);next.fame=clamp(next.fame+choice.fame);next.risk=clamp(next.risk+choice.risk);next.intel=Math.max(0,next.intel+(choice.intel||0));
  const oldLevel=next.level;next.level=levelFor(next.cash);
  const result=choice.cash>=0?`收入 £${choice.cash}`:`支出 £${Math.abs(choice.cash)}`;
  next.lastOutcome=`${actor.name}选择了「${choice.label}」：${result}，口碑${choice.fame>=0?"+":""}${choice.fame}。${next.level>oldLevel?" 店铺可以升级了！":""}`;
  next.note=(note||"").slice(0,30);next.history.unshift({id:crypto.randomUUID(),label:`第 ${next.day} 天 · ${actor.name}`,text:next.lastOutcome});next.history=next.history.slice(0,8);
  next.turn++;next.currentPlayer=next.currentPlayer==="sun"?"moon":"sun";if(next.currentPlayer==="sun")next.day++;
  next.event=makeEvent(next);return next;
}
export function safeState(state){return migrateState(state);}
