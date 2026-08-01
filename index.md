---
layout: listing
title: HTB Writeups
permalink: /
---

<div class="home-wrap">

<div class="home-intro">
<p>Here is where I'll post every writeup for HTB machines, challenges, and ProLabs. Just to be clear: I won't post anything I'm not allowed to under the HTB guidelines.</p>

<p>Even more important, I'll try to keep this website up to date, but keeping track of every machine and challenge while taking care of the other thousand things I like to do can be hard. So sorry if you don't find a writeup for a machine that just retired :)</p>

<p>About the format I give these writeups: since I don't like posting plain lists of instructions, each writeup tries to represent the <em>methodology</em> I followed during the assessment. I'll skip over parts like research, etc., but I'll always mention them.</p>

<p>In the end, knowing how to hack is just pattern recognition, research skills, and a lot of patience.</p>
</div>

<div class="htb-card">
  <div class="htb-head">
    <span class="htb-logo">⬡</span>
    <div>
      <div class="htb-name">lucarom3o</div>
      <span class="htb-badge">HACKER</span>
    </div>
  </div>
  <div class="htb-divider"></div>
  <div class="htb-stats">
    <div><span class="lbl">HTB Rank:</span> Professional</div>
    <div><span class="lbl">Level:</span> 60</div>
    <div><span class="lbl">Region:</span> Italy 🇮🇹</div>
  </div>
  <a class="htb-link" href="https://profile.hackthebox.com/profile/019e440c-afd0-7016-836a-ab7ac4d236bf" target="_blank" rel="noopener">View full profile →</a>
</div>

</div>

<style>
.home-wrap {
  display: flex; flex-wrap: wrap; gap: 2rem;
  align-items: flex-start; margin-top: 1.5rem;
}
.home-intro { flex: 1 1 380px; line-height: 1.65; color: var(--text); }
.home-intro p { margin-bottom: 1.1rem; }
.home-intro em { color: var(--headings); font-style: italic; }

.htb-card {
  flex: 0 0 260px;
  background: var(--bg-secondary); border: 1px solid var(--text-secondary);
  border-radius: 10px; padding: 1.1rem 1.3rem; align-self: flex-start;
}
.htb-head { display: flex; align-items: center; gap: .6rem; }
.htb-logo { color: #9fef00; font-size: 1.6rem; line-height: 1; }
.htb-name { font-weight: 700; color: var(--headings); font-size: 1.1rem; }
.htb-badge {
  display: inline-block; margin-top: .2rem; font-size: .68rem; font-weight: 700;
  letter-spacing: .05em; color: var(--text-secondary);
  border: 1px solid var(--text-secondary); border-radius: 4px; padding: .05rem .4rem;
}
.htb-divider { height: 1px; background: var(--text-secondary); opacity: .3; margin: .9rem 0; }
.htb-stats { font-size: .88rem; line-height: 1.9; }
.htb-stats .lbl { color: var(--text-secondary); }
.htb-link {
  display: inline-block; margin-top: 1rem; font-size: .85rem;
  color: #9fef00 !important; text-decoration: none;
}
.htb-link:hover { text-decoration: underline; }

@media (max-width: 720px) { .htb-card { flex: 1 1 100%; } }
</style>