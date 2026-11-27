#!/usr/bin/env python3
"""Generate a searchable Portuguese index for Nexora's retained English guides."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://nexoradev-create.github.io/Nexora/"

class ArticleMeta(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=False; self.h1=False; self.description=""; self.title_text=[]; self.h1_text=[]; self.capture_title=False; self.capture_h1=False
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=="title": self.capture_title=True
        if tag=="h1": self.capture_h1=True
        if tag=="meta" and attrs.get("name","").lower()=="description": self.description=attrs.get("content","")
    def handle_endtag(self, tag):
        if tag=="title": self.capture_title=False
        if tag=="h1": self.capture_h1=False
    def handle_data(self, data):
        if self.capture_title: self.title_text.append(data)
        if self.capture_h1: self.h1_text.append(data)

items=[]
for page in sorted((ROOT/"articles").glob("*.html")):
    if page.name=="index.html": continue
    parser=ArticleMeta(); parser.feed(page.read_text(encoding="utf-8"))
    title="".join(parser.h1_text).strip() or "".join(parser.title_text).removesuffix(" — Nexora").strip()
    slug=page.stem
    if any(word in slug for word in ("freelance","client","invoice","price","proposal","scope","estimate","async","portfolio")):
        category="FREELANCING"
    elif any(word in slug for word in ("workflow","tool","files","backup","security","accessibility","landing-page")):
        category="FLUXOS DIGITAIS"
    elif "focus" in slug:
        category="PRODUTIVIDADE"
    elif any(word in slug for word in ("validate","brief")):
        category="IDEIAS E PRODUTOS"
    else:
        category="GUIAS PRÁTICOS"
    items.append({"file":page.name,"title":title,"description":parser.description,"category":category})

cards=[]
for item in items:
    cards.append(f'''<a class="discovery-index-card guide-card" data-guide-card data-category="{escape(item['category'],quote=True)}" href="{escape(item['file'],quote=True)}"><span class="eyebrow">{escape(item['category'])} · ENGLISH</span><h2>{escape(item['title'])}</h2><p>{escape(item['description'])}</p><span class="inline-link">Ler guia em inglês ↗</span></a>''')
url=BASE+"articles/"
page=f'''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0b0d10">
  <meta name="description" content="Explore os guias práticos da Nexora sobre trabalho independente, ferramentas digitais, produtividade e criação de produtos. Conteúdo em inglês.">
  <link rel="canonical" href="{url}"><link rel="icon" type="image/svg+xml" href="../favicon.svg"><link rel="manifest" href="../manifest.webmanifest">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Nexora"><meta property="og:url" content="{url}"><meta property="og:title" content="Guias práticos em inglês | Nexora"><meta property="og:description" content="Uma biblioteca de guias práticos sobre trabalho independente e ferramentas digitais.">
  <title>Guias práticos em inglês | Nexora</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../article.css">
  <script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"CollectionPage","name":"Guias práticos da Nexora","url":url,"inLanguage":"pt-BR"},ensure_ascii=False)}</script>
</head>
<body><a class="skip-link" href="#main-content">Pular para o conteúdo</a>
<header class="site-header"><a class="brand" href="../" aria-label="Nexora início"><span class="brand-mark">N</span> nexora<span class="brand-period">.</span></a><nav class="main-nav" aria-label="Navegação principal"><a href="../#descoberta">Descobertas</a><a href="../misterios.html">Investigações</a><a href="../#jornada">Sua jornada</a></nav><a class="header-link" href="../">Voltar à Nexora ↗</a></header>
<main id="main-content" class="discovery-archive"><div class="eyebrow">NEXORA / BIBLIOTECA</div><h1>Guias para <em>colocar em prática.</em></h1><p class="archive-lead">Uma coleção de guias sobre trabalho independente, organização e ferramentas digitais. Estes textos estão em inglês; o idioma está indicado em cada cartão.</p>
<div class="archive-tools"><label for="guide-search">BUSCAR GUIA<input id="guide-search" type="search" placeholder="Ex.: portfolio, workflow, focus..." autocomplete="off"></label><label for="guide-filter">TEMA<select id="guide-filter"><option value="">Todos os temas</option>{''.join(f'<option value="{escape(category,quote=True)}">{escape(category)}</option>' for category in sorted({item['category'] for item in items}))}</select></label></div>
<p class="archive-count" id="guide-count" role="status">{len(items)} guias disponíveis · em inglês</p><div class="discovery-index-grid">{''.join(cards)}</div>
</main><footer class="site-footer"><a class="brand" href="../"><span class="brand-mark">N</span> nexora<span class="brand-period">.</span></a><span>DISCOVER SOMETHING NEW.</span><div><a href="../about.html">Sobre</a><a href="../privacy.html">Privacidade</a><a href="../discoveries/">Descobertas</a></div><small>© 2026 NEXORA · CONHECIMENTO EM MOVIMENTO.</small></footer>
<script>(()=>{{const search=document.getElementById('guide-search');const filter=document.getElementById('guide-filter');const cards=[...document.querySelectorAll('[data-guide-card]')];const count=document.getElementById('guide-count');function apply(){{const term=search.value.trim().toLocaleLowerCase('pt-BR');let visible=0;cards.forEach(card=>{{const show=card.textContent.toLocaleLowerCase('pt-BR').includes(term)&&(!filter.value||card.dataset.category===filter.value);card.hidden=!show;if(show)visible++;}});count.textContent=visible+' de '+cards.length+' guias · em inglês';}}search.addEventListener('input',apply);filter.addEventListener('change',apply);}})();</script><script src="../app.js"></script></body></html>'''
(ROOT/"articles"/"index.html").write_text(page,encoding="utf-8")
print(f"Generated searchable guide archive with {len(items)} English articles.")
