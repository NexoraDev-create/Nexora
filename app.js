const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const discoveries = Array.isArray(window.NEXORA_DISCOVERIES) ? window.NEXORA_DISCOVERIES : [];

const challenges = [
  {category:"ASTRONOMIA",question:"Qual planeta tem um dia mais longo que seu próprio ano?",answers:["Mercúrio","Vênus","Marte"],correct:1,explanation:"Vênus leva cerca de 243 dias terrestres para girar uma vez sobre seu eixo e aproximadamente 225 dias para orbitar o Sol."},
  {category:"OCEANOS",question:"Qual é o maior oceano da Terra?",answers:["Atlântico","Índico","Pacífico"],correct:2,explanation:"O Pacífico é o maior e mais profundo oceano da Terra."},
  {category:"FÍSICA",question:"A luz do Sol demora aproximadamente quanto tempo para chegar à Terra?",answers:["8 minutos","8 segundos","1 hora"],correct:0,explanation:"A distância média entre a Terra e o Sol faz a luz levar cerca de 8 minutos e 20 segundos."},
  {category:"ANIMAIS",question:"Quantos corações tem um polvo?",answers:["Um","Dois","Três"],correct:2,explanation:"Polvos têm três corações: dois associados às brânquias e um que bombeia sangue para o corpo."},
  {category:"GEOGRAFIA",question:"Qual continente é também o maior deserto do planeta?",answers:["África","Antártida","Ásia"],correct:1,explanation:"A Antártida é um deserto polar porque recebe pouquíssima precipitação."},
  {category:"ASTRONOMIA",question:"Qual planeta abriga o Monte Olimpo, um vulcão gigantesco?",answers:["Marte","Júpiter","Mercúrio"],correct:0,explanation:"O Monte Olimpo fica em Marte e é o maior vulcão conhecido do Sistema Solar."},
  {category:"BIOLOGIA",question:"Como se chama a comunidade de microrganismos que vive no corpo?",answers:["Microbiota","Hemoglobina","Membrana"],correct:0,explanation:"Microbiota é o conjunto de microrganismos que vivem em determinado ambiente, incluindo o corpo humano."}
];

function dayIndex(length){
  const now = new Date();
  const start = new Date(now.getFullYear(),0,0);
  const day = Math.floor((now - start) / 86400000);
  return day % length;
}
const today = new Date();
const dateEl = document.getElementById("today-date");
if(dateEl) dateEl.textContent = new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long",year:"numeric"}).format(today).toUpperCase();
const dailyDiscoveryIndex=discoveries.length?dayIndex(discoveries.length):0;
const requestedDiscovery=new URLSearchParams(window.location.search).get("descoberta");
const requestedIndex=requestedDiscovery!==null && /^\d+$/.test(requestedDiscovery) ? Number(requestedDiscovery) : -1;
const discoveryIndex=Number.isInteger(requestedIndex) && requestedIndex>=0 && requestedIndex<discoveries.length ? requestedIndex : dailyDiscoveryIndex;
const discovery=discoveries[discoveryIndex]||null;
const setText = (id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};

// Jornada diária: duas de três atividades concluem a missão e mantêm a sequência.
const journeyKey="nexora-journey-v1";
const localDateKey=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
const todayKey=localDateKey();
let journey={today:todayKey,actions:{},lastCompleted:"",streak:0,bestStreak:0,xp:0,missions:0,completedDates:[],unlockedBadges:[],challengeDate:"",challengeAnswer:null};
try{
  const saved=JSON.parse(localStorage.getItem(journeyKey)||"null");
  if(saved && typeof saved==="object")journey={...journey,...saved,actions:saved.today===todayKey && saved.actions && typeof saved.actions==="object" ? saved.actions : {},xp:Number.isFinite(saved.xp)?Math.max(0,saved.xp):0,missions:Number.isFinite(saved.missions)?Math.max(0,saved.missions):0,streak:Number.isFinite(saved.streak)?Math.max(0,saved.streak):0,bestStreak:Number.isFinite(saved.bestStreak)?Math.max(saved.bestStreak||0,saved.streak||0):Math.max(0,saved.streak||0),completedDates:Array.isArray(saved.completedDates)?saved.completedDates.filter(value=>typeof value==="string").slice(-60):[],unlockedBadges:Array.isArray(saved.unlockedBadges)?saved.unlockedBadges.filter(value=>typeof value==="string"):[],challengeDate:typeof saved.challengeDate==="string"?saved.challengeDate:"",challengeAnswer:Number.isInteger(saved.challengeAnswer)?saved.challengeAnswer:null};
}catch(error){/* armazenamento indisponível: a jornada funciona durante esta visita */}
if(journey.today!==todayKey){journey.today=todayKey;journey.actions={};}
function saveJourney(){try{localStorage.setItem(journeyKey,JSON.stringify(journey));}catch(error){/* armazenamento local pode estar bloqueado */}}
function updateJourney(){
  const tasks=["discovery","challenge","lab"];
  const done=tasks.filter(task=>journey.actions[task]).length;
  const count=document.getElementById("return-streak-count");
  const progress=document.getElementById("return-progress");
  const fill=document.getElementById("return-progress-fill");
  if(count)count.textContent=String(journey.streak||0);
  if(progress)progress.setAttribute("aria-valuenow",String(Math.min(done,2)));
  if(fill)fill.style.width=(Math.min(done,2)/2*100)+"%";
  tasks.forEach(task=>{
    const row=document.getElementById("task-"+task);
    const status=document.getElementById("task-"+task+"-status");
    if(row)row.classList.toggle("is-done",!!journey.actions[task]);
    if(status)status.textContent=journey.actions[task]?"CONCLUÍDO":"PENDENTE";
  });
  const message=document.getElementById("return-message");
  if(message)message.textContent=done>=2?"Missão diária concluída. Sua sequência está atualizada.":`${done} de 2 atividades concluídas. Complete mais ${2-done} para fechar a missão de hoje.`;
  const levels=[{name:"Curioso",min:0},{name:"Explorador",min:100},{name:"Pesquisador",min:250},{name:"Especialista",min:500},{name:"Mestre Nexora",min:1000}];
  const level=levels.reduce((current,item)=>journey.xp>=item.min?item:current,levels[0]);
  const next=levels.find(item=>item.min>journey.xp);
  const levelEl=document.getElementById("explorer-level");if(levelEl)levelEl.textContent=`Nível ${levels.indexOf(level)+1} · ${level.name}`;
  const xpEl=document.getElementById("explorer-xp");if(xpEl)xpEl.textContent=String(journey.xp);
  const progressEl=document.getElementById("explorer-progress");const progressFill=document.getElementById("explorer-progress-fill");
  const percent=next?Math.round((journey.xp-level.min)/(next.min-level.min)*100):100;
  if(progressEl)progressEl.setAttribute("aria-valuenow",String(percent));if(progressFill)progressFill.style.width=percent+"%";
  const nextEl=document.getElementById("explorer-next");if(nextEl)nextEl.textContent=next?`${next.min-journey.xp} XP para o próximo nível`:"Nível máximo alcançado";
  const unlocked={first:journey.missions>=1,streak3:journey.bestStreak>=3,xp100:journey.xp>=100,streak7:journey.bestStreak>=7,missions5:journey.missions>=5,xp500:journey.xp>=500};
  let badgesChanged=false;
  Object.entries(unlocked).forEach(([key,active])=>{if(active&&!journey.unlockedBadges.includes(key)){journey.unlockedBadges.push(key);badgesChanged=true;}});
  document.querySelectorAll("[data-badge]").forEach(badge=>{const active=journey.unlockedBadges.includes(badge.dataset.badge);badge.classList.toggle("unlocked",active);badge.classList.toggle("locked",!active);badge.setAttribute("aria-label",badge.textContent+(active?" · desbloqueada":" · bloqueada"));});
  const week=document.getElementById("journey-week");
  if(week){week.innerHTML="";for(let offset=6;offset>=0;offset--){const date=new Date();date.setDate(date.getDate()-offset);const key=localDateKey(date);const day=document.createElement("span");day.className="journey-day"+(journey.completedDates.includes(key)?" is-complete":"")+(offset===0?" is-today":"");day.textContent=new Intl.DateTimeFormat("pt-BR",{weekday:"narrow"}).format(date);day.title=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long"}).format(date)+(journey.completedDates.includes(key)?" · missão concluída":" · sem missão registrada");day.setAttribute("aria-label",day.title);week.appendChild(day);}}
  const best=document.getElementById("best-streak-count");if(best)best.textContent=String(journey.bestStreak||0);
  if(badgesChanged)saveJourney();
}
function completeJourneyTask(task){
  if(journey.actions[task])return;
  journey.actions[task]=true;
  const points={discovery:10,challenge:15,lab:10};
  journey.xp=(journey.xp||0)+points[task];
  const done=["discovery","challenge","lab"].filter(key=>journey.actions[key]).length;
  if(done>=2 && journey.lastCompleted!==todayKey){
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    journey.streak=journey.lastCompleted===localDateKey(yesterday)?(journey.streak||0)+1:1;
    journey.bestStreak=Math.max(journey.bestStreak||0,journey.streak);
    journey.completedDates=Array.isArray(journey.completedDates)?journey.completedDates:[];
    if(!journey.completedDates.includes(todayKey))journey.completedDates.push(todayKey);
    journey.completedDates=journey.completedDates.slice(-60);
    journey.lastCompleted=todayKey;
    journey.xp+=25;
    journey.missions=(journey.missions||0)+1;
  }
  journey.today=todayKey;
  saveJourney();
  updateJourney();
}
if(journey.lastCompleted){
  if(!journey.completedDates.includes(journey.lastCompleted))journey.completedDates.push(journey.lastCompleted);
  journey.bestStreak=Math.max(journey.bestStreak||0,journey.streak||0);
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  if(journey.lastCompleted!==todayKey && journey.lastCompleted!==localDateKey(yesterday))journey.streak=0;
}
updateJourney();
const markDiscovery=document.getElementById("mark-discovery");
if(markDiscovery){
  if(journey.actions.discovery){markDiscovery.disabled=true;markDiscovery.textContent="Descoberta concluída ✓";}
  markDiscovery.addEventListener("click",()=>{
    completeJourneyTask("discovery");markDiscovery.disabled=true;markDiscovery.textContent="Descoberta concluída ✓";
  });
}

if(discovery){
setText("discovery-number",String(discoveryIndex+1).padStart(3,"0"));
setText("discovery-category",discovery.category);
setText("discovery-title",discovery.title);
setText("discovery-summary",discovery.summary);
setText("discovery-detail",discovery.detail);
const sourceLink=document.getElementById("discovery-source");
if(sourceLink){sourceLink.href=discovery.source;sourceLink.textContent="Fonte: "+discovery.label+" ↗";}
const shareButton=document.getElementById("share-discovery");
const shareFeedback=document.getElementById("share-feedback");
if(shareButton){
  shareButton.addEventListener("click",async()=>{
    const shareUrl=new URL(window.location.href);
    shareUrl.pathname=shareUrl.pathname.replace(/\/$/,"")+"/discoveries/"+discovery.slug+".html";
    shareUrl.search="";
    shareUrl.hash="descoberta";
    const shareData={title:"Nexora · "+discovery.title,text:discovery.summary+" — Leia na Nexora:",url:shareUrl.href};
    try{
      if(navigator.share){
        await navigator.share(shareData);
        if(shareFeedback)shareFeedback.textContent="Compartilhamento aberto.";
      }else{
        await navigator.clipboard.writeText(shareUrl.href);
        if(shareFeedback)shareFeedback.textContent="Link da descoberta copiado.";
      }
    }catch(error){
      if(error && error.name==="AbortError")return;
      if(shareFeedback)shareFeedback.textContent="Não foi possível compartilhar agora. Tente novamente.";
    }
  });
}

}

const range=document.getElementById("distance-range");
const target=document.getElementById("light-target");
const line=document.querySelector(".distance-line");
const rays=document.getElementById("light-rays");
function updateLab(){
  if(!range)return;
  const distance=Number(range.value);
  const intensity=100/(distance*distance);
  setText("distance-value",distance);
  setText("intensity-value",intensity.toFixed(distance===1?0:1)+"%");
  setText("diagram-distance",distance+"×");
  if(target)target.style.left=(25+(distance-1)*6.3)+"%";
  if(line)line.style.width=(12+(distance-1)*6.3)+"%";
  if(rays)rays.style.opacity=String(Math.max(.18,1/distance));
}
if(range){range.addEventListener("input",()=>{updateLab();completeJourneyTask("lab");});updateLab();}

const challenge=challenges[dayIndex(challenges.length)];
setText("challenge-number",String(dayIndex(challenges.length)+1).padStart(2,"0"));
setText("challenge-category",challenge.category+" · NÍVEL CURIOSO");
setText("challenge-question",challenge.question);
const answersEl=document.getElementById("challenge-answers");
const feedback=document.getElementById("answer-feedback");
if(answersEl){
  answersEl.innerHTML="";
  challenge.answers.forEach((answer,index)=>{
    const button=document.createElement("button");
    button.className="answer";
    button.type="button";
    button.textContent=answer;
    button.addEventListener("click",()=>{
      if(answersEl.dataset.answered==="true")return;
      answersEl.dataset.answered="true";
      completeJourneyTask("challenge");
      journey.challengeDate=todayKey;journey.challengeAnswer=index;saveJourney();
      const correct=index===challenge.correct;
      [...answersEl.children].forEach((item,i)=>{
        item.disabled=true;
        if(i===challenge.correct)item.classList.add("correct");
        else if(i===index)item.classList.add("wrong");
      });
      if(feedback)feedback.textContent=(correct?"Resposta certa! ":"Não foi dessa vez. ")+challenge.explanation;
    });
    answersEl.appendChild(button);
  });
  if(journey.challengeDate===todayKey && Number.isInteger(journey.challengeAnswer) && journey.challengeAnswer>=0 && journey.challengeAnswer<challenge.answers.length){
    answersEl.dataset.answered="true";
    [...answersEl.children].forEach((button,index)=>{button.disabled=true;if(index===challenge.correct)button.classList.add("correct");else if(index===journey.challengeAnswer)button.classList.add("wrong");});
    if(feedback)feedback.textContent=(journey.challengeAnswer===challenge.correct?"Resposta certa! ":"Não foi dessa vez. ")+challenge.explanation;
  }
}


// Mistério semanal: as pistas são liberadas progressivamente e a conclusão aparece no domingo.
const weeklyMysteries = [
  {category:"HISTÓRIA · MANUSCRITOS",title:"O livro que ninguém conseguiu ler",intro:"Um manuscrito antigo reúne escrita desconhecida, desenhos curiosos e séculos de tentativas de interpretação. O que exatamente temos diante de nós?",symbol:"?",answer:"O Manuscrito Voynich",explanation:"É um códice ilustrado, produzido provavelmente no início do século XV. Seu sistema de escrita ainda não foi decifrado de forma consensual. Existem hipóteses sobre sua origem e conteúdo, mas nenhuma tradução foi comprovada. O mistério real não é uma solução escondida já conhecida: é justamente não sabermos o que o texto diz.",clues:["É um livro feito à mão, não um documento digital ou uma impressão moderna.","Suas páginas misturam texto em uma escrita ainda não identificada e ilustrações de plantas, diagramas e figuras.","A análise do pergaminho indica que ele foi produzido no começo do século XV.","O manuscrito recebeu o nome de Wilfrid Voynich, um livreiro que o adquiriu em 1912."],source:"https://beinecke.library.yale.edu/collections/highlights/voynich-manuscript",label:"YALE · BEINECKE LIBRARY"},
  {category:"ARQUEOLOGIA · TECNOLOGIA",title:"A máquina encontrada no fundo do mar",intro:"Um objeto recuperado de um naufrágio parecia simples à primeira vista. Dentro dele, porém, havia uma engenharia surpreendentemente sofisticada para sua época.",symbol:"⚙",answer:"O mecanismo de Anticítera",explanation:"Construído na Grécia antiga, o mecanismo usava engrenagens para representar ciclos astronômicos e prever fenômenos, como eclipses. É frequentemente descrito como um computador analógico antigo. Pesquisadores ainda estudam detalhes de seu funcionamento e de seu contexto.",clues:["O objeto foi recuperado de um naufrágio perto de uma ilha grega.","Ele é feito de bronze e possui engrenagens cuidadosamente construídas.","Seu funcionamento está ligado à observação do céu e a ciclos astronômicos.","O nome vem da ilha de Anticítera, próxima ao local do naufrágio."],source:"https://www.nhm.ac.uk/discover/what-is-the-antikythera-mechanism.html",label:"NATURAL HISTORY MUSEUM"},
  {category:"ASTRONOMIA · SINAIS",title:"Um sinal estranho vindo do espaço",intro:"Durante uma observação do céu, um radiotelescópio registrou um sinal intenso e incomum. Ele chamou atenção, mas sua origem nunca foi confirmada.",symbol:"〰",answer:"O sinal Wow!",explanation:"O sinal Wow! foi detectado em 1977 pelo radiotelescópio Big Ear, nos Estados Unidos. Sua intensidade e características chamaram atenção, mas ele não voltou a ser observado de maneira confirmada. Não há evidência de que tenha sido enviado por vida extraterrestre; sua origem permanece desconhecida.",clues:["O registro foi feito em 1977 por um radiotelescópio.","O sinal durou cerca de 72 segundos na observação registrada.","Um astrônomo escreveu uma anotação de surpresa ao lado dos dados impressos.","A anotação manuscrita deu nome ao evento: Wow!."],source:"https://www.seti.org/",label:"SETI INSTITUTE"},
  {category:"HISTÓRIA · NAVEGAÇÃO",title:"O navio encontrado sem sua tripulação",intro:"No século XIX, um navio foi encontrado à deriva no Atlântico. Estava flutuando, mas ninguém da tripulação foi localizado. O que aconteceu continua sem resposta definitiva.",symbol:"⌁",answer:"O caso do Mary Celeste",explanation:"O Mary Celeste foi encontrado abandonado em 1872, no Atlântico. A tripulação nunca foi localizada e não existe uma explicação definitiva aceita para o abandono. Relatos populares acrescentaram detalhes dramáticos ao caso, por isso é importante separar documentos históricos de lendas posteriores.",clues:["O caso aconteceu no século XIX, durante uma travessia pelo Atlântico.","A embarcação foi encontrada navegável, mas sem as pessoas que estavam a bordo.","O navio transportava carga comercial e havia partido de Nova York.","O nome da embarcação era Mary Celeste."],source:"https://www.britannica.com/topic/Mary-Celeste",label:"ENCYCLOPAEDIA BRITANNICA"}
];
function weekIndex(){
  const now=new Date();
  const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate()-((now.getDay()+6)%7));
  const year=monday.getFullYear();
  const firstDay=new Date(year,0,1);
  const firstMonday=new Date(year,0,1-((firstDay.getDay()+6)%7));
  const week=Math.floor((monday-firstMonday)/604800000);
  return ((week%weeklyMysteries.length)+weeklyMysteries.length)%weeklyMysteries.length;
}
function setupWeeklyMystery(){
  const root=document.getElementById("mystery-clues");
  if(!root)return;
  const item=weeklyMysteries[weekIndex()];
  const day=(new Date().getDay()+6)%7; // segunda=0, domingo=6
  const available=Math.min(4,Math.max(1,Math.floor(day*4/6)+1));
  setText("mystery-case",String(weekIndex()+1).padStart(3,"0"));
  setText("mystery-category",item.category);
  setText("mystery-title",item.title);
  setText("mystery-intro",item.intro);
  setText("mystery-symbol",item.symbol);
  setText("mystery-status",day===6?"EDIÇÃO DA SEMANA · REVELADA":`${available} DE 4 PISTAS LIBERADAS`);
  root.innerHTML="";
  item.clues.forEach((clue,index)=>{
    const row=document.createElement("div");
    row.className="mystery-clue";
    const label=document.createElement("span");
    label.className="mystery-clue-number";
    label.textContent=String(index+1).padStart(2,"0");
    const body=document.createElement("p");
    if(index<available){body.textContent=clue;}
    else{body.textContent="Pista liberada em breve";row.classList.add("locked");}
    row.append(label,body);root.appendChild(row);
  });
  const reveal=document.getElementById("mystery-reveal");
  if(day===6){
    reveal.hidden=false;
    setText("mystery-answer",item.answer);
    setText("mystery-explanation",item.explanation);
    const link=document.getElementById("mystery-source");
    link.href=item.source;link.textContent="Fonte: "+item.label+" ↗";
    setText("mystery-return","A solução desta edição está aberta. A próxima investigação começa na segunda-feira.");
  }else{
    reveal.hidden=true;
    setText("mystery-return",day===5?"A última pista já está disponível. A conclusão será revelada amanhã.":"Volte amanhã para encontrar uma nova pista. A conclusão aparece no domingo.");
  }
}
setupWeeklyMystery();


// Instalação e leitura offline: o site continua funcional após a primeira visita online.
if("serviceWorker" in navigator && document.currentScript){const appBase=new URL("./",document.currentScript.src);window.addEventListener("load",()=>{navigator.serviceWorker.register(new URL("sw.js",appBase).href,{scope:appBase.pathname}).catch(()=>{});});}
