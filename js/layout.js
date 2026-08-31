/* ============================================================
   layout.js — 全站公共头部 / 页脚注入
   纯静态托管没有 SSI，用 JS 注入保持导航单点维护；
   Google 可以正常渲染 JS，不影响收录。
   ============================================================ */
(function () {
  'use strict';

  var base = location.pathname.indexOf('/blog/') !== -1 ? '../' : '';
  var curPath = normPath(location.pathname);
  var inBlog = location.pathname.indexOf('/blog/') !== -1;

  /* 归一化路径：目录地址补全 index.html，再统一去掉末尾的 index.html
     这样 "/"、"/index.html"、"/blog/"、"/blog/index.html" 互匹配 */
  function normPath(p) {
    var out = p.charAt(p.length - 1) === '/' ? p + 'index.html' : p;
    return out.replace(/index\.html$/, '');
  }

  /* [显示文字, 链接] */
  var NAV = [
    ['Weekly Planner', './'],
    ['Undated', 'undated-weekly-planner'],
    ['Vertical', 'vertical-weekly-planner'],
    ['Habit Tracker', 'weekly-habit-tracker-printable'],
    ['Blog', 'blog/'],
    ['About', 'about']
  ];

  function navLinks(items) {
    return items.map(function (it) {
      /* 用临时 <a> 把相对链接解析成绝对路径，再和当前页归一化比较 */
      var a = document.createElement('a');
      a.href = base + it[1];
      var isActive = normPath(a.pathname) === curPath || (inBlog && it[1] === 'blog/');
      return '<a href="' + base + it[1] + '"' + (isActive ? ' aria-current="page"' : '') + '>' + it[0] + '</a>';
    }).join('');
  }

  var header = document.getElementById('site-header');
  if (header) {
    header.innerHTML =
      '<header class="site-header"><div class="container">' +
      '<a class="brand" href="' + base + './"><span class="dot"></span>Print<strong>Weekly</strong></a>' +
      '<nav class="site-nav">' + navLinks(NAV) + '</nav>' +
      '</div></header>';
  }

  var footer = document.getElementById('site-footer');
  if (footer) {
    var year = new Date().getFullYear();
    footer.innerHTML =
      '<footer class="site-footer"><div class="container">' +
      '<div class="foot-grid">' +
      '<div><div class="foot-brand">Print<strong>Weekly</strong></div>' +
      '<p class="foot-desc">Free printable weekly planners and habit trackers. Customize online, print at home, plan your week on paper.</p></div>' +
      '<div class="foot-col"><h4>Templates</h4>' +
      '<a href="' + base + './">Weekly Planner</a>' +
      '<a href="' + base + 'undated-weekly-planner">Undated Weekly Planner</a>' +
      '<a href="' + base + 'vertical-weekly-planner">Vertical Weekly Planner</a>' +
      '<a href="' + base + '7-day-weekly-planner-pdf">7 Day Planner PDF</a>' +
      '<a href="' + base + 'cute-weekly-planner-template">Cute Weekly Planner</a>' +
      '<a href="' + base + 'weekly-habit-tracker-printable">Habit Tracker</a></div>' +
      '<div class="foot-col"><h4>Site</h4>' +
      '<a href="' + base + 'blog/">Blog</a>' +
      '<a href="' + base + 'about">About</a>' +
      '<a href="' + base + 'contact">Contact</a>' +
      '<a href="' + base + 'privacy">Privacy Policy</a></div>' +
      '</div>' +
      '<div class="foot-bottom"><span>© ' + year + ' PrintWeekly. All rights reserved.</span>' +
      '<span>Made for people who love paper.</span></div>' +
      '</div></footer>';
  }
})();
