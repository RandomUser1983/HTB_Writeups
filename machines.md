---
layout: none
title: Machines
permalink: /machines/
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

  {% include nav.html current="machines" %}

  <main class="page">
    <h1 class="page-title">Machines</h1>

    {% assign machine_posts = site.posts | where_exp: "p", "p.tags contains 'machine'" %}
    {% assign c_easy = 0 %}
    {% assign c_medium = 0 %}
    {% assign c_hard = 0 %}
    {% assign c_insane = 0 %}
    {% for post in machine_posts %}
      {% assign t = post.tags | join: " " | downcase %}
      {% if t contains "insane" %}
        {% assign c_insane = c_insane | plus: 1 %}
      {% elsif t contains "medium" %}
        {% assign c_medium = c_medium | plus: 1 %}
      {% elsif t contains "hard" %}
        {% assign c_hard = c_hard | plus: 1 %}
      {% elsif t contains "easy" %}
        {% assign c_easy = c_easy | plus: 1 %}
      {% endif %}
    {% endfor %}

    <div class="stats-box">
      <div class="stat-cell">
        <div class="stat-label">Easy</div>
        <div class="stat-count">{{ c_easy }}</div>
      </div>
      <div class="stat-cell">
        <div class="stat-label">Medium</div>
        <div class="stat-count">{{ c_medium }}</div>
      </div>
      <div class="stat-cell">
        <div class="stat-label">Hard</div>
        <div class="stat-count">{{ c_hard }}</div>
      </div>
      <div class="stat-cell">
        <div class="stat-label">Insane</div>
        <div class="stat-count">{{ c_insane }}</div>
      </div>
    </div>

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

      <span class="flabel">Category:</span>
      <div class="category-picker" id="category-picker">
        <input class="search-input category-search" id="category-search"
               placeholder="All categories" autocomplete="off">
        <div class="category-dropdown" id="category-dropdown"></div>
      </div>
    </div>

    <div class="sortbar">
      <input class="search-input title-search" id="title-search" type="text" placeholder="Search title…">

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
         data-dlevel="{{ dlevel }}"
         data-categories="{{ t }}">
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
  </main>

  <script>
  var CATEGORIES = [{% for cat in site.data.categories %}"{{ cat | escape }}"{% unless forloop.last %},{% endunless %}{% endfor %}];

  (function () {
    var PER_PAGE = 9;
    var sel = { os: "all", diff: "all" };
    var titleQuery = "";
    var categoryQuery = "";
    var sortMode = "date";
    var page = 1;

    var buttons = document.querySelectorAll(".f");
    var sortSel = document.getElementById("sort-select");
    var titleInput = document.getElementById("title-search");
    var categoryPicker = document.getElementById("category-picker");
    var categoryInput = document.getElementById("category-search");
    var categoryDropdown = document.getElementById("category-dropdown");
    var grid = document.getElementById("machine-list");
    var pagEl = document.getElementById("pagination");
    var allCards = Array.prototype.slice.call(grid.querySelectorAll(".card"));

    function filtered() {
      return allCards.filter(function (c) {
        var okOs = sel.os === "all" || c.dataset.os === sel.os;
        var okDiff = sel.diff === "all" || c.dataset.diff === sel.diff;
        var okTitle = titleQuery === "" || c.dataset.title.indexOf(titleQuery) !== -1;
        var okCategory = categoryQuery === "" || c.dataset.categories.indexOf(categoryQuery) !== -1;
        return okOs && okDiff && okTitle && okCategory;
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
    titleInput.addEventListener("input", function () {
      titleQuery = titleInput.value.trim().toLowerCase(); page = 1; render();
    });

    function showDropdown(query) {
      var q = query.trim().toLowerCase();
      var matches = CATEGORIES.filter(function (c) { return c.toLowerCase().indexOf(q) !== -1; });
      categoryDropdown.innerHTML = "";
      matches.forEach(function (c) {
        var opt = document.createElement("div");
        opt.className = "category-option";
        opt.textContent = c;
        opt.addEventListener("click", function () {
          categoryInput.value = c;
          categoryQuery = c.toLowerCase();
          categoryDropdown.classList.remove("open");
          page = 1; render();
        });
        categoryDropdown.appendChild(opt);
      });
      categoryDropdown.classList.toggle("open", matches.length > 0);
    }

    categoryInput.addEventListener("input", function () {
      categoryQuery = categoryInput.value.trim().toLowerCase();
      showDropdown(categoryInput.value);
      page = 1; render();
    });
    categoryInput.addEventListener("focus", function () {
      showDropdown(categoryInput.value);
    });
    document.addEventListener("click", function (e) {
      if (!categoryPicker.contains(e.target)) categoryDropdown.classList.remove("open");
    });

    render();
  })();
  </script>

</body>
</html>
