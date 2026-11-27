#!/usr/bin/env python3
"""Generate individual, indexable Nexora discovery pages and the sitemap."""
from datetime import date
from html import escape
import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://nexoradev-create.github.io/Nexora/"
items = json.loads((ROOT / "discoveries.json").read_text(encoding="utf-8"))
(ROOT / "discoveries.js").write_text(
    "window.NEXORA_DISCOVERIES = " + json.dumps(items, ensure_ascii=False, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
out = ROOT / "discoveries"
out.mkdir(exist_ok=True)
for item in items:
    slug = item["slug"]
    title = item["title"]
    description = item["summary"]
    url = BASE + "discoveries/" + slug + ".html"
    e = escape
    page = f'''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b0d10">
  <meta name="description" content="{e(description, quote=True)}">
  <link rel="canonical" href="{url}">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="manifest" href="../manifest.webmanifest">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Nexora">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{e(title, quote=True)} | Nexora">
  <meta property="og:description" content="{e(description, quote=True)}">
  <meta property="og:image" content="{BASE}discovery-share.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(title, quote=True)} | Nexora">
  <meta name="twitter:description" content="{e(description, quote=True)}">
  <meta name="twitter:image" content="{BASE}discovery-share.svg">
  <title>{e(title)} | Nexora</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Article","headline":title,"description":description,"url":url,"image":BASE+"discovery-share.svg","author":{"@type":"Organization","name":"Nexora"},"publisher":{"@type":"Organization","name":"Nexora"},"inLanguage":"pt-BR"},ensure_ascii=False)}</script>
</head>
<body>
  <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
  <header class="site-header">
    <a class="brand" href="../" aria-label="Nexora início"><span class="brand-mark">N</span> nexora<span class="brand-period">.</span></a>
    <nav class="main-nav" aria-label="Navegação principal"><a href="../#descoberta">Descoberta do dia</a><a href="../#misterio">Mistério semanal</a></nav>
    <a class="header-link" href="../">Voltar à Nexora ↗</a>
  </header>
  <main id="main-content" class="discovery-article">
    <a class="article-back" href="../#descoberta">← Todas as descobertas</a>
    <div class="eyebrow">NEXORA FIELD NOTE / {int(items.index(item)+1):03d} · {e(item['category'])}</div>
    <h1>{e(title)}</h1>
    <p class="article-lead">{e(description)}</p>
    <div class="article-rule"></div>
    <h2>O que isso significa?</h2>
    <p>{e(item['detail'])}</p>
    <aside class="article-source"><span class="card-kicker">CONTINUE INVESTIGANDO</span><p>Esta descoberta foi preparada com base em uma fonte de referência. Consulte o material original para conhecer os detalhes.</p><a class="inline-link" href="{e(item['source'], quote=True)}" target="_blank" rel="noopener noreferrer">Fonte: {e(item['label'])} ↗</a></aside>
    <a class="button button-primary article-home" href="../">Explorar mais descobertas <span>↗</span></a>
  </main>
  <footer class="site-footer"><a class="brand" href="../"><span class="brand-mark">N</span> nexora<span class="brand-period">.</span></a><span>DISCOVER SOMETHING NEW.</span><div><a href="../about.html">Sobre</a><a href="../privacy.html">Privacidade</a></div><small>© {date.today().year} NEXORA · CONHECIMENTO EM MOVIMENTO.</small></footer>
  <script src="../app.js"></script>
</body>
</html>
'''
    (out / f"{slug}.html").write_text(page, encoding="utf-8")

cards = []
for index, item in enumerate(items, 1):
    cards.append(f'''<a class="discovery-index-card" data-discovery-card data-category="{escape(item['category'], quote=True)}" href="{item['slug']}.html"><span class="eyebrow">FIELD NOTE / {index:03d} · {escape(item['category'])}</span><h2>{escape(item['title'])}</h2><p>{escape(item['summary'])}</p><span class="inline-link">Explorar descoberta ↗</span></a>''')
collection_url = BASE + "discoveries/"
collection = f'''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0b0d10">
  <meta name="description" content="Explore o arquivo de descobertas da Nexora: ciência, história, natureza, astronomia e muito mais.">
  <link rel="canonical" href="{collection_url}"><link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Nexora"><meta property="og:url" content="{collection_url}">
  <meta property="og:title" content="Arquivo de descobertas | Nexora"><meta property="og:description" content="Uma coleção de descobertas para explorar, entender e compartilhar.">
  <meta property="og:image" content="{BASE}discovery-share.svg"><meta name="twitter:card" content="summary_large_image">
  <title>Arquivo de descobertas | Nexora</title><link rel="stylesheet" href="../styles.css"><link rel="manifest" href="../manifest.webmanifest">
  <script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"CollectionPage","name":"Arquivo de descobertas da Nexora","url":collection_url,"inLanguage":"pt-BR"},ensure_ascii=False)}</script>
</head>
<body><a class="skip-link" href="#main-content">Pular para o conteúdo</a>
<header class="site-header"><a class="brand" href="../" aria-label="Nexora início"><span class="brand-mark">N</span> nexora<span class="brand-period">.</span></a><nav class="main-nav" aria-label="Navegação principal"><a href="../#descoberta">Descoberta do dia</a><a href="../#misterio">Mistério semanal</a></nav><a class="header-link" href="../">Voltar à Nexora ↗</a></header>
<main id="main-content" class="discovery-archive"><div class="eyebrow">NEXORA / ARQUIVO ABERTO</div><h1>Descobertas para <em>explorar.</em></h1><p class="archive-lead">Cada curiosidade tem sua própria página, contexto e fonte para você continuar investigando.</p>
<div class="archive-tools"><label for="discovery-search">BUSCAR DESCOBERTA<input id="discovery-search" type="search" placeholder="Ex.: oceano, Vênus, luz..." autocomplete="off"></label><label for="discovery-filter">CATEGORIA<select id="discovery-filter"><option value="">Todas as categorias</option>{''.join(f'<option value="{escape(category, quote=True)}">{escape(category)}</option>' for category in sorted({item['category'] for item in items}))}</select></label></div>
<p class="archive-count" id="discovery-count" role="status">{len(items)} descobertas no arquivo</p><div class="discovery-index-grid">{''.join(cards)}</div>
<script>
(()=>{{const search=document.getElementById('discovery-search');const filter=document.getElementById('discovery-filter');const cards=[...document.querySelectorAll('[data-discovery-card]')];const count=document.getElementById('discovery-count');function apply(){{const term=search.value.trim().toLocaleLowerCase('pt-BR');let visible=0;cards.forEach(card=>{{const matchesText=card.textContent.toLocaleLowerCase('pt-BR').includes(term);const matchesCategory=!filter.value||card.dataset.category===filter.value;const show=matchesText&&matchesCategory;card.hidden=!show;if(show)visible++;}});count.textContent=visible+' de '+cards.length+' descobertas';}}search.addEventListener('input',apply);filter.addEventListener('change',apply);}})();
</script></main>
<footer class="site-footer"><a class="brand" href="../"><span class="brand-mark">N</span> nexora<span class="brand-period">.</span></a><span>DISCOVER SOMETHING NEW.</span><div><a href="../about.html">Sobre</a><a href="../privacy.html">Privacidade</a></div><small>© {date.today().year} NEXORA · CONHECIMENTO EM MOVIMENTO.</small></footer><script src="../app.js"></script></body></html>'''
(out / "index.html").write_text(collection, encoding="utf-8")

urls = [BASE, BASE+"about.html", BASE+"privacy.html", BASE+"discoveries/", BASE+"misterios.html", BASE+"articles/"]
urls += [BASE+"discoveries/"+item["slug"]+".html" for item in items]
urls += [BASE+"articles/"+p.name for p in sorted((ROOT/"articles").glob("*.html"))]
urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
for url in urls:
    ET.SubElement(ET.SubElement(urlset, "url"), "loc").text = url
ET.indent(urlset, space="  ")
(ROOT/"sitemap.xml").write_bytes(ET.tostring(urlset, encoding="utf-8", xml_declaration=True))
print(f"Generated {len(items)} discovery pages and sitemap with {len(urls)} URLs.")
