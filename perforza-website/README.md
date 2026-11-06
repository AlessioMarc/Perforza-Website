# PERFORZA – sito web

Landing page statica (HTML + CSS + JavaScript puro). Nessuna installazione richiesta:
apri `index.html` nel browser, oppure carica l'intera cartella su qualsiasi hosting.

## Struttura
```
index.html
css/style.css
js/main.js
assets/
  images/   foto + logo ufficiale (SVG vettoriale estratto dal PDF del marchio)
  fonts/    Oxanium (font del marchio) e Figtree (testi), in locale
  icons/    favicon
  videos/   (vuota: vedi sotto)
```

## Da completare (cerca "PLACEHOLDER" in index.html)
- Presentazione e foto di Andrea (sezione "Chi siamo")
- Orari di apertura, link social, P. IVA / dati legali (footer)
- Testi dei servizi: sono bozze generali, da far verificare ad Andrea
- Meta tag `og:image`: sostituire con l'indirizzo completo (https://...) quando il sito è online

## Aggiungere un video
Copia il file `.mp4` in `assets/videos/`, aggiungi una copertina in `assets/images/`,
poi in `index.html` togli i commenti al blocco "VIDEO (modello pronto all'uso)" nella galleria.

## Colori e font (dal manuale del marchio)
Deep Navy `#0F172A` · Blue Force `#2E9BFF` · Oxanium
Le variabili sono all'inizio di `css/style.css`.
