#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor(id='') {
    this.id=id; this.dataset={}; this.style={}; this.attrs={}; this.children=[]; this.listeners={};
    this.classNames=new Set(); this.disabled=false; this.hidden=false; this.value='1'; this.textContent='';
    this.classList={
      add:(name)=>this.classNames.add(name),
      remove:(name)=>this.classNames.delete(name),
      toggle:(name,force)=>{const active=force===undefined?!this.classNames.has(name):!!force;if(active)this.classNames.add(name);else this.classNames.delete(name);return active;},
      contains:(name)=>this.classNames.has(name)
    };
  }
  addEventListener(type,callback){this.listeners[type]=callback;}
  appendChild(child){this.children.push(child);return child;}
  append(...items){this.children.push(...items);}
  setAttribute(name,value){this.attrs[name]=String(value);}
  getAttribute(name){return this.attrs[name]??null;}
  set innerHTML(value){this._innerHTML=value;if(value==='')this.children=[];}
  get innerHTML(){return this._innerHTML||'';}
  click(){this.listeners.click?.();}
  dispatch(type){this.listeners[type]?.();}
}

const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
function boot(storage={},includeDiscoveries=true){
  const elements=new Map();
  const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
  const badgeKeys=['first','streak3','xp100','streak7','missions5','xp500'];
  const badges=badgeKeys.map(key=>{const el=new Element('badge-'+key);el.dataset.badge=key;el.textContent=key;return el;});
  const line=new Element('distance-line');
  const listeners={};
  const document={
    currentScript:{src:'https://nexoradev-create.github.io/Nexora/app.js'},
    getElementById:get,
    querySelector:(selector)=>selector==='.distance-line'?line:null,
    querySelectorAll:(selector)=>selector==='[data-badge]'?badges:[],
    createElement:(tag)=>new Element(tag)
  };
  const local={...storage};
  const localStorage={getItem:key=>local[key]??null,setItem:(key,value)=>{local[key]=value;},removeItem:key=>delete local[key]};
  const discoveries=Array.from({length:7},(_,i)=>({category:'TESTE',title:'Descoberta '+i,summary:'Resumo',detail:'Detalhe',source:'https://example.com',label:'Fonte',slug:'descoberta-'+i}));
  const window={NEXORA_DISCOVERIES:includeDiscoveries?discoveries:undefined,location:{search:'',href:'https://nexoradev-create.github.io/Nexora/'},addEventListener:(name,fn)=>{listeners[name]=fn;}};
  const navigator={serviceWorker:{register:async(url,options)=>({url,options})}};
  const context={document,window,navigator,localStorage,URL,URLSearchParams,Intl,Date,Math,Number,String,Array,Object,JSON,console};
  vm.runInNewContext(fs.readFileSync('app.js','utf8'),context,{filename:'app.js'});
  return {elements,get,badges,local,window,navigator,listeners};
}

const first=boot();
first.get('mark-discovery').click();
const answers=first.get('challenge-answers');
assert.equal(answers.children.length,3,'daily challenge renders three answer buttons');
answers.children[0].click();
assert.equal(answers.dataset.answered,'true','answer is locked after selection');
assert.equal(first.get('return-message').textContent.startsWith('Missão diária concluída'),true,'two tasks complete the daily mission');
first.get('distance-range').value='2';
first.get('distance-range').dispatch('input');
const saved=JSON.parse(first.local['nexora-journey-v1']);
assert.equal(saved.missions,1,'daily mission is counted once');
assert.equal(saved.xp,60,'XP rewards and mission bonus are added');
assert.equal(saved.challengeDate,today(),'challenge answer is persisted for today');
assert.equal(saved.bestStreak,1,'best streak is recorded');
assert.equal(saved.completedDates.includes(today()),true,'completed day is stored');
assert.equal(first.badges.find(x=>x.dataset.badge==='first').classList.contains('unlocked'),true,'first achievement unlocks');

const second=boot(first.local);
assert.equal(second.get('explorer-xp').textContent,'60','XP survives reload');
assert.equal(second.get('mark-discovery').disabled,true,'completed discovery remains completed after reload');
assert.equal(second.get('challenge-answers').dataset.answered,'true','daily answer remains locked after reload');
assert.equal(second.get('challenge-answers').children.every(button=>button.disabled),true,'all answer choices remain disabled after reload');

const older=new Date();older.setDate(older.getDate()-2);
const oldKey=[older.getFullYear(),String(older.getMonth()+1).padStart(2,'0'),String(older.getDate()).padStart(2,'0')].join('-');
const achievementState={'nexora-journey-v1':JSON.stringify({today:today(),actions:{},lastCompleted:oldKey,streak:0,bestStreak:7,xp:500,missions:5,completedDates:[oldKey],unlockedBadges:[]})};
const third=boot(achievementState);
assert.equal(third.get('return-streak-count').textContent,'0','current streak resets after a missed day');
assert.equal(third.get('best-streak-count').textContent,'7','best streak remains recorded');
assert.equal(third.badges.every(badge=>badge.classList.contains('unlocked')),true,'earned achievements remain unlocked');
const contentPage=boot({},false);
assert.equal(String(contentPage.get('year').textContent),String(new Date().getFullYear()),'shared app script works on pages without discovery data');
console.log('App tests passed: daily mission, XP, persistence, challenge lock, streak history, permanent achievements, content-page compatibility.');
