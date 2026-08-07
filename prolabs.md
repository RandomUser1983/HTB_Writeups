---
layout: none
title: ProLabs
permalink: /prolabs/
---
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ page.title }} · {{ site.title }}</title>
  <link rel="icon" href="{{ site.baseurl }}/favicon.ico" />
  <link rel="stylesheet" href="{{ site.baseurl }}/assets/css/style.css" />
</head>
<body>

  {% include nav.html current="prolabs" %}

  <main class="page">
    <h1 class="page-title">ProLabs</h1>

    <div class="prolab-intro">
      <p>I still need to think about a nice way to build this section. I can't disclose the writeups of most of the ProLabs, but for the ones that I'm allowed to, I'd love to create something cool.</p>
      <p>So for now I'll just put here the certificates I get from the ProLabs once I complete them. I won't try to do them very often since the ProLab bundle isn't cheap for me :)</p>
    </div>

    <div class="cert-grid" id="cert-grid">
      <!-- Quando avrai i certificati, aggiungi qui una card per ciascuno, es:
      <div class="cert-card">
        <img src="{{ '/images/cert-dante.png' | relative_url }}" alt="Dante ProLab certificate">
        <div class="cert-name">Dante</div>
      </div>
      -->
    </div>
  </main>

  <style>
  .prolab-intro {
    max-width: 640px; margin: 0 0 2rem;
    line-height: 1.6; color: var(--text);
  }
  .prolab-intro p { margin-bottom: 1rem; }

  .cert-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.1rem; margin-top: 1rem;
  }
  .cert-card {
    background: var(--bg-secondary); border: 1px solid var(--text-secondary);
    border-radius: 8px; padding: .8rem; text-align: center;
  }
  .cert-card img { width: 100%; border-radius: 6px; display: block; }
  .cert-name { margin-top: .6rem; font-weight: 600; color: var(--headings); }
  </style>

</body>
</html>
