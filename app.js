const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const discoveries = [
  {category:"ASTRONOMIA",title:"Em Vênus, um dia dura mais que um ano.",summary:"Vênus leva cerca de 243 dias terrestres para completar uma rotação. Sua volta ao redor do Sol leva aproximadamente 225 dias terrestres.",detail:"Isso significa que Vênus termina uma órbita ao redor do Sol antes de completar uma única rotação em torno do próprio eixo. É uma das características mais curiosas da dinâmica do planeta.",source:"https://science.nasa.gov/venus/venus-facts/",label:"NASA · VENUS FACTS"},
  {category:"OCEANOS",title:"O maior habitat da Terra ainda é pouco explorado.",summary:"O oceano cobre mais de 70% da superfície terrestre e contém a maior parte do espaço habitável do planeta.",detail:"A pressão, a escuridão e a dificuldade de acesso tornam a exploração do oceano profundo um desafio científico e tecnológico.",source:"https://oceanservice.noaa.gov/facts/ocean.html",label:"NOAA · OCEAN FACTS"},
  {category:"FÍSICA",title:"A luz do Sol leva pouco mais de oito minutos para chegar à Terra.",summary:"Mesmo viajando a aproximadamente 300 mil quilômetros por segundo, a luz precisa de cerca de 8 minutos e 20 segundos para cruzar a distância média entre o Sol e a Terra.",detail:"Quando olhamos para o Sol, vemos como ele era há pouco mais de oito minutos. A luz é rápida, mas as distâncias astronômicas são enormes.",source:"https://science.nasa.gov/sun/facts/",label:"NASA · SUN FACTS"},
  {category:"ANIMAIS",title:"Polvos têm três corações e sangue azulado.",summary:"Dois corações ajudam a movimentar o sangue pelas brânquias, enquanto um terceiro o bombeia para o resto do corpo.",detail:"O sangue dos polvos usa hemocianina, uma molécula com cobre que transporta oxigênio e pode dar ao sangue uma aparência azulada.",source:"https://ocean.si.edu/ocean-life/invertebrates/cephalopods",label:"SMITHSONIAN OCEAN"},
  {category:"GEOGRAFIA",title:"A Antártida também é considerada um deserto.",summary:"Desertos são definidos pela baixa precipitação, não pela temperatura. Por isso, a Antártida é o maior deserto do planeta.",detail:"Apesar de estar coberta por gelo, o interior da Antártida recebe pouquíssima precipitação ao longo do ano.",source:"https://www.nationalgeographic.com/environment/article/antarctica",label:"NATIONAL GEOGRAPHIC"},
  {category:"ASTRONOMIA",title:"Há montanhas em Marte muito maiores que as da Terra.",summary:"O Monte Olimpo, em Marte, é um vulcão-escudo com cerca de 22 quilômetros de altura em relação à região ao redor.",detail:"Sua enorme dimensão está ligada, entre outros fatores, à ausência de placas tectônicas como as da Terra, permitindo que o vulcão crescesse na mesma região por muito tempo.",source:"https://science.nasa.gov/mars/",label:"NASA · MARS"},
  {category:"CIÊNCIA",title:"Seu corpo abriga comunidades de microrganismos.",summary:"Bactérias, fungos e outros microrganismos vivem na pele e em diferentes partes do corpo humano. Muitos participam de processos importantes para a saúde.",detail:"O conjunto desses microrganismos é chamado de microbiota. A ciência ainda investiga como essas comunidades interagem com alimentação, ambiente e sistema imunológico.",source:"https://www.nih.gov/",label:"NATIONAL INSTITUTES OF HEALTH"}
];

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
const discovery = discoveries[dayIndex(discoveries.length)];
const setText = (id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
setText("discovery-number",String(dayIndex(discoveries.length)+1).padStart(3,"0"));
setText("discovery-category",discovery.category);
setText("discovery-title",discovery.title);
setText("discovery-summary",discovery.summary);
setText("discovery-detail",discovery.detail);
const sourceLink=document.getElementById("discovery-source");
if(sourceLink){sourceLink.href=discovery.source;sourceLink.textContent="Fonte: "+discovery.label+" ↗";}

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
if(range){range.addEventListener("input",updateLab);updateLab();}

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
  const first=new Date(now.getFullYear(),0,1);
  const week=Math.floor((now-first)/604800000);
  return week%weeklyMysteries.length;
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
