/* ============================================================
   generator.js — 可打印周计划 / 习惯追踪生成器
   页面只需放置 <div id="generator" data-mode="planner" data-...></div>
   可配置 data 属性：
     data-mode        planner | habit      （默认 planner）
     data-title       纸张标题             （默认 Weekly Planner）
     data-orientation landscape | portrait （默认 landscape）
     data-layout      columns | rows       （默认 columns）
     data-style       minimal | cute       （默认 minimal）
     data-accent      十六进制颜色         （默认 #0f766e）
     data-week-start  mon | sun            （默认 mon）
     data-paper       a4 | letter          （默认 a4）
     data-goals / data-habits / data-notes   "off" 可隐藏对应模块
     data-month-cal  "on" 默认开启迷你月历
     data-week-label "off" 隐藏预设的 "Week of ___" 周标签（undated 用，
                     用户仍可在 Header text 输入自定义表头）
     data-locked     逗号分隔的锁定项：orientation,layout,style
                     被锁定的控件不会渲染，页面强制保持预设形态
   ============================================================ */
(function () {
  'use strict';

  var root = document.getElementById('generator');
  if (!root) return;

  var DAYS_MON = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var DAYS_SUN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var INIT_MON = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  var INIT_SUN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  /* 96dpi 下的纸张像素尺寸 + 物理毫米尺寸（用于打印精确匹配） */
  var PAPERS = {
    a4: {
      portrait: { w: 794, h: 1123, css: 'A4 portrait', mm: { w: '210mm', h: '297mm' } },
      landscape: { w: 1123, h: 794, css: 'A4 landscape', mm: { w: '297mm', h: '210mm' } }
    },
    letter: {
      portrait: { w: 816, h: 1056, css: 'letter portrait', mm: { w: '215.9mm', h: '279.4mm' } },
      landscape: { w: 1056, h: 816, css: 'letter landscape', mm: { w: '279.4mm', h: '215.9mm' } }
    }
  };

  var state = {
    mode: root.dataset.mode === 'habit' ? 'habit' : 'planner',
    title: root.dataset.title || 'Weekly Planner',
    orientation: root.dataset.orientation === 'portrait' ? 'portrait' : 'landscape',
    layout: root.dataset.layout === 'rows' ? 'rows' : 'columns',
    style: root.dataset.style === 'cute' ? 'cute' : 'minimal',
    accent: /^#[0-9a-f]{6}$/i.test(root.dataset.accent || '') ? root.dataset.accent : '#0f766e',
    weekStart: root.dataset.weekStart === 'sun' ? 'sun' : 'mon',
    paper: root.dataset.paper === 'letter' ? 'letter' : 'a4',
    label: '',
    goals: root.dataset.goals !== 'off',
    habits: root.dataset.habits !== 'off',
    notes: root.dataset.notes !== 'off',
    monthCal: root.dataset.monthCal === 'on',
    weekLabel: root.dataset.weekLabel !== 'off',
    mcalMonth: ''
  };

  var currentDims = null;

  /* 解析锁定项：被锁定的配置不渲染对应控件，页面保持预设形态 */
  var locked = {};
  String(root.dataset.locked || '').split(',').forEach(function (k) {
    var key = k.trim();
    if (key) locked[key] = true;
  });

  /* ---------- 小工具 ---------- */
  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  function field(labelText, control, extraClass) {
    return h('label', { class: 'field' + (extraClass ? ' ' + extraClass : '') }, [
      h('span', { class: 'field-label', text: labelText }),
      control
    ]);
  }

  function select(id, options, value) {
    var s = h('select', { id: id });
    options.forEach(function (o) {
      var opt = h('option', { value: o[0], text: o[1] });
      if (o[0] === value) opt.selected = true;
      s.appendChild(opt);
    });
    return s;
  }

  function chip(id, labelText, checked, extraClass) {
    var input = h('input', { type: 'checkbox', id: id });
    input.checked = checked;
    return h('label', { class: 'chip' + (extraClass ? ' ' + extraClass : '') }, [
      input, h('span', { text: labelText })
    ]);
  }

  function ruled(nLines) {
    var d = h('div', { class: 'ruled' });
    d.style.height = (nLines * 26) + 'px';
    return d;
  }

  /* ---------- 控件面板 ---------- */
  var panel = h('div', { class: 'gen-panel' });
  var preview = h('div', { class: 'gen-preview' });
  var notice = h('p', { class: 'gen-notice', text: 'Print preview — the blank cells and lines are for filling in by hand after printing.' });
  var wrap = h('div', { class: 'sheet-wrap' });
  var sheet = h('div', { class: 'sheet', id: 'sheet' });
  wrap.appendChild(sheet);
  preview.appendChild(notice);
  preview.appendChild(wrap);
  root.appendChild(panel);
  root.appendChild(preview);
  root.classList.add(state.mode === 'habit' ? 'mode-habit' : 'mode-planner');

  function buildPanel() {
    var labelPlaceholder = state.mode === 'habit' ? 'Month of …' : 'Week of …';
    panel.innerHTML = '';
    panel.appendChild(h('h2', { class: 'gen-title', text: 'Customize your ' + (state.mode === 'habit' ? 'habit tracker' : 'weekly planner') }));
    var fields = [
      field('Week starts on', select('opt-weekstart', [['mon', 'Monday'], ['sun', 'Sunday']], state.weekStart)),
      field('Paper size', select('opt-paper', [['a4', 'A4'], ['letter', 'US Letter']], state.paper))
    ];
    if (!locked.orientation) {
      fields.push(field('Orientation', select('opt-orient', [['landscape', 'Landscape'], ['portrait', 'Portrait']], state.orientation)));
    }
    if (!locked.layout) {
      fields.push(field('Layout', select('opt-layout', [['columns', 'Day columns'], ['rows', 'Vertical list']], state.layout), 'planner-only'));
    }
    if (!locked.style) {
      fields.push(field('Style', select('opt-style', [['minimal', 'Minimal'], ['cute', 'Cute pastel']], state.style)));
    }
    if (state.mode === 'planner') {
      fields.push(field('Mini calendar dates', select('opt-mcal', monthOptions(), state.mcalMonth), 'planner-only'));
    }
    fields.push(field('Accent color', colorInput()));
    fields.push(field('Header text', textInput(labelPlaceholder), 'field-full'));
    panel.appendChild(h('div', { class: 'gen-grid' }, fields));
    panel.appendChild(h('div', { class: 'gen-chips' }, [
      chip('opt-goals', 'Top goals box', state.goals, 'planner-only'),
      chip('opt-month', 'Month calendar', state.monthCal, 'planner-only'),
      chip('opt-habits', 'Mini habit tracker', state.habits, 'planner-only'),
      chip('opt-notes', 'Notes strip', state.notes, 'planner-only')
    ]));
    var actions = h('div', { class: 'gen-actions' });
    var btn = h('button', { id: 'btn-print', class: 'btn btn-primary btn-block', type: 'button', text: 'Print / Save as PDF' });
    btn.addEventListener('click', function () { window.print(); });
    actions.appendChild(btn);
    actions.appendChild(h('p', { class: 'gen-hint', text: 'Tip: choose “Save as PDF” in the print dialog to download a digital copy.' }));
    panel.appendChild(actions);
  }

  function colorInput() {
    var c = h('input', { type: 'color', id: 'opt-accent' });
    c.value = state.accent;
    return c;
  }

  function textInput(placeholder) {
    var t = h('input', { type: 'text', id: 'opt-label', maxlength: '60', placeholder: placeholder });
    t.value = state.label;
    return t;
  }

  /* 未来 24 个月的月份选项，供迷你月历自动填充 */
  function monthOptions() {
    var names = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var opts = [['', 'Blank — handwrite the dates']];
    var now = new Date();
    var y = now.getFullYear(), m0 = now.getMonth();
    for (var i = 0; i < 24; i++) {
      var mm = (m0 + i) % 12;
      var yy = y + Math.floor((m0 + i) / 12);
      opts.push([yy + '-' + (mm < 9 ? '0' : '') + (mm + 1), names[mm] + ' ' + yy]);
    }
    return opts;
  }

  function sync() {
    function v(id) { var n = document.getElementById(id); return n ? n.value : ''; }
    function c(id) { var n = document.getElementById(id); return n ? n.checked : false; }
    state.weekStart = v('opt-weekstart') || state.weekStart;
    state.paper = v('opt-paper') || state.paper;
    state.orientation = v('opt-orient') || state.orientation;
    state.layout = v('opt-layout') || state.layout;
    state.style = v('opt-style') || state.style;
    if (/^#[0-9a-f]{6}$/i.test(v('opt-accent'))) state.accent = v('opt-accent');
    state.label = v('opt-label').trim();
    state.goals = c('opt-goals');
    state.habits = c('opt-habits');
    state.notes = c('opt-notes');
    state.monthCal = c('opt-month');
    state.mcalMonth = v('opt-mcal');
    render();
  }

  /* ---------- 纸张渲染 ---------- */
  function sheetHead(title, labelText) {
    var kids = [h('div', { class: 'sheet-title', text: title })];
    if (labelText) kids.push(h('div', { class: 'sheet-label', text: labelText }));
    return h('div', { class: 'sheet-head' }, kids);
  }

  /* 横向纸张高度有限，模块行数自动缩减，保证日程格不被挤压 */
  function goalsBox() {
    return h('section', { class: 'goals' }, [
      h('h3', { text: 'Top 3 Goals This Week' }),
      ruled(state.orientation === 'landscape' ? 2 : 3)
    ]);
  }

  function daysGrid() {
    var days = state.weekStart === 'mon' ? DAYS_MON : DAYS_SUN;
    var grid = h('div', { class: 'days ' + (state.layout === 'rows' ? 'rows' : 'cols') });
    days.forEach(function (d) {
      grid.appendChild(h('div', { class: 'day' }, [
        h('h4', { text: d }),
        h('div', { class: 'lines ruled' })
      ]));
    });
    return grid;
  }

  function miniHabits() {
    var inits = state.weekStart === 'mon' ? INIT_MON : INIT_SUN;
    var rows = state.orientation === 'landscape' ? 4 : 5;
    var g = h('div', { class: 'mini' });
    g.appendChild(h('div', { class: 'mini-cell mini-head', text: 'Habits' }));
    inits.forEach(function (c) { g.appendChild(h('div', { class: 'mini-cell mini-head', text: c })); });
    for (var r = 0; r < rows; r++) {
      g.appendChild(h('div', { class: 'mini-cell mini-line' }));
      inits.forEach(function () {
        g.appendChild(h('div', { class: 'mini-cell' }, [h('span', { class: 'cbx' })]));
      });
    }
    return g;
  }

  /* 迷你月历：默认空白（undated 传统用法），也可选择具体月份自动填充日期 */
  function monthCalendar() {
    var inits = state.weekStart === 'mon' ? INIT_MON : INIT_SUN;
    var m = /^(\d{4})-(\d{2})$/.exec(state.mcalMonth || '');
    var sec = h('section', { class: 'month-cal' });
    var g = h('div', { class: 'mcal-grid' });
    inits.forEach(function (c) { g.appendChild(h('div', { class: 'mcal-cell mcal-head', text: c })); });
    if (m) {
      var y = parseInt(m[1], 10), mo = parseInt(m[2], 10); /* mo: 1-12 */
      var names = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      sec.appendChild(h('h3', { text: names[mo - 1] + ' ' + y }));
      var first = new Date(y, mo - 1, 1);
      var days = new Date(y, mo, 0).getDate();
      /* 该月 1 号在网格中的索引（随周起始日变化），需要几行就渲染几行 */
      var idx = state.weekStart === 'mon' ? (first.getDay() + 6) % 7 : first.getDay();
      var rows = Math.ceil((idx + days) / 7);
      var cell = 0;
      for (var r = 0; r < rows; r++) {
        for (var i = 0; i < 7; i++, cell++) {
          var dnum = cell - idx + 1;
          if (dnum >= 1 && dnum <= days) {
            g.appendChild(h('div', { class: 'mcal-cell mcal-num', text: String(dnum) }));
          } else {
            g.appendChild(h('div', { class: 'mcal-cell' }));
          }
        }
      }
    } else {
      sec.appendChild(h('h3', { text: 'Month of ________' }));
      var blankRows = state.orientation === 'landscape' ? 4 : 5;
      for (var r2 = 0; r2 < blankRows; r2++) {
        for (var i2 = 0; i2 < 7; i2++) g.appendChild(h('div', { class: 'mcal-cell' }));
      }
    }
    sec.appendChild(g);
    return sec;
  }

  function notesBox(titleText) {
    return h('section', { class: 'notes' }, [
      h('h3', { text: titleText }),
      ruled(state.orientation === 'landscape' ? 1 : 2)
    ]);
  }

  function plannerSheet() {
    var frag = document.createDocumentFragment();
    /* week-label="off" 的页面（undated）不预设周标签，仅显示用户自定义表头 */
    var headLabel = state.weekLabel ? (state.label || 'Week of ________________') : state.label;
    frag.appendChild(sheetHead(state.title, headLabel));
    if (state.goals) frag.appendChild(goalsBox());
    frag.appendChild(daysGrid());
    if (state.monthCal) frag.appendChild(monthCalendar());
    if (state.habits) frag.appendChild(miniHabits());
    if (state.notes) frag.appendChild(notesBox('Notes'));
    return frag;
  }

  function habitSheet() {
    var inits = state.weekStart === 'mon' ? INIT_MON : INIT_SUN;
    var frag = document.createDocumentFragment();
    frag.appendChild(sheetHead(state.title, state.label || 'Month of ________________'));
    var g = h('div', { class: 'hgrid' });
    g.appendChild(h('div', { class: 'hhead', text: 'My Habits' }));
    inits.forEach(function (c) { g.appendChild(h('div', { class: 'hhead', text: c })); });
    for (var r = 0; r < 10; r++) {
      g.appendChild(h('div', { class: 'hline' }));
      inits.forEach(function () {
        g.appendChild(h('div', null, [h('span', { class: 'cbx' })]));
      });
    }
    frag.appendChild(g);
    frag.appendChild(notesBox('Notes & Rewards', 2));
    return frag;
  }

  /* ---------- 缩放适配 ---------- */
  function fit() {
    if (!currentDims) return;
    var avail = wrap.clientWidth;
    if (!avail) return;
    var s = Math.min(1, avail / currentDims.w);
    sheet.style.transform = 'scale(' + s + ')';
    wrap.style.height = (currentDims.h * s) + 'px';
    sheet.style.marginLeft = Math.max(0, (avail - currentDims.w * s) / 2) + 'px';
  }

  /* ---------- 主渲染 ---------- */
  var pageStyle = document.createElement('style');
  document.head.appendChild(pageStyle);

  function render() {
    var dims = PAPERS[state.paper][state.orientation];
    currentDims = dims;
    /* 纯 CSS 打印规则：position:fixed 让 sheet 脱离文档流不参与分页，物理毫米精确匹配纸张 */
    pageStyle.textContent =
      '@page { size: ' + dims.css + '; margin: 0; }' +
      '@media print {' +
      '  html, body { margin: 0; padding: 0; background: #fff; }' +
      '  body * { visibility: hidden !important; }' +
      '  #sheet, #sheet * { visibility: visible !important; }' +
      '  #sheet {' +
      '    position: fixed !important;' +
      '    left: 0 !important;' +
      '    top: 0 !important;' +
      '    width: ' + dims.mm.w + ' !important;' +
      '    height: ' + dims.mm.h + ' !important;' +
      '    margin: 0 !important;' +
      '    transform: none !important;' +
      '    box-shadow: none !important;' +
      '    border-radius: 0 !important;' +
      '    background: #fff !important;' +
      '    page-break-inside: avoid !important;' +
      '    break-inside: avoid !important;' +
      '  }' +
      '}';
    sheet.className = 'sheet' + (state.style === 'cute' ? ' cute' : '') + (state.orientation === 'landscape' ? ' sheet-ls' : '');
    sheet.style.setProperty('--accent', state.accent);
    sheet.style.width = dims.w + 'px';
    sheet.style.height = dims.h + 'px';
    sheet.innerHTML = '';
    sheet.appendChild(state.mode === 'habit' ? habitSheet() : plannerSheet());
    fit();
  }

  /* ---------- 初始化 ---------- */
  buildPanel();
  panel.addEventListener('change', sync);
  panel.addEventListener('input', function (e) {
    if (e.target && (e.target.id === 'opt-label' || e.target.id === 'opt-accent')) sync();
  });
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  render();
})();
