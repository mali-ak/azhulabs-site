// AzHu Labs – menüler, arama, tema, kategori sekmeleri, dil tercihi (çerçeve yok)
(function () {
  var doc = document.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // İlk ziyarette tarayıcı diline göre yönlendir (yalnızca İngilizce ana sayfada, tercih kaydı yoksa)
  var LANGS = ['tr', 'es', 'pt', 'ru', 'ar'];
  var saved = store('azhu-lang');
  if (!saved && doc.lang === 'en' && location.pathname === '/') {
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    store('azhu-lang', LANGS.indexOf(nav) >= 0 ? nav : 'en');
    if (LANGS.indexOf(nav) >= 0) { location.replace('/' + nav + '/'); return; }
  }
  document.querySelectorAll('a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { store('azhu-lang', a.getAttribute('data-lang')); });
  });

  // Açılır menüler
  var dds = document.querySelectorAll('.dd');
  dds.forEach(function (dd) {
    var b = dd.querySelector('.ddbtn');
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      dds.forEach(function (x) { x.classList.remove('open'); x.querySelector('.ddbtn').setAttribute('aria-expanded', 'false'); });
      if (open) { dd.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', function () { dds.forEach(function (x) { x.classList.remove('open'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dds.forEach(function (x) { x.classList.remove('open'); }); });

  // Tema
  var tb = document.getElementById('theme');
  if (tb) tb.addEventListener('click', function () {
    var cur = doc.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = cur === 'light' ? 'dark' : 'light';
    doc.dataset.theme = next; store('azhu-theme', next);
  });

  // Arama
  var q = document.getElementById('q'), res = document.getElementById('sres');
  var data = []; try { data = JSON.parse(document.getElementById('appdata').textContent); } catch (e) {}
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var v = q.value.trim().toLowerCase();
    if (!v) { res.hidden = true; return; }
    var hits = data.filter(function (a) { return (a.n + ' ' + a.t).toLowerCase().indexOf(v) >= 0; });
    res.innerHTML = hits.length ? hits.map(function (a) {
      return '<a href="' + a.u + '"><img src="' + a.i + '" alt=""><span>' + esc(a.n) + '<small>' + esc(a.t) + '</small></span></a>';
    }).join('') : '<div class="none">' + esc(window.AZ_NORES || '') + '</div>';
    res.hidden = false;
  }
  if (q) {
    q.addEventListener('input', render);
    q.addEventListener('focus', render);
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var f = res.querySelector('a'); if (f) location.href = f.href; }
      if (e.key === 'Escape') { q.value = ''; res.hidden = true; }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) res.hidden = true; });
  }

  // Kategori filtresi (çipler ve "tümünü göster" bağlantıları)
  var chips = document.querySelectorAll('.chip');
  function filter(f) {
    chips.forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-filter') === f); });
    document.querySelectorAll('#allapps .pcard').forEach(function (k) { k.classList.toggle('hide', f !== 'all' && k.getAttribute('data-cat') !== f); });
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { filter(c.getAttribute('data-filter')); }); });
  document.querySelectorAll('.showall').forEach(function (a) { a.addEventListener('click', function () { filter(a.getAttribute('data-filter')); }); });

  // Kategori sekmeleri
  var tabs = document.querySelectorAll('.tab');
  function showTab(name) {
    tabs.forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-tab') === name); });
    document.querySelectorAll('.pane').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-pane') === name); });
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { showTab(t.getAttribute('data-tab')); }); });
  function fromHash() {
    var m = location.hash.match(/^#cat-(.+)$/);
    if (m && document.querySelector('.tab[data-tab="' + m[1] + '"]')) { showTab(m[1]); document.querySelector('.catpanel').scrollIntoView({ behavior: 'smooth' }); }
    if (location.hash === '#faq') { var d = document.querySelector('#faq details'); if (d) d.open = true; }
  }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
