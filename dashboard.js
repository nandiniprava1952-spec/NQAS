/* Quality Assessment Toolkit - Dashboard (State Admin / District / Block logins).
 * One call to the server ("list") returns every record the login may see, each with a small score summary.
 * The roster of facilities comes from NQAS_GEO, so facilities with no record show as "Not started".
 * Drill-down: districts > blocks > facilities > assessment rounds. Works for NQAS and Kayakalp. */
(function () {
  'use strict';
  var AT = ['Self', 'Internal Assessment 1', 'Internal Assessment 2', 'Internal Assessment 3', 'Peer', 'District', 'State'];
  var AT_S = { 'Self': 'Self', 'Internal Assessment 1': 'IA 1', 'Internal Assessment 2': 'IA 2', 'Internal Assessment 3': 'IA 3', 'Peer': 'Peer', 'District': 'District', 'State': 'State' };
  var GT = { sc: 'Sub-Centre', phc: 'PHC', chc: 'CHC', sdh: 'SDH', uphc: 'UPHC', dhh: 'DHH' };
  var PASS = 70;   /* NQAS / Kayakalp "good" line */
  var S = { fw: 'n', at: '', ft: '', minc: 0, from: '', to: '', sort: 'name', q: '', path: [], rows: [], loaded: false, err: '', open: {}, bf: null };
  var ov = null, facs = [], lastFocus = null;

  function nz(s) { return String(s == null ? '' : s).trim().toLowerCase(); }
  function e(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rank(t) { var i = AT.indexOf(t); return i < 0 ? 99 : i; }
  function cloud() { return window.qatCloud; }
  function prof() { var c = cloud(); return (c && c.profile()) || {}; }
  function isKK(r) { return /^KK_/.test(r.facility_type); }
  function band(p) { return p == null ? 'na' : p >= PASS ? 'good' : p >= 50 ? 'mid' : 'bad'; }
  function r1(p) { return Math.round(p * 10) / 10; }
  function pc(p) { return p == null ? '—' : r1(p) + '%'; }
  function dtm(iso) { if (!iso) return '\u2014'; var d = new Date(iso); return isNaN(d) ? '\u2014' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
  function dshort(iso) { if (!iso) return '—'; var d = new Date(iso); return isNaN(d) ? '—' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function dmy(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d.slice(8) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || ''); }
  function dateOf(r) { return /^\d{4}-\d{2}-\d{2}$/.test(r.start_date || '') ? r.start_date : String(r.updated_at || '').slice(0, 10); }
  function typeLabel(r) {
    try { if (isKK(r)) return KK[r.facility_type.slice(3)].label; return NQAS_DATA[r.facility_type].label; } catch (x) { return r.facility_type; }
  }

  /* ---------- styles ---------- */
  function css() {
    if (document.getElementById('qatDashCss')) return;
    var st = document.createElement('style'); st.id = 'qatDashCss';
    st.textContent =
      '#qatDash{position:fixed;inset:0;z-index:9998;background:#12091f;color:#eee7ff;font-family:Calibri,Arial,sans-serif;overflow:auto;-webkit-overflow-scrolling:touch}' +
      '#qatDash *{box-sizing:border-box}' +
      '.qd-w{max-width:1120px;margin:0 auto;padding:calc(12px + env(safe-area-inset-top)) 14px 40px}' +
      '.qd-top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}' +
      '.qd-top h2{margin:0;font-size:22px;flex:1 1 auto;min-width:160px}' +
      '.qd-top h2 small{display:block;font-size:13px;font-weight:400;opacity:.7;margin-top:2px}' +
      '#qatDash button,#qatDash select,#qatDash input{font:inherit}' +
      '.qd-b{border:1px solid #7a4a9f;background:#ffffff14;color:#eee7ff;padding:8px 13px;border-radius:8px;font-size:13px;cursor:pointer;min-height:38px}' +
      '.qd-b.p{background:#c084fc;border-color:#c084fc;color:#170b28;font-weight:700}' +
      '.qd-b:disabled{opacity:.5;cursor:default}' +
      '#qatDash :focus-visible{outline:2px solid #fbbf24;outline-offset:2px}' +
      '.qd-seg{display:inline-flex;border:1px solid #6b3a8f;border-radius:10px;overflow:hidden;margin-bottom:12px}' +
      '.qd-seg button{border:0;background:transparent;color:#d8c8f0;padding:9px 20px;font-size:14px;cursor:pointer;min-height:40px}' +
      '.qd-seg button[aria-pressed=true]{background:#c084fc;color:#170b28;font-weight:700}' +
      '.qd-f{display:flex;gap:10px 12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px}' +
      '.qd-f label{display:flex;flex-direction:column;gap:3px;font-size:12px;opacity:.9}' +
      '.qd-f select,.qd-f input{background:#140c21;color:#fff;border:1px solid #6b3a8f;border-radius:8px;padding:8px;font-size:14px;min-height:38px;max-width:100%}' +
      '.qd-f input[type=search]{min-width:200px}' +
      '.qd-crumb{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font-size:14px;margin:4px 0 12px}' +
      '.qd-crumb button{background:none;border:0;color:#c084fc;padding:4px 2px;cursor:pointer;text-decoration:underline;min-height:32px}' +
      '.qd-crumb span{opacity:.6}.qd-crumb b{padding:4px 2px}' +
      '.qd-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:12px}' +
      '.qd-k>div{background:#1d1030;border:1px solid #4b2868;border-radius:10px;padding:10px 12px}' +
      '.qd-k .v{font-size:26px;font-weight:700;line-height:1.15}.qd-k .l{font-size:12px;opacity:.75}.qd-k .s{font-size:12px;opacity:.7;margin-top:2px}' +
      '.good{color:#4ade80}.mid{color:#fbbf24}.bad{color:#fb7185}.na{opacity:.55}' +
      '.qd-n{background:#2d1942;border:1px solid #6b3a8f;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:13.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}' +
      '.qd-n.err{background:#3b1724;border-color:#fb7185}.qd-n span{flex:1 1 220px}' +
      '.qd-t{overflow-x:auto;border:1px solid #4b2868;border-radius:10px;background:#1d1030}' +
      '.qd-t table{width:100%;border-collapse:collapse;font-size:13.5px;min-width:760px}' +
      '.qd-t th{text-align:left;font-weight:600;font-size:12px;opacity:.75;padding:9px 10px;border-bottom:1px solid #4b2868;white-space:nowrap}' +
      '.qd-t td{padding:9px 10px;border-top:1px solid #32134f;vertical-align:middle}' +
      '.qd-t tr:first-child td{border-top:0}' +
      '.qd-t td.n,.qd-t th.n{text-align:right;white-space:nowrap}' +
      '.qd-l{background:none;border:0;color:#eee7ff;font-weight:700;font-size:14px;text-align:left;padding:4px 0;cursor:pointer;min-height:32px}' +
      '.qd-l:hover{color:#c084fc;text-decoration:underline}' +
      '.qd-sub{font-size:12px;opacity:.7;display:block;font-weight:400}' +
      '.qd-bar{display:inline-block;vertical-align:middle;width:70px;height:7px;background:#32134f;border-radius:4px;overflow:hidden;margin-right:8px}' +
      '.qd-bar i{display:block;height:100%;background:#c084fc}' +
      '.qd-hs{display:inline-flex;gap:2px;vertical-align:middle}' +
      '.qd-hs i{width:15px;height:15px;border-radius:3px;background:#32134f;display:block}' +
      '.qd-hs i.good{background:#22a559}.qd-hs i.mid{background:#d9a21b}.qd-hs i.bad{background:#e5484d}' +
      '.qd-t td .qd-sub{white-space:nowrap}.qd-pill{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11.5px;margin:1px 3px 1px 0;border:1px solid #6b3a8f;white-space:nowrap}' +
      '.qd-pill.good{border-color:#22a559;color:#4ade80}.qd-pill.mid{border-color:#d9a21b;color:#fbbf24}.qd-pill.bad{border-color:#e5484d;color:#fb7185}' +
      '.qd-st{font-size:12px;border-radius:10px;padding:2px 9px;white-space:nowrap;border:1px solid #6b3a8f}' +
      '.qd-st.none{opacity:.7}.qd-st.started{border-color:#d9a21b;color:#fbbf24}.qd-st.scored{border-color:#22a559;color:#4ade80}' +
      '.qd-x td{background:#170b28;padding:12px 14px}' +
      '.qd-r{display:grid;grid-template-columns:minmax(120px,1fr) minmax(0,3fr) auto;gap:8px 14px;align-items:center;padding:8px 0;border-top:1px dashed #3a2150}' +
      '.qd-r:first-child{border-top:0}' +
      '.qd-ch{display:inline-block;margin:2px 8px 2px 0;font-size:12.5px;white-space:nowrap}' +
      '.qd-fn{font-size:12px;opacity:.65;margin-top:10px;line-height:1.5}' +
      '.qd-e{padding:26px 14px;text-align:center;opacity:.8}' +
      '@media(max-width:600px){.qd-r{grid-template-columns:1fr}.qd-top h2{font-size:19px}.qd-f label{flex:1 1 140px}.qd-f select,.qd-f input{width:100%}}' +
      '@media print{#qatDash{position:static;overflow:visible}.qd-b,.qd-seg,.qd-f{display:none}}';
    document.head.appendChild(st);
  }

  /* ---------- roster (all facilities the login covers) ---------- */
  var rosterCache = null;
  function roster() {
    if (!rosterCache) {
      rosterCache = [];
      try {
        var dn = {}, bl = {}, seen = {};
        NQAS_GEO.districts.forEach(function (d) { dn[d.name] = d.label; });
        NQAS_GEO.blocks.forEach(function (b) { bl[b.name] = { label: b.label, district: dn[b.district] }; });
        NQAS_GEO.facilities.forEach(function (f) {
          var b = bl[f.block]; if (!b) return;
          var id = f.block + '|' + f.type + '|' + f.label; if (seen[id]) return; seen[id] = 1;
          rosterCache.push({ district: b.district, block: b.label, name: f.label, gt: GT[f.type] || f.type, t: f.type });
        });
      } catch (x) { rosterCache = []; }
    }
    var p = prof();
    return rosterCache.filter(function (f) {
      if (p.role === 'admin') return true;
      if (nz(f.district) !== nz(p.district)) return false;
      return p.role === 'district' || nz(f.block) === nz(p.block);
    });
  }

  /* Which facility kinds (as listed in the app's facility list) a checklist is used for. A sub-centre and a PHC can share a name in one block, so this decides which of them a record belongs to. */
  var KIND = { DH: ['sdh', 'dhh'], SDH: ['sdh', 'dhh'], CHC: ['chc'], CHC_NONFRU: ['chc'], PHC: ['phc', 'uphc'], PHC4: ['phc'], UPHC: ['uphc', 'phc'], SC: ['sc'], PHCB: ['phc', 'uphc'], PHCN: ['phc', 'uphc'] };
  function kinds(r) {
    var t = isKK(r) ? r.facility_type.slice(3) : r.facility_type;
    if (isKK(r) && t === 'DH') return ['dhh', 'sdh', 'chc'];
    return KIND[t] || (/^AAM/i.test(t) ? ['sc'] : []);
  }
  function pick(c, r) {
    if (!c || !c.length) return null;
    var k = kinds(r), m = c.filter(function (x) { return k.indexOf(x.t) >= 0; });
    return m.length ? m[0] : c.length === 1 ? c[0] : null;
  }

  /* ---------- derive facilities from the records + filters ---------- */
  function recOK(r) {
    if (S.fw === 'k' ? !isKK(r) : isKK(r)) return false;
    if (S.at && r.assessment_type !== S.at) return false;
    var d = dateOf(r);
    if (S.from && (!d || d < S.from)) return false;
    if (S.to && (!d || d > S.to)) return false;
    return true;
  }
/* one assessment (facility + type + date) can exist as several saved copies (older app versions, date added later): show only the latest saved copy */
  function latestCopies(rows) {
    var best = {}, order = [], all = {};
    rows.forEach(function (r) {
      var k = [nz(r.district), nz(r.facility_type), nz(r.facility_name), nz(r.assessment_type), r.start_date || r.end_date || ''].join('|');
      (all[k] = all[k] || []).push(r.key);
      if (!best[k]) { best[k] = r; order.push(k); } else if (!!r.start_date !== !!best[k].start_date ? !!r.start_date : String(r.updated_at) > String(best[k].updated_at)) best[k] = r;   /* a copy with a start date wins over an undated one, then the latest save */
    });
    return order.map(function (k) { best[k]._all = all[k]; return best[k]; });
  }
  function derive(noFt) {
    var out = [], k3 = {}, k2 = {}, ex = {};
    roster().forEach(function (f) {
      var o = { district: f.district, block: f.block, name: f.name, gt: f.gt, t: f.t, recs: [] };
      out.push(o); (k3[nz(f.district) + '|' + nz(f.block) + '|' + nz(f.name)] = k3[nz(f.district) + '|' + nz(f.block) + '|' + nz(f.name)] || []).push(o);
      (k2[nz(f.district) + '|' + nz(f.name)] = k2[nz(f.district) + '|' + nz(f.name)] || []).push(o);
    });
    latestCopies(S.rows.filter(recOK)).forEach(function (r) {
      var o = pick(k3[nz(r.district) + '|' + nz(r.block) + '|' + nz(r.facility_name)], r) || pick(k2[nz(r.district) + '|' + nz(r.facility_name)], r);
      if (!o) {   /* not in the roster (e.g. district hospitals): keep it, so no record is hidden */
        var xk = nz(r.district) + '|' + nz(r.block) + '|' + nz(r.facility_name) + '|' + r.facility_type;
        o = ex[xk]; if (!o) { o = ex[xk] = { district: r.district, block: r.block || '—', name: r.facility_name, gt: typeLabel(r), recs: [] }; out.push(o); }
      }
      o.recs.push(r);
    });
    out.forEach(function (f) {
      f.recs.sort(function (a, b) { return a.updated_at < b.updated_at ? 1 : -1; });
      if (f.recs.length > 1) {   /* only the latest saved record of a facility is shown; older ones are hidden (Delete removes them together with it) */
        var ks = [];
        f.recs.forEach(function (r) { (r._all || [r.key]).forEach(function (k) { if (k && ks.indexOf(k) < 0) ks.push(k); }); });
        f.recs[0]._all = ks; f.recs = [f.recs[0]];
      }
      f.latest = f.recs[0] || null;
      var sm = f.latest && f.latest.summary;
      f.comp = sm && sm.t ? sm.n / sm.t : null;
      f.score = (sm && sm.n > 0 && f.comp >= S.minc) ? sm.p : null;
      f.st = !f.recs.length ? 'none' : f.score != null ? 'scored' : 'started';
      f.key = nz(f.district) + '|' + nz(f.block) + '|' + nz(f.name) + '|' + f.gt;
    });
    return noFt ? out : out.filter(function (f) { return !S.ft || f.gt === S.ft; });
  }
  function areaKey() { return S.fw === 'n' ? 'aoc' : 'th'; }
  function agg(list) {
    var a = { total: list.length, assessed: 0, scored: 0, sum: 0, below: 0, last: '', ar: {} }, ac = {};
    list.forEach(function (f) {
      if (f.recs.length) a.assessed++;
      if (f.latest && f.latest.updated_at > a.last) a.last = f.latest.updated_at;
      if (f.score != null) {
        a.scored++; a.sum += f.score; if (f.score < PASS) a.below++;
        var ar = (f.latest.summary || {})[areaKey()] || {};
        Object.keys(ar).forEach(function (k) { (ac[k] = ac[k] || [0, 0]); ac[k][0] += ar[k]; ac[k][1]++; });
      }
    });
    a.avg = a.scored ? a.sum / a.scored : null;
    Object.keys(ac).forEach(function (k) { a.ar[k] = ac[k][0] / ac[k][1]; });
    return a;
  }

  /* ---------- small renderers ---------- */
  function areaName(k, type) {
    try { if (S.fw === 'n') return AOC_NAMES[k] || k; var th = KK[type.slice(3)].themes.filter(function (h) { return h.id === k; })[0]; return th ? th.name : k; } catch (x) { return k; }
  }
  function strip(ar) {
    var ks = Object.keys(ar || {}).sort();
    if (!ks.length) return '<span class="na">—</span>';
    return '<span class="qd-hs" role="img" aria-label="Area scores">' + ks.map(function (k) {
      return '<i class="' + band(ar[k]) + '" title="' + e(k + ' ' + (S.fw === 'n' ? (typeof AOC_NAMES !== 'undefined' && AOC_NAMES[k] || '') : '') + ': ' + pc(ar[k])) + '"></i>';
    }).join('') + '</span>';
  }
  function cover(a) {
    var p = a.total ? a.assessed / a.total * 100 : 0;
    return '<span class="qd-bar"><i style="width:' + Math.round(p) + '%"></i></span>' + a.assessed + ' / ' + a.total + ' <span class="qd-sub" style="display:inline">(' + Math.round(p) + '%)</span>';
  }
  function sortGroups(gs) {
    var m = S.sort;
    gs.sort(function (x, y) {
      var c = 0;
      if (m === 'cov') c = (x.a.total ? x.a.assessed / x.a.total : 0) - (y.a.total ? y.a.assessed / y.a.total : 0);
      else if (m === 'score') c = (x.a.avg == null ? 999 : x.a.avg) - (y.a.avg == null ? 999 : y.a.avg);
      else if (m === 'recent') c = x.a.last < y.a.last ? 1 : x.a.last > y.a.last ? -1 : 0;
      return c || x.name.localeCompare(y.name);
    });
  }
  function sortFacs(fs) {
    var m = S.sort, so = { none: 0, started: 1, scored: 2 };
    fs.sort(function (x, y) {
      var c = 0;
      if (m === 'cov') c = so[x.st] - so[y.st];
      else if (m === 'score') c = (x.score == null ? 999 : x.score) - (y.score == null ? 999 : y.score);
      else if (m === 'recent') { var a = x.latest ? x.latest.updated_at : '', b = y.latest ? y.latest.updated_at : ''; c = a < b ? 1 : a > b ? -1 : 0; }
      return c || x.name.localeCompare(y.name);
    });
  }

  /* ---------- main render ---------- */
  function scopeLabel() {
    var p = prof();
    return p.role === 'admin' ? 'State – all districts' : p.role === 'district' ? p.district + ' district' : p.block + ' block, ' + p.district;
  }
  function baseDepth() { var r = prof().role; return r === 'admin' ? 0 : r === 'district' ? 1 : 2; }
  function initPath() {
    var p = prof(); S.path = p.role === 'admin' ? [] : p.role === 'district' ? [p.district] : [p.district, p.block];
  }
  function inPath(f) {
    return (S.path.length < 1 || nz(f.district) === nz(S.path[0])) && (S.path.length < 2 || nz(f.block) === nz(S.path[1]));
  }
  function shown() { return derive(true).map(function (f) { return f.latest; }).filter(Boolean); }   /* the latest saved record of each facility = what the dashboard shows */
  function pending() { return shown().filter(function (r) { return !r.summary; }).length; }

  function paint() {
    if (!ov) return;
    var w = ov.querySelector('.qd-w'), sc = ov.scrollTop;
    var h = '';
    var ats = '<option value="">All assessment types</option>' + AT.map(function (t) { return '<option' + (S.at === t ? ' selected' : '') + ' value="' + e(t) + '">' + e(t) + '</option>'; }).join('');
    h += '<div class="qd-top"><h2>Dashboard<small class="no-i18n">' + e(scopeLabel()) + '</small></h2>' +
      '<button class="qd-b" data-act="refresh"' + (S.bf ? ' disabled' : '') + '>Refresh</button><button class="qd-b" data-act="xlsx"' + (S.loaded ? '' : ' disabled') + '>Export XLSX</button><button class="qd-b p" data-act="close" id="qdClose">Close</button></div>' +
      '<div class="qd-seg" role="group" aria-label="Framework"><button data-act="fw" data-v="n" aria-pressed="' + (S.fw === 'n') + '">NQAS</button><button data-act="fw" data-v="k" aria-pressed="' + (S.fw === 'k') + '">Kayakalp</button></div>';
    if (!S.loaded) {
      h += S.err ? '<div class="qd-n err"><span>' + e(S.err) + '</span><button class="qd-b" data-act="refresh">Try again</button></div>' : '<div class="qd-e">Loading assessments…</div>';
      w.innerHTML = h; return;
    }
    facs = derive();
    var all = facs, inScope = all.filter(inPath);
    var types = {}; all.forEach(function (f) { types[f.gt] = 1; });
    var fts = '<option value="">All facility types</option>' + Object.keys(types).sort().map(function (t) { return '<option' + (S.ft === t ? ' selected' : '') + ' value="' + e(t) + '">' + e(t) + '</option>'; }).join('');
    var mc = [[0, 'Any'], [0.5, '50% or more'], [0.9, '90% or more']].map(function (x) { return '<option' + (S.minc === x[0] ? ' selected' : '') + ' value="' + x[0] + '">' + x[1] + '</option>'; }).join('');
    var sorts = [['name', 'Name'], ['cov', 'Least assessed first'], ['score', 'Lowest score first'], ['recent', 'Recently saved']].map(function (x) { return '<option' + (S.sort === x[0] ? ' selected' : '') + ' value="' + x[0] + '">' + x[1] + '</option>'; }).join('');
    h += '<div class="qd-f"><label>Assessment type<select data-f="at">' + ats + '</select></label><label>Facility type<select data-f="ft">' + fts + '</select></label>' +
      '<label>Answered checkpoints (to count a score)<select data-f="minc">' + mc + '</select></label>' +
      '<label>From<input type="date" data-f="from" value="' + e(S.from) + '"></label><label>To<input type="date" data-f="to" value="' + e(S.to) + '"></label>' +
      '<label>Sort<select data-f="sort">' + sorts + '</select></label><label>Search<input type="search" data-f="q" placeholder="Name…" value="' + e(S.q) + '"></label></div>';

    /* breadcrumb */
    var bd = baseDepth(), cr = [];
    if (bd < 2) {
      var rootLbl = bd === 0 ? 'All districts' : 'All blocks';
      cr.push(S.path.length > bd ? '<button data-act="crumb" data-v="' + bd + '">' + rootLbl + '</button>' : '<b>' + rootLbl + '</b>');
      S.path.forEach(function (n, i) {
        if (i < bd) return;
        cr.push(i === S.path.length - 1 ? '<b class="no-i18n">' + e(n) + '</b>' : '<button class="no-i18n" data-act="crumb" data-v="' + (i + 1) + '">' + e(n) + '</button>');
      });
      h += '<div class="qd-crumb">' + cr.join('<span>›</span>') + '</div>';
    }

    /* KPIs */
    var A = agg(inScope);
    h += '<div class="qd-k"><div><div class="v">' + A.total + '</div><div class="l">Facilities</div></div>' +
      '<div><div class="v">' + A.assessed + '</div><div class="l">With an assessment</div><div class="s">' + (A.total ? Math.round(A.assessed / A.total * 100) : 0) + '% of facilities</div></div>' +
      '<div><div class="v ' + band(A.avg) + '">' + pc(A.avg) + '</div><div class="l">Average score</div><div class="s">' + A.scored + ' facilit' + (A.scored === 1 ? 'y' : 'ies') + ' scored</div></div>' +
      '<div><div class="v ' + (A.below ? 'bad' : '') + '">' + A.below + '</div><div class="l">Scoring below ' + PASS + '%</div></div></div>';

    /* backfill / progress */
    var pend = pending();
    if (S.bf) h += '<div class="qd-n"><span>Calculating scores… ' + S.bf.done + ' of ' + S.bf.n + (S.bf.fail ? ' (' + S.bf.fail + ' skipped)' : '') + '. Keep this screen open.</span><button class="qd-b" data-act="bfstop">Stop</button></div>';
    else if (pend) h += '<div class="qd-n"><span>' + pend + ' saved assessment' + (pend === 1 ? ' has' : 's have') + ' no score yet (saved before the dashboard existed). Calculate them once and they appear here.</span><button class="qd-b p" data-act="bf">Calculate missing scores</button></div>';

    /* table */
    var level = S.path.length, q = nz(S.q);
    if (level < 2) {
      var key = level === 0 ? 'district' : 'block', map = {}, gs = [];
      inScope.forEach(function (f) { var n = f[key]; (map[n] = map[n] || []).push(f); });
      Object.keys(map).forEach(function (n) { gs.push({ name: n, a: agg(map[n]) }); });
      gs = gs.filter(function (g) { return !q || nz(g.name).indexOf(q) >= 0; });
      sortGroups(gs);
      h += '<div class="qd-t"><table><thead><tr><th>' + (level === 0 ? 'District' : 'Block') + '</th><th>Assessed</th><th class="n">Avg score</th><th>Areas</th><th class="n">Below ' + PASS + '%</th><th class="n">Last saved</th></tr></thead><tbody>' +
        (gs.length ? gs.map(function (g) {
          return '<tr><td><button class="qd-l no-i18n" data-act="drill" data-v="' + e(g.name) + '">' + e(g.name) + '</button><span class="qd-sub">' + g.a.total + ' facilities</span></td><td>' + cover(g.a) + '</td><td class="n ' + band(g.a.avg) + '"><b>' + pc(g.a.avg) + '</b></td><td>' + strip(g.a.ar) + '</td><td class="n ' + (g.a.below ? 'bad' : '') + '">' + g.a.below + '</td><td class="n">' + dtm(g.a.last) + '</td></tr>';
        }).join('') : '<tr><td colspan="6" class="qd-e">Nothing matches these filters.</td></tr>') + '</tbody></table></div>';
    } else {
      var fs = inScope.filter(function (f) { return !q || nz(f.name).indexOf(q) >= 0; });
      sortFacs(fs);
      var STX = { none: 'Not started', started: 'Started', scored: 'Scored' };
      h += '<div class="qd-t"><table><thead><tr><th>Facility</th><th>Status</th><th>Assessment</th><th class="n">Answered</th><th class="n">Score</th><th>Areas</th><th class="n">Last saved</th></tr></thead><tbody>' +
        (fs.length ? fs.map(function (f) {
          var sm = f.latest && f.latest.summary, op = S.open[f.key], idx = facs.indexOf(f);
          var row = '<tr><td><button class="qd-l no-i18n" data-act="tog" data-v="' + idx + '" aria-expanded="' + !!op + '">' + (f.recs.length ? (op ? '▾ ' : '▸ ') : '') + e(f.name) + '</button><span class="qd-sub no-i18n">' + e(f.gt) + (S.path.length < 2 ? '' : '') + '</span></td>' +
            '<td><span class="qd-st ' + f.st + '">' + STX[f.st] + '</span></td><td>' + (f.latest ? e(f.latest.assessment_type || '\u2014') + (f.latest.start_date ? '<span class="qd-sub">' + e(dmy(f.latest.start_date)) + '</span>' : '') : '<span class="na">\u2014</span>') + '</td>' +
            '<td class="n">' + (f.comp != null ? Math.round(f.comp * 100) + '%' : '—') + '</td><td class="n ' + band(f.score) + '"><b>' + pc(f.score) + '</b></td>' +
            '<td>' + strip(sm && sm[areaKey()]) + '</td><td class="n">' + (f.latest ? dtm(f.latest.updated_at) + '<span class="qd-sub">' + (f.latest.updated_by ? 'by ' + e(f.latest.updated_by) : '') + '</span>' : '—') + '</td></tr>';
          if (op && f.recs.length) row += '<tr class="qd-x"><td colspan="7">' + detail(f) + '</td></tr>';
          return row;
        }).join('') : '<tr><td colspan="7" class="qd-e">No facilities match these filters.</td></tr>') + '</tbody></table></div>';
    }
    h += '<p class="qd-fn">Each facility shows only its latest saved assessment (matching the filters) – earlier saves are not shown. Average score is the mean of those facility scores; facilities without a score are left out of it. “Not started” facilities come from the facility list in the app; assessments saved for a facility that is not in that list (for example some district hospitals) are still counted.</p>';
    w.innerHTML = h; ov.scrollTop = sc;
  }

  function detail(f) {
    return f.recs.slice().sort(function (a, b) { return rank(a.assessment_type) - rank(b.assessment_type) || (a.updated_at < b.updated_at ? 1 : -1); }).map(function (r) {
      var sm = r.summary, ar = sm && sm[areaKey()], p = sm && sm.n > 0 ? sm.p : null;
      var dt = (r.start_date || r.end_date) ? dmy(r.start_date) + (r.end_date && r.end_date !== r.start_date ? ' → ' + dmy(r.end_date) : '') : '';
      var chips = ar ? Object.keys(ar).sort().map(function (k) { return '<span class="qd-ch ' + band(ar[k]) + '" title="' + e(areaName(k, r.facility_type)) + '"><b>' + e(k) + '</b> ' + r1(ar[k]) + '%</span>'; }).join('') : '<span class="na">Score not calculated yet</span>';
      var i = S.rows.indexOf(r);
      return '<div class="qd-r"><div><b>' + e(r.assessment_type || '—') + '</b><span class="qd-sub">' + e(dt || 'No dates') + (r.assessors ? ' · ' + e(r.assessors) : '') + '</span><span class="qd-sub">Saved ' + dtm(r.updated_at) + (r.updated_by ? ' by ' + e(r.updated_by) : '') + '</span></div>' +
        '<div><span class="qd-ch ' + band(p) + '"><b style="font-size:16px">' + pc(p) + '</b></span>' + (sm && sm.t ? '<span class="qd-sub" style="display:inline">' + sm.n + ' of ' + sm.t + ' answered</span><br>' : '<br>') + chips + '</div>' +
        '<div><button class="qd-b" data-act="open" data-v="' + i + '">Open</button>' + (prof().role === 'facility' ? '' : '<br><button class="qd-b" data-act="del" data-v="' + i + '" style="margin-top:8px;color:#fb7185;border-color:#fb718566">Delete</button>') + '</div></div>';
    }).join('');
  }

  /* ---------- XLSX ---------- */
  function xlsx() {
    var fs = derive().filter(inPath), ak = {}, rows = [];
    fs.forEach(function (f) { f.recs.forEach(function (r) { var ar = r.summary && r.summary[areaKey()]; if (ar) Object.keys(ar).forEach(function (k) { ak[k] = 1; }); }); });
    var keys = Object.keys(ak).sort();
    var head = ['District', 'Block', 'Facility', 'Facility type', 'Status', 'Assessment', 'Start date', 'Last saved', 'Answered %', 'Score %']
      .concat(keys.map(function (k) { return (S.fw === 'n' ? 'AoC ' : 'Theme ') + k + ' %'; }));
    rows.push(head);
    fs.forEach(function (f) {
      var sm = f.latest && f.latest.summary, ar = (sm && sm[areaKey()]) || {};
      rows.push([f.district, f.block, f.name, f.gt, { none: 'Not started', started: 'Started', scored: 'Scored' }[f.st], f.latest ? f.latest.assessment_type : '', f.latest ? dmy(f.latest.start_date) : '', f.latest ? dtm(f.latest.updated_at) : '',
        f.comp != null ? Math.round(f.comp * 100) : '', f.score != null ? r1(f.score) : ''].concat(keys.map(function (k) { return ar[k] != null ? r1(ar[k]) : ''; })));
    });
    if (typeof XLSX === 'undefined') { if (typeof qatToast === 'function') qatToast('Excel library not loaded - reload the app and try again', 'warn'); return; }
    var recRows = [['District', 'Block', 'Facility', 'Facility type', 'Assessment', 'Start date', 'End date', 'Assessors', 'Last saved', 'Saved by', 'Answered', 'Total checkpoints', 'Answered %', 'Score %']];
    fs.forEach(function (f) {
      f.recs.slice().sort(function (a, b) { return rank(a.assessment_type) - rank(b.assessment_type) || (a.updated_at < b.updated_at ? 1 : -1); }).forEach(function (r) {
        var sm = r.summary;
        recRows.push([f.district, f.block, f.name, f.gt, r.assessment_type || '', dmy(r.start_date), dmy(r.end_date), r.assessors || '', dtm(r.updated_at), r.updated_by || '',
          sm && sm.n != null ? sm.n : '', sm && sm.t ? sm.t : '', sm && sm.t ? Math.round(sm.n / sm.t * 100) : '', sm && sm.n > 0 ? r1(sm.p) : '']);
      });
    });
    function sheet(aoa) {
      var ws = XLSX.utils.aoa_to_sheet(aoa);
      ws['!cols'] = aoa[0].map(function (h, c) { var w = String(h).length; aoa.forEach(function (r) { w = Math.max(w, String(r[c] == null ? '' : r[c]).length); }); return { wch: Math.min(Math.max(w + 2, 8), 40) }; });
      ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: aoa.length - 1, c: aoa[0].length - 1 } }) };
      return ws;
    }
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet(rows), 'Facilities');
    XLSX.utils.book_append_sheet(wb, sheet(recRows), 'Assessments');
    XLSX.writeFile(wb, 'dashboard-' + (S.fw === 'n' ? 'nqas' : 'kayakalp') + '-' + new Date().toISOString().slice(0, 10) + '.xlsx');
  }

  /* ---------- data ---------- */
  async function load() {
    S.loaded = false; S.err = ''; paint();
    try {
      var j = await cloud().api('list', {});
      if (!j.ok) { S.err = j.error || 'Could not load.'; paint(); return; }
      S.rows = j.rows || []; S.loaded = true;
    } catch (x) {
      S.err = x && x.message === 'auth' ? 'Your session has expired. Close this screen, tap the ☁ chip at the top and sign in again.' : 'Could not load. Check the internet connection and try again.';
    }
    paint();
    if (S.loaded && !S.bf) backfill(true);
  }
  /* fill the score summary of records saved before the dashboard existed (pull each record, score it, store only the summary) */
  async function backfill(auto) {   /* auto = runs by itself after the list loads; records that failed once are not retried until the next full open */
    S.bfSkip = S.bfSkip || {};
    var todo = shown().filter(function (r) { return !r.summary && !(auto && S.bfSkip[r.key]); });
    if (!todo.length || S.bf) return;
    S.bf = { n: todo.length, done: 0, fail: 0, stop: false }; paint();
    var i = 0, bf = S.bf;
    async function lane() {
      while (i < todo.length && !bf.stop) {
        var r = todo[i++];
        try {
          var ids = { district: r.district, facility_type: r.facility_type, facility_name: r.facility_name, assessment_type: r.assessment_type || '', start_date: r.start_date || '', key: r.key };
          var j = await cloud().api('pull', ids), sm = null;
          if (j.ok && j.found) sm = isKK(r) ? window.qatKk.score(r.facility_type.slice(3), j.data.answers) : cloud().nSum(r.facility_type, j.data.answers);
          if (!sm) { bf.fail++; S.bfSkip[r.key] = 1; continue; }
          var k = await cloud().api('summary', Object.assign({}, ids, { summary: sm }));
          if (k.ok) { r.summary = sm; bf.done++; } else { bf.fail++; S.bfSkip[r.key] = 1; }
        } catch (x) { bf.fail++; S.bfSkip[r.key] = 1; if (x && x.message === 'auth') { bf.stop = true; S.err = 'Your session has expired.'; } }
        if ((bf.done + bf.fail) % 4 === 0) paint();
      }
    }
    await Promise.all([lane(), lane()]);
    S.bf = null; paint();
    if (typeof qatToast === 'function' && (!auto || bf.done)) qatToast('Scores calculated: ' + bf.done + (bf.fail ? ' · skipped ' + bf.fail : ''), bf.fail ? 'warn' : 'ok');
  }

  /* ---------- events ---------- */
  function onClick(ev) {
    var b = ev.target.closest('[data-act]'); if (!b) return;
    var a = b.dataset.act, v = b.dataset.v;
    if (a === 'close') close();
    else if (a === 'refresh') load();
    else if (a === 'xlsx') xlsx();
    else if (a === 'fw') { S.fw = v; S.ft = ''; S.q = ''; S.open = {}; initPath(); paint(); }
    else if (a === 'crumb') { S.path = S.path.slice(0, +v); S.q = ''; paint(); }
    else if (a === 'drill') { S.path = S.path.concat([v]); S.q = ''; paint(); }
    else if (a === 'tog') { var f = facs[+v]; if (f) { S.open[f.key] = !S.open[f.key]; paint(); } }
    else if (a === 'bf') backfill(false);
    else if (a === 'bfstop') { if (S.bf) S.bf.stop = true; }
    else if (a === 'open') openRec(S.rows[+v]);
    else if (a === 'del') delRec(S.rows[+v]);
  }
  function onChange(ev) {
    var t = ev.target, f = t.dataset && t.dataset.f; if (!f) return;
    S[f] = f === 'minc' ? +t.value : t.value;
    if (f === 'q') { var pos = t.selectionStart; paint(); var n = ov.querySelector('[data-f=q]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } return; }
    paint();
  }
  async function delRec(r) {
    if (!r) return;
    var keys = (r._all || [r.key]).filter(Boolean);
    if (!keys.length) { if (typeof qatToast === 'function') qatToast('Refresh the dashboard and try again', 'warn'); return; }
    var dt = r.start_date || r.end_date;
    if (!confirm('Delete the ' + (r.assessment_type || 'saved') + ' assessment' + (dt ? ' of ' + dmy(dt) : '') + ' for ' + r.facility_name + '?' + (keys.length > 1 ? '\n\n(This also removes ' + (keys.length - 1) + ' older saved record' + (keys.length === 2 ? '' : 's') + ' of this facility.)' : '') + '\n\nThis cannot be undone.')) return;
    try {
      var j = await cloud().api('delete', { keys: keys });
      if (!j.ok) { alert(j.error || 'Could not delete.'); return; }
      if (!isKK(r) && cloud().forget) cloud().forget(r);
      if (typeof qatToast === 'function') qatToast('Deleted', 'ok');
      await load();
    } catch (x) { if (!x || x.message !== 'auth') alert('Could not delete. Check the internet connection and try again.'); }
  }
  async function openRec(r) {
    if (!r) return;
    close();
    try {
      if (isKK(r)) await window.qatKk.open(r);
      else { if (window.qatKk && window.qatKk.isKk()) window.qatKk.comp('nqas'); await cloud().openRec(r); }
    } catch (x) { if (typeof qatToast === 'function') qatToast('Could not open that assessment.', 'warn'); }
  }
  function onKey(ev) { if (ev.key === 'Escape' && ov && ov.style.display !== 'none') close(); }

  function open() {
    if (!cloud() || !cloud().profile()) { if (typeof qatToast === 'function') qatToast('Sign in to use the dashboard.', 'warn'); return; }
    css();
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'qatDash'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Dashboard');
      ov.innerHTML = '<div class="qd-w"></div>';
      ov.addEventListener('click', onClick); ov.addEventListener('change', onChange); ov.addEventListener('input', function (ev) { if (ev.target.dataset && ev.target.dataset.f === 'q') onChange(ev); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(ov);
    }
    lastFocus = document.activeElement; ov.style.display = ''; document.documentElement.style.overflow = 'hidden';
    initPath(); S.open = {}; S.q = '';
    load().then(function () { var c = document.getElementById('qdClose'); if (c) c.focus(); });
  }
  function close() {
    if (!ov) return;
    if (S.bf) S.bf.stop = true;
    ov.style.display = 'none'; document.documentElement.style.overflow = '';
    try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (x) {}
  }
  window.qatDashboard = { open: open, close: close };
})();
