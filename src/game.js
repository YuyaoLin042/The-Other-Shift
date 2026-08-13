export const ITEM_LIBRARY = [
  { id: "noodles", name: "老坛方便面", icon: "🍜", hint: "留学生夜宵爆款", price: 3 },
  { id: "laoganma", name: "辣椒酱", icon: "🌶️", hint: "本地邻居也会上瘾", price: 5 },
  { id: "dumplings", name: "速冻饺子", icon: "🥟", hint: "华人家庭必囤", price: 7 },
  { id: "milk_tea", name: "珍珠奶茶", icon: "🧋", hint: "年轻顾客最爱拍照", price: 6 },
  { id: "hotpot", name: "火锅底料", icon: "🍲", hint: "周末聚会畅销品", price: 9 },
  { id: "rice", name: "东北大米", icon: "🍚", hint: "利润不高但很稳", price: 12 },
];

const MORE_EVENTS = [
  ["sale","刚下班的川菜厨师","围裙上还沾着花椒","后厨断货了，借我两包火锅底料，明早双倍还你。","处理同行请求",["按进价借给他","按夜间价卖出","换他家的招牌菜"]],
  ["sale","带女儿买年货的爸爸","小女孩抱着纸灯笼","今年回不了国，想让家里有点过年的味道。","搭配年货篮",["饺子和火锅底料","做红色礼篮","只拿便宜泡面"]],
  ["sale","演出结束的地下乐队","四个人只剩十一英镑","需要能分着吃、还不会弄脏乐器的东西。","给乐队配夜宵",["做四份干拌面","奶茶少收一杯","卖一袋米"]],
  ["sale","修地铁的夜班工人","反光背心全是灰","隧道还要修八小时，来点热的、咸的，别太贵。","准备夜班餐",["热汤面加煎饺","特辣火锅套餐","只卖奶茶"]],
  ["sale","附近新来的法国店主","拿翻译软件逐字念","想找一种能让客人记住我的中国调味料。","认识新邻居",["试吃辣椒酱","分享融合菜谱","高价卖秘方"]],
  ["street","检查消防通道的市政人员","在后门停了很久","纸箱挡住逃生通道。现在处理，还是正式开单？","应付检查",["立刻清理","接受罚单","拿图纸解释"]],
  ["street","想画外墙的涂鸦青年","背包装满喷漆罐","让我画一条中国龙，后巷以后就是打卡点。","决定外墙形象",["画整面龙墙","画小招牌","拒绝"]],
  ["supply","开面包车的华人农场主","车里是刚摘的亚洲蔬菜","你愿不愿意每周固定收我的小批量货？","选择供应商",["签每周供货","先试卖一周","压到最低价"]],
  ["supply","港口打来的海关电话","茶叶标签翻译有问题","今天不补材料，货就要退回原产地。","救回货物",["连夜补文件","找清关代理","托关系提货"]],
  ["explore","经营二十年的杂货店老板娘","她知道每条街的租金","带你看没挂牌的铺面，但要分享供应商。","交换扩店情报",["交换线索","只看铺面","给假线索"]],
  ["explore","熟悉小路的外卖骑手","他说知道一座空冷库","给我今晚的饭，我带你从河边小路过去。","探索隐藏冷库",["立刻出发","先画地图","以后再说"]],
  ["sale","刚搬来的尼日利亚妈妈","推车里坐着两个孩子","中国米适合做我的家乡饭吗？你教我挑好吗？","帮助新邻居",["介绍东北大米","做试吃","推荐礼盒米"]],
].map((e,n)=>({type:e[0],who:e[1],title:e[2],text:e[3],goal:e[4],choices:e[5].map((label,i)=>({id:`extra_${n}_${i}`,label,detail:["稳妥处理，建立长期关系","收益与风险比较平衡","大胆选择，结果难以预料"][i],cash:[18,28,42][i],fame:[8,4,-3][i],risk:[0,2,7][i],intel:e[0]==="explore"?i+1:0}))}));

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
  let pool=[...EVENTS,...MORE_EVENTS];
  if(state.turn<2) pool=EVENTS.filter(e=>e.type==="sale");
  else if(state.currentPlayer==="moon") pool=EVENTS.filter(e=>e.type!=="sale");
  const recent=state.recentVisitors||[];const fresh=pool.filter(e=>!recent.includes(e.who));
  return structuredClone(pick(fresh.length?fresh:pool));
}
export function createInitialState(code,name,token){const s={version:4,code,day:1,turn:0,currentPlayer:"sun",shiftHours:12,customersThisShift:0,recentVisitors:[],players:[{id:"sun",name,token}],cash:120,fame:5,risk:8,intel:0,level:1,city:"伦敦 · 东区",storeName:"好运来食品店",inventory:ITEM_LIBRARY.map(x=>({...x,count:3})),event:null,note:"",lastOutcome:"",worldNews:"伦敦东区新开了一家不起眼的中国食品店。",history:[]};s.event=makeEvent(s);return s;}
export function migrateState(old){
  if(old?.version===4)return old;
  if(old?.version===3)return {...old,version:4,recentVisitors:old.recentVisitors||[]};
  if(old?.version===2){return {...old,version:3,shiftHours:12,customersThisShift:0,worldNews:old.worldNews||"伦敦东区开始有人谈论这家新开的中国食品店。"};}
  const s=createInitialState(old.code,old.players?.[0]?.name||"店长",old.players?.[0]?.token);
  s.players=old.players||s.players;s.currentPlayer=old.currentPlayer||"sun";s.day=old.day||1;s.turn=old.turn||0;s.cash=Math.max(120,(old.coins||0)*5);return s;
}
function interpret(action,event,choice){
  const text=(action||"").trim();let cash=0,fame=0,risk=0,intel=0,hours=1;
  let story=text?`你还特别吩咐：“${text}”。`:"你按常规方式完成了这笔生意。";
  let world="街区生活照常继续。";
  if(/最辣|辣椒|爆辣|魔鬼辣/.test(text)){cash+=8;fame+=4;risk+=5;story+=` 你翻出柜台下最辣的辣椒酱，红得像警报灯。${event.who}被辣得瞬间清醒。`;world="一张“神秘中超爆辣套餐”的照片传遍了本地留学生群，中超门口开始有人挑战辣度。";}
  if(/论文|熬夜|通宵|醒一晚|肝/.test(text)){cash+=5;fame+=6;risk+=2;story+=" 对方真的精神到天亮，一口气赶完了论文。";world="第二天，大学校园流传着一家能让论文起死回生的中国超市，夜间学生客流上升。";}
  if(/免费|送他|赠送|不要钱/.test(text)){cash-=choice.cash;fame+=12;story+=" 你没有收钱，这份人情被对方牢牢记住。";world="本地互助群开始推荐这家有人情味的小店，但账本上的数字变薄了。";}
  if(/报警|警察|监控/.test(text)){risk-=8;intel+=2;story+=" 你保存证据并联系警方备案。";world="警方增加了附近巡逻，街头势力暂时收敛，却开始打听店主是谁。";}
  if(/跟踪|调查|套话|卧底/.test(text)){risk+=6;intel+=4;hours=4;story+=" 你花了额外时间顺藤摸瓜，记下几个关键名字。";world="合伙人掌握了一条地下供货网络的线索，地图上出现了新的可疑仓库。";}
  if(/菜谱|教.*做|试吃/.test(text)){cash+=3;fame+=9;story+=" 你现场讲了吃法，试吃香味把路人也吸引进店。";world="附近居民开始把这里当成认识中国食物的窗口，周末家庭客流增加。";}
  if(!text)world=`${event.who}带着「${choice.label}」离开，店里又迎来下一位客人。`;
  return {cash,fame,risk,intel,hours,story,world};
}
export function resolveTurn(raw,actorId,choiceId,action,note,endShift=false){
  const next=structuredClone(migrateState(raw));const actor=next.players.find(p=>p.id===actorId);
  if(!actor||next.currentPlayer!==actorId)throw new Error("现在轮到另一位合伙人值班");
  const choice=next.event.choices.find(c=>c.id===choiceId);if(!choice)throw new Error("请先选择一个行动");
  const custom=interpret(action,next.event,choice);const cashChange=choice.cash+custom.cash,fameChange=choice.fame+custom.fame;
  next.cash=Math.max(0,next.cash+cashChange);next.fame=clamp(next.fame+fameChange);next.risk=clamp(next.risk+choice.risk+custom.risk);next.intel=Math.max(0,next.intel+(choice.intel||0)+custom.intel);
  const oldLevel=next.level;next.level=levelFor(next.cash);
  const result=cashChange>=0?`收入 £${cashChange}`:`支出 £${Math.abs(cashChange)}`;
  next.lastOutcome=`${actor.name}选择了「${choice.label}」：${custom.story} ${result}，口碑${fameChange>=0?"+":""}${fameChange}。${next.level>oldLevel?"店铺可以升级了！":""}`;next.worldNews=custom.world;
  next.note=(note||"").slice(0,30);next.history.unshift({id:crypto.randomUUID(),label:`第 ${next.day} 天 · ${actor.name}`,text:next.lastOutcome});next.history=next.history.slice(0,8);
  next.turn++;next.customersThisShift++;next.shiftHours=Math.max(0,next.shiftHours-custom.hours);next.recentVisitors=[next.event.who,...(next.recentVisitors||[]).filter(x=>x!==next.event.who)].slice(0,6);
  if(endShift||next.shiftHours===0){next.currentPlayer=next.currentPlayer==="sun"?"moon":"sun";if(next.currentPlayer==="sun")next.day++;next.shiftHours=12;next.customersThisShift=0;}
  next.event=makeEvent(next);return next;
}
export function endShift(raw,actorId,note=""){const next=structuredClone(migrateState(raw));if(next.currentPlayer!==actorId)throw new Error("现在不是你的班次");next.note=(note||"提前交班").slice(0,30);next.currentPlayer=next.currentPlayer==="sun"?"moon":"sun";if(next.currentPlayer==="sun")next.day++;next.shiftHours=12;next.customersThisShift=0;next.lastOutcome="合伙人提前结束了本班，店铺钥匙已交给下一班。";next.event=makeEvent(next);return next;}
export function safeState(state){return migrateState(state);}
