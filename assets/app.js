(function () {
  var P = window.PORTFOLIO;
  if (!P) { document.body.insertAdjacentHTML('afterbegin', '<p style="padding:20px">data/portfolio.js is missing.</p>'); return; }
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var LABEL = { 'complete': 'Complete', 'in-progress': 'In progress', 'not-started': 'Not started' };
  var badge = function (s) { s = LABEL[s] ? s : 'not-started'; return '<span class="badge ' + s + '">' + LABEL[s] + '</span>'; };

  // Profile
  var pr = P.profile || {};
  $('name').textContent = pr.name || 'Your Name';
  $('brand').textContent = (pr.name && pr.name !== 'Your Name') ? pr.name : 'GRC Portfolio';
  document.title = (pr.name ? pr.name + ' · ' : '') + 'GRC Portfolio';
  $('headline').textContent = pr.headline || '';
  $('intro').textContent = pr.intro || '';
  var links = [];
  if (pr.resume) links.push('<a class="btn primary" href="' + esc(pr.resume) + '">Resume</a>');
  if (pr.linkedin) links.push('<a class="btn" href="' + esc(pr.linkedin) + '">LinkedIn</a>');
  if (pr.github) links.push('<a class="btn" href="' + esc(pr.github) + '">GitHub</a>');
  if (pr.email) links.push('<a class="btn" href="mailto:' + esc(pr.email) + '">Email</a>');
  links.push('<a class="btn" href="#projects">See projects</a>');
  $('profile-links').innerHTML = links.join('');
  $('contact-links').innerHTML = links.slice(0, -1).join('') || '<span class="muted">Add your email and LinkedIn in data/portfolio.js.</span>';

  // Progress
  var labs = P.labs || [];
  var done = labs.filter(function (l) { return l.status === 'complete'; });
  var prog = labs.filter(function (l) { return l.status === 'in-progress'; });
  var hours = done.reduce(function (a, l) { return a + (l.hours || 0); }, 0);
  var withLinks = done.filter(function (l) { return l.link; }).length;
  var pct = labs.length ? Math.round(done.length / labs.length * 100) : 0;
  $('stats').innerHTML = [
    [done.length + ' / ' + labs.length, 'labs complete'],
    [prog.length, 'in progress'],
    [hours, 'hours of lab work logged'],
    [withLinks, 'work products published']
  ].map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');
  setTimeout(function () { $('overall-bar').style.width = pct + '%'; }, 100);
  var lastDone = done.map(function (l) { return l.completed; }).filter(Boolean).sort().pop();
  $('overall-label').textContent = pct + '% of the program complete' + (lastDone ? ' · last lab completed ' + lastDone : '') + (P.programStart ? ' · started ' + P.programStart : '');

  var mods = [];
  labs.forEach(function (l) { if (mods.indexOf(l.module) < 0) mods.push(l.module); });
  $('modules').innerHTML = mods.map(function (m) {
    var ls = labs.filter(function (l) { return l.module === m; });
    var d = ls.filter(function (l) { return l.status === 'complete'; }).length;
    return '<div class="mod"><div class="name">' + esc(m) + '</div><div class="mini"><div style="width:' + Math.round(d / ls.length * 100) + '%"></div></div><small>' + d + ' of ' + ls.length + ' labs</small></div>';
  }).join('');

  // Projects
  var byId = {}; labs.forEach(function (l) { byId[l.id] = l; });
  var PR = window.PROJECTS || { grc: [], otherProjects: [] };
  $('projects-grid').innerHTML = PR.grc.map(function (p) {
    var ls = p.labs.map(function (id) { return byId[id]; }).filter(Boolean);
    var d = ls.filter(function (l) { return l.status === 'complete'; }).length;
    var st = ls.length && d === ls.length ? 'complete' : 'in-progress';
    return '<article class="card"><div class="tag">Labs ' + esc(p.labs.join(', ')) + '</div><h3><a class="plain" href="projects/' + esc(p.slug) + '.html">' + esc(p.title) + '</a></h3>' +
      '<p>' + esc(p.tagline) + '</p><div class="chips small">' + p.frameworks.slice(0, 3).map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div>' +
      '<div class="foot"><a href="projects/' + esc(p.slug) + '.html">Read the project &rarr;</a>' + badge(st) + '</div></article>';
  }).join('');
  $('other-projects').innerHTML = PR.otherProjects.map(function (o) {
    var foot = o.link ? '<a href="' + esc(o.link) + '">View on GitHub &rarr;</a>' : '<span class="muted">Private repository · code available on request</span>';
    return '<article class="card"><div class="tag">' + esc(o.stack.join(' · ')) + '</div><h3>' + esc(o.title) + '</h3><p>' + esc(o.desc) + '</p>' +
      '<p class="label">GRC relevance</p><p>' + esc(o.grc) + '</p><div class="foot">' + foot + '</div></article>';
  }).join('');

  // Timeline
  function renderWeeks(filter) {
    var weeks = {};
    labs.forEach(function (l) { (weeks[l.week] = weeks[l.week] || []).push(l); });
    var html = Object.keys(weeks).sort(function (a, b) { return a - b; }).map(function (w) {
      var ls = weeks[w];
      var shown = ls.filter(function (l) { return filter === 'all' || l.status === filter; });
      if (!shown.length) return '';
      var d = ls.filter(function (l) { return l.status === 'complete'; }).length;
      var p = ls.some(function (l) { return l.status === 'in-progress'; });
      var cls = d === ls.length ? 'done' : (d || p ? 'partial' : '');
      return '<li class="week ' + cls + '"><h3><small>Week ' + w + '</small>' + esc((P.weeks || {})[w] || '') + '</h3>' +
        shown.map(function (l) {
          var del = l.link ? '<a href="' + esc(l.link) + '">' + esc(l.deliverable) + '</a>' : esc(l.deliverable);
          return '<div class="lab"><div class="id">' + esc(l.id) + '</div><div><div class="t">' + esc(l.title) + '</div><div class="d">' + esc(l.objective) +
            (l.deliverable ? ' · Deliverable: ' + del : '') + (l.completed ? ' · Completed ' + esc(l.completed) : '') + '</div></div>' + badge(l.status) + '</div>';
        }).join('') + '</li>';
    }).join('');
    $('weeks').innerHTML = html || '<li class="week"><p class="muted">No labs match this filter yet.</p></li>';
  }
  renderWeeks('all');
  Array.prototype.forEach.call(document.querySelectorAll('#filters button'), function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#filters button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); renderWeeks(b.getAttribute('data-f'));
    });
  });

  // Skills, tools, certs
  var SK = { 'confident': ['complete', 'Confident'], 'practicing': ['in-progress', 'Practicing'], 'learning': ['not-started', 'Learning'] };
  $('skill-list').innerHTML = (P.skills || []).map(function (s) {
    var k = SK[s.status] || SK.learning;
    return '<li><span>' + esc(s.name) + '</span><span class="badge ' + k[0] + '">' + k[1] + '</span></li>';
  }).join('');
  $('tools').innerHTML = (P.tools || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
  var CS = { 'earned': ['complete', 'Earned'], 'studying': ['in-progress', 'Studying'], 'planned': ['not-started', 'Planned'] };
  $('certs').innerHTML = (P.certifications || []).map(function (c) {
    var k = CS[c.status] || CS.planned;
    return '<li><span>' + esc(c.name) + (c.target ? ' <small class="muted">· ' + esc(c.target) + '</small>' : '') + '</span><span class="badge ' + k[0] + '">' + k[1] + '</span></li>';
  }).join('');
})();
