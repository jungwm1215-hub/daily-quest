import React, { useState, useEffect, useRef } from "react";

const ST = {
  root:{minHeight:"100vh",background:"#030d18",fontFamily:"'Noto Sans KR',sans-serif",color:"#c8e8ff",position:"relative",overflowX:"hidden"},
  gridBg:{position:"fixed",inset:0,backgroundImage:`linear-gradient(rgba(0,180,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,180,255,.05) 1px,transparent 1px)`,backgroundSize:"40px 40px",animation:"gridPulse 4s ease-in-out infinite",pointerEvents:"none",zIndex:0},
  scanline:{position:"fixed",left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,rgba(0,212,255,.18),transparent)",animation:"scanMove 8s linear infinite",pointerEvents:"none",zIndex:1},
  particle:{position:"fixed",width:"5px",height:"5px",borderRadius:"50%",pointerEvents:"none",zIndex:100,transition:"all 1s ease-out"},
  notif:{position:"fixed",top:"8%",left:"50%",transform:"translateX(-50%)",background:"rgba(3,13,24,0.96)",border:"1px solid",borderRadius:8,padding:"10px 20px",fontSize:"clamp(11px,3vw,13px)",fontFamily:"'Orbitron',sans-serif",pointerEvents:"none",zIndex:200,whiteSpace:"nowrap",animation:"notifIn 2.5s ease forwards",maxWidth:"88vw",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis"},
  lvUpOverlay:{position:"fixed",inset:0,pointerEvents:"none",zIndex:300},
  lvUpBox:{position:"absolute",top:"36%",left:"50%",animation:"lvUp 3s ease forwards",textAlign:"center"},
  lvUpTitle:{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(18px,5vw,32px)",fontWeight:900,color:"#ffd700",textShadow:"0 0 28px rgba(255,215,0,0.53)"},
  lvUpSub:{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(10px,3vw,14px)",color:"#ffee88",marginTop:6},
  achNotif:{position:"fixed",bottom:16,right:10,display:"flex",alignItems:"center",gap:8,background:"#061828",border:"1px solid rgba(123,97,255,0.27)",borderRadius:10,padding:"10px 12px",zIndex:250,animation:"achSlide 3s ease forwards",boxShadow:"0 0 16px rgba(123,97,255,0.13)",maxWidth:"min(300px,80vw)"},
  modalBg:{position:"fixed",inset:0,background:"rgba(2,6,14,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:"12px"},
  timerModal:{background:"linear-gradient(160deg,#061828,#0a2040)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:16,padding:"18px 16px",textAlign:"center",width:"min(290px,92vw)",boxShadow:"0 0 40px rgba(0,17,34,0.4)",maxHeight:"80vh",overflowY:"auto"},
  timerTypeBtn:{flex:1,background:"transparent",border:"1px solid #091a28",borderRadius:7,padding:"9px 0",fontSize:"clamp(10px,2.5vw,12px)",color:"#8aaabb",cursor:"pointer"},
  timerTypeBtnA:{borderColor:"rgba(0,212,255,0.27)",color:"#00d4ff",background:"rgba(0,212,255,0.03)"},
  durBtn:{background:"transparent",border:"none",color:"rgba(0,212,255,0.47)",cursor:"pointer",fontSize:"clamp(14px,4vw,18px)",padding:"6px 10px"},
  timerBtn:{background:"transparent",border:"1px solid",borderRadius:8,padding:"11px 20px",fontSize:"clamp(13px,3.5vw,15px)",cursor:"pointer"},
  container:{position:"relative",zIndex:2,maxWidth:"780px",margin:"0 auto",padding:"clamp(12px,3vw,20px) clamp(10px,3vw,16px) 70px"},
  header:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},
  logo:{display:"flex",alignItems:"center",gap:6,marginBottom:2},
  logoIcon:{fontSize:"clamp(14px,4vw,18px)",color:"#00d4ff",animation:"logoGlow 2.5s ease-in-out infinite"},
  logoText:{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(11px,3.5vw,16px)",fontWeight:900,letterSpacing:"clamp(1px,1vw,4px)",color:"#00d4ff",animation:"logoGlow 2.5s ease-in-out infinite"},
  iconBtn:{background:"transparent",border:"1px solid rgba(0,212,255,0.13)",borderRadius:7,width:"clamp(32px,8vw,38px)",height:"clamp(32px,8vw,38px)",fontSize:"clamp(12px,3.5vw,14px)",cursor:"pointer",color:"#00d4ff"},
  levelCard:{background:"linear-gradient(135deg,rgba(6,24,40,0.93),rgba(10,34,64,0.93))",border:"1px solid rgba(0,212,255,0.13)",borderRadius:11,padding:"clamp(10px,3vw,14px)",marginBottom:12,transition:"box-shadow .5s"},
  barBg:{height:"5px",background:"#040f1c",borderRadius:3,position:"relative",border:"1px solid rgba(0,212,255,0.08)"},
  barFill:{height:"100%",background:"linear-gradient(90deg,#0044aa,#00aaff,#00d4ff,#7b61ff)",backgroundSize:"200% auto",animation:"barShimmer 2s linear infinite",borderRadius:3,transition:"width .6s cubic-bezier(.34,1.56,.64,1)"},
  barGlow:{position:"absolute",top:"-2px",left:0,height:"9px",background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.2))",borderRadius:3,filter:"blur(3px)",transition:"width .6s ease",pointerEvents:"none"},
  tabs:{display:"flex",gap:3,marginBottom:12,overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",paddingBottom:2},
  tab:{flex:"0 0 auto",background:"transparent",border:"1px solid #091828",borderRadius:7,padding:"clamp(7px,2vw,9px) clamp(8px,2.5vw,12px)",fontSize:"clamp(9px,2.2vw,11px)",color:"#8aaabb",cursor:"pointer",whiteSpace:"nowrap"},
  tabA:{borderColor:"rgba(0,212,255,0.2)",color:"#00d4ff",background:"rgba(0,212,255,0.03)"},
  limitWarn:{background:"#180a0a",border:"1px solid rgba(255,77,109,0.13)",borderRadius:7,padding:"8px 12px",fontSize:"clamp(10px,2.5vw,11px)",color:"rgba(255,77,109,0.75)",marginBottom:9},
  addBtn:{background:"transparent",border:"1px solid rgba(0,212,255,0.16)",borderRadius:6,padding:"clamp(6px,2vw,8px) clamp(10px,3vw,14px)",fontSize:"clamp(10px,2.5vw,12px)",color:"#00d4ff",cursor:"pointer"},
  addForm:{background:"#061828",border:"1px solid rgba(0,212,255,0.09)",borderRadius:10,padding:"clamp(12px,3vw,16px)",marginBottom:10,display:"flex",flexDirection:"column",gap:10},
  input:{background:"#040f1c",border:"1px solid rgba(0,212,255,0.13)",borderRadius:7,padding:"clamp(10px,2.5vw,12px) clamp(10px,3vw,14px)",color:"#c8e8ff",fontSize:"clamp(13px,3.5vw,15px)",outline:"none",width:"100%"},
  select:{background:"#040f1c",border:"1px solid rgba(0,212,255,0.09)",borderRadius:7,padding:"clamp(8px,2vw,10px) clamp(8px,2.5vw,12px)",color:"#c8e8ff",fontSize:"clamp(12px,3vw,14px)",outline:"none",cursor:"pointer",width:"100%"},
  prioBtn:{background:"transparent",border:"1px solid",borderRadius:6,padding:"clamp(6px,2vw,8px) clamp(10px,2.5vw,14px)",fontSize:"clamp(10px,2.5vw,12px)",cursor:"pointer",transition:"all .2s"},
  schedBtn:{flex:1,background:"transparent",border:"1px solid #091828",borderRadius:6,padding:"clamp(8px,2vw,10px)",fontSize:"clamp(10px,2.5vw,12px)",color:"#8aaabb",cursor:"pointer"},
  confirmBtn:{background:"linear-gradient(135deg,#003388,#0088cc)",border:"none",borderRadius:8,padding:"clamp(9px,2.5vw,11px) clamp(16px,4vw,20px)",color:"#fff",fontSize:"clamp(12px,3vw,14px)",fontWeight:700,cursor:"pointer"},
  questCard:{display:"flex",alignItems:"center",gap:"clamp(8px,2vw,12px)",background:"linear-gradient(135deg,rgba(6,24,40,0.93),rgba(10,34,64,0.87))",border:"1px solid",borderRadius:10,padding:"clamp(10px,2.5vw,13px) clamp(11px,3vw,14px)",transition:"all .3s"},
  checkBtn:{width:"clamp(22px,5vw,26px)",height:"clamp(22px,5vw,26px)",borderRadius:"50%",border:"2px solid",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"},
  delBtn:{background:"transparent",border:"none",color:"#4a5a65",cursor:"pointer",fontSize:"clamp(13px,3.5vw,16px)",padding:"4px 6px",flexShrink:0},
  statBox:{background:"linear-gradient(135deg,#061828,#09203a)",border:"1px solid rgba(0,212,255,0.07)",borderRadius:9,padding:"clamp(9px,2.5vw,12px) clamp(6px,2vw,10px)",textAlign:"center"},
  statVal:{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(10px,2.5vw,13px)",color:"#00d4ff",marginBottom:2},
  filterBtn:{background:"transparent",border:"1px solid #091828",borderRadius:6,padding:"clamp(5px,1.5vw,7px) clamp(9px,2.5vw,13px)",fontSize:"clamp(10px,2.5vw,12px)",color:"#8aaabb",cursor:"pointer"},
  filterBtnA:{borderColor:"rgba(0,212,255,0.2)",color:"#00d4ff",background:"rgba(0,212,255,0.03)"},
  cheatBtn:{background:"transparent",border:"1px solid rgba(255,68,0,0.2)",borderRadius:5,padding:"clamp(4px,1.5vw,6px) clamp(8px,2.5vw,12px)",fontSize:"clamp(9px,2.5vw,11px)",color:"#ff6644",cursor:"pointer"},
};

// ══════════════════════════════════════════════════════════════════
// LEVEL & TITLE SYSTEM
// ══════════════════════════════════════════════════════════════════
function xpForLevel(n) {
  if(n<=1) return 0;
  return Math.floor(150*(n-1) + 30*(n-1)*(n-2));
}
function getLevelInfo(xp) {
  let lv = 1; while (xpForLevel(lv + 1) <= xp) lv++;
  const cur = xpForLevel(lv), nxt = xpForLevel(lv + 1);
  return { lv, cur, nxt, progress: ((xp - cur) / (nxt - cur)) * 100 };
}
function dailyLimit(lv, vocation) { return Math.floor((lv - 1) / 10) + 3 + getRewardLimitBonus(vocation); }

// ══════════════════════════════════════════════════════════════════
// CONSTELLATION SYSTEM
// ══════════════════════════════════════════════════════════════════
const RARITY = {
  common:    { label: "일반",  color: "#dddddd", bg: "#16161e", glowColor: "rgba(255,255,255,0.2)", stars: 1 },
  uncommon:  { label: "희귀",  color: "#44cc44", bg: "#091409", glowColor: "rgba(68,204,68,0.2)", stars: 2 },
  rare:      { label: "레어",  color: "#4488ff", bg: "#07091a", glowColor: "rgba(68,136,255,0.27)", stars: 3 },
  epic:      { label: "에픽",  color: "#aa44ff", bg: "#0d0418", glowColor: "rgba(170,68,255,0.33)", stars: 4 },
  legendary: { label: "전설",  color: "#ff8800", bg: "#1a1100", glowColor: "rgba(255,136,0,0.4)", stars: 5 },
  mythic:    { label: "???",   color: "#ff2222", bg: "#1a0000", glowColor: "rgba(255,34,34,0.47)", stars: 6 },
};
const RARITY_ORDER = ["common","uncommon","rare","epic","legendary","mythic"];

// 별자리 목록
const CONSTELLATIONS = [
  // 일반 (12)
  { id:"c01", name:"큰곰",         rarity:"common",    desc:"밤하늘의 큰 곰.",          bonus:"xp",   bonusVal:3  },
  { id:"c02", name:"작은곰",       rarity:"common",    desc:"북극성을 품은 작은 곰.",    bonus:"shard", bonusVal:3  },
  { id:"c03", name:"까마귀",       rarity:"common",    desc:"지혜를 상징하는 새.",       bonus:"xp",   bonusVal:3  },
  { id:"c04", name:"컵",           rarity:"common",    desc:"신들의 술잔.",             bonus:"shard", bonusVal:3  },
  { id:"c05", name:"화살",         rarity:"common",    desc:"정확함을 상징하는 화살.",   bonus:"xp",   bonusVal:3  },
  { id:"c06", name:"방패",         rarity:"common",    desc:"수호를 상징하는 방패.",     bonus:"shard", bonusVal:3  },
  { id:"c07", name:"도마뱀",       rarity:"common",    desc:"민첩함의 상징.",           bonus:"xp",   bonusVal:3  },
  { id:"c08", name:"살쾡이",       rarity:"common",    desc:"예리한 눈을 가진 짐승.",   bonus:"shard", bonusVal:3  },
  { id:"c09", name:"작은여우",     rarity:"common",    desc:"꾀 많은 여우.",            bonus:"xp",   bonusVal:3  },
  { id:"c10", name:"비둘기",       rarity:"common",    desc:"평화를 전하는 새.",        bonus:"shard", bonusVal:3  },
  { id:"c11", name:"토끼",         rarity:"common",    desc:"빠르고 영리한 토끼.",      bonus:"xp",   bonusVal:3  },
  { id:"c12", name:"돌고래",       rarity:"common",    desc:"바다의 사자.",             bonus:"shard", bonusVal:3  },
  // 희귀 - 황도 12궁 (12)
  { id:"u01", name:"양",           rarity:"uncommon",  desc:"황도 12궁의 첫 번째.",     bonus:"xp",   bonusVal:8  },
  { id:"u02", name:"황소",         rarity:"uncommon",  desc:"강인함의 상징.",           bonus:"shard", bonusVal:8  },
  { id:"u03", name:"쌍둥이",       rarity:"uncommon",  desc:"이중성을 지닌 존재.",      bonus:"xp",   bonusVal:8  },
  { id:"u04", name:"게",           rarity:"uncommon",  desc:"단단한 껍질의 수호자.",    bonus:"shard", bonusVal:8  },
  { id:"u05", name:"사자",         rarity:"uncommon",  desc:"황도 12궁의 왕.",          bonus:"xp",   bonusVal:8  },
  { id:"u06", name:"처녀",         rarity:"uncommon",  desc:"지혜와 순수함의 상징.",    bonus:"shard", bonusVal:8  },
  { id:"u07", name:"천칭",         rarity:"uncommon",  desc:"균형과 정의의 상징.",      bonus:"xp",   bonusVal:8  },
  { id:"u08", name:"전갈",         rarity:"uncommon",  desc:"강력한 독을 지닌 존재.",   bonus:"shard", bonusVal:8  },
  { id:"u09", name:"궁수",         rarity:"uncommon",  desc:"먼 곳을 겨누는 사수.",     bonus:"xp",   bonusVal:8  },
  { id:"u10", name:"염소",         rarity:"uncommon",  desc:"인내와 끈기의 상징.",      bonus:"shard", bonusVal:8  },
  { id:"u11", name:"물병",         rarity:"uncommon",  desc:"지식을 나누는 자.",        bonus:"xp",   bonusVal:8  },
  { id:"u12", name:"물고기",       rarity:"uncommon",  desc:"깊은 곳을 유영하는 자.",   bonus:"shard", bonusVal:8  },
  // 레어 - 신화 속 영웅 (7)
  { id:"r01", name:"페르세우스",   rarity:"rare",      desc:"메두사를 쓰러뜨린 영웅.",  bonus:"xp",   bonusVal:15 },
  { id:"r02", name:"헤라클레스",   rarity:"rare",      desc:"12가지 과업을 완수한 자.", bonus:"shard", bonusVal:15 },
  { id:"r03", name:"안드로메다",   rarity:"rare",      desc:"사슬에서 풀려난 공주.",    bonus:"xp",   bonusVal:15 },
  { id:"r04", name:"카시오페이아", rarity:"rare",      desc:"허영심 강한 왕비.",        bonus:"shard", bonusVal:15 },
  { id:"r05", name:"케페우스",     rarity:"rare",      desc:"에티오피아의 왕.",         bonus:"xp",   bonusVal:15 },
  { id:"r06", name:"페가수스",     rarity:"rare",      desc:"하늘을 나는 천마.",        bonus:"shard", bonusVal:15 },
  { id:"r07", name:"오리온",       rarity:"rare",      desc:"최강의 사냥꾼.",           bonus:"xp",   bonusVal:15 },
  // 에픽 - 신화 속 강력한 존재 (6)
  { id:"e01", name:"히드라",       rarity:"epic",      desc:"머리가 잘려도 다시 자라는 괴물.", bonus:"xp",   bonusVal:25 },
  { id:"e02", name:"켄타우로스",   rarity:"epic",      desc:"인간과 말의 혼합 존재.",   bonus:"shard", bonusVal:25 },
  { id:"e03", name:"용",           rarity:"epic",      desc:"하늘을 지배하는 존재.",    bonus:"xp",   bonusVal:25 },
  { id:"e04", name:"봉황",         rarity:"epic",      desc:"불사조, 재생의 상징.",     bonus:"shard", bonusVal:25 },
  { id:"e05", name:"고래",         rarity:"epic",      desc:"바다를 지배하는 거대한 존재.", bonus:"xp", bonusVal:25 },
  { id:"e06", name:"독수리",       rarity:"epic",      desc:"제우스의 사자.",           bonus:"shard", bonusVal:25 },
  // 전설 - 특별한 별 (5)
  { id:"l01", name:"북극성",       rarity:"legendary", desc:"모든 항해자의 길잡이.",    bonus:"xp",   bonusVal:40 },
  { id:"l02", name:"남십자성",     rarity:"legendary", desc:"남반구의 수호자.",         bonus:"shard", bonusVal:40 },
  { id:"l03", name:"오리온 벨트",  rarity:"legendary", desc:"세 별이 일직선으로 빛난다.", bonus:"xp", bonusVal:40 },
  { id:"l04", name:"여름 대삼각형",rarity:"legendary", desc:"여름밤을 밝히는 세 별.",   bonus:"shard", bonusVal:40 },
  { id:"l05", name:"겨울 대삼각형",rarity:"legendary", desc:"겨울밤을 수놓는 세 별.",   bonus:"xp",   bonusVal:40 },
  // 신화 - 잊혀진 별자리 (9) - ???로 표시
  { id:"m01", name:"총애의 낙인",   rarity:"mythic",   desc:"황제의 눈물이 만들어낸 별.", bonus:"xp",   bonusVal:80 },
  { id:"m02", name:"잿더미의 왕좌", rarity:"mythic",   desc:"멸망한 제국의 마지막 흔적.", bonus:"shard", bonusVal:80 },
  { id:"m03", name:"꺾인 왕의 지팡이",rarity:"mythic", desc:"권위를 잃은 왕의 유물.",   bonus:"xp",   bonusVal:80 },
  { id:"m04", name:"하룻밤의 꽃",   rarity:"mythic",   desc:"덧없이 사라진 아름다움.",  bonus:"shard", bonusVal:80 },
  { id:"m05", name:"망각의 근원",   rarity:"mythic",   desc:"모든 것이 시작된 곳.",     bonus:"xp",   bonusVal:80 },
  { id:"m06", name:"잠든 문명의 강",rarity:"mythic",   desc:"고대 문명이 잠든 강.",     bonus:"shard", bonusVal:80 },
  { id:"m07", name:"피로 물든 급류",rarity:"mythic",   desc:"수많은 전쟁을 목격한 강.", bonus:"xp",   bonusVal:80 },
  { id:"m08", name:"사라진 낙원",   rarity:"mythic",   desc:"인류가 잃어버린 이상향.",  bonus:"shard", bonusVal:80 },
  { id:"m09", name:"신성한 경계선", rarity:"mythic",   desc:"성과 속을 나누는 경계.",   bonus:"xp",   bonusVal:80 },
];

// 확률 설정
const GACHA_RATES = [
  { rarity:"common",    rate:50 },
  { rarity:"uncommon",  rate:28 },
  { rarity:"rare",      rate:15 },
  { rarity:"epic",      rate:5  },
  { rarity:"legendary", rate:1.5 },
  { rarity:"mythic",    rate:0.5 },
];
const CEILING_LEGENDARY = 50;
const CEILING_MYTHIC    = 400;
const SHARD_PER_QUEST   = 5;
const GACHA_SINGLE_COST = 10;
const GACHA_MULTI_COST  = 100;

function rollGacha(pityCount, pityMythic, rates, legCeiling) {
  const lCeil = legCeiling || CEILING_LEGENDARY;
  if (pityMythic + 1 >= CEILING_MYTHIC) return "mythic";
  if (pityCount + 1 >= lCeil) return "legendary";
  const useRates = rates || GACHA_RATES;
  const roll = Math.random() * 100;
  let acc = 0;
  for (const { rarity, rate } of useRates) {
    acc += rate;
    if (roll < acc) return rarity;
  }
  return "common";
}

function pickConstellationOfRarity(rarity, owned) {
  const pool = CONSTELLATIONS.filter(c => c.rarity === rarity);
  const unowned = pool.filter(c => !owned.includes(c.id));
  if (unowned.length > 0) return unowned[Math.floor(Math.random() * unowned.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ══════════════════════════════════════════════════════════════════
// VOCATION (전직) SYSTEM
// ══════════════════════════════════════════════════════════════════
const VOCATION_TREE = {
  none:       { name:"별빛 방랑자",   icon:"✦",  color:"#aaaaaa", abilities:[] },
  seeker:     { name:"성자",          icon:"⭐", color:"#dddddd", abilities:[] },
  warrior:    { name:"성전사",        icon:"⚔️", color:"#4488ff", abilities:["던전 보상 ×1.2"] },
  priest:     { name:"성직자",        icon:"🔮", color:"#aa44ff", abilities:["별빛 조각 ×1.2"] },
  star_knight:{ name:"별의 기사",     icon:"⚔️", color:"#4488ff", abilities:["던전 보상 ×1.4","잊혀진 던전 -1시간"] },
  star_guard: { name:"성좌 검사",     icon:"⚔️", color:"#4488ff", abilities:["던전 보상 ×1.4","던전 쿨타임 6시간"] },
  star_sage:  { name:"별의 사제",     icon:"🔮", color:"#aa44ff", abilities:["별빛 조각 ×1.4","천장 -10회"] },
  star_oracle:{ name:"성좌 현자",     icon:"🔮", color:"#aa44ff", abilities:["별빛 조각 ×1.4","소환 비용 -10%"] },
  star_guardian:{ name:"별의 수호자", icon:"⚔️", color:"#ff8800", abilities:["던전 보상 ×1.6","일일 보상 한도 +1"] },
  star_lord:  { name:"성좌 지배자",   icon:"⚔️", color:"#ff8800", abilities:["던전 보상 ×1.6","기여 퀘스트 효과 ×2"] },
  star_prophet:{ name:"별의 예언자",  icon:"🔮", color:"#ff8800", abilities:["별빛 조각 ×1.6","에픽 이상 확률 ↑"] },
  star_divine:{ name:"성좌 신탁자",   icon:"🔮", color:"#ff8800", abilities:["별빛 조각 ×1.6","일일 보상 한도 +1"] },
  star_god:   { name:"별자리의 신",   icon:"★",  color:"#ff2222", abilities:["던전 보상 ×2.5","잊혀진 던전 주 5회"] },
  star_avatar:{ name:"별자리의 현신", icon:"★",  color:"#ff2222", abilities:["별빛 조각 ×2.0","가챠 최고 확률"] },
};

const WARRIOR_BRANCH = ["warrior","star_knight","star_guard","star_guardian","star_lord","star_god"];
const PRIEST_BRANCH  = ["priest","star_sage","star_oracle","star_prophet","star_divine","star_avatar"];

function getDungeonBonus(vocation) {
  if (vocation==="star_god")                             return 2.5;
  if (["star_guardian","star_lord"].includes(vocation)) return 1.6;
  if (["star_knight","star_guard"].includes(vocation))  return 1.4;
  if (vocation==="warrior")                             return 1.2;
  return 1.0;
}
function getDungeonDuration(vocation) {
  return vocation==="star_guard" ? 6*3600*1000 : 8*3600*1000;
}
function getContribMultiplier(vocation) {
  return vocation==="star_lord" ? 2 : 1;
}
function getRewardLimitBonus(vocation) {
  return ["star_guardian","star_divine"].includes(vocation) ? 1 : 0;
}
function getForgottenDungeonHours(vocation) {
  return vocation==="star_knight" ? 4 : FORGOTTEN_DUNGEON.focusHoursRequired;
}
function getForgottenWeeklyLimit(vocation) {
  return vocation==="star_god" ? 5 : FORGOTTEN_DUNGEON.weeklyLimit;
}
function getGachaCost(vocation, base) {
  return vocation==="star_oracle" ? Math.floor(base*0.9) : base;
}
function getLegendaryCeiling(vocation) {
  return vocation==="star_sage" ? CEILING_LEGENDARY-10 : CEILING_LEGENDARY;
}
function getShardBonus(vocation) {
  if (vocation==="star_avatar")                                  return 2.0;
  if (["star_prophet","star_divine"].includes(vocation))        return 1.6;
  if (["star_sage","star_oracle"].includes(vocation))           return 1.4;
  if (vocation==="priest")                                       return 1.2;
  return 1.0;
}
function getGachaRates(vocation) {
  const base=[{rarity:"common",rate:50},{rarity:"uncommon",rate:28},{rarity:"rare",rate:15},{rarity:"epic",rate:5},{rarity:"legendary",rate:1.5},{rarity:"mythic",rate:0.5}];
  if (vocation==="star_avatar")
    return [{rarity:"common",rate:35},{rarity:"uncommon",rate:27},{rarity:"rare",rate:24},{rarity:"epic",rate:10},{rarity:"legendary",rate:2.5},{rarity:"mythic",rate:1.0}];
  if (["star_prophet","star_divine"].includes(vocation))
    return [{rarity:"common",rate:40},{rarity:"uncommon",rate:28},{rarity:"rare",rate:22},{rarity:"epic",rate:8},{rarity:"legendary",rate:1.5},{rarity:"mythic",rate:0.5}];
  if (["star_sage","star_oracle"].includes(vocation))
    return [{rarity:"common",rate:45},{rarity:"uncommon",rate:30},{rarity:"rare",rate:18},{rarity:"epic",rate:5},{rarity:"legendary",rate:1.5},{rarity:"mythic",rate:0.5}];
  if (vocation==="priest")
    return [{rarity:"common",rate:47},{rarity:"uncommon",rate:31},{rarity:"rare",rate:15},{rarity:"epic",rate:5},{rarity:"legendary",rate:1.5},{rarity:"mythic",rate:0.5}];
  return base;
}
function getVocationTitle(vocation, mainConstName) {
  const v = VOCATION_TREE[vocation || "none"];
  const prefix = mainConstName ? mainConstName + " " : "";
  return prefix + v.name;
}

// ══════════════════════════════════════════════════════════════════
// QUEST / PRIORITY / CATEGORIES
// ══════════════════════════════════════════════════════════════════
const PRIO = [
  { key:"high", label:"긴급", color:"#ff4d6d", glow:"rgba(255,77,109,0.33)", xp:180 },
  { key:"mid",  label:"일반", color:"#00d4ff", glow:"rgba(0,212,255,0.27)", xp:120 },
  { key:"low",  label:"여유", color:"#7b61ff", glow:"rgba(123,97,255,0.27)", xp:80  },
];
const CATS = ["🗡️ 업무","📚 학습","🏃 건강","🌱 성장","⚙️ 기타"];

// ══════════════════════════════════════════════════════════════════
// DUNGEONS
// ══════════════════════════════════════════════════════════════════
const DUNGEONS = [
  {
    id:"study", name:"나머지 공부 던전", icon:"📚", tag:"📚 학습",
    desc:"학습 퀘스트를 완료해 별빛 조각을 획득하세요.",
    duration: 8 * 60 * 60 * 1000,
    baseXp:200, baseShard:20,
    dropTable:[["uncommon",28,7],["rare",13,4],["epic",3,2],["legendary",1,0.5]],
  },
  {
    id:"body", name:"신체 강화 던전", icon:"🏃", tag:"🏃 건강",
    desc:"건강 퀘스트를 완료해 별빛 조각을 획득하세요.",
    duration: 8 * 60 * 60 * 1000,
    baseXp:200, baseShard:20,
    dropTable:[["uncommon",28,7],["rare",13,4],["epic",3,2],["legendary",1,0.5]],
  },
];

const FORGOTTEN_DUNGEON = {
  id:"forgotten", name:"잊혀진 던전", icon:"🌑",
  desc:"잊혀진 별자리를 보유한 자만 입장할 수 있는 던전.",
  focusHoursRequired: 5,
  weeklyLimit: 3,
  ancientShardReward: 1,
  nameUnlockRequired: 6,
};

// ══════════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════════
const ACHIEVEMENTS = [
  { id:"first",     icon:"⚔️", name:"첫 출정",       desc:"첫 퀘스트 완료",           cond:s=>s.totalDone>=1 },
  { id:"ten",       icon:"🔟", name:"10개 완료",      desc:"퀘스트 10개 완료",         cond:s=>s.totalDone>=10 },
  { id:"streak3",   icon:"🔥", name:"3일 연속",       desc:"3일 연속 스트릭",          cond:s=>s.streak>=3 },
  { id:"streak7",   icon:"🌟", name:"일주일 전사",    desc:"7일 연속 스트릭",          cond:s=>s.streak>=7 },
  { id:"lv5",       icon:"🎖️", name:"레벨 5",        desc:"레벨 5 이상 도달",         cond:s=>s.lv>=5 },
  { id:"lv10",      icon:"🏆", name:"레벨 10",       desc:"레벨 10 이상 도달",        cond:s=>s.lv>=10 },
  { id:"firstConst",icon:"⭐", name:"첫 별자리",      desc:"첫 별자리 획득",           cond:s=>s.constCount>=1 },
  { id:"rare",      icon:"💫", name:"레어 성자",      desc:"레어 이상 별자리 획득",    cond:s=>s.hasRare },
  { id:"mythic",    icon:"🔴", name:"잊혀진 자",      desc:"신화 별자리 획득",         cond:s=>s.hasMythic },
  { id:"dungeon1",  icon:"🏰", name:"던전 개척자",    desc:"던전 1회 완료",            cond:s=>s.dungeonClears>=1 },
  { id:"rich",      icon:"✨", name:"별빛 수집가",    desc:"별빛 조각 500개 보유",     cond:s=>s.starShards>=500 },
  { id:"gacha10",   icon:"🎰", name:"소환사",         desc:"뽑기 10회 완료",           cond:s=>s.totalGacha>=10 },
];

// ══════════════════════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════════════════════
const SK = "dq_v8";
function load() { try { return JSON.parse(localStorage.getItem(SK)||"null"); } catch { return null; } }
function save(s) { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} }
function todayStr() { return new Date().toISOString().slice(0,10); }
function tomorrowStr() { const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); }
function isWeekend() { const d=new Date().getDay(); return d===0||d===6; }
function weekStr() { const d=new Date(); const day=d.getDay(); const diff=d.getDate()-day+(day===0?-6:1); const mon=new Date(d.setDate(diff)); return mon.toISOString().slice(0,10); }

const DEF = {
  quests:[], scheduledQuests:[],
  totalXp:0, starShards:0,
  totalDone:0, timersDone:0,
  streak:0, lastActiveDate:null,
  todayRewardCount:0, lastRewardDate:null,
  unlockedAch:[], calendarData:{},
  // 별자리
  ownedConstellations:[], // [{id, obtainedAt, nameUnlocked}]
  mainConstId:null,
  pityCount:0, pityMythic:0,
  totalGacha:0,
  // 계승
  pendingInheritance:null, // {newConstId}
  // 전직
  vocation:"none",
  vocationChoicePending:false, // Lv.10 전직 선택 대기
  vocation2ChoicePending:false,
  vocation3ChoicePending:false,
  // 던전
  activeDungeon:null,
  dungeonClears:0,
  dungeonHistory:[],
  // 잊혀진 던전
  ancientShards:{}, // {constId: count}
  forgottenDungeonWeek:null,
  forgottenDungeonUsed:0,
  forgottenFocusSecs:0, // 이번 입장에서 누적 집중 시간(초)
  forgottenActive:false,
  forgottenWeekendOverride:false,
  // 신전 시스템
  shinjeon: null,       // 가입한 신전 정보 {id, name, desc, isPublic, leaderId, members:[]}
  sungryeok: 0,         // 누적 성력
  weeklySungryeok: 0,   // 주간 성력 (랭킹용)
  sungryeokWeek: null,  // 주간 리셋 기준
  nickname: "",         // 유저 닉네임
  onboardingDone: false,
  tutorialStep: 0,   // 0=미시작 1~4=진행중 5=완료
  tutorialDone: false,
  tutorialRewardGiven: false,
  shinjeonTooltipSeen: false,
};

let _id = 1000;

// ══════════════════════════════════════════════════════════════════
// CONSTELLATION DISPLAY (SVG)
// ══════════════════════════════════════════════════════════════════
// 별자리별 실제 별 좌표 (0~100 스케일) + 연결선
// 실제 별자리 모양을 최대한 근사하게 표현
const CONST_DATA = {
  // ── 일반 ──────────────────────────────────────────
  c01: { // 큰곰 (Big Dipper 7개 + 앞다리)
    pts:[[20,35],[32,30],[48,28],[62,25],[75,30],[82,42],[70,48],[55,52],[40,55],[28,50]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3],[6,7],[7,8],[8,9],[9,0]],
  },
  c02: { // 작은곰 (Little Dipper)
    pts:[[50,15],[55,25],[52,38],[48,50],[35,60],[25,55],[30,45]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  c03: { // 까마귀 (4각형)
    pts:[[30,40],[55,30],[70,45],[60,65],[35,62]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,0],[1,3]],
  },
  c04: { // 컵 (컵 모양)
    pts:[[40,25],[60,25],[65,45],[70,65],[55,75],[45,75],[30,65],[35,45]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[2,7]],
  },
  c05: { // 화살 (직선+화살촉)
    pts:[[15,50],[35,50],[55,50],[75,50],[90,50],[80,40],[80,60]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[4,6]],
  },
  c06: { // 방패 (사각형+대각선)
    pts:[[25,25],[75,25],[75,75],[25,75],[50,50]],
    lines:[[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]],
  },
  c07: { // 도마뱀 (지그재그)
    pts:[[15,50],[28,35],[42,50],[55,35],[68,50],[80,35],[90,50]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  },
  c08: { // 살쾡이 (구불구불)
    pts:[[15,40],[25,55],[38,42],[50,58],[63,40],[75,55],[88,42]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  },
  c09: { // 작은여우 (삼각형+꼬리)
    pts:[[50,20],[35,55],[65,55],[50,20],[20,70],[35,55]],
    lines:[[0,1],[1,2],[2,0],[1,4]],
  },
  c10: { // 비둘기 (날개형)
    pts:[[50,50],[30,35],[15,40],[35,55],[50,50],[65,35],[85,40],[70,55]],
    lines:[[0,1],[1,2],[2,3],[3,0],[0,5],[5,6],[6,7],[7,0]],
  },
  c11: { // 토끼 (두 귀+몸통)
    pts:[[35,20],[30,40],[50,50],[70,40],[65,20],[50,65],[40,75],[60,75]],
    lines:[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,5]],
  },
  c12: { // 돌고래 (마름모+꼬리)
    pts:[[50,25],[65,40],[50,55],[35,40],[50,25],[60,70],[40,70]],
    lines:[[0,1],[1,2],[2,3],[3,0],[2,5],[2,6]],
  },
  // ── 희귀 - 황도 12궁 ────────────────────────────
  u01: { // 양 (V자+별)
    pts:[[50,20],[35,40],[20,55],[30,55],[50,45],[70,55],[80,55],[65,40]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,7]],
  },
  u02: { // 황소 (V자+뿔)
    pts:[[50,60],[30,45],[15,30],[25,20],[30,45],[70,45],[85,30],[75,20]],
    lines:[[0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[6,7]],
  },
  u03: { // 쌍둥이 (두 사람 나란히)
    pts:[[30,15],[30,35],[25,55],[35,70],[40,55],[35,35],[60,15],[65,35],[60,55],[70,70],[75,55],[65,35]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,1],[6,7],[7,8],[8,9],[9,10],[10,11],[11,7],[1,7]],
  },
  u04: { // 게 (집게발+몸통)
    pts:[[50,50],[35,40],[20,30],[25,20],[35,40],[65,40],[80,30],[75,20],[35,60],[65,60]],
    lines:[[0,1],[1,2],[2,3],[0,5],[5,6],[6,7],[0,8],[0,9],[8,9]],
  },
  u05: { // 사자 (낫+삼각형)
    pts:[[45,20],[50,35],[55,50],[70,60],[85,55],[85,70],[70,75],[55,70],[40,60],[25,50],[20,35],[30,25]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,0],[3,8]],
  },
  u06: { // 처녀 (Y자형)
    pts:[[50,15],[50,35],[35,55],[20,70],[35,55],[65,55],[80,70],[50,70],[50,85]],
    lines:[[0,1],[1,2],[2,3],[2,5],[5,6],[1,7],[7,8]],
  },
  u07: { // 천칭 (저울)
    pts:[[50,20],[50,45],[25,65],[75,65],[25,80],[75,80]],
    lines:[[0,1],[1,2],[1,3],[2,3],[2,4],[3,5],[4,5]],
  },
  u08: { // 전갈 (S자+집게)
    pts:[[50,15],[50,30],[45,45],[35,55],[30,65],[35,75],[45,80],[55,75],[60,65],[55,55],[45,45],[30,35],[20,25]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[1,11],[11,12]],
  },
  u09: { // 궁수 (활+화살)
    pts:[[50,20],[40,40],[25,55],[30,70],[45,65],[50,50],[60,35],[75,25],[80,40],[70,55],[55,60]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,5],[0,6]],
  },
  u10: { // 염소 (뿔+꼬리)
    pts:[[50,20],[35,35],[20,40],[30,55],[50,50],[70,55],[80,40],[65,35],[50,60],[40,75],[60,75]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[4,8],[8,9],[8,10]],
  },
  u11: { // 물병 (물결선)
    pts:[[20,40],[35,30],[50,40],[65,30],[80,40],[20,55],[35,65],[50,55],[65,65],[80,55]],
    lines:[[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9],[2,7]],
  },
  u12: { // 물고기 (두 물고기+끈)
    pts:[[25,30],[15,45],[25,60],[35,45],[25,30],[75,30],[85,45],[75,60],[65,45],[75,30],[50,45]],
    lines:[[0,1],[1,2],[2,3],[3,0],[5,6],[6,7],[7,8],[8,5],[3,10],[8,10]],
  },
  // ── 레어 - 신화 속 영웅 ──────────────────────────
  r01: { // 페르세우스
    pts:[[50,15],[40,30],[30,45],[20,55],[35,60],[45,50],[55,40],[65,30],[75,20],[60,35],[55,55],[65,70]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[1,9],[9,5],[5,10],[10,11]],
  },
  r02: { // 헤라클레스 (곤봉+팔다리)
    pts:[[50,20],[45,35],[35,45],[25,40],[20,55],[35,55],[50,50],[65,55],[80,55],[75,40],[65,45],[55,35]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,1],[2,6]],
  },
  r03: { // 안드로메다 (사슬형)
    pts:[[15,50],[30,40],[45,35],[60,30],[75,25],[85,35],[80,50],[70,60],[55,65],[40,60],[25,65]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,0]],
  },
  r04: { // 카시오페이아 (W자)
    pts:[[10,40],[25,20],[50,40],[75,20],[90,40]],
    lines:[[0,1],[1,2],[2,3],[3,4]],
  },
  r05: { // 케페우스 (집 모양)
    pts:[[50,15],[75,35],[70,65],[30,65],[25,35],[50,15]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,0],[1,4],[2,3]],
  },
  r06: { // 페가수스 (큰 사각형+목)
    pts:[[20,40],[20,70],[80,70],[80,40],[55,25],[45,15],[35,20]],
    lines:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]],
  },
  r07: { // 오리온 (모래시계+벨트+무기)
    pts:[[30,20],[70,20],[50,35],[50,50],[50,65],[30,80],[70,80],[15,50],[85,50],[35,50],[65,50]],
    lines:[[0,2],[1,2],[2,3],[3,4],[4,5],[4,6],[7,9],[9,10],[10,8],[3,9],[3,10]],
  },
  // ── 에픽 ────────────────────────────────────────
  e01: { // 히드라 (긴 S자)
    pts:[[15,50],[20,40],[30,35],[40,40],[50,35],[60,40],[70,35],[80,40],[90,35],[85,50],[75,60],[65,55],[55,60],[45,55]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,3]],
  },
  e02: { // 켄타우로스 (사람+말)
    pts:[[40,15],[30,30],[20,45],[30,55],[45,50],[55,45],[50,30],[60,45],[75,55],[85,45],[80,30],[70,20]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[5,7],[7,8],[8,9],[9,10],[10,11],[11,6]],
  },
  e03: { // 용 (구불구불)
    pts:[[50,10],[60,20],[75,15],[80,30],[70,40],[55,38],[45,50],[35,62],[25,70],[15,75],[20,85],[35,80]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[0,5]],
  },
  e04: { // 봉황 (날개+꼬리)
    pts:[[50,25],[35,40],[15,35],[20,55],[40,55],[50,45],[60,55],[80,55],[85,35],[65,40],[50,65],[40,80],[60,80]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[5,10],[10,11],[10,12]],
  },
  e05: { // 고래 (타원형+꼬리)
    pts:[[20,50],[25,35],[40,25],[60,25],[75,35],[80,50],[75,65],[60,75],[40,75],[25,65],[20,50],[10,45],[10,55]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[0,11],[0,12]],
  },
  e06: { // 독수리 (날개 펼침)
    pts:[[50,50],[35,40],[20,35],[15,45],[30,50],[50,50],[65,40],[80,35],[85,45],[70,50],[50,30],[50,65]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,0],[0,6],[6,7],[7,8],[8,9],[9,0],[0,10],[0,11]],
  },
  // ── 전설 ────────────────────────────────────────
  l01: { // 북극성 (작은곰 꼬리 끝 + 주변 별들)
    pts:[[50,50],[50,35],[50,20],[35,28],[65,28],[42,45],[58,45],[35,50],[65,50]],
    lines:[[2,1],[1,0],[0,5],[0,6],[0,7],[0,8],[3,1],[4,1]],
  },
  l02: { // 남십자성 (십자)
    pts:[[50,15],[50,85],[15,50],[85,50],[50,50]],
    lines:[[0,4],[4,1],[2,4],[4,3]],
  },
  l03: { // 오리온 벨트 (3개 별 일직선)
    pts:[[20,50],[50,50],[80,50],[20,48],[50,48],[80,48]],
    lines:[[0,1],[1,2]],
  },
  l04: { // 여름 대삼각형
    pts:[[50,15],[15,70],[85,70],[50,50]],
    lines:[[0,3],[3,1],[1,2],[2,0],[0,1],[0,2]],
  },
  l05: { // 겨울 대삼각형
    pts:[[25,30],[75,30],[50,80],[50,55]],
    lines:[[0,3],[1,3],[3,2],[0,1],[1,2],[0,2]],
  },
  // ── 신화 - 공통 특별 모양 (잊혀진 별 느낌) ────────
  m01:{ pts:[[50,10],[62,40],[95,40],[70,60],[82,90],[50,72],[18,90],[30,60],[5,40],[38,40],[50,28],[50,55]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m02:{ pts:[[50,8],[60,38],[92,38],[67,58],[78,88],[50,70],[22,88],[33,58],[8,38],[40,38],[50,23],[50,53]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m03:{ pts:[[50,12],[61,40],[93,40],[68,59],[80,88],[50,71],[20,88],[32,59],[7,40],[39,40],[50,26],[50,56]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m04:{ pts:[[50,10],[60,38],[90,38],[68,57],[78,86],[50,69],[22,86],[32,57],[10,38],[40,38],[50,24],[50,52]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m05:{ pts:[[50,6],[62,36],[96,36],[70,58],[82,90],[50,72],[18,90],[30,58],[4,36],[38,36],[50,20],[50,54]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m06:{ pts:[[50,10],[61,39],[93,39],[68,58],[79,87],[50,70],[21,87],[32,58],[7,39],[39,39],[50,25],[50,54]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m07:{ pts:[[50,9],[60,37],[91,37],[67,57],[78,87],[50,70],[22,87],[33,57],[9,37],[40,37],[50,23],[50,53]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m08:{ pts:[[50,11],[61,40],[94,40],[69,59],[80,89],[50,71],[20,89],[31,59],[6,40],[39,40],[50,26],[50,55]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
  m09:{ pts:[[50,7],[61,37],[95,37],[69,57],[81,89],[50,71],[19,89],[31,57],[5,37],[39,37],[50,21],[50,53]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[10,2],[10,8],[11,3],[11,7]] },
};

function ConstellationSVG({ constId, rarity, color, size=80, animate=false }) {
  const data = CONST_DATA[constId] || CONST_DATA["c01"];
  const { pts, lines } = data;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setInterval(() => setTick(v=>v+1), 60);
    return () => clearInterval(t);
  }, [animate]);
  const pulse = animate ? 0.7 + Math.sin(tick*0.08)*0.3 : 1;
  const isMythic = rarity === "mythic";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <filter id={`glow_${constId}`}>
          <feGaussianBlur stdDeviation={isMythic?3:2} result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {lines.map(([a,b],i) => (
        <line key={i}
          x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
          stroke={color} strokeWidth={isMythic?"2":"1.5"} strokeOpacity={0.45*pulse}/>
      ))}
      {pts.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i===0?(isMythic?5:4):(isMythic?3:2.5)}
          fill={color} opacity={pulse}
          filter={animate?`url(#glow_${constId})`:"none"}/>
      ))}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// GACHA ANIMATION COMPONENT
// ══════════════════════════════════════════════════════════════════
function GachaResult({ results, onClose }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro | reveal | done
  const [tick, setTick] = useState(0);
  const stateRef = useRef({ idx:0, phase:"intro", locked:false });

  const result = results[stateRef.current.idx] ?? results[0];
  const r = RARITY[result.rarity];
  const isMythic = result.rarity === "mythic";

  // phase 진행 — idx ref 기준
  useEffect(() => {
    stateRef.current.phase = "intro";
    stateRef.current.locked = true;
    setPhase("intro");
    const t1 = setTimeout(() => {
      stateRef.current.phase = "reveal";
      setPhase("reveal");
    }, 800);
    const t2 = setTimeout(() => {
      stateRef.current.phase = "done";
      stateRef.current.locked = false;
      setPhase("done");
    }, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [idx]); // idx state가 바뀔 때만 재실행

  useEffect(() => {
    const t = setInterval(() => setTick(v=>v+1), 50);
    return () => clearInterval(t);
  }, []);

  function handleNext() {
    if (stateRef.current.locked) return; // 아직 애니메이션 중
    const nextIdx = stateRef.current.idx + 1;
    if (nextIdx >= results.length) { onClose(); return; }
    stateRef.current.idx = nextIdx;
    setIdx(nextIdx); // 리렌더 트리거
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"#000008" }}/>

      {/* 파티클 */}
      {Array.from({length:20}).map((_,i) => {
        const angle = (tick*(0.8+i*0.1)+i*18) % 360;
        const rad = angle*Math.PI/180;
        const dist = 80+i*14;
        const x = 50+Math.cos(rad)*dist/5;
        const y = 50+Math.sin(rad)*dist/8;
        return <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`,
          width:2+i%3, height:2+i%3, borderRadius:"50%", background:r.color,
          opacity:0.25+Math.sin(tick*0.05+i)*0.15, pointerEvents:"none", zIndex:1 }}/>;
      })}

      {/* 회전 링 */}
      {[160,220,280].map((size,i) => (
        <div key={i} style={{ position:"absolute", width:size, height:size,
          border:`1px solid ${r.color}${["55","33","22"][i]}`, borderRadius:"50%",
          transform:`rotate(${tick*(0.5-i*0.2)}deg)`,
          top:"50%", left:"50%", marginLeft:-size/2, marginTop:-size/2,
          pointerEvents:"none", zIndex:1 }}/>
      ))}

      {/* 진행 표시 (10연일 때) */}
      {results.length > 1 && (
        <div style={{ position:"absolute", top:24, display:"flex", gap:5, zIndex:3 }}>
          {results.map((res,i) => {
            const rc = RARITY[res.rarity];
            return <div key={i} style={{ width:8, height:8, borderRadius:"50%",
              background: i<=stateRef.current.idx ? rc.color : "#5a6570",
              boxShadow: i===stateRef.current.idx ? `0 0 6px ${rc.color}` : "none",
              transition:"all .3s" }}/>;
          })}
        </div>
      )}

      {/* 콘텐츠 */}
      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 20px" }}>
        {phase === "intro" && (
          <div style={{ animation:"gachaFadeIn 0.4s ease" }}>
            <div style={{ fontSize:52, filter:`drop-shadow(0 0 20px ${r.color})`,
              animation:"gachaPulse 0.5s ease-in-out infinite" }}>✦</div>
          </div>
        )}
        {(phase === "reveal" || phase === "done") && (
          <div style={{ animation:"gachaReveal 0.5s ease" }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:r.color,
              letterSpacing:4, marginBottom:10, textShadow:`0 0 16px ${r.color}` }}>
              [{r.label}]
            </div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:14,
              filter:`drop-shadow(0 0 10px ${r.color})` }}>
              <ConstellationSVG constId={result.id} rarity={result.rarity} color={r.color} size={110} animate={true}/>
            </div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:900,
              color:r.color, textShadow:`0 0 18px ${r.color}`, letterSpacing:2, marginBottom:6 }}>
              {isMythic ? "잊혀진 별" : result.name}
            </div>
            {isMythic && <div style={{ fontSize:10, color:r.color+"88", marginBottom:6, letterSpacing:2 }}>???의 힘이 깃들었습니다</div>}
            <div style={{ fontSize:9, color:"#8aa0b0", marginBottom:12 }}>{result.desc}</div>
            <div style={{ fontSize:10, color:"#c8e8ff", marginBottom:20 }}>
              {result.bonus==="xp" ? `⚡ XP +${result.bonusVal}%` : `✨ 별빛 조각 +${result.bonusVal}%`}
            </div>
            {phase === "done" && (
              <button style={{ background:`linear-gradient(135deg,${r.color}33,${r.color}11)`,
                border:`1px solid ${r.color}66`, borderRadius:8, padding:"9px 28px",
                color:r.color, fontSize:12, cursor:"pointer", fontFamily:"'Orbitron',sans-serif",
                letterSpacing:2 }} onClick={handleNext}>
                {stateRef.current.idx >= results.length-1 ? "확인" : `다음 (${stateRef.current.idx+1}/${results.length})`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DUNGEON SUMMON ANIMATION
// ══════════════════════════════════════════════════════════════════
function DungeonSummonAnim({ constId, constName, rarity, onDone }) {
  const [tick, setTick] = useState(0);
  const r = RARITY[rarity];
  useEffect(() => {
    const t = setInterval(() => setTick(v=>v+1), 50);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:550, background:"rgba(0,0,8,0.93)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      {[200,280,360].map((size,i) => (
        <div key={i} style={{ position:"absolute", width:size, height:size,
          border:`1px solid ${r.color}${["44","33","22"][i]}`, borderRadius:"50%",
          transform:`rotate(${tick*(0.6-i*0.2)}deg)`,
          top:"50%", left:"50%", marginLeft:-size/2, marginTop:-size/2 }}/>
      ))}
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:r.color+"88", letterSpacing:4, marginBottom:16 }}>DUNGEON</div>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:16,
        filter:`drop-shadow(0 0 16px ${r.color})` }}>
        <ConstellationSVG constId={constId} rarity={rarity} color={r.color} size={100} animate={true}/>
      </div>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, color:r.color,
        textShadow:`0 0 20px ${r.color}`, letterSpacing:3, marginBottom:8 }}>
        {constName}
      </div>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:r.color+"88", letterSpacing:2 }}>
        별자리를 강림시킵니다...
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// INHERITANCE POPUP
// ══════════════════════════════════════════════════════════════════
function InheritancePopup({ newConst, oldConst, ownedConsts, onAccept, onReject }) {
  const rNew = RARITY[newConst.rarity];
  const rOld = RARITY[oldConst?.rarity||"common"];
  const isMythic = newConst.rarity === "mythic";
  const newOwned = ownedConsts?.find(o=>o.id===newConst.id);
  const nameUnlocked = newOwned?.nameUnlocked;
  const displayName = isMythic && !nameUnlocked ? "잊혀진 별" : newConst.name;
  const oldDisplayName = oldConst ? (oldConst.rarity==="mythic" && !ownedConsts?.find(o=>o.id===oldConst.id)?.nameUnlocked ? "잊혀진 별" : oldConst.name) : "없음";
  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,8,20,0.8)",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"linear-gradient(160deg,#061828,#0a2040)",
        border:`1px solid ${rNew.color}66`, borderRadius:16, padding:"28px 24px",
        textAlign:"center", width:300, boxShadow:`0 0 40px ${rNew.glowColor}` }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:rNew.color,
          letterSpacing:3, marginBottom:12 }}>계승</div>
        <div style={{ fontSize:12, color:"#c8e8ff", marginBottom:16, lineHeight:1.7 }}>
          <span style={{ color:rNew.color, fontWeight:700 }}>{displayName}</span>이<br/>
          메인 별자리로 계승을 요청합니다.
        </div>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16,
          filter:`drop-shadow(0 0 8px ${rNew.color})` }}>
          <ConstellationSVG constId={newConst.id} rarity={newConst.rarity} color={rNew.color} size={80} animate={true}/>
        </div>
        {isMythic && !nameUnlocked && (
          <div style={{ fontSize:9, color:rNew.color+"88", marginBottom:10, letterSpacing:1 }}>
            잊혀진 던전을 클리어해 진짜 이름을 해금하세요
          </div>
        )}
        <div style={{ display:"flex", gap:8, alignItems:"center", justifyContent:"center", marginBottom:20 }}>
          <div style={{ fontSize:10, color:rOld.color }}>[{rOld.label}] {oldDisplayName}</div>
          <div style={{ fontSize:14, color:"#8aa0b0" }}>→</div>
          <div style={{ fontSize:10, color:rNew.color }}>[{rNew.label}] {displayName}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ flex:1, background:`linear-gradient(135deg,${rNew.color}33,${rNew.color}11)`,
            border:`1px solid ${rNew.color}66`, borderRadius:7, padding:"9px",
            color:rNew.color, cursor:"pointer", fontSize:11, fontFamily:"'Orbitron',sans-serif" }}
            onClick={onAccept}>수락</button>
          <button style={{ flex:1, background:"transparent", border:"1px solid #0a2030",
            borderRadius:7, padding:"9px", color:"#8aa0b0", cursor:"pointer", fontSize:11 }}
            onClick={onReject}>거부</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// VOCATION CHOICE POPUP
// ══════════════════════════════════════════════════════════════════
// 이름 해금 연출 팝업
function NameUnlockPopup({ constData, onClose }) {
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState("flash"); // flash → reveal
  const r = RARITY["mythic"];
  useEffect(() => {
    const t = setInterval(() => setTick(v=>v+1), 50);
    const t2 = setTimeout(() => setPhase("reveal"), 1200);
    return () => { clearInterval(t); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:700, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"#000" }}/>
      {/* 빨간 빛 파티클 */}
      {Array.from({length:30}).map((_,i) => {
        const angle = (tick*(1+i*0.08)+i*12) % 360;
        const rad = angle*Math.PI/180;
        const dist = 60+i*12;
        const x = 50+Math.cos(rad)*dist/4;
        const y = 50+Math.sin(rad)*dist/6;
        return <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`,
          width:3+i%3, height:3+i%3, borderRadius:"50%", background:"#ff2222",
          opacity:0.4+Math.sin(tick*0.06+i)*0.2, pointerEvents:"none", zIndex:1 }}/>;
      })}
      {[160,240,320].map((size,i) => (
        <div key={i} style={{ position:"absolute", width:size, height:size,
          border:`1px solid #ff2222${["66","44","22"][i]}`, borderRadius:"50%",
          transform:`rotate(${tick*(0.6-i*0.2)}deg)`,
          top:"50%", left:"50%", marginLeft:-size/2, marginTop:-size/2, zIndex:1 }}/>
      ))}
      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px" }}>
        {phase === "flash" && (
          <div style={{ animation:"gachaFadeIn 0.5s ease" }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:"rgba(255,34,34,0.53)",
              letterSpacing:6, marginBottom:16 }}>MEMORY RESTORED</div>
            <div style={{ fontSize:60, filter:"drop-shadow(0 0 24px #ff2222)",
              animation:"gachaPulse 0.5s ease-in-out infinite" }}>✦</div>
            <div style={{ fontSize:11, color:"rgba(255,34,34,0.4)", letterSpacing:3, marginTop:16 }}>
              잊혀진 별의 이름이 깨어나고 있습니다...
            </div>
          </div>
        )}
        {phase === "reveal" && (
          <div style={{ animation:"gachaReveal 0.6s ease" }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:"#ff2222",
              letterSpacing:4, marginBottom:12, textShadow:"0 0 16px #ff2222" }}>
              [신화] 이름 해금
            </div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16,
              filter:"drop-shadow(0 0 16px #ff2222)" }}>
              <ConstellationSVG constId={constData.id} rarity="mythic" color="#ff2222" size={120} animate={true}/>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,68,68,0.53)", marginBottom:8, letterSpacing:2 }}>
              잊혀진 별의 진짜 이름은...
            </div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:22, fontWeight:900,
              color:"#ff2222", textShadow:"0 0 24px #ff2222, 0 0 48px rgba(255,34,34,0.4)",
              letterSpacing:2, marginBottom:8 }}>
              {constData.name}
            </div>
            <div style={{ fontSize:10, color:"#8aa0b0", marginBottom:6 }}>{constData.desc}</div>
            <div style={{ fontSize:10, color:"rgba(255,68,68,0.53)", marginBottom:24, letterSpacing:1 }}>
              이제 칭호에 이름이 반영됩니다
            </div>
            <button style={{ background:"linear-gradient(135deg,rgba(255,34,34,0.2),rgba(255,34,34,0.07))",
              border:"1px solid rgba(255,34,34,0.4)", borderRadius:8, padding:"10px 32px",
              color:"#ff4444", fontSize:12, cursor:"pointer",
              fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}
              onClick={onClose}>확인</button>
          </div>
        )}
      </div>
    </div>
  );
}

function VocationChoicePopup({ level, options, onChoose }) {
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro → choose → flash
  const [chosen, setChosen] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTick(v=>v+1), 50);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setPhase("choose"), 1200);
    return () => clearTimeout(t);
  }, []);

  function handleChoose(opt) {
    setChosen(opt);
    setPhase("flash");
    setTimeout(() => onChoose(opt), 1800);
  }

  const isWarrior = options[0] && WARRIOR_BRANCH.includes(options[0]);
  const branchColor = isWarrior ? "#4488ff" : "#aa44ff";
  const chosenV = chosen ? VOCATION_TREE[chosen] : null;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600,
      background: phase==="flash" ? `${chosenV?.color}33` : "rgba(0,8,20,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center",
      transition:"background .3s", overflow:"hidden" }}>

      {/* 파티클 */}
      {phase !== "intro" && Array.from({length:20}).map((_,i) => {
        const col = chosen ? chosenV.color : (i%2===0?"#4488ff":"#aa44ff");
        const angle = (tick*(0.6+i*0.07)+i*18) % 360;
        const rad = angle*Math.PI/180;
        const x = 50+Math.cos(rad)*(60+i*12)/4;
        const y = 50+Math.sin(rad)*(60+i*12)/6;
        return <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`,
          width:2+i%3, height:2+i%3, borderRadius:"50%", background:col,
          opacity:0.2+Math.sin(tick*0.04+i)*0.1, pointerEvents:"none" }}/>;
      })}

      {/* 회전 링 */}
      {phase !== "intro" && [200,300].map((r,i) => (
        <div key={i} style={{ position:"absolute", width:r, height:r,
          border:`1px solid ${branchColor}${["22","14"][i]}`, borderRadius:"50%",
          transform:`rotate(${tick*(0.3-i*0.15)}deg)`,
          top:"50%", left:"50%", marginLeft:-r/2, marginTop:-r/2 }}/>
      ))}

      <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:400, padding:"0 16px" }}>

        {/* 인트로 */}
        {phase === "intro" && (
          <div style={{ textAlign:"center", animation:"focusIntro 0.5s ease" }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
              color:"rgba(0,212,255,0.6)", letterSpacing:5, marginBottom:12 }}>LV.{level}</div>
            <div style={{ fontSize:"clamp(28px,7vw,40px)",
              filter:"drop-shadow(0 0 16px #00d4ff)", marginBottom:12,
              animation:"gachaPulse 0.6s ease-in-out infinite" }}>✦</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(16px,4.5vw,22px)",
              color:"#00d4ff", textShadow:"0 0 20px #00d4ff88", letterSpacing:2 }}>
              전직 가능
            </div>
          </div>
        )}

        {/* 선택창 */}
        {phase === "choose" && (
          <div style={{ animation:"gachaFadeIn 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
                color:"rgba(0,212,255,0.6)", letterSpacing:4, marginBottom:6 }}>LV.{level} 전직</div>
              <div style={{ fontSize:"clamp(14px,4vw,17px)", color:"#c8e8ff", fontWeight:700 }}>
                계열을 선택하세요
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {options.map(opt => {
                const v = VOCATION_TREE[opt];
                const isWar = WARRIOR_BRANCH.includes(opt);
                const isHov = hovered === opt;
                return (
                  <div key={opt}
                    onMouseEnter={()=>setHovered(opt)}
                    onMouseLeave={()=>setHovered(null)}
                    onClick={()=>handleChoose(opt)}
                    style={{ flex:1, background:`linear-gradient(160deg,${v.color}18,${v.color}08)`,
                      border:`2px solid ${isHov?v.color:v.color+"55"}`,
                      borderRadius:14, padding:"16px 10px", cursor:"pointer",
                      textAlign:"center", transition:"all .2s",
                      boxShadow:isHov?`0 0 20px ${v.color}44`:"none",
                      transform:isHov?"scale(1.02)":"scale(1)" }}>
                    <div style={{ fontSize:"clamp(28px,7vw,36px)", marginBottom:8,
                      filter:`drop-shadow(0 0 8px ${v.color})` }}>{v.icon}</div>
                    <div style={{ fontFamily:"'Orbitron',sans-serif",
                      fontSize:"clamp(11px,3vw,13px)", fontWeight:900,
                      color:v.color, marginBottom:4, letterSpacing:1 }}>{v.name}</div>
                    <div style={{ fontSize:9, color:v.color+"88", marginBottom:10 }}>
                      {isWar ? "⚔️ 탐험 계열" : "🔮 수집 계열"}
                    </div>
                    <div style={{ borderTop:`1px solid ${v.color}22`, paddingTop:8 }}>
                      {v.abilities.map((ab,i)=>(
                        <div key={i} style={{ fontSize:"clamp(9px,2.5vw,10px)", color:"#c8e8ff",
                          marginBottom:4, display:"flex", alignItems:"center", gap:4, justifyContent:"center" }}>
                          <span style={{ color:v.color, fontSize:8 }}>▸</span>{ab}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign:"center", marginTop:12, fontSize:9, color:"#4a6070" }}>
              탭하여 선택 · 신중하게 고르세요
            </div>
          </div>
        )}

        {/* 선택 후 플래시 */}
        {phase === "flash" && chosenV && (
          <div style={{ textAlign:"center", animation:"gachaFadeIn 0.3s ease" }}>
            <div style={{ fontSize:"clamp(36px,10vw,52px)", marginBottom:12,
              filter:`drop-shadow(0 0 24px ${chosenV.color})`,
              animation:"gachaPulse 0.4s infinite" }}>{chosenV.icon}</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif",
              fontSize:"clamp(18px,5vw,26px)", fontWeight:900,
              color:chosenV.color, textShadow:`0 0 24px ${chosenV.color}88`,
              letterSpacing:2, marginBottom:8 }}>{chosenV.name}</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
              color:chosenV.color+"88", letterSpacing:4 }}>전직 완료</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LV.100 ASCENSION POPUP
// ══════════════════════════════════════════════════════════════════
function AscensionPopup({ branch, onChoose }) {
  const [phase, setPhase] = useState("dark");   // dark → text → choose → flash → done
  const [tick, setTick] = useState(0);
  const [chosen, setChosen] = useState(null);

  const isWarrior = branch === "warrior";
  const options = isWarrior
    ? { a:"star_god",    aName:"별자리의 신",   aDesc:"던전 보상 ×2.0 · 별자리의 의지를 검에 담다" }
    : { a:"star_avatar", aName:"별자리의 현신", aDesc:"별빛 조각 ×2.0 · 최고 가챠 확률 · 별자리 그 자체가 되다" };

  useEffect(() => {
    const t = setInterval(() => setTick(v=>v+1), 50);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1000);
    const t2 = setTimeout(() => setPhase("choose"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  function handleChoose(voc) {
    setChosen(voc);
    setPhase("flash");
    setTimeout(() => onChoose(voc), 2200);
  }

  const chosenV = chosen ? VOCATION_TREE[chosen] : null;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:800, overflow:"hidden",
      background: phase==="flash" ? "#ffffff" : "#000008",
      transition: phase==="flash" ? "background 0.1s" : "background 1s" }}>

      {/* 별 파티클 */}
      {phase !== "dark" && Array.from({length:40}).map((_,i) => {
        const angle = (tick*(0.6+i*0.07)+i*9) % 360;
        const rad = angle*Math.PI/180;
        const dist = 50+i*18;
        const x = 50+Math.cos(rad)*dist/4.5;
        const y = 50+Math.sin(rad)*dist/6;
        const col = i%3===0?"#ffd700":i%3===1?"#ff2222":"#ffffff";
        return <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`,
          width:i%5===0?4:2, height:i%5===0?4:2, borderRadius:"50%",
          background:col, opacity:0.3+Math.sin(tick*0.04+i)*0.2,
          pointerEvents:"none" }}/>;
      })}

      {/* 회전 링 */}
      {phase !== "dark" && [200,300,420].map((r,i) => (
        <div key={i} style={{ position:"absolute", width:r, height:r,
          border:`1px solid ${["rgba(255,215,0,0.2)","rgba(255,34,34,0.15)","rgba(255,255,255,0.08)"][i]}`,
          borderRadius:"50%", transform:`rotate(${tick*(0.4-i*0.15)}deg)`,
          top:"50%", left:"50%", marginLeft:-r/2, marginTop:-r/2 }}/>
      ))}

      {/* 텍스트 페이즈 */}
      {phase === "text" && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", zIndex:2, animation:"focusIntro 0.8s ease" }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:"rgba(255,215,0,0.5)",
            letterSpacing:6, marginBottom:20 }}>LV. 100</div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(18px,5vw,28px)",
            fontWeight:900, color:"#ffd700", textShadow:"0 0 30px #ffd700, 0 0 60px rgba(255,215,0,0.4)",
            letterSpacing:3, textAlign:"center", marginBottom:16, lineHeight:1.5 }}>
            당신은 별자리의<br/>경계에 다다랐습니다
          </div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10,
            color:"rgba(255,215,0,0.4)", letterSpacing:3 }}>
            이제 선택하십시오...
          </div>
        </div>
      )}

      {/* 선택 페이즈 */}
      {phase === "choose" && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", zIndex:2, padding:"20px",
          animation:"focusIntro 0.6s ease" }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10,
            color:"rgba(255,215,0,0.5)", letterSpacing:4, marginBottom:28 }}>최종 전직</div>

          {/* 단일 선택지 (계열에 따라 1개) */}
          <div style={{ width:"100%", maxWidth:360 }}>
            <div style={{ background:"linear-gradient(160deg,#1a0a00,#2a1500)",
              border:"2px solid rgba(255,34,34,0.6)", borderRadius:16,
              padding:"28px 24px", textAlign:"center",
              boxShadow:"0 0 40px rgba(255,34,34,0.3), 0 0 80px rgba(255,34,34,0.1)",
              cursor:"pointer", transition:"all .3s" }}
              onClick={() => handleChoose(isWarrior ? "star_god" : "star_avatar")}>
              <div style={{ fontSize:"clamp(32px,8vw,48px)", marginBottom:14 }}>★</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif",
                fontSize:"clamp(16px,4.5vw,22px)", fontWeight:900,
                color:"#ff2222", textShadow:"0 0 20px #ff2222",
                letterSpacing:2, marginBottom:12 }}>
                {isWarrior ? "별자리의 신" : "별자리의 현신"}
              </div>
              <div style={{ fontSize:"clamp(11px,3vw,13px)", color:"rgba(255,100,100,0.8)",
                lineHeight:1.8, marginBottom:16 }}>
                {isWarrior
                  ? "던전 보상 ×2.0\n별자리의 의지를 검에 담다"
                  : "별빛 조각 ×2.0\n최고 가챠 확률\n별자리 그 자체가 되다"}
              </div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10,
                color:"rgba(255,34,34,0.5)", letterSpacing:3 }}>
                TAP TO ASCEND
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 선택 후 플래시 */}
      {phase === "flash" && chosenV && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", zIndex:2,
          animation:"focusIntro 0.3s ease" }}>
          <div style={{ fontSize:"clamp(40px,12vw,64px)", marginBottom:16,
            filter:"drop-shadow(0 0 30px #ff2222)", animation:"gachaPulse 0.4s infinite" }}>★</div>
          <div style={{ fontFamily:"'Orbitron',sans-serif",
            fontSize:"clamp(20px,6vw,32px)", fontWeight:900,
            color:"#ff2222", textShadow:"0 0 30px #ff2222, 0 0 60px rgba(255,34,34,0.5)",
            letterSpacing:3, marginBottom:10 }}>
            {chosenV.name}
          </div>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10,
            color:"rgba(255,34,34,0.6)", letterSpacing:4 }}>ASCENDED</div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SUMMON TAB (소환)
// ══════════════════════════════════════════════════════════════════
function SummonTab({ st, setSt, showNotif, spawnParticles }) {
  const [gachaAnim, setGachaAnim] = useState(null);
  const mainConst = st.mainConstId ? CONSTELLATIONS.find(c=>c.id===st.mainConstId) : null;

  function doGacha(multi=false) {
    const baseCost = multi ? GACHA_MULTI_COST : GACHA_SINGLE_COST;
    const cost = getGachaCost(st.vocation, baseCost);
    if (st.starShards < cost) { showNotif("별빛 조각이 부족합니다", "#ff4d6d"); return; }
    const count = multi ? 10 : 1;
    const results = [];
    let pity = st.pityCount, pityM = st.pityMythic;
    const rates = getGachaRates(st.vocation);
    const legCeiling = getLegendaryCeiling(st.vocation);
    for (let i=0; i<count; i++) {
      const rarity = rollGacha(pity, pityM, rates, legCeiling);
      const constData = pickConstellationOfRarity(rarity, st.ownedConstellations.map(o=>o.id));
      results.push(constData);
      if (rarity === "mythic") { pity=0; pityM=0; }
      else if (rarity === "legendary") pity=0;
      else pity++;
      pityM++;
    }
    const best = results.reduce((a,b) => RARITY_ORDER.indexOf(a.rarity) > RARITY_ORDER.indexOf(b.rarity) ? a : b);
    const newOwned = [...st.ownedConstellations];
    results.forEach(c => { if (!newOwned.find(o=>o.id===c.id)) newOwned.push({id:c.id, obtainedAt:Date.now(), nameUnlocked:c.rarity!=="mythic"}); });
    let pendingInheritance = null;
    const mainC = st.mainConstId ? CONSTELLATIONS.find(c=>c.id===st.mainConstId) : null;
    if (!mainC || RARITY_ORDER.indexOf(best.rarity) > RARITY_ORDER.indexOf(mainC.rarity)) {
      if (mainC) pendingInheritance = { newConstId: best.id };
    }
    setSt(p => ({
      ...p, starShards:p.starShards-cost, pityCount:pity, pityMythic:pityM,
      totalGacha:p.totalGacha+count, ownedConstellations:newOwned,
      mainConstId:p.mainConstId||best.id, pendingInheritance,
      vocation: p.vocation==="none" ? "seeker" : p.vocation,
      tutorialStep: p.tutorialStep===3 ? 4 : p.tutorialStep,
    }));
    setGachaAnim(results);
  }

  if (gachaAnim) return <GachaResult results={gachaAnim} onClose={() => setGachaAnim(null)}/>;

  if (st.pendingInheritance) {
    const newC = CONSTELLATIONS.find(c=>c.id===st.pendingInheritance.newConstId);
    return (
      <InheritancePopup newConst={newC} oldConst={mainConst} ownedConsts={st.ownedConstellations}
        onAccept={() => setSt(p=>({...p, mainConstId:p.pendingInheritance.newConstId, pendingInheritance:null}))}
        onReject={() => setSt(p=>({...p, pendingInheritance:null}))}/>
    );
  }

  return (
    <div>
      {/* 별빛 조각 */}
      <div style={{ display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#061828,#0a2040)",
        border:"1px solid rgba(0,212,255,0.09)", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
        <span style={{ fontSize:20 }}>✨</span>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, color:"#00d4ff" }}>{st.starShards.toLocaleString()}</div>
          <div style={{ fontSize:9, color:"#8aaabb" }}>별빛 조각 보유</div>
        </div>
        <div style={{ fontSize:9, color:"#8aaabb", textAlign:"right", lineHeight:1.8 }}>
          1회 소환 {getGachaCost(st.vocation,GACHA_SINGLE_COST)}개{st.vocation==="star_oracle"?<span style={{color:"#aa44ff"}}> (-10%)</span>:""}<br/>
          10연 소환 {getGachaCost(st.vocation,GACHA_MULTI_COST)}개{st.vocation==="star_oracle"?<span style={{color:"#aa44ff"}}> (-10%)</span>:""}
        </div>
      </div>

      {/* 천장 */}
      <div style={{ background:"#061828", border:"1px solid rgba(0,212,255,0.08)", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#8aaabb", letterSpacing:2, marginBottom:10 }}>천장</div>
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:9, color:"#ff8800" }}>전설 천장</span>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#ff8800" }}>{st.pityCount}/{CEILING_LEGENDARY}</span>
          </div>
          <div style={{ height:4, background:"#040f1c", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(st.pityCount/CEILING_LEGENDARY)*100}%`, background:"#ff8800", borderRadius:2 }}/>
          </div>
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:9, color:"#ff2222" }}>??? 천장</span>
            <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#ff2222" }}>???</span>
          </div>
          <div style={{ height:4, background:"#040f1c", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:"0%", background:"#ff2222", borderRadius:2 }}/>
          </div>
          <div style={{ fontSize:8, color:"#884433", marginTop:3 }}>천장 존재 여부 미확인</div>
        </div>
      </div>

      {/* 소환 버튼 */}
      <div style={{ display:"flex", gap:10, marginBottom:14 }} className="gacha-btns">
        <button style={{ flex:1, background:"linear-gradient(135deg,rgba(0,212,255,0.13),rgba(0,212,255,0.07))",
          border:"1px solid rgba(0,212,255,0.27)", borderRadius:10, padding:"14px",
          color:"#00d4ff", cursor:st.starShards>=GACHA_SINGLE_COST?"pointer":"default",
          opacity:st.starShards>=GACHA_SINGLE_COST?1:0.4, fontSize:12,
          fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}
          onClick={() => doGacha(false)}>
          ✦ 1회 소환<br/>
          <span style={{ fontSize:9, opacity:0.7 }}>{GACHA_SINGLE_COST}개</span>
        </button>
        <button style={{ flex:1, background:"linear-gradient(135deg,rgba(123,97,255,0.13),rgba(123,97,255,0.07))",
          border:"1px solid rgba(123,97,255,0.27)", borderRadius:10, padding:"14px",
          color:"#7b61ff", cursor:st.starShards>=GACHA_MULTI_COST?"pointer":"default",
          opacity:st.starShards>=GACHA_MULTI_COST?1:0.4, fontSize:12,
          fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}
          onClick={() => doGacha(true)}>
          ✦ 10연 소환<br/>
          <span style={{ fontSize:9, opacity:0.7 }}>{GACHA_MULTI_COST}개</span>
        </button>
      </div>

      {/* 소환 확률 */}
      <div style={{ background:"#061828", border:"1px solid rgba(0,212,255,0.08)", borderRadius:10, padding:"12px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#8aaabb", letterSpacing:2 }}>소환 확률</div>
          {PRIEST_BRANCH.includes(st.vocation) && (
            <div style={{ fontSize:8, color:"#aa44ff" }}>🔮 성직자 보정 적용 중</div>
          )}
        </div>
        {getGachaRates(st.vocation).map(({rarity,rate}) => {
          const r = RARITY[rarity];
          return (
            <div key={rarity} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:10, color:r.color, width:32 }}>{r.label}</span>
              <div style={{ flex:1, height:4, background:"#040f1c", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min(rate,100)}%`, background:r.color, borderRadius:2 }}/>
              </div>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:rarity==="mythic"?"rgba(255,34,34,0.53)":r.color, width:32, textAlign:"right" }}>
                {rarity==="mythic" ? "???" : rate+"%"}
              </span>
            </div>
          );
        })}
        <div style={{ fontSize:8, color:"#7a9aaa", marginTop:8, lineHeight:1.6 }}>
          전설 {CEILING_LEGENDARY}회 천장 · ??? 천장 미공개<br/>
          10연 소환 시 레어 이상 1개 보장
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CONSTELLATION TAB (도감/인벤토리)
// ══════════════════════════════════════════════════════════════════
function ConstellationTab({ st, setSt, showNotif }) {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const mainConst = st.mainConstId ? CONSTELLATIONS.find(c=>c.id===st.mainConstId) : null;

  const filtered = rarityFilter === "all" ? CONSTELLATIONS : CONSTELLATIONS.filter(c=>c.rarity===rarityFilter);

  const totalOwned = st.ownedConstellations.length;
  const totalAll = CONSTELLATIONS.length;

  return (
    <div>
      {/* 메인 별자리 */}
      {mainConst && (() => {
        const r = RARITY[mainConst.rarity];
        const owned = st.ownedConstellations.find(o=>o.id===mainConst.id);
        const displayName = mainConst.rarity==="mythic"&&!owned?.nameUnlocked ? "잊혀진 별" : mainConst.name;
        return (
          <div style={{ background:`linear-gradient(160deg,${r.bg},#030d18)`,
            border:`1px solid ${r.color}44`, borderRadius:12, padding:"14px 16px",
            marginBottom:14, display:"flex", alignItems:"center", gap:12,
            boxShadow:`0 0 16px ${r.glowColor}` }}>
            <ConstellationSVG constId={mainConst.id} rarity={mainConst.rarity} color={r.color} size={60} animate={true}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, color:r.color, fontFamily:"'Orbitron',sans-serif", letterSpacing:1, marginBottom:2 }}>[{r.label}] 메인 별자리</div>
              <div style={{ fontSize:14, color:"#c8e8ff", fontWeight:600, marginBottom:2 }}>{displayName}</div>
              <div style={{ fontSize:9, color:"#8aa0b0", marginBottom:4 }}>{mainConst.desc}</div>
              <div style={{ fontSize:10, color:r.color }}>{mainConst.bonus==="xp"?`⚡ XP +${mainConst.bonusVal}%`:`✨ 별빛 조각 +${mainConst.bonusVal}%`}</div>
            </div>
          </div>
        );
      })()}

      {/* 수집 현황 */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:"#00d4ff", flex:1 }}>
          {totalOwned} / {totalAll}
        </div>
        <div style={{ height:4, flex:3, background:"#040f1c", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${totalOwned/totalAll*100}%`,
            background:"linear-gradient(90deg,#00d4ff,#7b61ff)", borderRadius:2 }}/>
        </div>
        <div style={{ fontSize:9, color:"#8aaabb" }}>{Math.round(totalOwned/totalAll*100)}%</div>
      </div>

      {/* 등급 필터 */}
      <div style={{ display:"flex", gap:5, marginBottom:12, overflowX:"auto" }}>
        {[["all","전체"],...RARITY_ORDER.map(r=>[r,RARITY[r].label])].map(([k,l])=>{
          const active = rarityFilter===k;
          const col = k==="all"?"#00d4ff":RARITY[k]?.color||"#00d4ff";
          return (
            <button key={k} style={{ flexShrink:0, background:active?`${col}14`:"transparent",
              border:`1px solid ${active?col+"66":"#0a2030"}`, borderRadius:6,
              padding:"4px 10px", fontSize:10, color:active?col:"#8aaabb", cursor:"pointer" }}
              onClick={()=>setRarityFilter(k)}>{l}</button>
          );
        })}
      </div>

      {/* 별자리 그리드 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }} className="constellation-grid resp-const-grid">
        {filtered.map(c => {
          const r = RARITY[c.rarity];
          const owned = st.ownedConstellations.find(o=>o.id===c.id);
          const isMain = c.id === st.mainConstId;
          const isSelected = c.id === selectedId;
          const displayName = c.rarity==="mythic"&&!owned?.nameUnlocked ? "잊혀진 별" : c.name;
          return (
            <div key={c.id}
              onClick={() => { setSelectedId(isSelected?null:c.id); if(owned&&!isMain) setSt(p=>({...p,mainConstId:c.id})); }}
              style={{ background: owned ? r.bg : "#0a0a12",
                border:`1px solid ${isMain?r.color+"88":owned?r.color+"44":"#0a1520"}`,
                borderRadius:9, padding:"10px 8px", textAlign:"center", cursor:"pointer",
                opacity: owned ? 1 : 0.3,
                boxShadow: isMain ? `0 0 10px ${r.glowColor}` : "none",
                transition:"all .2s" }}>
              <ConstellationSVG constId={c.id} rarity={c.rarity} color={owned?r.color:"#2a3a50"} size={52} animate={isMain}/>
              <div style={{ fontSize:9, color:owned?"#c8e8ff":"#2a3a50", marginTop:4,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {owned ? displayName : "???"}
              </div>
              <div style={{ fontSize:7, color:owned?r.color:"#4a5a65", marginTop:1 }}>[{r.label}]</div>
              {isMain && <div style={{ fontSize:7, color:"#00d4ff", marginTop:1 }}>● 메인</div>}
              {!owned && <div style={{ fontSize:7, color:"#5a6570", marginTop:1 }}>미획득</div>}
            </div>
          );
        })}
      </div>

      {totalOwned === 0 && (
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div style={{ fontSize:36, marginBottom:10, opacity:0.15 }}>✦</div>
          <div style={{ fontSize:12, color:"#8aaabb" }}>아직 별자리가 없습니다</div>
          <div style={{ fontSize:10, color:"#7a9aaa", marginTop:4 }}>소환 탭에서 첫 별자리를 소환하세요</div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DUNGEON TAB
// ══════════════════════════════════════════════════════════════════
function DungeonTab({ st, setSt, showNotif, spawnParticles, setNameUnlockPopup }) {
  const now = Date.now();
  const [showConstSelect, setShowConstSelect] = useState(null); // dungeonId
  const [selectedConstId, setSelectedConstId] = useState(null);
  const [summonAnim, setSummonAnim] = useState(null); // {constName, rarity}
  const activeDungeon = st.activeDungeon;
  const activeDg = activeDungeon ? DUNGEONS.find(d=>d.id===activeDungeon.dungeonId) : null;
  const elapsed = activeDungeon ? now - activeDungeon.startedAt : 0;
  // 성좌 검사: 쿨타임 6시간
  const dungeonDuration = getDungeonDuration(st.vocation);
  const isDone = activeDungeon ? elapsed >= dungeonDuration : false;
  const progress = activeDungeon ? Math.min(elapsed/dungeonDuration*100,100) : 0;
  const remaining = activeDungeon ? Math.max(0, dungeonDuration-elapsed) : 0;
  const hh=Math.floor(remaining/3600000), mm=Math.floor((remaining%3600000)/60000), ss=Math.floor((remaining%60000)/1000);
  const timeStr=`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  // 성좌 지배자: 기여 퀘스트 ×2
  const contribRaw = activeDungeon?.contributedQuestIds?.length||0;
  const contribCount = Math.round(contribRaw * getContribMultiplier(st.vocation));

  // 잊혀진 던전
  const hasMythic = st.ownedConstellations.some(o => CONSTELLATIONS.find(c=>c.id===o.id)?.rarity==="mythic");
  const thisWeek = weekStr();
  const forgottenUsed = st.forgottenDungeonWeek===thisWeek ? st.forgottenDungeonUsed : 0;
  // 별자리의 신: 주 5회, 별의 기사: 4시간
  const forgottenWeeklyMax = getForgottenWeeklyLimit(st.vocation);
  const forgottenHoursReq = getForgottenDungeonHours(st.vocation);
  const forgottenAvail = (isWeekend() || st.forgottenWeekendOverride) && forgottenUsed < forgottenWeeklyMax;
  const focusHoursDone = (st.forgottenFocusSecs||0) / 3600;
  const focusProgress = Math.min(focusHoursDone/forgottenHoursReq*100,100);

  function sendToDungeon(dungeonId, constId) {
    const c = CONSTELLATIONS.find(cc=>cc.id===constId);
    const owned = st.ownedConstellations.find(o=>o.id===constId);
    const displayName = c?.rarity==="mythic" && !owned?.nameUnlocked ? "잊혀진 별" : (c?.name||"별자리");
    setSt(p=>({...p, tutorialStep:p.tutorialStep===4?5:p.tutorialStep}));
    setSummonAnim({ constId: c?.id||"c01", constName: displayName, rarity: c?.rarity||"common", dungeonId });
  }

  function confirmSendToDungeon(dungeonId, constId) {
    setSt(p=>({...p, activeDungeon:{ dungeonId, constId, startedAt:Date.now(), contributedQuestIds:[] }}));
    const dg = DUNGEONS.find(d=>d.id===dungeonId);
    showNotif(`${dg.icon} ${dg.name} 시작!`, "#00d4ff");
    setSummonAnim(null);
    setShowConstSelect(null);
    setSelectedConstId(null);
  }

  function contributeQuest(questId) {
    setSt(p=>({...p, activeDungeon:{...p.activeDungeon, contributedQuestIds:[...(p.activeDungeon.contributedQuestIds||[]),questId]}}));
    showNotif("던전 기여! 확률 상승 ↑","#00d4ff");
  }

  function claimDungeon() {
    if (!activeDungeon||!activeDg) return;
    const roll = Math.random()*100;
    let acc=0, eggRarity=null;
    for (const [r,base,bonus] of activeDg.dropTable) {
      acc += base+bonus*contribCount;
      if (roll<acc) { eggRarity=r; break; }
    }
    // 전직 보너스
    const dungeonMult = getDungeonBonus(st.vocation);
    // 강림한 별자리 보너스
    const summonedConst = activeDungeon.constId ? CONSTELLATIONS.find(c=>c.id===activeDungeon.constId) : null;
    const constXpMult  = summonedConst?.bonus==="xp"    ? 1+(summonedConst.bonusVal/100) : 1;
    const constShardMult = summonedConst?.bonus==="shard" ? 1+(summonedConst.bonusVal/100) : 1;

    const bonusXp    = Math.round((activeDg.baseXp+contribCount*30) * dungeonMult * constXpMult);
    const bonusShard = Math.round((activeDg.baseShard+(eggRarity?20:0)) * dungeonMult * constShardMult);

    setSt(p=>({
      ...p, totalXp:p.totalXp+bonusXp,
      starShards:p.starShards+bonusShard,
      activeDungeon:null, dungeonClears:(p.dungeonClears||0)+1,
      dungeonHistory:[...(p.dungeonHistory||[]),{dungeonId:activeDungeon.dungeonId,contribCount,at:Date.now()}],
    }));
    const multParts = [];
    if (dungeonMult > 1) multParts.push(`전직×${dungeonMult.toFixed(2)}`);
    if (constXpMult > 1 || constShardMult > 1) multParts.push(`${summonedConst.name} 보너스`);
    const multStr = multParts.length ? ` (${multParts.join(", ")})` : "";
    showNotif(`던전 완료! +${bonusXp}XP +${bonusShard}✨${multStr}`,"#00d4ff");
    spawnParticles(window.innerWidth/2, window.innerHeight/3,"#00d4ff");
  }

  // 별자리 선택 모달
  if (showConstSelect) {
    const selectedC = selectedConstId ? CONSTELLATIONS.find(c=>c.id===selectedConstId) : null;
    const selectedR = selectedC ? RARITY[selectedC.rarity] : null;
    return (
      <div style={ST.modalBg} onClick={()=>{ setShowConstSelect(null); setSelectedConstId(null); }}>
        <div style={{...ST.timerModal, width:300, textAlign:"left", maxHeight:"80vh", overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:"#00d4ff", marginBottom:12 }}>별자리 선택</div>
          {st.ownedConstellations.length===0 && <div style={{ fontSize:11, color:"#8aaabb" }}>보유한 별자리가 없습니다</div>}
          {st.ownedConstellations.map(owned => {
            const c = CONSTELLATIONS.find(cc=>cc.id===owned.id);
            if (!c) return null;
            const r = RARITY[c.rarity];
            const inDungeon = activeDungeon?.constId===c.id;
            const isSelected = selectedConstId === c.id;
            const displayName = c.rarity==="mythic"&&!owned.nameUnlocked?"잊혀진 별":c.name;
            return (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10,
                background: isSelected ? `${r.color}18` : "#061828",
                border:`1px solid ${isSelected ? r.color+"88" : r.color+"33"}`,
                borderRadius:8, padding:"9px 10px", marginBottom:7,
                cursor:inDungeon?"default":"pointer", opacity:inDungeon?0.4:1,
                transition:"all .2s" }}
                onClick={() => { if(!inDungeon) setSelectedConstId(c.id); }}>
                <ConstellationSVG constId={c.id} rarity={c.rarity} color={r.color} size={36} animate={isSelected}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"#c8e8ff" }}>{displayName}</div>
                  <div style={{ fontSize:9, color:r.color }}>[{r.label}]</div>
                </div>
                {isSelected && <span style={{ fontSize:12, color:r.color }}>✓</span>}
                {inDungeon && <span style={{ fontSize:9, color:"#8aaabb" }}>진행 중</span>}
              </div>
            );
          })}
          {/* 강림 버튼 */}
          <button style={{
            width:"100%", marginTop:8,
            background: selectedConstId ? `linear-gradient(135deg,${selectedR?.color}33,${selectedR?.color}11)` : "#0a1520",
            border:`1px solid ${selectedConstId ? selectedR?.color+"66" : "#0a2030"}`,
            borderRadius:8, padding:"11px",
            color: selectedConstId ? selectedR?.color : "#8aaabb",
            cursor: selectedConstId ? "pointer" : "default",
            fontFamily:"'Orbitron',sans-serif", fontSize:11, letterSpacing:1,
            transition:"all .2s"
          }} onClick={() => {
            if(selectedConstId) {
              setShowConstSelect(null); // 선택창 먼저 닫기
              sendToDungeon(showConstSelect, selectedConstId);
            }
          }}>
            {selectedConstId ? `✦ ${selectedC?.rarity==="mythic"&&!st.ownedConstellations.find(o=>o.id===selectedConstId)?.nameUnlocked?"잊혀진 별":selectedC?.name} 강림` : "별자리를 선택하세요"}
          </button>
        </div>
      </div>
    );
  }

  // 강림 애니메이션
  if (summonAnim) {
    return <DungeonSummonAnim constId={summonAnim.constId} constName={summonAnim.constName} rarity={summonAnim.rarity}
      onDone={() => confirmSendToDungeon(summonAnim.dungeonId, summonAnim.constId)}/>;
  }

  return (
    <div>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#8aaabb", letterSpacing:2, marginBottom:4 }}>던전</div>
      <div style={{ fontSize:10, color:"#7a9aaa", marginBottom:14, lineHeight:1.7 }}>
        별자리를 강림시켜 던전을 탐험하세요.<br/>
        해당 태그 퀘스트를 완료하면 보상이 상승합니다.
      </div>

      {/* 진행 중인 던전 */}
      {activeDungeon && activeDg && (
        <div style={{ background:"linear-gradient(135deg,#061828,#0a2040)", border:"1px solid rgba(0,212,255,0.27)", borderRadius:11, padding:"14px", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <span style={{ fontSize:22 }}>{activeDg.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"#c8e8ff", fontWeight:600 }}>{activeDg.name}</div>
              <div style={{ fontSize:9, color:"#8aaabb" }}>진행 중 · {activeDg.tag}</div>
            </div>
            {(() => {
              const c = CONSTELLATIONS.find(cc=>cc.id===activeDungeon.constId);
              const owned = st.ownedConstellations.find(o=>o.id===activeDungeon.constId);
              if (!c) return null;
              const r = RARITY[c.rarity];
              return (
                <div style={{ textAlign:"center" }}>
                  <ConstellationSVG constId={c.id} rarity={c.rarity} color={r.color} size={36} animate={false}/>
                  <div style={{ fontSize:8, color:r.color, marginTop:2 }}>
                    {c.rarity==="mythic"&&!owned?.nameUnlocked?"잊혀진 별":c.name}
                  </div>
                </div>
              );
            })()}
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:9, color:"#3a5070" }}>진행도</span>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:isDone?"#00d4ff":"#3a5070" }}>
                {isDone?"완료!":timeStr}
              </span>
            </div>
            <div style={{ height:5, background:"#040f1c", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:isDone?"#00d4ff":"linear-gradient(90deg,rgba(0,68,136,0.53),rgba(0,212,255,0.53))", borderRadius:3 }}/>
            </div>
          </div>
          {/* 기여 퀘스트 */}
          {(() => {
            const eligible = st.quests.filter(q=>q.category===activeDg.tag&&q.rewarded&&q.done&&!activeDungeon.contributedQuestIds?.includes(q.id));
            return eligible.length>0 && (
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:9, color:"#8aaabb", marginBottom:4 }}>
                  기여 가능한 퀘스트 ({eligible.length}개)
                </div>
                {eligible.map(q=>(
                  <div key={q.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <span style={{ fontSize:10, color:"#c8e8ff", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.title}</span>
                    <button style={{ ...ST.addBtn, padding:"2px 8px", fontSize:9 }} onClick={()=>contributeQuest(q.id)}>기여</button>
                  </div>
                ))}
              </div>
            );
          })()}
          <div style={{ fontSize:9, color:"#8aaabb", marginBottom:isDone?10:0 }}>
            기여 퀘스트: {contribCount}개
            {(() => {
              const c = activeDungeon?.constId ? CONSTELLATIONS.find(cc=>cc.id===activeDungeon.constId) : null;
              if (!c) return null;
              const owned = st.ownedConstellations.find(o=>o.id===c.id);
              const name = c.rarity==="mythic"&&!owned?.nameUnlocked?"잊혀진 별":c.name;
              return <span style={{ color:"#00d4ff55", marginLeft:8 }}>· {name} {c.bonus==="xp"?`XP+${c.bonusVal}%`:`✨+${c.bonusVal}%`}</span>;
            })()}
          </div>
          {isDone && (
            <button style={{ ...ST.confirmBtn, width:"100%", padding:"9px", marginTop:4 }} onClick={claimDungeon}>
              🎁 보상 수령
            </button>
          )}
        </div>
      )}

      {/* 일반 던전 목록 */}
      {!activeDungeon && DUNGEONS.map(dg => (
        <div key={dg.id} style={{ background:"linear-gradient(135deg,#061828,#0a2040)", border:"1px solid #0a2030", borderRadius:11, padding:"14px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontSize:22 }}>{dg.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"#c8e8ff", fontWeight:600 }}>{dg.name}</div>
              <div style={{ fontSize:9, color:"#8aaabb" }}>태그: {dg.tag} · 8시간</div>
              <div style={{ fontSize:9, color:"#8aaabb" }}>기본 +{dg.baseXp}XP +{dg.baseCoin}💰 +{dg.baseShard}✨</div>
            </div>
            <button style={{ ...ST.confirmBtn, padding:"6px 12px", fontSize:10 }}
              onClick={() => { if(st.ownedConstellations.length===0){showNotif("별자리가 없습니다","#556677");return;} setSelectedConstId(null); setShowConstSelect(dg.id); }}>
              입장
            </button>
          </div>
          <div style={{ fontSize:9, color:"#7a9aaa" }}>{dg.desc}</div>
        </div>
      ))}

      {/* 잊혀진 던전 */}
      <div style={{ background:"linear-gradient(135deg,#1a0000,#0d0000)", border:`1px solid ${hasMythic?"rgba(255,34,34,0.27)":"#2a0000"}`, borderRadius:11, padding:"14px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:22 }}>🌑</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:hasMythic?"#ff4444":"#884433", fontWeight:600 }}>잊혀진 던전</div>
            <div style={{ fontSize:9, color:"#884433" }}>
              {hasMythic ? `주말 전용 · 주 ${forgottenWeeklyMax}회` : "신화 별자리 보유자만 입장 가능"}
            </div>
          </div>
          {hasMythic && forgottenAvail && !st.forgottenActive && (
            <button style={{ background:"linear-gradient(135deg,rgba(255,34,34,0.2),rgba(255,34,34,0.07))", border:"1px solid rgba(255,34,34,0.27)",
              borderRadius:7, padding:"6px 12px", fontSize:10, color:"#ff4444", cursor:"pointer" }}
              onClick={() => {
                const week = weekStr();
                setSt(p=>({
                  ...p,
                  forgottenActive: true,
                  forgottenFocusSecs: 0,
                  forgottenDungeonWeek: week,
                  forgottenDungeonUsed: (p.forgottenDungeonWeek===week ? p.forgottenDungeonUsed : 0) + 1,
                }));
                showNotif("🌑 잊혀진 던전 입장!", "#ff2222");
              }}>
              입장 ({forgottenWeeklyMax-forgottenUsed}회)
            </button>
          )}
          {st.forgottenActive && (
            <div style={{ fontSize:9, color:"#ff4444", fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}>
              ● 진행 중
            </div>
          )}
        </div>
        {hasMythic ? (
          <div>
            <div style={{ fontSize:9, color:"#994433", marginBottom:8 }}>
              {isWeekend()||st.forgottenWeekendOverride ? `이번 주 ${forgottenUsed}/${forgottenWeeklyMax}회 사용` : "주말에만 입장 가능합니다"}
            </div>

            {/* 진행 중 상태 */}
            {st.forgottenActive && (
              <div style={{ background:"#0d0000", border:"1px solid rgba(255,34,34,0.2)", borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:10, color:"#ff4444" }}>집중 시간 누적</span>
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:"#ff4444" }}>
                    {((st.forgottenFocusSecs||0)/3600).toFixed(2)} / {forgottenHoursReq}시간
                  </span>
                </div>
                <div style={{ height:5, background:"#1a0000", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", width:`${Math.min((st.forgottenFocusSecs||0)/3600/forgottenHoursReq*100,100)}%`,
                    background:"linear-gradient(90deg,#ff2222,#ff6644)", borderRadius:3,
                    transition:"width 1s linear" }}/>
                </div>
                <div style={{ fontSize:8, color:"#884433", marginBottom:8 }}>
                  집중 모드 타이머를 켜면 시간이 누적됩니다
                </div>
                {(() => {
                  const mainC = st.mainConstId ? CONSTELLATIONS.find(c=>c.id===st.mainConstId) : null;
                  if (!mainC) return null;
                  const owned = st.ownedConstellations.find(o=>o.id===mainC.id);
                  const displayName = mainC.rarity==="mythic"&&!owned?.nameUnlocked ? "잊혀진 별" : mainC.name;
                  return (
                    <div style={{ fontSize:8, color:"#994433", marginBottom:8 }}>
                      {displayName} 효과 적용 중 · {mainC.bonus==="xp"?`XP +${mainC.bonusVal}%`:`별빛 조각 +${mainC.bonusVal}%`}
                    </div>
                  );
                })()}
                {(st.forgottenFocusSecs||0) >= forgottenHoursReq * 3600 && (
                  <button style={{ width:"100%", background:"linear-gradient(135deg,rgba(255,34,34,0.3),rgba(255,34,34,0.1))",
                    border:"1px solid rgba(255,34,34,0.5)", borderRadius:7, padding:"8px",
                    color:"#ff4444", fontSize:11, cursor:"pointer", fontFamily:"'Orbitron',sans-serif" }}
                    onClick={() => {
                      // 메인 별자리 효과 적용
                      const mainC = st.mainConstId ? CONSTELLATIONS.find(c=>c.id===st.mainConstId) : null;
                      const constMult = mainC ? 1+(mainC.bonusVal/100) : 1;
                      const dungeonMult = getDungeonBonus(st.vocation);
                      const baseXp = 300;
                      const baseShard = 30;
                      const bonusXp    = Math.round(baseXp * dungeonMult * (mainC?.bonus==="xp" ? constMult : 1));
                      const bonusShard = Math.round(baseShard * dungeonMult * (mainC?.bonus==="shard" ? constMult : 1));

                      const mythicOwned = st.ownedConstellations.find(o=>CONSTELLATIONS.find(c=>c.id===o.id)?.rarity==="mythic"&&!o.nameUnlocked);
                      setSt(p => {
                        const newShards = {...(p.ancientShards||{})};
                        if (mythicOwned) newShards[mythicOwned.id] = (newShards[mythicOwned.id]||0) + 1;
                        const next = newShards[mythicOwned?.id]||0;
                        const shouldUnlock = next >= FORGOTTEN_DUNGEON.nameUnlockRequired && !!mythicOwned;
                        return {
                          ...p,
                          forgottenActive:false, forgottenFocusSecs:0,
                          ancientShards:newShards,
                          totalXp:p.totalXp+bonusXp,
                          starShards:p.starShards+bonusShard,
                          ownedConstellations: shouldUnlock
                            ? p.ownedConstellations.map(o=>o.id===mythicOwned.id?{...o,nameUnlocked:true}:o)
                            : p.ownedConstellations,
                        };
                      });
                      // 이름 해금 팝업은 setSt 밖에서 지연 호출
                      if (mythicOwned) {
                        const curShards = (st.ancientShards?.[mythicOwned.id]||0) + 1;
                        if (curShards >= FORGOTTEN_DUNGEON.nameUnlockRequired) {
                          const c = CONSTELLATIONS.find(cc=>cc.id===mythicOwned.id);
                          if (c) setTimeout(()=>setNameUnlockPopup(c), 200);
                        }
                      }
                      const bonusStr = mainC ? ` · ${mainC.name} 보너스` : "";
                      showNotif(`🌑 클리어! 고대 조각+1 +${bonusXp}XP +${bonusShard}✨${bonusStr}`,"#ff2222");
                    }}>
                    클리어! 고대의 조각 획득
                  </button>
                )}
              </div>
            )}

            {/* 고대의 조각 현황 */}
            {st.ownedConstellations.filter(o=>CONSTELLATIONS.find(c=>c.id===o.id)?.rarity==="mythic"&&!o.nameUnlocked).map(owned => {
              const c = CONSTELLATIONS.find(cc=>cc.id===owned.id);
              const shards = st.ancientShards?.[owned.id]||0;
              return (
                <div key={owned.id} style={{ marginBottom:6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontSize:9, color:"#ff4444" }}>잊혀진 별 — 고대의 조각</span>
                    <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#ff4444" }}>
                      {shards}/{FORGOTTEN_DUNGEON.nameUnlockRequired}
                    </span>
                  </div>
                  <div style={{ height:4, background:"#1a0000", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${shards/FORGOTTEN_DUNGEON.nameUnlockRequired*100}%`,
                      background:"#ff2222", borderRadius:2 }}/>
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize:9, color:"#884433", marginTop:6 }}>
              클리어 조건: 집중 모드 {forgottenHoursReq}시간 누적
            </div>
          </div>
        ) : (
          <div style={{ fontSize:9, color:"#884433" }}>{FORGOTTEN_DUNGEON.desc}</div>
        )}
      </div>

      {/* 던전 기록 */}
      {st.dungeonHistory?.length>0 && (
        <div style={{ marginTop:8 }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#7a9aaa", letterSpacing:2, marginBottom:8 }}>최근 기록</div>
          {[...st.dungeonHistory].reverse().slice(0,3).map((h,i) => {
            const dg = DUNGEONS.find(d=>d.id===h.dungeonId);
            return (
              <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11 }}>{dg?.icon||"🏰"}</span>
                <span style={{ fontSize:10, color:"#3a5070", flex:1 }}>{dg?.name}</span>
                <span style={{ fontSize:9, color:"#8aaabb" }}>기여 {h.contribCount}개</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



function CalendarTab({ st }) {
  const now = new Date(), year = now.getFullYear(), month = now.getMonth();
  const first = new Date(year,month,1).getDay(), days = new Date(year,month+1,0).getDate();
  const cells = []; for(let i=0;i<first;i++) cells.push(null); for(let d=1;d<=days;d++) cells.push(d);
  const lvInfo = getLevelInfo(st.totalXp);
  const [selectedDay, setSelectedDay] = useState(null);

  function fmtSecs(s) {
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60);
    if(h>0) return h+"시간 "+m+"분";
    if(m>0) return m+"분";
    return s+"초";
  }

  const monthPrefix = year+"-"+String(month+1).padStart(2,"0");
  const monthDays = Object.entries(st.calendarData||{}).filter(([k])=>k.startsWith(monthPrefix));
  const monthActiveDays = monthDays.filter(([,v])=>v.done>0||(v.focusSecs||0)>0).length;
  const monthTotalDone = monthDays.reduce((s,[,v])=>s+v.done, 0);
  const monthPerfectDays = monthDays.filter(([,v])=>v.total>0&&v.done>=v.total).length;
  const monthFocusSecs = monthDays.reduce((s,[,v])=>s+(v.focusSecs||0), 0);
  const allDays = Object.values(st.calendarData||{});
  const totalActiveDays = allDays.filter(v=>v.done>0||(v.focusSecs||0)>0).length;
  const totalFocusSecs = allDays.reduce((s,v)=>s+(v.focusSecs||0), 0);
  const dayOfWeekCount = [0,0,0,0,0,0,0];
  Object.entries(st.calendarData||{}).forEach(([k,v])=>{ if(v.done>0||(v.focusSecs||0)>0) dayOfWeekCount[new Date(k).getDay()]++; });
  const maxDow = Math.max(...dayOfWeekCount, 1);
  const selectedKey = selectedDay ? year+"-"+String(month+1).padStart(2,"0")+"-"+String(selectedDay).padStart(2,"0") : null;
  const selectedInfo = selectedKey ? st.calendarData[selectedKey] : null;

  return (
    <div>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, color:"#00d4ff", letterSpacing:2, textAlign:"center", marginBottom:14 }}>
        {now.toLocaleDateString("ko-KR",{year:"numeric",month:"long"})}
      </div>
      <div style={{ background:"linear-gradient(135deg,#061828,#0a2040)", border:"1px solid rgba(0,212,255,0.1)", borderRadius:12, padding:"12px", marginBottom:10 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
          {["일","월","화","수","목","금","토"].map(d=>(
            <div key={d} style={{ textAlign:"center", fontSize:9, color:"#8aaabb", padding:"3px 0", fontFamily:"'Orbitron',sans-serif" }}>{d}</div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
          {cells.map((d,i)=>{
            if (!d) return <div key={"e"+i}/>;
            const key=year+"-"+String(month+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
            const info=st.calendarData[key];
            const isToday=d===now.getDate();
            const isPast=d<now.getDate();
            const isSelected=d===selectedDay;
            const pct=info?info.done/Math.max(info.total,1):0;
            const perfect=info&&info.total>0&&info.done>=info.total;
            const hasFocus=info&&(info.focusSecs||0)>60;
            const focusH=Math.floor((info?.focusSecs||0)/3600);
            return (
              <div key={d} onClick={()=>setSelectedDay(isSelected?null:d)}
                style={{ borderRadius:6, padding:"4px 2px", textAlign:"center", minHeight:44,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  cursor:"pointer",
                  border:"1px solid "+(isSelected?"#7b61ff":isToday?"#00d4ff":perfect?"rgba(0,212,255,0.3)":hasFocus?"rgba(123,97,255,0.2)":info&&info.done>0?"rgba(0,212,255,0.1)":"#091828"),
                  background:isSelected?"rgba(123,97,255,0.15)":perfect?"rgba(0,212,255,0.12)":hasFocus?"rgba(123,97,255,0.06)":info&&info.done>0?"rgba(0,212,255,"+(0.02+pct*0.06)+")":"#060f1a",
                  boxShadow:isSelected?"0 0 8px rgba(123,97,255,0.3)":isToday?"0 0 8px rgba(0,212,255,0.25)":"none",
                  transition:"all .15s" }}>
                <div style={{ fontSize:9, color:isSelected?"#7b61ff":isToday?"#00d4ff":perfect?"#00d4ff":info&&(info.done>0||hasFocus)?"#c8e8ff":"#8aaabb", fontFamily:"'Orbitron',sans-serif", fontWeight:isToday?700:400 }}>{d}</div>
                {perfect && <div style={{ fontSize:7 }}>⭐</div>}
                {hasFocus && !perfect && <div style={{ fontSize:7, color:"rgba(123,97,255,0.7)", marginTop:1 }}>{focusH>0?focusH+"h":"●"}</div>}
                {info&&!perfect&&!hasFocus&&info.done>0 && <div style={{ fontSize:7, color:"rgba(0,212,255,0.5)", marginTop:1 }}>{info.done}/{info.total}</div>}
                {!info && isPast && <div style={{ width:3, height:3, borderRadius:"50%", background:"#5a6570", marginTop:2 }}/>}
              </div>
            );
          })}
        </div>
      </div>
      {selectedDay && (
        <div style={{ background:"linear-gradient(135deg,#0a0820,#0d0a30)", border:"1px solid rgba(123,97,255,0.3)", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#7b61ff", letterSpacing:2, marginBottom:8 }}>{(month+1)}월 {selectedDay}일</div>
          {selectedInfo ? (
            <div style={{ display:"flex", gap:12 }}>
              {[
                ["퀘스트", selectedInfo.done+"/"+selectedInfo.total, "#00d4ff"],
                ["집중 시간", (selectedInfo.focusSecs||0)>0?fmtSecs(selectedInfo.focusSecs||0):"-", "#7b61ff"],
                ["완벽", selectedInfo.total>0&&selectedInfo.done>=selectedInfo.total?"⭐":"–", "#ffd700"],
              ].map(([l,v,c],idx)=>(
                <div key={l} style={{ flex:1, textAlign:"center" }}>
                  {idx>0 && false}
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(12px,3.5vw,15px)", color:c }}>{v}</div>
                  <div style={{ fontSize:8, color:"#8aaabb", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ fontSize:10, color:"#8aaabb", textAlign:"center" }}>기록 없음</div>}
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:7, marginBottom:10 }}>
        {[
          ["이번 달 집중", monthFocusSecs>0?fmtSecs(monthFocusSecs):"-", "#7b61ff"],
          ["이번 달 퀘스트", monthTotalDone+"개", "#00d4ff"],
          ["활동일", monthActiveDays+"일", "#00d4ff"],
          ["완벽한 날", monthPerfectDays+"일", "#ffd700"],
        ].map(([l,v,c])=>(
          <div key={l} style={{ background:"linear-gradient(135deg,#061828,#09203a)", border:"1px solid "+c+"18", borderRadius:9, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(12px,3.5vw,16px)", color:c, marginBottom:3 }}>{v}</div>
            <div style={{ fontSize:9, color:"#8aaabb" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"linear-gradient(135deg,#0a0800,#1a1000)", border:"1px solid rgba(255,102,68,0.2)", borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ textAlign:"center", flex:1 }}>
            <div style={{ fontSize:24, marginBottom:2 }}>🔥</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:22, color:"#ff6644" }}>{st.streak}</div>
            <div style={{ fontSize:9, color:"#8aa0b0", marginTop:2 }}>연속 스트릭</div>
          </div>
          <div style={{ width:1, height:60, background:"#5a6570" }}/>
          <div style={{ flex:2, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[["총 집중", totalFocusSecs>0?fmtSecs(totalFocusSecs):"-"],["총 퀘스트",st.totalDone+"개"],["총 활동일",totalActiveDays+"일"],["레벨","LV."+lvInfo.lv]].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:"#c8e8ff" }}>{v}</div>
                <div style={{ fontSize:8, color:"#8aaabb", marginTop:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#061828,#0a2040)", border:"1px solid rgba(0,212,255,0.1)", borderRadius:12, padding:"14px 16px" }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#8aaabb", letterSpacing:2, marginBottom:12 }}>요일별 활동 패턴</div>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:50 }}>
          {["일","월","화","수","목","금","토"].map((d,i)=>{
            const h=maxDow>0?(dayOfWeekCount[i]/maxDow)*100:0;
            const isWeekend=i===0||i===6;
            return (
              <div key={d} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{ width:"100%", background:"rgba(0,212,255,"+(0.1+h*0.008)+")", border:"1px solid rgba(0,212,255,"+(0.1+h*0.005)+")", borderRadius:3, height:Math.max(h,8)+"%", minHeight:4, transition:"height .5s ease" }}/>
                <div style={{ fontSize:8, color:isWeekend?"rgba(0,212,255,0.5)":"#8aaabb" }}>{d}</div>
              </div>
            );
          })}
        </div>
        {totalActiveDays===0 && <div style={{ textAlign:"center", fontSize:10, color:"#7a9aaa", marginTop:8 }}>퀘스트를 완료하면 패턴이 나타나요</div>}
      </div>
    </div>
  );
}


function AchievementsTab({ st }) {
  const lvInfo=getLevelInfo(st.totalXp);
  const achSt={
    totalDone:st.totalDone, streak:st.streak, lv:lvInfo.lv,
    constCount:st.ownedConstellations.length,
    hasRare:st.ownedConstellations.some(o=>["rare","epic","legendary","mythic"].includes(CONSTELLATIONS.find(c=>c.id===o.id)?.rarity)),
    hasMythic:st.ownedConstellations.some(o=>CONSTELLATIONS.find(c=>c.id===o.id)?.rarity==="mythic"),
    dungeonClears:st.dungeonClears||0, totalGacha:st.totalGacha||0,
  };
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
      {ACHIEVEMENTS.map(a=>{
        const ok=st.unlockedAch.includes(a.id);
        return (
          <div key={a.id} style={{ background:"linear-gradient(135deg,#061828,#0a2040)", border:`1px solid ${ok?"rgba(0,212,255,0.2)":"#091828"}`, borderRadius:9, padding:"12px 8px", textAlign:"center", opacity:ok?1:0.3 }}>
            <div style={{ fontSize:20, marginBottom:3 }}>{ok?a.icon:"🔒"}</div>
            <div style={{ fontSize:10, color:"#c8e8ff", fontWeight:500, marginBottom:2 }}>{a.name}</div>
            <div style={{ fontSize:9, color:"#8aaabb", lineHeight:1.4 }}>{a.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// SHINJEON TAB (신전)
// ══════════════════════════════════════════════════════════════════
// 더미 멤버 데이터 (Firebase 연동 전 UI 미리보기용)
const DUMMY_MEMBERS = [
  { uid:"u1", nickname:"오리온 성전사",   lv:23, voc:"star_knight", mainConst:"r07", sungryeok:342, weeklySr:342, isLeader:true },
  { uid:"u2", nickname:"전갈 성직자",     lv:15, voc:"priest",      mainConst:"u08", sungryeok:287, weeklySr:287 },
  { uid:"u3", nickname:"북극성 성자",     lv:31, voc:"star_sage",   mainConst:"l01", sungryeok:256, weeklySr:256 },
  { uid:"u4", nickname:"용 별의기사",     lv:18, voc:"star_knight", mainConst:"e03", sungryeok:198, weeklySr:198 },
  { uid:"u5", nickname:"별빛 방랑자",     lv:5,  voc:"seeker",      mainConst:"c01", sungryeok:120, weeklySr:120 },
];

function ShinjeonTab({ st, setSt, showNotif }) {
  const [view, setView] = useState("main");
  const [inputName, setInputName] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [inputNick, setInputNick] = useState(st.nickname||"");
  const [isPublic, setIsPublic] = useState(true);
  const [inputPassword, setInputPassword] = useState("");
  const [inputJoinPassword, setInputJoinPassword] = useState("");
  const [showNickEdit, setShowNickEdit] = useState(!st.nickname);
  const [tooltipStep, setTooltipStep] = useState(st.shinjeonTooltipSeen ? null : 0);

  // 신전 툴팁 단계
  const SHINJEON_TIPS = [
    { icon:"⛩️", title:"신전이란?",
      desc:"신전은 함께 공부하는 그룹이에요.\n최대 30명이 모여 서로의 공부 현황을\n실시간으로 확인할 수 있어요.", color:"#ffd700" },
    { icon:"🔥", title:"성력 시스템",
      desc:"집중 모드 실행 중 분당 1성력이 쌓여요.\n퀘스트 완료 시 +2성력도 추가돼요.\n주간 성력으로 멤버 랭킹이 정해져요.", color:"#ff8800" },
    { icon:"👑", title:"교황 권한",
      desc:"신전을 창설하면 교황가 돼요.\n멤버 추방, 이름/소개 변경,\n공개/비공개 전환이 가능해요.", color:"#ffd700" },
    { icon:"🔑", title:"가입 방법",
      desc:"공개 신전은 검색으로 바로 가입,\n비공개 신전은 초대 코드 + 비밀번호가\n필요해요.", color:"#00d4ff" },
  ];

  const currentTip = tooltipStep !== null ? SHINJEON_TIPS[tooltipStep] : null;

  function nextTip() {
    if (tooltipStep < SHINJEON_TIPS.length - 1) {
      setTooltipStep(tooltipStep + 1);
    } else {
      setTooltipStep(null);
      setSt(p=>({...p, shinjeonTooltipSeen:true}));
    }
  }

  const inShinjeon = !!st.shinjeon;
  const isLeader = st.shinjeon?.leaderId === "me";

  // 더미 신전 목록 (검색용)
  const DUMMY_SHINJEOPS = [
    { id:"s1", name:"별의 서약",    desc:"매일 공부하는 사람들의 신전", members:12, maxMembers:30, isPublic:true  },
    { id:"s2", name:"성좌 수호단",  desc:"서울대 목표 스터디",          members:8,  maxMembers:30, isPublic:true  },
    { id:"s3", name:"새벽의 성자",  desc:"새벽 공부 모임",              members:25, maxMembers:30, isPublic:true  },
  ];

  function saveNickname() {
    if (!inputNick.trim()) { showNotif("닉네임을 입력하세요","#ff4d6d"); return; }
    setSt(p=>({...p, nickname:inputNick.trim()}));
    setShowNickEdit(false);
    showNotif("닉네임 저장!","#00d4ff");
  }

  function createShinjeon() {
    if (!inputName.trim()) { showNotif("신전 이름을 입력하세요","#ff4d6d"); return; }
    if (!st.nickname) { showNotif("먼저 닉네임을 설정하세요","#ff4d6d"); return; }
    if (!isPublic && !inputPassword.trim()) { showNotif("비공개 신전은 비밀번호를 설정해야 해요","#ff4d6d"); return; }
    const newSj = { id:"my_sj", name:inputName.trim(), desc:inputDesc.trim(),
      isPublic, leaderId:"me", code:"STAR"+Math.random().toString(36).slice(2,6).toUpperCase(),
      password: !isPublic ? inputPassword.trim() : null,
      members:[] };
    setSt(p=>({...p, shinjeon:newSj}));
    showNotif(`신전 "${inputName}" 창설!`,"#ffd700");
    setView("main");
  }

  function joinShinjeon(sj) {
    if (!st.nickname) { showNotif("먼저 닉네임을 설정하세요","#ff4d6d"); return; }
    setSt(p=>({...p, shinjeon:{...sj, leaderId:"other", members:[]}}));
    showNotif(`신전 "${sj.name}" 가입!`,"#00d4ff");
    setView("main");
  }

  function leaveShinjeon() {
    setSt(p=>({...p, shinjeon:null}));
    showNotif("신전 탈퇴","#556677");
    setView("main");
  }

  const lvInfo = getLevelInfo(st.totalXp);
  const mainC = st.mainConstId ? CONSTELLATIONS.find(c=>c.id===st.mainConstId) : null;
  const voc = VOCATION_TREE[st.vocation||"none"];
  const [selectedMember, setSelectedMember] = useState(null);

  // 멤버 랭킹 (더미 + 나) — isMe가 교황면 isLeader도 true
  const myEntry = { uid:"me", nickname:st.nickname||"나", lv:lvInfo.lv,
    voc:st.vocation, mainConst:st.mainConstId, sungryeok:st.sungryeok||0,
    weeklySr:st.weeklySungryeok||0, isMe:true, isLeader:isLeader };
  const allMembers = inShinjeon
    ? [...(st.shinjeon.members||[]), myEntry].sort((a,b)=>b.weeklySr-a.weeklySr)
    : [];

  // ── 멤버 명단 화면
  if (view==="members") return (
    <div>
      <button style={{ background:"transparent", border:"none", color:"#8aa0b0", cursor:"pointer", fontSize:12, marginBottom:16 }}
        onClick={()=>setView("main")}>← 돌아가기</button>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:"#00d4ff", letterSpacing:2, marginBottom:16 }}>
        멤버 명단 <span style={{ fontSize:9, color:"#8aaabb" }}>({allMembers.length}/30)</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {allMembers.map((m) => {
          const mc = CONSTELLATIONS.find(c=>c.id===m.mainConst);
          const r = mc ? RARITY[mc.rarity] : null;
          const v = VOCATION_TREE[m.voc||"none"];
          const owned = st.ownedConstellations.find(o=>o.id===mc?.id);
          const constName = mc?.rarity==="mythic"&&!owned?.nameUnlocked?"잊혀진 별":mc?.name;
          return (
            <div key={m.uid}
              onClick={()=>{ setSelectedMember(m); setView("profile"); }}
              style={{ display:"flex", alignItems:"center", gap:10,
                background:m.isMe?"linear-gradient(135deg,#061828,#0a2840)":"linear-gradient(135deg,#040f1c,#061828)",
                border:`1px solid ${m.isMe?"#00d4ff33":"#152535"}`,
                borderRadius:9, padding:"10px 12px", cursor:"pointer",
                transition:"all .15s" }}>
              {mc && <ConstellationSVG constId={mc.id} rarity={mc.rarity} color={r?.color||"#aaa"} size={28} animate={false}/>}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                  <span style={{ fontSize:11, color:m.isMe?"#00d4ff":"#c8e8ff",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.nickname}</span>
                  {m.isLeader && <span style={{ fontSize:8, color:"#ffd700", background:"rgba(255,215,0,0.1)",
                    border:"1px solid rgba(255,215,0,0.3)", borderRadius:3, padding:"1px 4px" }}>교황</span>}
                  {m.isMe && !m.isLeader && <span style={{ fontSize:8, color:"#00d4ff88" }}>나</span>}
                </div>
                <div style={{ fontSize:8, color:"#8aaabb" }}>Lv.{m.lv} {v.name}{constName?` · ${constName}`:""}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:"#ffd700" }}>{(m.weeklySr||0).toLocaleString()}</div>
                <div style={{ fontSize:7, color:"#8aaabb" }}>주간 성력</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── 멤버 프로필 화면
  if (view==="profile" && selectedMember) {
    const m = selectedMember;
    const mc = CONSTELLATIONS.find(c=>c.id===m.mainConst);
    const r = mc ? RARITY[mc.rarity] : null;
    const v = VOCATION_TREE[m.voc||"none"];
    const owned = m.isMe ? st.ownedConstellations.find(o=>o.id===mc?.id) : null;
    const constName = mc?.rarity==="mythic"&&!owned?.nameUnlocked?"잊혀진 별":mc?.name;
    return (
      <div>
        <button style={{ background:"transparent", border:"none", color:"#8aa0b0", cursor:"pointer", fontSize:12, marginBottom:16 }}
          onClick={()=>{ setSelectedMember(null); setView("members"); }}>← 멤버 명단</button>
        <div style={{ background:"linear-gradient(160deg,#061828,#0a2040)",
          border:`1px solid ${r?.color||"#00d4ff"}44`, borderRadius:14, padding:"24px 16px",
          textAlign:"center", marginBottom:14, boxShadow:`0 0 24px ${r?.color||"#00d4ff"}18` }}>
          {mc ? (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:14,
              filter:`drop-shadow(0 0 10px ${r?.color||"#aaa"})` }}>
              <ConstellationSVG constId={mc.id} rarity={mc.rarity} color={r?.color||"#aaa"} size={80} animate={true}/>
            </div>
          ) : (
            <div style={{ fontSize:40, marginBottom:14, opacity:0.3 }}>✦</div>
          )}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:6 }}>
            <div style={{ fontSize:"clamp(15px,4vw,18px)", color:m.isMe?"#00d4ff":"#c8e8ff", fontWeight:700 }}>{m.nickname}</div>
            {m.isLeader && <span style={{ fontSize:9, color:"#ffd700", background:"rgba(255,215,0,0.1)",
              border:"1px solid rgba(255,215,0,0.3)", borderRadius:4, padding:"2px 6px" }}>교황</span>}
            {m.isMe && <span style={{ fontSize:9, color:"#00d4ff66", marginLeft:2 }}>나</span>}
          </div>
          <div style={{ fontSize:11, color:v.color, marginBottom:4 }}>{v.icon} {v.name}</div>
          {mc && <div style={{ fontSize:9, color:r?.color||"#aaa" }}>[{RARITY[mc.rarity].label}] {constName||mc.name}</div>}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:14 }}>
          {[
            ["레벨", `LV.${m.lv}`, "#00d4ff"],
            ["누적 성력", `${(m.sungryeok||0).toLocaleString()}`, "#ffd700"],
            ["주간 성력", `${(m.weeklySr||0).toLocaleString()}`, "#ffd700"],
            ["별자리", mc?(constName||mc.name):"-", r?.color||"#8aaabb"],
          ].map(([l,val,c])=>(
            <div key={l} style={{ background:"linear-gradient(135deg,#061828,#09203a)",
              border:`1px solid ${c}22`, borderRadius:9, padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"clamp(12px,3.5vw,15px)", color:c, marginBottom:3 }}>{val}</div>
              <div style={{ fontSize:9, color:"#8aaabb" }}>{l}</div>
            </div>
          ))}
        </div>
        {isLeader && !m.isMe && (
          <button style={{ width:"100%", background:"transparent",
            border:"1px solid rgba(255,77,109,0.2)", borderRadius:7, padding:"10px",
            color:"rgba(255,77,109,0.7)", cursor:"pointer", fontSize:11 }}
            onClick={()=>{
              setSt(p=>({...p, shinjeon:{...p.shinjeon,
                members:(p.shinjeon.members||[]).filter(mem=>mem.uid!==m.uid)
              }}));
              showNotif(`${m.nickname} 추방됨`,"#ff4d6d");
              setSelectedMember(null);
              setView("members");
            }}>
            멤버 추방
          </button>
        )}
      </div>
    );
  }

  // ── 신전 툴팁 (첫 진입 시)
  if (currentTip) return (
    <div>
      <div style={{ background:`linear-gradient(160deg,#061828,#0a2040)`,
        border:`1px solid ${currentTip.color}44`, borderRadius:14,
        padding:"28px 20px", textAlign:"center",
        boxShadow:`0 0 24px ${currentTip.color}18` }}>
        {/* 진행 점 */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
          {SHINJEON_TIPS.map((_,i)=>(
            <div key={i} style={{ width:i===tooltipStep?20:7, height:7, borderRadius:4,
              background:i<=tooltipStep?currentTip.color:"#152535", transition:"all .3s" }}/>
          ))}
        </div>
        <div style={{ fontSize:"clamp(40px,10vw,52px)", marginBottom:14,
          filter:`drop-shadow(0 0 12px ${currentTip.color})` }}>
          {currentTip.icon}
        </div>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
          color:currentTip.color+"88", letterSpacing:3, marginBottom:8 }}>
          신전 가이드 {tooltipStep+1}/{SHINJEON_TIPS.length}
        </div>
        <div style={{ fontFamily:"'Orbitron',sans-serif",
          fontSize:"clamp(15px,4vw,18px)", fontWeight:700,
          color:currentTip.color, marginBottom:14,
          textShadow:`0 0 16px ${currentTip.color}66` }}>
          {currentTip.title}
        </div>
        <div style={{ fontSize:"clamp(12px,3vw,14px)", color:"#c8e8ff",
          lineHeight:1.8, marginBottom:24, whiteSpace:"pre-line" }}>
          {currentTip.desc}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ flex:1, background:`linear-gradient(135deg,${currentTip.color}33,${currentTip.color}11)`,
            border:`1px solid ${currentTip.color}55`, borderRadius:10, padding:"12px",
            color:currentTip.color, cursor:"pointer",
            fontFamily:"'Orbitron',sans-serif", fontSize:12, letterSpacing:1 }}
            onClick={nextTip}>
            {tooltipStep < SHINJEON_TIPS.length-1 ? "다음 →" : "시작하기 ✦"}
          </button>
          {tooltipStep < SHINJEON_TIPS.length-1 && (
            <button style={{ background:"transparent", border:"1px solid #152535",
              borderRadius:10, padding:"12px 16px", color:"#4a6070",
              cursor:"pointer", fontSize:11 }}
              onClick={()=>{ setTooltipStep(null); setSt(p=>({...p, shinjeonTooltipSeen:true})); }}>
              건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── 닉네임 설정 화면
  if (showNickEdit) return (
    <div>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, color:"#00d4ff", letterSpacing:3, marginBottom:6 }}>닉네임 설정</div>
      <div style={{ fontSize:11, color:"#8aa0b0", marginBottom:20 }}>신전에서 사용할 닉네임을 정해주세요.</div>
      <input style={{...ST.input, marginBottom:10}} placeholder="닉네임 (최대 15자)"
        value={inputNick} maxLength={15}
        onChange={e=>setInputNick(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&saveNickname()}/>
      <button style={ST.confirmBtn} onClick={saveNickname}>저장</button>
    </div>
  );

  // ── 신전 생성 화면
  if (view==="create") return (
    <div>
      <button style={{ background:"transparent", border:"none", color:"#8aa0b0", cursor:"pointer", fontSize:12, marginBottom:16 }}
        onClick={()=>setView("main")}>← 돌아가기</button>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:"#00d4ff", letterSpacing:2, marginBottom:16 }}>신전 창설</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <input style={ST.input} placeholder="신전 이름 (최대 16자)" maxLength={16}
          value={inputName} onChange={e=>setInputName(e.target.value)}/>
        <textarea style={{...ST.input, height:70, resize:"none"}} placeholder="신전 소개 (선택)"
          value={inputDesc} onChange={e=>setInputDesc(e.target.value)}/>
        <div style={{ display:"flex", gap:8 }}>
          {[["공개","true"],["비공개","false"]].map(([l,v])=>(
            <button key={v} style={{...ST.schedBtn, borderColor:String(isPublic)===v?"#00d4ff55":"#091828",
              color:String(isPublic)===v?"#00d4ff":"#8aaabb"}}
              onClick={()=>{ setIsPublic(v==="true"); setInputPassword(""); }}>{l}</button>
          ))}
        </div>
        {!isPublic && (
          <div>
            <div style={{ fontSize:9, color:"#8aaabb", marginBottom:6 }}>
              🔒 비밀번호 설정 <span style={{ color:"rgba(255,77,109,0.7)" }}>*필수</span>
            </div>
            <input style={{...ST.input, letterSpacing:2}}
              type="password" placeholder="비밀번호 입력 (최대 20자)" maxLength={20}
              value={inputPassword} onChange={e=>setInputPassword(e.target.value)}/>
            <div style={{ fontSize:8, color:"#7a9aaa", marginTop:4 }}>
              코드로 가입 시 이 비밀번호가 필요해요
            </div>
          </div>
        )}
        <button style={ST.confirmBtn} onClick={createShinjeon}>신전 창설</button>
      </div>
    </div>
  );

  // ── 코드 가입 화면
  if (view==="code") return (
    <div>
      <button style={{ background:"transparent", border:"none", color:"#8aa0b0", cursor:"pointer", fontSize:12, marginBottom:16 }}
        onClick={()=>setView("main")}>← 돌아가기</button>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:"#00d4ff", letterSpacing:2, marginBottom:16 }}>코드로 가입</div>
      <input style={{...ST.input, marginBottom:10, fontFamily:"'Orbitron',sans-serif", letterSpacing:3}}
        placeholder="초대 코드 입력" value={inputCode}
        onChange={e=>setInputCode(e.target.value.toUpperCase())} maxLength={10}/>
      <input style={{...ST.input, marginBottom:10, letterSpacing:2}}
        type="password" placeholder="비밀번호 (공개 신전은 생략 가능)" maxLength={20}
        value={inputJoinPassword} onChange={e=>setInputJoinPassword(e.target.value)}/>
      <button style={ST.confirmBtn} onClick={()=>{
        if(!inputCode.trim()){showNotif("코드를 입력하세요","#ff4d6d");return;}
        showNotif("서버 연동 후 사용 가능해요","#556677");
      }}>가입</button>
      <div style={{ textAlign:"center", marginTop:16, fontSize:9, color:"#4a6070" }}>
        Supabase 연동 후 실제 코드로 가입할 수 있어요
      </div>
    </div>
  );

  // ── 검색 화면
  if (view==="search") return (
    <div>
      <button style={{ background:"transparent", border:"none", color:"#8aa0b0", cursor:"pointer", fontSize:12, marginBottom:16 }}
        onClick={()=>setView("main")}>← 돌아가기</button>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:"#00d4ff", letterSpacing:2, marginBottom:12 }}>신전 검색</div>
      <input style={{...ST.input, marginBottom:16}} placeholder="신전 이름 검색..."
        value={inputSearch} onChange={e=>setInputSearch(e.target.value)}/>
      <div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ fontSize:32, marginBottom:12, opacity:0.3 }}>⛩️</div>
        <div style={{ fontSize:12, color:"#8aaabb", marginBottom:6 }}>검색 기능 준비 중이에요</div>
        <div style={{ fontSize:10, color:"#4a6070", lineHeight:1.7 }}>
          Supabase 연동 후 실제 신전을 검색할 수 있어요.<br/>
          코드로 가입하거나 직접 신전을 창설해보세요!
        </div>
      </div>
    </div>
  );

  // ── 신전 설정 화면 (교황만)
  if (view==="settings" && isLeader) return (
    <div>
      <button style={{ background:"transparent", border:"none", color:"#8aa0b0", cursor:"pointer", fontSize:12, marginBottom:16 }}
        onClick={()=>setView("main")}>← 돌아가기</button>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:"#00d4ff", letterSpacing:2, marginBottom:16 }}>신전 관리</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <input style={ST.input} placeholder="신전 이름 변경" defaultValue={st.shinjeon?.name}/>
        <textarea style={{...ST.input, height:60, resize:"none"}} placeholder="소개 변경" defaultValue={st.shinjeon?.desc}/>
        <div style={{ display:"flex", gap:8 }}>
          {[["공개","true"],["비공개","false"]].map(([l,v])=>(
            <button key={v} style={{...ST.schedBtn,
              borderColor:String(st.shinjeon?.isPublic)===v?"#00d4ff55":"#091828",
              color:String(st.shinjeon?.isPublic)===v?"#00d4ff":"#8aaabb"}}>{l}</button>
          ))}
        </div>
        {!st.shinjeon?.isPublic && (
          <div>
            <div style={{ fontSize:9, color:"#8aaabb", marginBottom:6 }}>🔒 비밀번호 변경</div>
            <input style={{...ST.input, letterSpacing:2}}
              type="password" placeholder="새 비밀번호 입력" maxLength={20}/>
          </div>
        )}
        <button style={ST.confirmBtn}>변경 저장</button>
        <div style={{ marginTop:8, borderTop:"1px solid #0a2030", paddingTop:12 }}>
          <div style={{ fontSize:10, color:"#ff4d6d", marginBottom:4 }}>위험 구역</div>
          <button style={{ background:"transparent", border:"1px solid rgba(255,77,109,0.2)",
            borderRadius:6, padding:"7px 14px", color:"#ff4d6d", cursor:"pointer", fontSize:11 }}
            onClick={leaveShinjeon}>신전 해산</button>
        </div>
      </div>
    </div>
  );

  // ── 메인 화면 (미가입)
  if (!inShinjeon) return (
    <div>
      {/* 닉네임 표시 */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20,
        background:"linear-gradient(135deg,#061828,#0a2040)", border:"1px solid #00d4ff18",
        borderRadius:10, padding:"12px 14px" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0044aa,#00d4ff)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>✦</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, color:"#c8e8ff", fontWeight:600 }}>{st.nickname}</div>
          <div style={{ fontSize:9, color:"#8aa0b0" }}>LV.{lvInfo.lv} · {voc.name}</div>
        </div>
        <button style={{ background:"transparent", border:"1px solid #00d4ff22", borderRadius:5,
          padding:"4px 8px", fontSize:9, color:"#8aa0b0", cursor:"pointer" }}
          onClick={()=>setShowNickEdit(true)}>수정</button>
      </div>

      <div style={{ textAlign:"center", padding:"20px 0 24px" }}>
        <div style={{ fontSize:32, marginBottom:10, opacity:0.3 }}>⛩️</div>
        <div style={{ fontSize:13, color:"#c8e8ff", marginBottom:6 }}>소속된 신전이 없습니다</div>
        <div style={{ fontSize:11, color:"#8aaabb", lineHeight:1.7 }}>
          신전에 가입하면 퀘스트 완료 시<br/>
          성력을 획득하고 멤버들과 경쟁할 수 있어요
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <button style={{ background:"linear-gradient(135deg,#ffd70022,#ffd70011)",
          border:"1px solid rgba(255,215,0,0.27)", borderRadius:10, padding:"14px",
          color:"#ffd700", cursor:"pointer", fontSize:12, textAlign:"left" }}
          onClick={()=>setView("create")}>
          <div style={{ fontWeight:700, marginBottom:2 }}>⛩️ 신전 창설</div>
          <div style={{ fontSize:10, opacity:0.7 }}>나만의 신전을 만들고 멤버를 모집하세요</div>
        </button>
        <button style={{ background:"linear-gradient(135deg,#00d4ff14,#00d4ff08)",
          border:"1px solid rgba(0,212,255,0.2)", borderRadius:10, padding:"14px",
          color:"#00d4ff", cursor:"pointer", fontSize:12, textAlign:"left" }}
          onClick={()=>setView("search")}>
          <div style={{ fontWeight:700, marginBottom:2 }}>🔍 신전 검색</div>
          <div style={{ fontSize:10, opacity:0.7 }}>공개 신전을 검색해 가입하세요</div>
        </button>
        <button style={{ background:"linear-gradient(135deg,#7b61ff14,#7b61ff08)",
          border:"1px solid rgba(123,97,255,0.2)", borderRadius:10, padding:"14px",
          color:"#7b61ff", cursor:"pointer", fontSize:12, textAlign:"left" }}
          onClick={()=>setView("code")}>
          <div style={{ fontWeight:700, marginBottom:2 }}>🔑 코드로 가입</div>
          <div style={{ fontSize:10, opacity:0.7 }}>초대 코드를 입력해 가입하세요</div>
        </button>
      </div>
    </div>
  );

  // ── 메인 화면 (가입 중)
  return (
    <div>
      {/* 신전 헤더 */}
      <div style={{ background:"linear-gradient(135deg,#0c1a0c,#0a2040)",
        border:"1px solid rgba(255,215,0,0.2)", borderRadius:12, padding:"16px",
        marginBottom:14, boxShadow:"0 0 20px rgba(255,215,0,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ fontSize:28 }}>⛩️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, color:"#ffd700", fontWeight:700 }}>{st.shinjeon.name}</div>
            <div style={{ fontSize:9, color:"#8aa0b0", marginTop:2 }}>{st.shinjeon.desc||"신전 소개 없음"}</div>
          </div>
          {isLeader && (
            <button style={{ background:"transparent", border:"1px solid rgba(255,215,0,0.2)",
              borderRadius:5, padding:"4px 8px", fontSize:9, color:"rgba(255,215,0,0.6)", cursor:"pointer" }}
              onClick={()=>setView("settings")}>관리</button>
          )}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {[
            ["멤버",`${(st.shinjeon.members?.length||0)+1}/30명`, true],
            ["나의 성력",`${(st.sungryeok||0).toLocaleString()}`, false],
            ["주간 성력",`${(st.weeklySungryeok||0).toLocaleString()}`, false],
          ].map(([l,v,clickable])=>(
            <div key={l} onClick={clickable?()=>setView("members"):undefined}
              style={{ flex:1, background:"#040f1c", borderRadius:7, padding:"8px", textAlign:"center",
                cursor:clickable?"pointer":"default",
                border:clickable?"1px solid rgba(0,212,255,0.1)":"none",
                transition:"all .15s" }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:clickable?"#00d4ff":"#ffd700" }}>{v}</div>
              <div style={{ fontSize:8, color:"#8aaabb", marginTop:2 }}>{l}{clickable?" →":""}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 초대 코드 */}
      {isLeader && st.shinjeon.code && (
        <div style={{ background:"#061828", border:"1px solid #00d4ff14", borderRadius:8,
          padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:"#8aaabb", marginBottom:2 }}>초대 코드</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:"#00d4ff", letterSpacing:3 }}>
              {st.shinjeon.code}
            </div>
          </div>
          <button style={{ background:"transparent", border:"1px solid #00d4ff22", borderRadius:5,
            padding:"5px 10px", fontSize:9, color:"#00d4ff", cursor:"pointer" }}
            onClick={()=>showNotif("코드 복사됨!","#00d4ff")}>복사</button>
        </div>
      )}

      {/* 주간 랭킹 */}
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:"#8aaabb", letterSpacing:2, marginBottom:8 }}>
        주간 성력 랭킹
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
        {allMembers.map((m, idx) => {
          const mc = CONSTELLATIONS.find(c=>c.id===m.mainConst);
          const r = mc ? RARITY[mc.rarity] : null;
          const v = VOCATION_TREE[m.voc||"none"];
          const rankColor = idx===0?"#ffd700":idx===1?"#aaaaaa":idx===2?"#cd7f32":"#8aaabb";
          const owned = st.ownedConstellations.find(o=>o.id===mc?.id);
          const constName = mc?.rarity==="mythic"&&!owned?.nameUnlocked?"잊혀진 별":mc?.name;
          return (
            <div key={m.uid}
              onClick={()=>{ setSelectedMember(m); setView("profile"); }}
              style={{ display:"flex", alignItems:"center", gap:10,
                background:m.isMe?"linear-gradient(135deg,#061828,#0a2840)":"linear-gradient(135deg,#040f1c,#061828)",
                border:`1px solid ${m.isMe?"#00d4ff33":"#091828"}`,
                borderRadius:9, padding:"10px 12px", cursor:"pointer", transition:"all .15s" }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:rankColor,
                width:24, textAlign:"center", flexShrink:0 }}>
                {idx===0?"👑":idx+1}
              </div>
              {mc && (
                <div style={{ flexShrink:0 }}>
                  <ConstellationSVG constId={mc.id} rarity={mc.rarity} color={r?.color||"#aaa"} size={28} animate={false}/>
                </div>
              )}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:11, color:m.isMe?"#00d4ff":"#c8e8ff", fontWeight:m.isMe?700:400,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.nickname}</span>
                  {m.isLeader && <span style={{ fontSize:8, color:"#ffd700", background:"rgba(255,215,0,0.1)",
                    border:"1px solid rgba(255,215,0,0.25)", borderRadius:3, padding:"1px 4px" }}>교황</span>}
                  {m.isMe && !m.isLeader && <span style={{ fontSize:8, color:"#00d4ff88" }}>나</span>}
                </div>
                <div style={{ fontSize:8, color:"#8aaabb", marginTop:1 }}>
                  Lv.{m.lv} {v.name}{constName?` · ${constName}`:""}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:"#ffd700" }}>
                  {(m.weeklySr||0).toLocaleString()}
                </div>
                <div style={{ fontSize:8, color:"#8aaabb" }}>성력</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 내 정보 + 닉네임 수정 + 탈퇴 */}
      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, background:"transparent", border:"1px solid #00d4ff18",
          borderRadius:7, padding:"8px", fontSize:10, color:"#8aa0b0", cursor:"pointer" }}
          onClick={()=>setShowNickEdit(true)}>닉네임 수정</button>
        <button style={{ background:"transparent", border:"1px solid rgba(255,77,109,0.2)",
          borderRadius:7, padding:"8px 14px", fontSize:10, color:"#ff4d6d66", cursor:"pointer" }}
          onClick={leaveShinjeon}>탈퇴</button>
      </div>
    </div>
  );
}

function TimerSidePanel({ st, sorted, timerRunning, swRunning, pomoDurSec, timerSec, swSec }) {
  const [panelTab, setPanelTab] = useState("quest");
  const inSj = !!st.shinjeon;
  const myStudying = timerRunning || swRunning;
  const mySecs = timerRunning ? Math.max(0, pomoDurSec - timerSec) : swSec;

  const dummyActive = [
    {uid:"u1", nickname:"오리온 성전사", studying:true,  secs:3720},
    {uid:"u2", nickname:"전갈 성직자",   studying:false, secs:0},
    {uid:"u3", nickname:"북극성 성자",   studying:true,  secs:1240},
    {uid:"u4", nickname:"용 별의기사",   studying:true,  secs:540},
    {uid:"u5", nickname:"별빛 방랑자",   studying:false, secs:0},
  ];

  function fmtSecs(s) {
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60);
    return h>0 ? `${h}시간 ${m}분` : `${m}분`;
  }

  return (
    <>
      {/* 탭 버튼 */}
      <div style={{display:"flex",gap:4,marginBottom:10}}>
        {[["quest","퀘스트"],["shinjeon","⛩️ 신전"]].map(([t,l])=>(
          <button key={t} style={{flex:1,background:panelTab===t?"#00d4ff0a":"transparent",
            border:`1px solid ${panelTab===t?"#00d4ff33":"#091828"}`,
            borderRadius:5,padding:"5px 0",fontSize:9,
            color:panelTab===t?"#00d4ff":"#8aaabb",cursor:"pointer"}}
            onClick={()=>setPanelTab(t)}>{l}</button>
        ))}
      </div>

      {/* 퀘스트 패널 */}
      {panelTab==="quest" && (<>
        {sorted.length===0 && <div style={{fontSize:11,color:"#7a9aaa",textAlign:"center",paddingTop:20}}>퀘스트가 없습니다</div>}
        {sorted.map(q=>{
          const p=PRIO.find(pp=>pp.key===q.priority);
          return (
            <div key={q.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",marginBottom:6,
              background:"linear-gradient(135deg,#061828,#0a2040)",
              border:`1px solid ${q.done?"#091828":`${p.color}33`}`,borderRadius:7,opacity:q.done?0.45:1}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:q.done?p.color:"transparent",
                border:`2px solid ${q.done?p.color:`${p.color}66`}`,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,color:q.done?"#aabbcc":"#c8e8ff",textDecoration:q.done?"line-through":"none",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.title}</div>
                <div style={{fontSize:9,color:p.color,marginTop:1}}>◆{p.label} {q.rewarded?`+${p.xp}XP`:"보상없음"}</div>
              </div>
            </div>
          );
        })}
      </>)}

      {/* 신전 패널 */}
      {panelTab==="shinjeon" && (
        <div>
          {!inSj ? (
            <div style={{textAlign:"center",paddingTop:24}}>
              <div style={{fontSize:20,marginBottom:6,opacity:0.3}}>⛩️</div>
              <div style={{fontSize:10,color:"#8aaabb"}}>신전에 가입하면<br/>멤버 현황을 볼 수 있어요</div>
            </div>
          ) : (<>
            <div style={{fontSize:9,color:"#8aaabb",marginBottom:8}}>{st.shinjeon.name} · 지금 공부 중</div>
            {/* 나 */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:5,
              background:"linear-gradient(135deg,#061828,#0a2840)",
              border:`1px solid ${myStudying?"#00d4ff44":"#091828"}`,borderRadius:7}}>
              <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,
                background:myStudying?"#00d4ff":"#8aaabb",
                boxShadow:myStudying?"0 0 6px #00d4ff":""}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,color:"#00d4ff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {st.nickname||"나"} <span style={{fontSize:8,color:"#00d4ff66"}}>나</span>
                </div>
                <div style={{fontSize:8,color:"#8aaabb",marginTop:1}}>
                  {myStudying ? fmtSecs(mySecs)+" 집중 중" : "대기 중"}
                </div>
              </div>
              {myStudying && (
                <div style={{fontSize:8,color:"rgba(255,215,0,0.6)",fontFamily:"'Orbitron',sans-serif"}}>
                  +{Math.floor(mySecs/60)}성력
                </div>
              )}
            </div>
            {/* 더미 멤버 제거 - Supabase 연동 후 실제 데이터 표시 */}
            <div style={{fontSize:8,color:"#4a6070",textAlign:"center",marginTop:16,lineHeight:1.7}}>
              Supabase 연동 후<br/>멤버 실시간 현황이 표시돼요
            </div>
          </>)}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// TUTORIAL OVERLAY
// ══════════════════════════════════════════════════════════════════
const TUTORIAL_STEPS = [
  null, // 0 = 미시작
  { step:1, total:4, tab:"quests",
    icon:"⚔️", title:"첫 퀘스트 등록",
    desc:"퀘스트 탭에서 + 버튼을 눌러\n오늘 할 일을 등록해보세요!\n\n📌 카테고리(태그)를 꼭 설정하세요!\n학습 태그 → 나머지 공부 던전 연동\n건강 태그 → 신체 강화 던전 연동\n\n관련 태그 퀘스트를 완료할수록\n던전 보상이 올라가요!",
    hint:"퀘스트 추가 → 카테고리 선택 → 확인",
    color:"#ffd700" },
  { step:2, total:4, tab:"quests",
    icon:"✅", title:"퀘스트 완료",
    desc:"등록한 퀘스트의 체크 버튼을 눌러\n완료해보세요!",
    hint:"퀘스트 왼쪽 동그라미를 탭하세요",
    color:"#00d4ff" },
  { step:3, total:4, tab:"summon",
    icon:"🌌", title:"별자리 소환",
    desc:"소환 탭으로 이동해서\n첫 별자리를 뽑아보세요!\n별빛 조각 10개가 지급됩니다.",
    hint:"✦ 소환 탭 → 1회 소환",
    color:"#7b61ff" },
  { step:4, total:4, tab:"dungeon",
    icon:"🏰", title:"던전에 별자리 강림",
    desc:"던전 탭에서 학습 또는 신체 강화 던전을 선택하고\n별자리를 골라 강림시켜보세요!\n강림한 별자리가 던전을 지켜줘요.",
    hint:"🏰 던전 탭 → 강림 버튼 → 별자리 선택 → 강림",
    color:"#00ff88",
    subPhases: [
      { icon:"⚔️", title:"던전 진행 중!",
        desc:"별자리가 던전을 지키고 있어요.\n\n📌 이제 관련 태그 퀘스트를 완료하세요!\n학습 던전 → 학습 태그 퀘스트 완료\n건강 던전 → 건강 태그 퀘스트 완료\n\n퀘스트 완료할수록 기여도가 올라가고\n던전 보상(XP, 별빛 조각)이 증가해요!\n\n실제로는 8시간이 필요하지만\n개발자 패널로 즉시 완료할 수 있어요.",
        hint:"맨 아래 🛠 테스트 패널 → 던전 즉시 완료",
        color:"#00ff88" },
      { icon:"🎁", title:"보상 수령!",
        desc:"던전이 완료됐어요!\n던전 탭으로 가서\n보상 수령 버튼을 눌러보세요.\nXP와 별빛 조각을 획득해요!",
        hint:"🏰 던전 탭 → 보상 수령 버튼",
        color:"#ffd700" },
    ]
  },
];

function TutorialOverlay({ st, setSt, setTab, showNotif }) {
  const baseStep = TUTORIAL_STEPS[st.tutorialStep];
  const [dungeonPhase, setDungeonPhase] = useState(0);
  const prevClears = useRef(st.dungeonClears||0);
  const isDungeonStep = st.tutorialStep === 4;

  // 3단계 진입 시 별빛 조각 10개 지급
  useEffect(() => {
    if (st.tutorialStep === 3 && st.starShards < 10) {
      setSt(p=>({...p, starShards:p.starShards+10}));
      showNotif("튜토리얼 보상: 별빛 조각 +10 ✨","#7b61ff");
    }
  }, [st.tutorialStep]);

  // 5단계 도달 = 완료
  useEffect(() => {
    if (st.tutorialStep === 5 && !st.tutorialDone) {
      setSt(p=>({...p, tutorialDone:true}));
    }
  }, [st.tutorialStep]);

  // 강림 감지 → 서브페이즈 1로
  useEffect(() => {
    if (isDungeonStep && st.activeDungeon && dungeonPhase === 0) {
      setDungeonPhase(1);
    }
  }, [st.activeDungeon, isDungeonStep]);

  // 던전 완료 감지 → 서브페이즈 2로
  useEffect(() => {
    if (isDungeonStep && dungeonPhase === 1 && !st.activeDungeon) {
      setDungeonPhase(2);
    }
  }, [st.activeDungeon, isDungeonStep, dungeonPhase]);

  // 던전 보상 수령 감지 → 튜토리얼 5단계로
  useEffect(() => {
    if (isDungeonStep && dungeonPhase === 2 && (st.dungeonClears||0) > prevClears.current) {
      setSt(p=>({...p, tutorialStep:5}));
    }
    prevClears.current = st.dungeonClears||0;
  }, [st.dungeonClears]);

  // early return은 모든 hooks 뒤에
  if (!baseStep || st.tutorialDone) return null;

  const subPhases = baseStep.subPhases;
  const step = isDungeonStep && dungeonPhase > 0
    ? { ...subPhases[dungeonPhase - 1], step:4, total:4 }
    : baseStep;
  return (
    <div style={{ position:"fixed", bottom:80, left:0, right:0, zIndex:500, padding:"0 12px", pointerEvents:"none" }}>
      <div style={{ background:"linear-gradient(135deg,rgba(6,24,40,0.98),rgba(10,34,64,0.98))",
        border:`1px solid ${step.color}55`, borderRadius:14, padding:"14px 16px",
        boxShadow:`0 0 24px ${step.color}22`, pointerEvents:"auto" }}>

        {/* 진행 바 */}
        <div style={{ display:"flex", gap:4, marginBottom:10 }}>
          {Array.from({length:step.total}).map((_,i)=>(
            <div key={i} style={{ flex:1, height:3, borderRadius:2,
              background:i<step.step?step.color:"#152535", transition:"all .3s" }}/>
          ))}
        </div>

        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:24, flexShrink:0, filter:`drop-shadow(0 0 8px ${step.color})` }}>
            {step.icon}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
                color:step.color, letterSpacing:1 }}>튜토리얼 {step.step}/{step.total}</span>
            </div>
            <div style={{ fontSize:"clamp(13px,3.5vw,15px)", color:"#c8e8ff",
              fontWeight:700, marginBottom:4 }}>{step.title}</div>
            <div style={{ fontSize:"clamp(11px,3vw,12px)", color:"#8aaabb",
              lineHeight:1.6, whiteSpace:"pre-line", marginBottom:6 }}>{step.desc}</div>
            <div style={{ fontSize:10, color:step.color+"aa",
              background:`${step.color}0f`, borderRadius:5, padding:"4px 8px",
              display:"inline-block" }}>💡 {step.hint}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
            <button style={{ background:`${step.color}22`, border:`1px solid ${step.color}55`,
              borderRadius:7, padding:"6px 12px", color:step.color, cursor:"pointer",
              fontSize:10, fontFamily:"'Orbitron',sans-serif", whiteSpace:"nowrap" }}
              onClick={()=>setTab(dungeonPhase===2?"dungeon":step.tab)}>
              {dungeonPhase===1?"테스트 패널↓":"이동 →"}
            </button>
            <button style={{ background:"transparent", border:"1px solid #152535",
              borderRadius:7, padding:"5px 8px", color:"#4a6070",
              cursor:"pointer", fontSize:9, whiteSpace:"nowrap" }}
              onClick={()=>setSt(p=>({...p, tutorialDone:true}))}>
              건너뛰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 튜토리얼 완료 팝업
function TutorialCompletePopup({ onClose }) {
  const [tick, setTick] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setTick(v=>v+1),50); return()=>clearInterval(t); },[]);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,8,20,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      {Array.from({length:24}).map((_,i)=>{
        const angle=(tick*(0.7+i*0.06)+i*15)%360;
        const rad=angle*Math.PI/180;
        const x=50+Math.cos(rad)*(60+i*10)/4;
        const y=50+Math.sin(rad)*(60+i*10)/6;
        const col=["#ffd700","#00d4ff","#7b61ff","#00ff88"][i%4];
        return <div key={i} style={{ position:"absolute",left:`${x}%`,top:`${y}%`,
          width:3,height:3,borderRadius:"50%",background:col,
          opacity:0.3+Math.sin(tick*0.05+i)*0.2,pointerEvents:"none" }}/>;
      })}
      <div style={{ position:"relative", zIndex:2, textAlign:"center",
        background:"linear-gradient(160deg,#061828,#0a2040)",
        border:"1px solid rgba(255,215,0,0.4)", borderRadius:16,
        padding:"32px 24px", maxWidth:320, width:"100%",
        boxShadow:"0 0 40px rgba(255,215,0,0.15)" }}>
        <div style={{ fontSize:48, marginBottom:16, filter:"drop-shadow(0 0 16px #ffd700)" }}>🎉</div>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10,
          color:"rgba(255,215,0,0.6)", letterSpacing:4, marginBottom:8 }}>TUTORIAL CLEAR</div>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:900,
          color:"#ffd700", textShadow:"0 0 20px rgba(255,215,0,0.5)", marginBottom:8 }}>
          튜토리얼 완료!
        </div>
        <div style={{ fontSize:12, color:"#c8e8ff", lineHeight:1.8, marginBottom:20 }}>
          이제 본격적으로 시작해볼까요?
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:20 }}>
          {[["⭐ XP","+ 200","#00d4ff"],["✨ 별빛 조각","+ 50","#7b61ff"]].map(([l,v,c])=>(
            <div key={l} style={{ background:`${c}14`, border:`1px solid ${c}33`,
              borderRadius:8, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, color:c }}>{v}</div>
              <div style={{ fontSize:9, color:"#8aaabb", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button style={{ background:"linear-gradient(135deg,#ffd70033,#ffd70011)",
          border:"1px solid rgba(255,215,0,0.4)", borderRadius:10, padding:"12px 32px",
          color:"#ffd700", fontSize:13, cursor:"pointer",
          fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}
          onClick={onClose}>시작하기 ✦</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════════════════════════
const ONBOARDING_SLIDES = [
  {
    icon:"✦",
    iconColor:"#00d4ff",
    title:"DAILY QUEST",
    subtitle:"별자리 RPG",
    desc:"별자리를 수집하고 매일 퀘스트를 완료하며 성장하는 RPG예요. 공부하고 퀘스트를 깰수록 더 강해져요.",
    color:"#00d4ff",
  },
  {
    icon:"⚔️",
    iconColor:"#ffd700",
    title:"퀘스트",
    subtitle:"매일의 목표를 설정하세요",
    desc:"오늘 할 일을 퀘스트로 등록하고 완료하면 XP와 별빛 조각을 획득해요.\n내일 예약 퀘스트는 보상이 더 많아요!",
    color:"#ffd700",
  },
  {
    icon:"🌌",
    iconColor:"#7b61ff",
    title:"별자리 소환",
    subtitle:"별빛 조각으로 별자리를 뽑으세요",
    desc:"별빛 조각을 모아 별자리를 소환해요. 첫 별자리를 뽑는 순간 칭호가 바뀌고 Lv.10부터 전직이 시작돼요.",
    color:"#7b61ff",
  },
  {
    icon:"⏱",
    iconColor:"#00ff88",
    title:"집중 모드",
    subtitle:"공부하면 던전이 진행돼요",
    desc:"뽀모도로나 스톱워치로 공부하면 던전에 시간이 쌓여요. 신전에 가입하면 성력도 누적돼요!",
    color:"#00ff88",
  },
  {
    icon:"⛩️",
    iconColor:"#ffd700",
    title:"신전",
    subtitle:"함께 공부하는 그룹",
    desc:"신전을 만들거나 가입하면 멤버들과 함께 공부 현황을 볼 수 있어요. 퀘스트 완료 시 성력도 추가로 획득!",
    color:"#ffd700",
    isLast:false,
  },
];

function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const [nick, setNick] = useState("");
  const [tick, setTick] = useState(0);
  const isNickSlide = slide === ONBOARDING_SLIDES.length;
  const current = ONBOARDING_SLIDES[slide];

  useEffect(() => {
    const t = setInterval(() => setTick(v=>v+1), 60);
    return () => clearInterval(t);
  }, []);

  function next() {
    if (slide < ONBOARDING_SLIDES.length) setSlide(v=>v+1);
  }
  function finish() {
    if (!nick.trim()) return;
    onDone(nick.trim());
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, background:"#030d18",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      overflow:"hidden" }}>

      {/* 배경 파티클 */}
      {Array.from({length:20}).map((_,i) => {
        const angle = (tick*(0.5+i*0.08)+i*18) % 360;
        const rad = angle*Math.PI/180;
        const dist = 80+i*15;
        const x = 50+Math.cos(rad)*dist/4;
        const y = 50+Math.sin(rad)*dist/6;
        const col = isNickSlide?"#ffd700":current?.color||"#00d4ff";
        return <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`,
          width:2+i%3, height:2+i%3, borderRadius:"50%", background:col,
          opacity:0.15+Math.sin(tick*0.04+i)*0.1, pointerEvents:"none" }}/>;
      })}

      {/* 진행 점 */}
      <div style={{ position:"absolute", top:40, display:"flex", gap:8 }}>
        {[...ONBOARDING_SLIDES.map((_,i)=>i), ONBOARDING_SLIDES.length].map(i => (
          <div key={i} style={{ width: i===slide?20:7, height:7, borderRadius:4,
            background: i<=slide ? (isNickSlide?"#ffd700":current?.color||"#00d4ff") : "#5a6570",
            transition:"all .3s" }}/>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 28px",
        maxWidth:400, width:"100%" }}>

        {!isNickSlide ? (
          <div key={slide} style={{ animation:"gachaFadeIn 0.4s ease" }}>
            {/* 아이콘 */}
            <div style={{ fontSize:"clamp(52px,14vw,72px)", marginBottom:20,
              filter:`drop-shadow(0 0 20px ${current.color})`,
              animation:"gachaPulse 2s ease-in-out infinite" }}>
              {current.icon}
            </div>
            {/* 제목 */}
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
              color:current.color+"88", letterSpacing:4, marginBottom:8 }}>
              {current.subtitle}
            </div>
            <div style={{ fontFamily:"'Orbitron',sans-serif",
              fontSize:"clamp(20px,5.5vw,28px)", fontWeight:900,
              color:current.color, textShadow:`0 0 20px ${current.color}88`,
              letterSpacing:2, marginBottom:20 }}>
              {current.title}
            </div>
            {/* 설명 */}
            <div style={{ fontSize:"clamp(13px,3.5vw,15px)", color:"#c8e8ff",
              lineHeight:1.8, marginBottom:40, whiteSpace:"pre-line" }}>
              {current.desc}
            </div>
            {/* 버튼 */}
            <button style={{ background:`linear-gradient(135deg,${current.color}33,${current.color}11)`,
              border:`1px solid ${current.color}66`, borderRadius:12,
              padding:"14px 40px", color:current.color,
              fontSize:"clamp(13px,3.5vw,15px)", cursor:"pointer",
              fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}
              onClick={next}>
              {slide === ONBOARDING_SLIDES.length-1 ? "마지막으로 →" : "다음 →"}
            </button>
          </div>
        ) : (
          <div style={{ animation:"gachaFadeIn 0.4s ease" }}>
            <div style={{ fontSize:"clamp(40px,11vw,56px)", marginBottom:16,
              filter:"drop-shadow(0 0 20px #ffd700)" }}>✦</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9,
              color:"rgba(255,215,0,0.6)", letterSpacing:4, marginBottom:8 }}>
              마지막 단계
            </div>
            <div style={{ fontFamily:"'Orbitron',sans-serif",
              fontSize:"clamp(18px,5vw,24px)", fontWeight:900,
              color:"#ffd700", textShadow:"0 0 20px rgba(255,215,0,0.5)",
              letterSpacing:2, marginBottom:10 }}>
              닉네임 설정
            </div>
            <div style={{ fontSize:"clamp(12px,3vw,14px)", color:"#c8e8ff",
              marginBottom:28, lineHeight:1.7 }}>
              신전에서 사용할 닉네임을 정해주세요.<br/>
              나중에 변경할 수 있어요.
            </div>
            <input
              style={{ background:"rgba(4,15,28,0.9)", border:`1px solid rgba(255,215,0,0.3)`,
                borderRadius:10, padding:"14px 16px", color:"#ffd700",
                fontSize:"clamp(15px,4vw,18px)", outline:"none", width:"100%",
                marginBottom:16, textAlign:"center",
                fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}
              placeholder="닉네임 입력..."
              value={nick} maxLength={15}
              onChange={e=>setNick(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&nick.trim()&&finish()}
              autoFocus/>
            <div style={{ fontSize:9, color:"rgba(255,215,0,0.4)", marginBottom:24 }}>
              최대 15자
            </div>
            <button style={{ background:nick.trim()?"linear-gradient(135deg,#ffd70033,#ffd70011)":"#0a1520",
              border:`1px solid ${nick.trim()?"rgba(255,215,0,0.5)":"#0a2030"}`,
              borderRadius:12, padding:"14px 40px",
              color:nick.trim()?"#ffd700":"#8aaabb",
              fontSize:"clamp(13px,3.5vw,15px)", cursor:nick.trim()?"pointer":"default",
              fontFamily:"'Orbitron',sans-serif", letterSpacing:2, transition:"all .2s" }}
              onClick={()=>nick.trim()&&finish()}>
              시작하기 ✦
            </button>
            <div style={{ marginTop:16 }}>
              <button style={{ background:"transparent", border:"none",
                color:"#8aaabb", fontSize:11, cursor:"pointer" }}
                onClick={()=>onDone("별빛 방랑자")}>
                닉네임 나중에 설정할게요
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResetButton({ setSt, showNotif }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) return (
    <button style={{ ...ST.cheatBtn, borderColor:"rgba(255,0,0,0.2)", color:"#ff4444", marginTop:4 }}
      onClick={()=>setConfirm(true)}>
      ⚠️ 전체 초기화
    </button>
  );
  return (
    <div style={{ display:"flex", gap:6, marginTop:4, alignItems:"center" }}>
      <span style={{ fontSize:9, color:"#ff4444" }}>정말 초기화?</span>
      <button style={{ ...ST.cheatBtn, borderColor:"rgba(255,68,68,0.4)", color:"#ff4444" }}
        onClick={()=>{
          localStorage.removeItem(SK);
          setSt({...DEF});
          showNotif("초기화 완료","#ff4444");
          setConfirm(false);
        }}>확인</button>
      <button style={ST.cheatBtn} onClick={()=>setConfirm(false)}>취소</button>
    </div>
  );
}

export default function App() {
  const [st, setSt] = useState(()=>{ const s=load(); return s?{...DEF,...s}:DEF; });
  const [tab, setTab] = useState("quests");
  const [showCheat, setShowCheat] = useState(false);
  const [nameUnlockPopup, setNameUnlockPopup] = useState(null);
  const [ascensionPopup, setAscensionPopup] = useState(null); // "warrior" | "priest"
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState(CATS[0]);
  const [newPrio, setNewPrio] = useState("mid");
  const [scheduleFor, setScheduleFor] = useState("today");
  const [particles, setParticles] = useState([]);
  const [notif, setNotif] = useState(null);
  const [lvUpAnim, setLvUpAnim] = useState(false);
  const [newAch, setNewAch] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [timerType, setTimerType] = useState("pomodoro");
  const [pomoDur, setPomoDur] = useState({h:0,m:25,s:0});
  const [timerSec, setTimerSec] = useState(25*60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("work");
  const [swSec, setSwSec] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [focusPhase, setFocusPhase] = useState("idle");
  const [focusTick, setFocusTick] = useState(0);
  const timerRef = useRef(null);
  const swRef = useRef(null);
  const focusTickRef = useRef(null);
  const pIdRef = useRef(0);
  const prevLvRef = useRef(getLevelInfo(st.totalXp).lv);

  useEffect(()=>{ save(st); },[st]);

  // 일별 리셋
  useEffect(()=>{
    const today=todayStr();
    setSt(p=>{
      if(p.lastActiveDate===today) return p;
      const yd=new Date(); yd.setDate(yd.getDate()-1);
      const ys=yd.toISOString().slice(0,10);
      const streak=p.lastActiveDate===ys?p.streak+1:1;
      const promoted=p.scheduledQuests.filter(q=>q.scheduledFor===today);
      const remaining=p.scheduledQuests.filter(q=>q.scheduledFor!==today);
      return {...p, streak, lastActiveDate:today, todayRewardCount:0, lastRewardDate:today,
        quests:promoted.map(q=>({...q,done:false,rewarded:true,createdAt:Date.now()})),
        scheduledQuests:remaining};
    });
  },[]);

  // 뽀모도로
  useEffect(()=>{
    if(timerRunning){
      timerRef.current=setInterval(()=>{
        setTimerSec(s=>{
          if(s<=1){
            clearInterval(timerRef.current); setTimerRunning(false);
            setSt(p=>({...p, timersDone:p.timersDone+1}));
            if(timerMode==="work"){setTimerMode("break");setTimerSec(5*60);showNotif("🍅 집중 완료!","#00d4ff");}
            else{setTimerMode("work");const tot=pomoDur.h*3600+pomoDur.m*60+pomoDur.s||25*60;setTimerSec(tot);showNotif("☕ 휴식 완료!","#7b61ff");}
            return 0;
          }
          return s-1;
        });
      },1000);
    } else clearInterval(timerRef.current);
    return ()=>clearInterval(timerRef.current);
  },[timerRunning,timerMode]);

  // 스톱워치
  useEffect(()=>{
    if(swRunning){swRef.current=setInterval(()=>setSwSec(s=>s+1),1000);}
    else clearInterval(swRef.current);
    return()=>clearInterval(swRef.current);
  },[swRunning]);

  // 집중 틱
  useEffect(()=>{
    if(showTimer&&(timerRunning||swRunning)){
      focusTickRef.current=setInterval(()=>setFocusTick(t=>t+1),60);
    } else clearInterval(focusTickRef.current);
    return()=>clearInterval(focusTickRef.current);
  },[showTimer,timerRunning,swRunning]);

  // 잊혀진 던전 집중 시간 누적 + 성력 누적 + 일별 집중 시간 기록
  useEffect(()=>{
    if(timerRunning||swRunning){
      const t=setInterval(()=>{
        setSt(p=>{
          const next = {...p};
          const today = todayStr();
          // 잊혀진 던전
          if(p.forgottenActive) next.forgottenFocusSecs = (p.forgottenFocusSecs||0)+1;
          // 성력: 신전 가입자만, 60초마다 1점
          if(p.shinjeon){
            const newSecs = (p._focusSecs||0)+1;
            if(newSecs>=60){
              next._focusSecs = 0;
              next.sungryeok = (p.sungryeok||0)+1;
              next.weeklySungryeok = (p.weeklySungryeok||0)+1;
            } else {
              next._focusSecs = newSecs;
            }
          }
          // 일별 집중 시간 누적
          const cal = {...p.calendarData};
          const dayData = cal[today] || {done:0, total:0, focusSecs:0};
          cal[today] = {...dayData, focusSecs:(dayData.focusSecs||0)+1};
          next.calendarData = cal;
          return next;
        });
      },1000);
      return()=>clearInterval(t);
    }
  },[timerRunning,swRunning]);

  // 고대 조각 6개 달성 → 이름 해금 팝업
  useEffect(()=>{
    if (!st.ancientShards) return;
    Object.entries(st.ancientShards).forEach(([constId, count]) => {
      const owned = st.ownedConstellations.find(o=>o.id===constId);
      if (count >= FORGOTTEN_DUNGEON.nameUnlockRequired && owned && !owned.nameUnlocked) {
        const c = CONSTELLATIONS.find(cc=>cc.id===constId);
        if (c) setNameUnlockPopup(c);
      }
    });
  },[st.ancientShards]);

  // 던전 타이머 갱신
  useEffect(()=>{
    const t=setInterval(()=>setSt(p=>({...p})),5000);
    return()=>clearInterval(t);
  },[]);

  const lvInfo=getLevelInfo(st.totalXp);

  // 레벨업 감지
  useEffect(()=>{
    if(lvInfo.lv>prevLvRef.current){
      setLvUpAnim(true);
      showNotif(`🎉 LEVEL UP! LV.${lvInfo.lv}`,"#ffd700");
      setTimeout(()=>setLvUpAnim(false),3000);
      // 전직 체크
      const lv = lvInfo.lv;
      const voc = st.vocation;
      const hasConst = st.ownedConstellations.length > 0;
      if (lv >= 10 && (voc === "none" || voc === "seeker") && hasConst) {
        setSt(p=>({...p, vocationChoicePending:true}));
      } else if (lv >= 30 && (voc === "warrior" || voc === "priest")) {
        setSt(p=>({...p, vocation2ChoicePending:true}));
      } else if (lv >= 100 && ["star_guardian","star_lord","star_prophet","star_divine"].includes(voc)) {
        const branch = WARRIOR_BRANCH.includes(voc) ? "warrior" : "priest";
        setTimeout(() => setAscensionPopup(branch), 1500);
      } else if (lv >= 60 && (voc === "star_knight"||voc==="star_guard"||voc==="star_sage"||voc==="star_oracle")) {
        setSt(p=>({...p, vocation3ChoicePending:true}));
      }
    }
    prevLvRef.current=lvInfo.lv;
  },[lvInfo.lv]);

  // 업적
  useEffect(()=>{
    const achSt={
      totalDone:st.totalDone, streak:st.streak, lv:lvInfo.lv,
      constCount:st.ownedConstellations.length,
      hasRare:st.ownedConstellations.some(o=>["rare","epic","legendary","mythic"].includes(CONSTELLATIONS.find(c=>c.id===o.id)?.rarity)),
      hasMythic:st.ownedConstellations.some(o=>CONSTELLATIONS.find(c=>c.id===o.id)?.rarity==="mythic"),
      dungeonClears:st.dungeonClears||0, totalGacha:st.totalGacha||0,
    };
    ACHIEVEMENTS.forEach(a=>{
      if(!st.unlockedAch.includes(a.id)&&a.cond(achSt)){
        setSt(p=>({...p,unlockedAch:[...p.unlockedAch,a.id]}));
        setNewAch(a); setTimeout(()=>setNewAch(null),3000);
      }
    });
  },[st.totalDone,st.streak,st.totalXp,st.ownedConstellations,st.dungeonClears,st.totalGacha]);

  function addAncientShard(constId) {
    setSt(p => {
      const cur = p.ancientShards?.[constId] || 0;
      const next = cur + 1;
      const newShards = { ...p.ancientShards, [constId]: next };
      const shouldUnlock = next >= FORGOTTEN_DUNGEON.nameUnlockRequired;
      return {
        ...p,
        ancientShards: newShards,
        ownedConstellations: shouldUnlock
          ? p.ownedConstellations.map(o => o.id === constId ? { ...o, nameUnlocked: true } : o)
          : p.ownedConstellations,
      };
    });
    // setSt 밖에서 팝업 - 타이밍 문제 방지
    setTimeout(() => {
      setSt(p => {
        const count = p.ancientShards?.[constId] || 0;
        const owned = p.ownedConstellations.find(o=>o.id===constId);
        if (count >= FORGOTTEN_DUNGEON.nameUnlockRequired && owned?.nameUnlocked) {
          const c = CONSTELLATIONS.find(cc=>cc.id===constId);
          if (c) setNameUnlockPopup(c);
        }
        return p;
      });
    }, 100);
  }

  function showNotif(text,color="#00d4ff"){setNotif({text,color});setTimeout(()=>setNotif(null),2500);}
  function spawnParticles(x,y,color="#00d4ff"){
    const ps=Array.from({length:16},(_,i)=>({id:pIdRef.current++,x,y,color,angle:(i/16)*360,dist:40+Math.random()*60}));
    setParticles(p=>[...p,...ps]);
    setTimeout(()=>setParticles(p=>p.filter(pp=>!ps.find(n=>n.id===pp.id))),1000);
  }

  function toggleQuest(id,e){
    const rect=e.currentTarget.getBoundingClientRect();
    const x=rect.left+rect.width/2, y=rect.top+rect.height/2;
    setSt(p=>{
      const q=p.quests.find(q=>q.id===id); if(!q) return p;
      const pr=PRIO.find(pp=>pp.key===q.priority);
      const isDone=!q.done;
      const today=todayStr();
      const trc=p.lastRewardDate===today?p.todayRewardCount:0;
      const lim=dailyLimit(getLevelInfo(p.totalXp).lv);
      const canReward=isDone&&q.rewarded&&trc<lim;
      // 별자리 보너스 적용
      const mainC=p.mainConstId?CONSTELLATIONS.find(c=>c.id===p.mainConstId):null;
      const bonusMult=mainC?1+(mainC.bonusVal/100):1;
      const xpD=canReward?Math.round(pr.xp*(mainC?.bonus==="xp"?bonusMult:1)):0;
      // 별빛 조각: 별자리 보너스 + 성직자 계열 보너스 중첩
      const constShardMult=mainC?.bonus==="shard"?bonusMult:1;
      const vocShardMult=getShardBonus(p.vocation);
      const shardBonusMult=constShardMult*vocShardMult;
      const shardD=canReward?Math.round(SHARD_PER_QUEST*shardBonusMult):0;
      const sungryeokD=canReward&&p.shinjeon?2:0;
      const newTrc=canReward?trc+1:isDone?trc:Math.max(0,trc-1);
      const newQ=p.quests.map(qq=>qq.id===id?{...qq,done:isDone}:qq);
      const cal={...p.calendarData,[today]:{done:newQ.filter(q=>q.done).length,total:newQ.length}};
      if(isDone){
        spawnParticles(x,y,pr.color);
        if(canReward) showNotif(`+${xpD}XP +${shardD}✨${sungryeokD?` +${sungryeokD}성력`:""}`,pr.color);
        else if(!q.rewarded) showNotif("오늘 등록 퀘스트 — 보상 없음 📋","#556677");
        else showNotif("보상 한도 도달 🔒","#556677");
      }
      return{...p, quests:newQ,
        totalXp:Math.max(0,p.totalXp+(isDone?xpD:-xpD)),
        starShards:Math.max(0,p.starShards+(isDone?shardD:-shardD)),
        sungryeok:(p.sungryeok||0)+(isDone?sungryeokD:0),
        weeklySungryeok:(p.weeklySungryeok||0)+(isDone?sungryeokD:0),
        totalDone:Math.max(0,p.totalDone+(isDone?1:-1)),
        todayRewardCount:newTrc, lastRewardDate:today, calendarData:cal,
        tutorialStep:p.tutorialStep===2&&isDone?3:p.tutorialStep};
    });
  }

  function addQuest(){
    if(!newTitle.trim()) return;
    if(scheduleFor==="today"){
      setSt(p=>({...p,quests:[...p.quests,{id:++_id,title:newTitle.trim(),category:newCat,priority:newPrio,done:false,rewarded:false,createdAt:Date.now()}],
        tutorialStep:p.tutorialStep===1?2:p.tutorialStep}));
    } else {
      setSt(p=>({...p,scheduledQuests:[...p.scheduledQuests,{id:++_id,title:newTitle.trim(),category:newCat,priority:newPrio,scheduledFor:tomorrowStr()}],
        tutorialStep:p.tutorialStep===1?2:p.tutorialStep}));
      showNotif("내일 퀘스트 예약 ✅","#00d4ff");
    }
    setNewTitle(""); setShowAdd(false);
  }

  function deleteQuest(id){
    setSt(p=>{
      const q=p.quests.find(q=>q.id===id); const pr=PRIO.find(pp=>pp.key===q?.priority);
      const today=todayStr(); const trc=p.lastRewardDate===today?p.todayRewardCount:0;
      return{...p,quests:p.quests.filter(q=>q.id!==id),
        totalXp:Math.max(0,p.totalXp-(q?.done&&q?.rewarded?Math.round(pr.xp):0)),
        starShards:Math.max(0,p.starShards-(q?.done&&q?.rewarded?SHARD_PER_QUEST:0)),
        totalDone:Math.max(0,p.totalDone-(q?.done?1:0)),
        todayRewardCount:Math.max(0,trc-(q?.done&&q?.rewarded?1:0))};
    });
  }
  function deleteScheduled(id){setSt(p=>({...p,scheduledQuests:p.scheduledQuests.filter(q=>q.id!==id)}));}

  const today=todayStr(), trc=st.lastRewardDate===today?st.todayRewardCount:0, limit=dailyLimit(lvInfo.lv, st.vocation);
  const sorted=[...st.quests].sort((a,b)=>{const o={high:0,mid:1,low:2};if(a.done!==b.done)return a.done?1:-1;return o[a.priority]-o[b.priority];});
  const completedCount=st.quests.filter(q=>q.done).length, totalCount=st.quests.length;
  const pomoDurSec=pomoDur.h*3600+pomoDur.m*60+pomoDur.s||25*60;
  const timerPct=timerMode==="work"?(1-timerSec/pomoDurSec)*100:(1-timerSec/(5*60))*100;
  const fmt=s=>{const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;return`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;};
  const tmr=tomorrowStr(), tomorrowScheduled=st.scheduledQuests.filter(q=>q.scheduledFor===tmr);
  const dungeonReady=st.activeDungeon&&(Date.now()-st.activeDungeon.startedAt)>=(DUNGEONS.find(d=>d.id===st.activeDungeon.dungeonId)?.duration||0);

  // 전직 칭호 — 신화는 이름 해금 후에만 칭호에 반영
  const mainConst=st.mainConstId?CONSTELLATIONS.find(c=>c.id===st.mainConstId):null;
  const ownedMainConst=st.ownedConstellations.find(o=>o.id===st.mainConstId);
  const mainConstDisplay = mainConst ? (mainConst.rarity==="mythic" && !ownedMainConst?.nameUnlocked ? null : mainConst.name) : null;
  const vTitle=getVocationTitle(st.vocation, mainConstDisplay);

  return (
    <div style={ST.root}>
      {/* 온보딩 */}
      {!st.onboardingDone && (
        <OnboardingScreen onDone={(nick) => {
          setSt(p=>({...p, onboardingDone:true, nickname:nick||p.nickname, tutorialStep:1}));
        }}/>
      )}

      <div style={ST.gridBg}/><div style={ST.scanline}/>
      {particles.map(p=>(<div key={p.id} style={{...ST.particle,left:p.x,top:p.y,background:p.color,boxShadow:`0 0 6px ${p.color}`,transform:`rotate(${p.angle}deg) translateX(${p.dist}px)`,opacity:0}}/>))}
      {notif&&<div style={{...ST.notif,borderColor:notif.color,color:notif.color,boxShadow:`0 0 20px ${notif.color}55`}}>{notif.text}</div>}
      {lvUpAnim&&(<div style={ST.lvUpOverlay}><div style={ST.lvUpBox}><div style={ST.lvUpTitle}>LEVEL UP!</div><div style={ST.lvUpSub}>LV.{lvInfo.lv}</div></div></div>)}
      {newAch&&(<div style={ST.achNotif}><div style={{fontSize:28}}>{newAch.icon}</div><div><div style={{fontSize:10,color:"#7b61ff",fontFamily:"'Orbitron',sans-serif"}}>업적 달성!</div><div style={{fontSize:13,color:"#c8e8ff",fontWeight:500}}>{newAch.name}</div></div></div>)}

      {/* Lv.100 승천 연출 */}
      {ascensionPopup && (
        <AscensionPopup branch={ascensionPopup}
          onChoose={(v) => {
            setSt(p=>({...p, vocation:v}));
            setAscensionPopup(null);
            showNotif(`★ ${VOCATION_TREE[v].name} 승천!`, "#ff2222");
          }}/>
      )}

      {/* 이름 해금 연출 */}
      {nameUnlockPopup && (
        <NameUnlockPopup constData={nameUnlockPopup}
          onClose={() => setNameUnlockPopup(null)}/>
      )}

      {/* 튜토리얼 완료 팝업 */}
      {st.tutorialStep===5 && st.tutorialDone && !st.tutorialRewardGiven && (
        <TutorialCompletePopup onClose={()=>{
          setSt(p=>({...p, tutorialRewardGiven:true,
            starShards:p.starShards+50, totalXp:p.totalXp+200}));
          showNotif("튜토리얼 완료 보상! +200XP +50✨","#ffd700");
        }}/>
      )}
      {st.tutorialStep>0 && !st.tutorialDone && st.tutorialStep<5 && (
        <TutorialOverlay st={st} setSt={setSt} setTab={setTab} showNotif={showNotif}/>
      )}

      {/* 전직 선택 팝업 */}
      {st.vocationChoicePending && (
        <VocationChoicePopup level={10}
          options={["warrior","priest"]}
          onChoose={(v)=>{
            setSt(p=>({...p,vocation:v,vocationChoicePending:false}));
            showNotif(`${VOCATION_TREE[v].name}로 전직!`,"#ffd700");
            spawnParticles(window.innerWidth/2,window.innerHeight/3,"#ffd700");
          }}/>
      )}
      {st.vocation2ChoicePending && (
        <VocationChoicePopup level={30}
          options={st.vocation==="warrior"?["star_knight","star_guard"]:["star_sage","star_oracle"]}
          onChoose={(v)=>{
            setSt(p=>({...p,vocation:v,vocation2ChoicePending:false}));
            showNotif(`${VOCATION_TREE[v].name}로 2차 전직!`,"#ffd700");
            spawnParticles(window.innerWidth/2,window.innerHeight/3,"#ffd700");
          }}/>
      )}
      {st.vocation3ChoicePending && (
        <VocationChoicePopup level={60}
          options={
            st.vocation==="star_knight"?["star_guardian","star_lord"]:
            st.vocation==="star_guard"?["star_guardian","star_lord"]:
            ["star_prophet","star_divine"]
          }
          onChoose={(v)=>{
            setSt(p=>({...p,vocation:v,vocation3ChoicePending:false}));
            showNotif(`${VOCATION_TREE[v].name}로 3차 전직!`,"#ffd700");
            spawnParticles(window.innerWidth/2,window.innerHeight/3,"#ffd700");
          }}/>
      )}

      {/* 타이머 */}
      {showTimer && (
        <div style={{position:"fixed",inset:0,zIndex:400,background:"#000814",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {(timerRunning||swRunning)&&Array.from({length:18}).map((_,i)=>{
            const angle=(focusTick*(1.1+i*0.12)+i*20)%360;
            const rad=angle*Math.PI/180;
            const dist=130+(i%5)*35;
            const x=50+Math.cos(rad)*dist/7;
            const y=50+Math.sin(rad)*dist/11;
            const size=2+(i%3);
            const op=0.2+Math.sin(focusTick*0.05+i)*0.15+0.15;
            return <div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:size,height:size,borderRadius:"50%",background:i%3===0?"#00d4ff":i%3===1?"#7b61ff":"#00ff88",opacity:op,pointerEvents:"none",zIndex:0}}/>;
          })}
          {(timerRunning||swRunning)&&[220,300,380].map((r,i)=>(
            <div key={i} style={{position:"absolute",width:r,height:r,border:`1px solid ${["rgba(0,212,255,0.13)","rgba(123,97,255,0.09)","rgba(0,255,136,0.06)"][i]}`,borderRadius:"50%",transform:`rotate(${focusTick*(0.4-i*0.15)}deg)`,top:"50%",left:"50%",marginLeft:-r/2,marginTop:-r/2,pointerEvents:"none",zIndex:0}}/>
          ))}
          {focusPhase==="intro"&&(
            <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#000814",animation:"focusIntro 0.5s ease"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:"rgba(0,212,255,0.4)",letterSpacing:6,marginBottom:14}}>SYSTEM</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,fontWeight:900,color:"#00d4ff",textShadow:"0 0 30px #00d4ff, 0 0 60px rgba(0,212,255,0.33)",letterSpacing:4,marginBottom:10}}>집중 모드 개시</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:"#7b61ff",textShadow:"0 0 12px #7b61ff",letterSpacing:3,marginBottom:16}}>LV.{lvInfo.lv} {vTitle}</div>
              <div style={{fontSize:10,color:"rgba(0,212,255,0.2)",letterSpacing:2}}>시공간이 고정됩니다...</div>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid rgba(0,212,255,0.09)",position:"relative",zIndex:5}}>
            <div style={{display:"flex",gap:6}}>
              {[["pomodoro","🍅 뽀모도로"],["stopwatch","⏱ 스톱워치"]].map(([t,l])=>{
                const isActive=timerType===t;
                const isLocked=(timerRunning||swRunning)&&!isActive;
                return <button key={t} style={{...ST.timerTypeBtn,...(isActive?ST.timerTypeBtnA:{}),opacity:isLocked?0.3:1,cursor:isLocked?"not-allowed":"pointer"}}
                  onClick={()=>{if(isLocked)return;setTimerType(t);setTimerRunning(false);setSwRunning(false);setFocusPhase("idle");}}>{l}</button>;
              })}
            </div>
            {(timerRunning||swRunning)
              ?<div style={{fontSize:10,color:"#00d4ff",fontFamily:"'Orbitron',sans-serif",letterSpacing:2,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#00d4ff",boxShadow:"0 0 8px #00d4ff",animation:"blink 1s ease-in-out infinite"}}/>
                FOCUS MODE
              </div>
              :<button style={{background:"transparent",border:"1px solid rgba(0,212,255,0.13)",borderRadius:7,padding:"5px 12px",color:"#8aa0b0",cursor:"pointer",fontSize:12}}
                onClick={()=>{setShowTimer(false);setFocusPhase("idle");}}>✕ 닫기</button>
            }
          </div>
          <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative",zIndex:5}} className="timer-layout">
            {/* 타이머 본체 */}
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"16px 12px 12px",overflowY:"auto",minWidth:0}} className="timer-main-panel">
              {timerType==="pomodoro"&&(<>
                <div style={{fontSize:10,color:timerMode==="work"?"#00d4ff":"#7b61ff",fontFamily:"'Orbitron',sans-serif",letterSpacing:3,marginBottom:10,textShadow:timerRunning?`0 0 10px ${timerMode==="work"?"#00d4ff":"#7b61ff"}`:"none"}}>
                  {timerMode==="work"?"● 집중 시간":"● 휴식 시간"}
                </div>
                {!timerRunning&&(
                  <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}}>
                    {[["h","시간",23],["m","분",59],["s","초",59]].map(([k,l,max])=>(
                      <div key={k} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <button style={{...ST.durBtn,fontSize:"clamp(12px,4vw,16px)"}} onClick={()=>{setPomoDur(d=>{const next={...d,[k]:Math.min(max,d[k]+1)};setTimerSec(next.h*3600+next.m*60+next.s||25*60);return next;});}}>▲</button>
                        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(20px,5vw,28px)",color:"#c8e8ff",width:"clamp(36px,8vw,44px)",textAlign:"center"}}>{String(pomoDur[k]).padStart(2,"0")}</div>
                        <button style={{...ST.durBtn,fontSize:"clamp(12px,4vw,16px)"}} onClick={()=>{setPomoDur(d=>{const next={...d,[k]:Math.max(0,d[k]-1)};setTimerSec(next.h*3600+next.m*60+next.s||25*60);return next;});}}>▼</button>
                        <div style={{fontSize:9,color:"#9abccb"}}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                  <svg viewBox="0 0 160 160" style={{width:"clamp(110px,28vw,150px)",height:"clamp(110px,28vw,150px)"}}>
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#0a2030" strokeWidth="8"/>
                    <circle cx="80" cy="80" r="70" fill="none" stroke={timerMode==="work"?"#00d4ff":"#7b61ff"} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2*Math.PI*70}`} strokeDashoffset={`${2*Math.PI*70*(1-Math.min(timerPct,100)/100)}`}
                      transform="rotate(-90 80 80)"
                      style={{transition:"stroke-dashoffset 1s linear",filter:`drop-shadow(0 0 ${timerRunning?8:4}px ${timerMode==="work"?"#00d4ff":"#7b61ff"})`}}/>
                  </svg>
                  <div style={{position:"absolute",fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(16px,4.5vw,24px)",color:"#c8e8ff",letterSpacing:2,textShadow:timerRunning?"0 0 12px rgba(0,212,255,0.27)":"none"}}>{fmt(timerSec)}</div>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:6}}>
                  <button style={{...ST.timerBtn,borderColor:"rgba(0,212,255,0.27)",color:"#00d4ff",padding:"clamp(8px,2vw,10px) clamp(16px,4vw,24px)",fontSize:"clamp(12px,3.5vw,14px)"}}
                    onClick={()=>{
                      if(!timerRunning&&timerSec===0)setTimerSec(pomoDurSec);
                      if(!timerRunning){setFocusPhase("intro");setTimeout(()=>setFocusPhase("active"),2000);}
                      else setFocusPhase("idle");
                      setTimerRunning(v=>!v);
                    }}>{timerRunning?"⏸ 일시정지":"▶ 시작"}</button>
                  <button style={{...ST.timerBtn,borderColor:"rgba(255,77,109,0.2)",color:"#ff4d6d",padding:"clamp(8px,2vw,10px) clamp(12px,3vw,16px)"}}
                    onClick={()=>{setTimerRunning(false);setTimerSec(pomoDurSec);setTimerMode("work");setFocusPhase("idle");}}>↺</button>
                </div>
                <div style={{fontSize:9,color:"#9abccb"}}>{st.timersDone}회 🍅</div>
              </>)}
              {timerType==="stopwatch"&&(<>
                <div style={{fontSize:10,color:"#00d4ff",fontFamily:"'Orbitron',sans-serif",letterSpacing:3,marginBottom:14,textShadow:swRunning?"0 0 10px #00d4ff":"none"}}>● 스톱워치</div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(32px,9vw,48px)",color:"#c8e8ff",textShadow:swRunning?"0 0 20px rgba(0,212,255,0.33)":"none",marginBottom:16,letterSpacing:3}}>{fmt(swSec)}</div>
                <div style={{display:"flex",gap:8}}>
                  <button style={{...ST.timerBtn,borderColor:"rgba(0,212,255,0.27)",color:"#00d4ff",padding:"clamp(8px,2vw,10px) clamp(16px,4vw,24px)",fontSize:"clamp(12px,3.5vw,14px)"}}
                    onClick={()=>{
                      if(!swRunning){setFocusPhase("intro");setTimeout(()=>setFocusPhase("active"),2000);}
                      else setFocusPhase("idle");
                      setSwRunning(v=>!v);
                    }}>{swRunning?"⏸ 일시정지":"▶ 시작"}</button>
                  <button style={{...ST.timerBtn,borderColor:"rgba(255,77,109,0.2)",color:"#ff4d6d",padding:"clamp(8px,2vw,10px) clamp(12px,3vw,16px)"}}
                    onClick={()=>{setSwRunning(false);setSwSec(0);setFocusPhase("idle");}}>↺</button>
                </div>
              </>)}
            </div>
            {/* 사이드 패널 */}
            <div style={{width:"min(260px,38vw)",display:"flex",flexDirection:"column",padding:"14px 12px",overflowY:"auto"}} className="timer-quest-panel">
              <TimerSidePanel st={st} sorted={sorted} timerRunning={timerRunning} swRunning={swRunning} pomoDurSec={pomoDurSec} timerSec={timerSec} swSec={swSec}/>
            </div>
          </div>
        </div>
      )}

      <div style={ST.container}>
        {/* 헤더 */}
        <header style={ST.header}>
          <div>
            <div style={ST.logo}><span style={ST.logoIcon}>✦</span><span style={ST.logoText}>DAILY QUEST</span></div>
            <div style={{fontSize:10,color:"#9abccb",letterSpacing:1}}>{new Date().toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"short"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:"#00d4ff"}}>{st.totalXp.toLocaleString()}<span style={{fontSize:9,color:"#9abccb"}}> XP</span></div>
              <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
<span style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:"#00d4ff"}}>✨{st.starShards.toLocaleString()}</span>
              </div>
            </div>
            <button style={{...ST.iconBtn,width:"auto",padding:"0 12px",fontSize:11,fontFamily:"'Orbitron',sans-serif",letterSpacing:1,borderColor:"rgba(0,212,255,0.33)",color:"#00d4ff",background:"linear-gradient(135deg,rgba(0,212,255,0.04),rgba(123,97,255,0.04))"}}
              onClick={()=>setShowTimer(true)}>집중</button>
          </div>
        </header>

        {/* 레벨 카드 */}
        <div style={{...ST.levelCard,boxShadow:lvUpAnim?"0 0 36px rgba(255,215,0,0.27)":"0 0 14px rgba(0,17,34,0.13)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}>
            <div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:"#00d4ff",letterSpacing:1,marginBottom:1}}>LV.{lvInfo.lv}</div>
              <div style={{fontSize:10,color:mainConst?RARITY[mainConst.rarity].color:"#8aa0b0"}}>{vTitle}</div>
              <div style={{fontSize:9,color:"#9abccb"}}>다음까지 {(lvInfo.nxt-st.totalXp).toLocaleString()} XP</div>
              {/* 전직 효과 표시 */}
              {WARRIOR_BRANCH.includes(st.vocation) && getDungeonBonus(st.vocation) > 1 && (
                <div style={{fontSize:8,color:"#4488ff",marginTop:2}}>⚔️ 던전 보상 ×{getDungeonBonus(st.vocation).toFixed(2)}</div>
              )}
              {PRIEST_BRANCH.includes(st.vocation) && getShardBonus(st.vocation) > 1 && (
                <div style={{fontSize:8,color:"#aa44ff",marginTop:2}}>🔮 별빛 조각 ×{getShardBonus(st.vocation).toFixed(2)}</div>
              )}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:16,color:"#00d4ff"}}>{completedCount}<span style={{fontSize:11,color:"#8aaabb"}}>/{totalCount}</span></div>
              <div style={{fontSize:9,color:trc>=limit?"#ff4d6d":"#3a9060"}}>보상 {trc}/{limit}{trc>=limit?" 🔒":""}</div>
            </div>
          </div>
          <div style={ST.barBg}><div style={{...ST.barFill,width:`${Math.min(lvInfo.progress,100)}%`}}/><div style={{...ST.barGlow,width:`${Math.min(lvInfo.progress,100)}%`}}/></div>
        </div>

        {/* 탭 */}
        <div style={ST.tabs}>
          {[["quests","⚔️ 퀘스트"],["dungeon",dungeonReady?"🏰 던전 🔴":"🏰 던전"],["summon","✦ 소환"],["constellation","🌌 별자리"],["shinjeon","⛩️ 신전"],["calendar","📅 달력"],["achievements","🏆 업적"]].map(([t,l])=>(
            <button key={t} style={{...ST.tab,...(tab===t?ST.tabA:{})}} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>

        {/* 퀘스트 탭 */}
        {tab==="quests"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,letterSpacing:2,color:"#8aaabb"}}>오늘의 퀘스트</span>
              <button style={ST.addBtn} onClick={()=>setShowAdd(v=>!v)}>{showAdd?"✕ 닫기":"+ 추가"}</button>
            </div>
            {trc>=limit&&<div style={ST.limitWarn}>🔒 오늘 보상 한도({limit}개) 달성.</div>}
            {showAdd&&(
              <div style={ST.addForm}>
                <input style={ST.input} placeholder="퀘스트 이름..." value={newTitle} onChange={e=>setNewTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQuest()} autoFocus/>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <select style={ST.select} value={newCat} onChange={e=>setNewCat(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
                  <div style={{display:"flex",gap:4}}>{PRIO.map(p=>(<button key={p.key} style={{...ST.prioBtn,borderColor:newPrio===p.key?p.color:"transparent",color:newPrio===p.key?p.color:"#aabbcc",boxShadow:newPrio===p.key?`0 0 6px ${p.glow}`:"none"}} onClick={()=>setNewPrio(p.key)}>{p.label}</button>))}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {[["today","오늘 (보상 ✕)"],["tomorrow","내일 (보상 ✓)"]].map(([v,l])=>(
                    <button key={v} style={{...ST.schedBtn,...(scheduleFor===v?{borderColor:"rgba(0,212,255,0.33)",color:"#00d4ff",background:"rgba(0,212,255,0.04)"}:{})}} onClick={()=>setScheduleFor(v)}>{l}</button>
                  ))}
                </div>
                <button style={ST.confirmBtn} onClick={addQuest}>등록</button>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {sorted.map(q=>{
                const p=PRIO.find(pp=>pp.key===q.priority);
                return(
                  <div key={q.id} style={{...ST.questCard,opacity:q.done?0.4:1,borderColor:q.done?"#091828":`${p.color}33`,boxShadow:q.done?"none":`0 0 8px ${p.glow}`}}>
                    <button style={{...ST.checkBtn,borderColor:q.done?p.color:`${p.color}55`,background:q.done?p.color:"transparent",boxShadow:q.done?`0 0 7px ${p.glow}`:"none"}} onClick={e=>toggleQuest(q.id,e)}>
                      {q.done&&<span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}
                    </button>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:12,fontWeight:500,color:q.done?"#aabbcc":"#c8e8ff",textDecoration:q.done?"line-through":"none",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.title}</span>
                        {!q.rewarded&&<span style={{fontSize:9,color:"rgba(255,77,109,0.7)"}}>📋</span>}
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:2,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,color:"#2a3a50"}}>{q.category}</span>
                        <span style={{fontSize:9,color:p.color}}>◆{p.label}</span>
                        {q.rewarded
                          ?<><span style={{fontSize:9,color:"rgba(0,212,255,0.8)",fontFamily:"'Orbitron',sans-serif"}}>+{p.xp}XP</span><span style={{fontSize:9,color:"rgba(0,212,255,0.8)"}}>+{SHARD_PER_QUEST}✨</span>{st.shinjeon&&<span style={{fontSize:9,color:"rgba(255,215,0,0.5)"}}>+2성력</span>}</>
                          :<span style={{fontSize:9,color:"rgba(255,77,109,0.7)"}}>보상없음</span>
                        }
                        {DUNGEONS.some(dg=>dg.tag===q.category&&st.activeDungeon?.dungeonId===dg.id)&&<span style={{fontSize:9,color:"rgba(0,212,255,0.53)"}}>⚔던전</span>}
                      </div>
                    </div>
                    <button style={ST.delBtn} onClick={()=>deleteQuest(q.id)}>✕</button>
                  </div>
                );
              })}
              {st.quests.length===0&&<div style={{textAlign:"center",color:"#7a9aaa",fontSize:12,padding:24}}>오늘 퀘스트가 없습니다.<br/>내일 것을 예약해보세요!</div>}
            </div>
            <div style={{marginTop:18}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:"#8aaabb",letterSpacing:2,marginBottom:8}}>내일 예약 ({tomorrowScheduled.length})</div>
              {tomorrowScheduled.length===0&&<div style={{fontSize:11,color:"#4a5a65",padding:"8px 0"}}>예약된 퀘스트가 없어요. 오늘 미리 등록하면 내일 보상을 받을 수 있어요!</div>}
              {tomorrowScheduled.map(q=>{
                const p=PRIO.find(pp=>pp.key===q.priority);
                return(<div key={q.id} style={{...ST.questCard,opacity:0.65,borderColor:"rgba(0,212,255,0.09)",marginBottom:6}}><span style={{fontSize:10,color:"rgba(0,212,255,0.27)"}}>📅</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,color:"#6688aa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.title}</div><div style={{display:"flex",gap:6,marginTop:1}}><span style={{fontSize:9,color:"#2a3a50"}}>{q.category}</span><span style={{fontSize:9,color:p.color}}>◆{p.label}</span><span style={{fontSize:9,color:"rgba(0,212,255,0.27)"}}>+{p.xp}XP +{SHARD_PER_QUEST}✨</span></div></div><button style={ST.delBtn} onClick={()=>deleteScheduled(q.id)}>✕</button></div>);
              })}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginTop:14 }} className="stat-grid">
              {[{l:"완료율",v:totalCount?`${Math.round(completedCount/totalCount*100)}%`:"0%"},{l:"오늘 보상",v:`${trc}/${limit}`},{l:"스트릭",v:`${st.streak}일 🔥`},{l:"총 완료",v:`${st.totalDone}개`},{l:"총 XP",v:st.totalXp.toLocaleString()},{l:"별빛 조각",v:`${st.starShards}✨`}].map(s=>(
                <div key={s.l} style={ST.statBox}><div style={ST.statVal}>{s.v}</div><div style={{fontSize:9,color:"#9abccb"}}>{s.l}</div></div>
              ))}
            </div>
          </div>
        )}

        {tab==="dungeon"&&<DungeonTab st={st} setSt={setSt} showNotif={showNotif} spawnParticles={spawnParticles} setNameUnlockPopup={setNameUnlockPopup}/>}
        {tab==="summon"&&<SummonTab st={st} setSt={setSt} showNotif={showNotif} spawnParticles={spawnParticles}/>}
        {tab==="constellation"&&<ConstellationTab st={st} setSt={setSt} showNotif={showNotif}/>}
        {tab==="shinjeon"&&<ShinjeonTab st={st} setSt={setSt} showNotif={showNotif}/>}
        {tab==="calendar"&&<CalendarTab st={st}/>}
        {tab==="achievements"&&<AchievementsTab st={st}/>}

      </div>

      <style dangerouslySetInnerHTML={{__html:"\n        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;500&display=swap');\n        *{box-sizing:border-box;margin:0;padding:0;}\n        html{-webkit-text-size-adjust:100%;}\n        body{overflow-x:hidden;}\n        select option{background:#040f1c;color:#c8e8ff;}\n        button,input,select,textarea{font-family:'Noto Sans KR',sans-serif;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}\n        ::-webkit-scrollbar{display:none;}\n\n        /* ── 별자리/통계 그리드 기본(모바일) ── */\n        .constellation-grid{grid-template-columns:repeat(3,1fr)!important;}\n        .stat-grid{grid-template-columns:repeat(3,1fr)!important;}\n        .gacha-btns{flex-direction:column!important;}\n\n        /* ── 타이머: 모바일 세로 → 위:타이머 아래:패널 ── */\n        .timer-layout{\n          display:flex;\n          flex-direction:column;\n          overflow-y:auto;\n        }\n        .timer-main-panel{\n          flex-shrink:0;\n        }\n        .timer-quest-panel{\n          width:100%!important;\n          min-height:200px;\n          max-height:45vh!important;\n          border-right:none!important;\n          border-top:1px solid rgba(0,212,255,0.06);\n          overflow-y:auto;\n          flex-shrink:0;\n        }\n\n        /* ═══ 폰 가로 / 태블릿 (600px+) ═══ */\n        @media(min-width:600px){\n          .constellation-grid{grid-template-columns:repeat(4,1fr)!important;}\n          .stat-grid{grid-template-columns:repeat(4,1fr)!important;}\n          .gacha-btns{flex-direction:row!important;}\n        }\n\n        /* ═══ 태블릿 가로 (768px+) → 좌우 분할 ═══ */\n        @media(min-width:768px){\n          .timer-layout{flex-direction:row!important;overflow-y:hidden;}\n          .timer-main-panel{flex:1;overflow-y:auto;}\n          .timer-quest-panel{\n            width:min(280px,36vw)!important;\n            min-height:unset!important;\n            max-height:none!important;\n            border-top:none!important;\n            border-right:none!important;\n            border-left:1px solid rgba(0,212,255,0.06)!important;\n            flex-shrink:0;\n          }\n          .constellation-grid{grid-template-columns:repeat(5,1fr)!important;}\n          .stat-grid{grid-template-columns:repeat(6,1fr)!important;}\n        }\n\n        /* ═══ 데스크탑 (1024px+) ═══ */\n        @media(min-width:1024px){\n          .constellation-grid{grid-template-columns:repeat(6,1fr)!important;}\n        }\n\n        /* ── 애니메이션 ── */\n        @keyframes scanMove{0%{transform:translateY(-100vh)}100%{transform:translateY(100vh)}}\n        @keyframes gridPulse{0%,100%{opacity:.25}50%{opacity:.5}}\n        @keyframes notifIn{0%{opacity:0;transform:translateX(-50%) translateY(12px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-16px)}}\n        @keyframes barShimmer{0%{background-position:-200% center}100%{background-position:200% center}}\n        @keyframes logoGlow{0%,100%{text-shadow:0 0 8px #00d4ff,0 0 18px rgba(0,212,255,0.4)}50%{text-shadow:0 0 18px #00d4ff,0 0 36px rgba(0,212,255,0.67)}}\n        @keyframes lvUp{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.25)}}\n        @keyframes achSlide{0%{opacity:0;transform:translateX(50px)}15%{opacity:1;transform:translateX(0)}80%{opacity:1}100%{opacity:0;transform:translateX(50px)}}\n        @keyframes focusIntro{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}\n        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}\n        @keyframes gachaFadeIn{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}\n        @keyframes gachaPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}\n        @keyframes gachaReveal{0%{opacity:0;transform:scale(0.6)}100%{opacity:1;transform:scale(1)}}\n"}}/>
    </div>
  );
}