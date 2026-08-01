---
layout: listing
title: Machines
permalink: /machines/
---

<div class="filters">
  <span class="flabel">OS:</span>
  <button class="f active" data-type="os" data-val="all">All</button>
  <button class="f" data-type="os" data-val="linux">Linux</button>
  <button class="f" data-type="os" data-val="windows">Windows</button>

  <span class="flabel">Difficulty:</span>
  <button class="f active" data-type="diff" data-val="all">All</button>
  <button class="f" data-type="diff" data-val="easy">Easy</button>
  <button class="f" data-type="diff" data-val="medium">Medium</button>
  <button class="f" data-type="diff" data-val="hard">Hard</button>
  <button class="f" data-type="diff" data-val="insane">Insane</button>

  </div>

<div class="sortbar">
  <span class="flabel">Sort:</span>
  <select id="sort-select">
    <option value="date">Newest</option>
    <option value="alpha">A–Z</option>
    <option value="diff">Difficulty</option>
  </select>
</div>

<div class="card-grid" id="machine-list">
{% assign items = site.posts | where_exp: "p", "p.tags contains 'machine'" | sort: "title" %}
{% for post in items %}
  {% assign t = post.tags | join: " " | downcase %}
  {% assign os = "" %}
  {% if t contains "windows" %}{% assign os = "windows" %}{% elsif t contains "linux" %}{% assign os = "linux" %}{% endif %}
  {% assign diff = "" %}
  {% if t contains "insane" %}{% assign diff = "insane" %}{% elsif t contains "medium" %}{% assign diff = "medium" %}{% elsif t contains "hard" %}{% assign diff = "hard" %}{% elsif t contains "easy" %}{% assign diff = "easy" %}{% endif %}
  {% assign wr = "no" %}
  {% if t contains "writeup_yes" %}{% assign wr = "yes" %}{% endif %}
  {% assign dlevel = 0 %}
  {% if diff == "easy" %}{% assign dlevel = 1 %}{% elsif diff == "medium" %}{% assign dlevel = 2 %}{% elsif diff == "hard" %}{% assign dlevel = 3 %}{% elsif diff == "insane" %}{% assign dlevel = 4 %}{% endif %}
  <a class="card" href="{{ post.url | relative_url }}"
     data-os="{{ os }}" data-diff="{{ diff }}"
     data-date="{{ post.date | date: '%s' }}"
     data-title="{{ post.title | downcase }}"
     data-dlevel="{{ dlevel }}">
    <div class="card-title">{{ post.title }}</div>
    <div class="card-divider"></div>
    <div class="card-info">
      <div><span class="lbl">OS:</span> {{ os | capitalize }}</div>
      <div><span class="lbl">Difficulty:</span> {{ diff | capitalize }}</div>
      <div><span class="lbl">Writeup:</span> {{ wr | capitalize }}</div>
    </div>
  </a>
{% endfor %}
</div>

<div class="pagination" id="pagination"></div>

<style>
.filters { margin: 1.8rem 0 .8rem; display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; }
.filters .flabel { font-weight: bold; margin-right: .2rem; }
.filters .flabel:not(:first-child) { margin-left: .8rem; }
.filters .f {
  padding: .2rem .6rem; border: 1px solid var(--text-secondary);
  background: transparent; color: var(--text); cursor: pointer;
  border-radius: 6px; font-size: .8rem;
}
.filters .f:hover { border-color: var(--links); }
.filters .f.active { background: var(--links); color: var(--bg); border-color: var(--links); }

.sortbar { display: flex; align-items: center; gap: .4rem; margin-bottom: 1.4rem; }
.sortbar .flabel { font-weight: bold; }
#sort-select {
  padding: .2rem .5rem; border-radius: 6px; font-size: .8rem;
  background: var(--bg-secondary); color: var(--text);
  border: 1px solid var(--text-secondary); cursor: pointer;
}

.card-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem; margin-top: 1rem;
}
.card {
  display: block; padding: .6rem .8rem; border-radius: 8px;
  background: var(--bg-secondary); border: 1px solid var(--text-secondary);
  text-decoration: none !important; color: var(--text);
  transition: transform .12s, border-color .12s;
}
.card:hover { transform: translateY(-3px); border-color: var(--links); color: var(--text); }
.card-title { font-weight: 600; color: var(--headings); text-align: center; margin-bottom: .35rem; font-size: .95rem; }
.card-divider { height: 1px; background: var(--text-secondary); opacity: .3; margin: 0 .3rem .45rem .3rem; }
.card-info { font-size: .78rem; line-height: 1.45; text-align: center; }
.card-info .lbl { color: var(--text-secondary); }

.pagination { display: flex; justify-content: center; flex-wrap: wrap; gap: .3rem; margin: 1rem 0; }
.pagination button {
  min-width: 1.8rem; padding: .25rem .5rem; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--text-secondary); background: transparent; color: var(--text);
  font-size: .8rem;
}
.pagination button:hover:not(:disabled) { border-color: var(--links); }
.pagination button.active { background: var(--links); color: var(--bg); border-color: var(--links); }
.pagination button:disabled { opacity: .4; cursor: default; }

@media (max-width: 640px) { .card-grid { grid-template-columns: 1fr 1fr; } }
</style>

<script>
(function () {
  var PER_PAGE = 9;
  var sel = { os: "all", diff: "all" };
  var sortMode = "date";
  var page = 1;

  var buttons = document.querySelectorAll(".f");
  var sortSel = document.getElementById("sort-select");
  var grid = document.getElementById("machine-list");
  var pagEl = document.getElementById("pagination");
  var allCards = Array.prototype.slice.call(grid.querySelectorAll(".card"));

  function filtered() {
    return allCards.filter(function (c) {
      var okOs = sel.os === "all" || c.dataset.os === sel.os;
      var okDiff = sel.diff === "all" || c.dataset.diff === sel.diff;
      return okOs && okDiff;
    });
  }

  function sortCards(list) {
    var l = list.slice();
    if (sortMode === "alpha") {
      l.sort(function (a, b) { return a.dataset.title.localeCompare(b.dataset.title); });
    } else if (sortMode === "diff") {
      l.sort(function (a, b) { return a.dataset.dlevel - b.dataset.dlevel; });
    } else { // date, newest first
      l.sort(function (a, b) { return b.dataset.date - a.dataset.date; });
    }
    return l;
  }

  function render() {
    var list = sortCards(filtered());
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page > pages) page = pages;

    // hide all, then show current page slice in order
    allCards.forEach(function (c) { c.style.display = "none"; });
    var start = (page - 1) * PER_PAGE;
    var slice = list.slice(start, start + PER_PAGE);
    slice.forEach(function (c) { c.style.display = ""; grid.appendChild(c); });

    // rebuild pagination
    pagEl.innerHTML = "";
    if (pages <= 1) return;
    var prev = mkBtn("‹", page === 1); prev.onclick = function () { page--; render(); };
    pagEl.appendChild(prev);
    for (var i = 1; i <= pages; i++) {
      (function (n) {
        var b = mkBtn(n, false);
        if (n === page) b.classList.add("active");
        b.onclick = function () { page = n; render(); };
        pagEl.appendChild(b);
      })(i);
    }
    var next = mkBtn("›", page === pages); next.onclick = function () { page++; render(); };
    pagEl.appendChild(next);
  }

  function mkBtn(label, disabled) {
    var b = document.createElement("button");
    b.textContent = label; b.disabled = disabled; return b;
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      sel[b.dataset.type] = b.dataset.val;
      buttons.forEach(function (x) {
        if (x.dataset.type === b.dataset.type) x.classList.remove("active");
      });
      b.classList.add("active");
      page = 1; render();
    });
  });
  sortSel.addEventListener("change", function () {
    sortMode = sortSel.value; page = 1; render();
  });

  render();
})();
</script>