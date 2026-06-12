/* =========================================================
   フレーバー診断 アプリロジック
   data.js(AXES/QUESTIONS/TYPES/TYPE_ORDER/LOADING_MSGS),
   card.js(FlavorCard.save) に依存
   ========================================================= */
(function () {
  'use strict';

  var answers = [];
  var index = 0;
  var transitioning = false; // 連打防止
  var toastTimer = null;

  function $(id) { return document.getElementById(id); }

  /* ---------- トースト ---------- */
  window.toast = function (msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2000);
  };

  /* ---------- 画面遷移 ---------- */
  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('active');
    });
    $('screen-' + name).classList.add('active');
    window.scrollTo(0, 0);
  }

  function hideBanner() { $('viewerBanner').classList.add('hidden'); }

  /* ---------- localStorage ---------- */
  function getMyType() {
    try { return localStorage.getItem('flavor_my_type'); } catch (e) { return null; }
  }
  function getMyMix() {
    try {
      var c = JSON.parse(localStorage.getItem('flavor_my_mix'));
      return Array.isArray(c) ? c : null;
    } catch (e) { return null; }
  }

  /* ---------- クイズ ---------- */
  function startQuiz() {
    answers = [];
    index = 0;
    transitioning = false;
    hideBanner();
    showScreen('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var q = QUESTIONS[index];
    var n = index + 1;
    var total = QUESTIONS.length;
    $('qNo').textContent = 'Q' + n;
    $('progLabel').textContent = 'Q' + n + ' / ' + total;
    $('progLeft').textContent = (n === total) ? 'ラスト1問！' : 'あと' + (total - n) + '問';
    var ratio = n / total;
    $('progHint').textContent =
      ratio <= 0.25 ? '下ごしらえ中…' :
      ratio <= 0.5  ? 'いい味が出てきた…' :
      ratio <= 0.75 ? '香りが立ってきた…' : 'あとひと煮込み！';
    $('progFill').style.width = (n / total * 100) + '%';
    $('qText').innerHTML = q.q;
    // 毎問アニメをかけ直す
    var card = $('qCard');
    card.classList.remove('anim-in');
    void card.offsetWidth;
    card.classList.add('anim-in');
  }

  function choose(w, btn) {
    if (transitioning) return;
    transitioning = true;
    if (btn) {
      btn.classList.add('picked');
      setTimeout(function () { btn.classList.remove('picked'); }, 220);
    }
    answers.push(w);
    index++;
    if (index >= QUESTIONS.length) {
      setTimeout(finish, 200);
      return;
    }
    setTimeout(function () {
      renderQuestion();
      transitioning = false;
    }, 200);
  }

  /* ---------- 集計 ----------
     軸ごとの合計点(プラス=a側)。逆方向質問(dir:'b')は符号を反転。
     各軸-10〜+10点 → a側の配合% = (sum+10)/20*100 */
  function finish() {
    var sums = AXES.map(function () { return 0; });
    QUESTIONS.forEach(function (q, i) {
      sums[q.axis] += (q.dir === 'a' ? answers[i] : -answers[i]);
    });

    var code = AXES.map(function (ax, i) {
      if (sums[i] > 0) return ax.a[1];
      if (sums[i] < 0) return ax.b[1];
      // 同点: その軸で最初に0以外を答えた質問の向きで決める(全部「わからない」ならa)
      for (var j = 0; j < QUESTIONS.length; j++) {
        if (QUESTIONS[j].axis !== i || answers[j] === 0) continue;
        var contrib = QUESTIONS[j].dir === 'a' ? answers[j] : -answers[j];
        return contrib > 0 ? ax.a[1] : ax.b[1];
      }
      return ax.a[1];
    }).join('');

    var id = null;
    Object.keys(TYPES).forEach(function (k) {
      if (TYPES[k].axes === code) id = k;
    });

    var mix = sums.map(function (s) {
      return Math.max(0, Math.min(100, Math.round((s + 10) / 20 * 100)));
    });

    try {
      localStorage.setItem('flavor_my_type', id);
      localStorage.setItem('flavor_my_mix', JSON.stringify(mix));
    } catch (e) { /* プライベートモード等は無視 */ }
    try { history.replaceState(null, '', '?t=' + id); } catch (e) { /* file://は無視 */ }

    showScreen('loading');
    var mi = 0;
    $('cookingMsg').textContent = LOADING_MSGS[0];
    var rot = setInterval(function () {
      mi = (mi + 1) % LOADING_MSGS.length;
      $('cookingMsg').textContent = LOADING_MSGS[mi];
    }, 600);
    setTimeout(function () {
      clearInterval(rot);
      renderResult(id, { mine: true, mix: mix });
      showScreen('result');
    }, 2400);
  }

  /* ---------- 結果描画 ---------- */
  function panel(tag, inner, color) {
    return '<section class="panel" style="--c:' + color + '">' +
      '<span class="panel-tag">' + tag + '</span>' + inner + '</section>';
  }

  function pairCardHTML(cls, title, mate, reason) {
    return '<div class="paircard ' + cls + '" style="--c:' + mate.color + '">' +
      '<p class="pair-title">' + title + '</p>' +
      '<div class="pair-char">' + mate.svg + '</div>' +
      '<p class="pair-name">' + mate.name + '</p>' +
      '<p class="pair-reason">' + reason + '</p>' +
      '<button class="pair-link" data-type="' + mate.id + '">この味をみる →</button>' +
      '</div>';
  }

  function renderResult(id, opts) {
    var mine = opts.mine;
    var mix = opts.mix;
    var t = TYPES[id];
    var best = TYPES[t.bestId];
    var worst = TYPES[t.worstId];

    $('resultLead').textContent = mine ? 'あなたのフレーバーは…' : 'この味の正体は…';

    /* カード */
    $('cardMount').innerHTML =
      '<div class="card" style="--c:' + t.color + '">' +
        '<div class="card-inner">' +
          '<div class="card-banner">FLAVOR CHECK ✦ フレーバー診断</div>' +
          '<p class="card-lead">あなたのフレーバーは</p>' +
          '<div class="card-charwrap">' +
            '<div class="card-char">' + t.svg + '</div>' +
            '<div class="card-stamp"><span>全国の</span><strong>' + t.rarity + '%</strong><span>おなじ味</span></div>' +
          '</div>' +
          '<h2 class="card-name' + (t.name.length > 10 ? ' long' : '') + '">' + t.name + '</h2>' +
          '<div class="card-catch">' + t.catch + '</div>' +
          '<ul class="card-feats">' + t.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
          '<div class="card-pair"><span class="good">◎ ' + best.short + '</span><span class="bad">✕ ' + worst.short + '</span></div>' +
          '<div class="card-foot">フレーバー診断 <em>#フレーバー診断</em></div>' +
        '</div>' +
      '</div>';

    /* アクション */
    $('resultActions').innerHTML = mine
      ? '<button class="btn btn-primary" id="btnSave">カードを保存する</button>' +
        '<button class="btn" id="btnShareX">Xでポスト</button>' +
        '<button class="btn" id="btnCopyLink">リンクをコピー</button>'
      : '<button class="btn btn-primary" id="btnViewerStart">自分も診断してみる</button>' +
        '<button class="btn" id="btnCopyLink">リンクをコピー</button>';

    /* 本文パネル */
    var html = '';

    html += panel('こんな味',
      t.desc.map(function (p) { return '<p class="panel-para">' + p + '</p>'; }).join(''), t.color);

    html += panel('せいぶん表示',
      '<p class="seibun-note">栄養成分表示（あなた1人あたり）</p>' +
      Object.keys(t.stats).map(function (k) {
        var v = t.stats[k];
        return '<div class="stat"><span class="stat-name">' + k + '</span>' +
          '<div class="stat-track"><div class="stat-fill" style="width:' + v + '%"></div></div>' +
          '<span class="stat-val">' + v + '%</span></div>';
      }).join(''), t.color);

    var manualLabels = [['like', 'してほしい'], ['ng', '地雷'], ['charge', '充電方法'], ['care', 'こわれたら']];
    html += panel('取扱説明書',
      manualLabels.map(function (m) {
        return '<div class="manual-row"><span class="manual-k">' + m[1] + '</span>' +
          '<p class="manual-v">' + t.manual[m[0]] + '</p></div>';
      }).join(''), t.color);

    html += panel('あるある',
      '<ul class="aruaru">' + t.aruaru.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>', t.color);

    html += panel('恋愛のあじ', '<p class="panel-para">' + t.love + '</p>', t.color);
    html += panel('ともだちの中では', '<p class="panel-para">' + t.friend + '</p>', t.color);

    html += panel('たべあわせ',
      '<div class="pairbox">' +
        pairCardHTML('good', '◎ ベストマリアージュ', best, t.bestReason) +
        pairCardHTML('bad', '✕ 食い合わせ注意', worst, t.worstRoast) +
      '</div>', t.color);

    html += panel('この味に多いMBTI',
      '<div class="chips">' + t.mbti.map(function (m) { return '<span class="chip">' + m + '</span>'; }).join('') + '</div>' +
      '<p class="chips-note">※体感です。MBTIガチ勢の方はお手やわらかに</p>', t.color);

    html += panel('bio用おみやげ',
      '<p class="emoji-row">' + t.emoji + '</p>' +
      '<button class="btn btn-small" id="btnCopyEmoji">絵文字をコピー</button>', t.color);

    if (mine && mix) {
      html += panel('あなたの配合',
        AXES.map(function (ax, i) {
          var pa = mix[i];
          var pb = 100 - pa;
          return '<div class="gohai-row2">' +
            '<div class="gohai-labels">' +
              '<span class="' + (pa < 50 ? 'lose' : '') + '">' + ax.a[0] + ' ' + pa + '%</span>' +
              '<span class="' + (pb < 50 ? 'lose' : '') + '">' + ax.b[0] + ' ' + pb + '%</span>' +
            '</div>' +
            '<div class="gohai-bar"><div class="gohai-fill" style="width:' + pa + '%"></div></div>' +
            '</div>';
        }).join('') +
        '<p class="gohai-note">ゲージが寄っているほど、その味が濃いめ。50%ラインぎりぎりの軸は、日によって変わるかも。</p>', t.color);
    }

    $('resultBody').innerHTML = html;

    /* イベント接続 */
    var btnSave = $('btnSave');
    if (btnSave) {
      var saving = false;
      btnSave.addEventListener('click', function () {
        if (saving) return;
        saving = true;
        FlavorCard.save(t)
          .catch(function (e) {
            if (e && e.name !== 'AbortError') toast('保存に失敗したかも…もう一回試して！');
          })
          .then(function () { saving = false; });
      });
    }

    var btnShareX = $('btnShareX');
    if (btnShareX) {
      btnShareX.addEventListener('click', function () {
        var text = '私は『' + t.name + '』味でした（全国の' + t.rarity + '%）あなたはなに味？ #フレーバー診断';
        var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
        if (location.protocol.indexOf('http') === 0) {
          url += '&url=' + encodeURIComponent(location.href);
        }
        window.open(url, '_blank');
      });
    }

    var btnCopyLink = $('btnCopyLink');
    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', function () {
        copyText(location.href, 'リンクをコピーしたよ');
      });
    }

    var btnCopyEmoji = $('btnCopyEmoji');
    if (btnCopyEmoji) {
      btnCopyEmoji.addEventListener('click', function () {
        copyText(t.emoji, 'コピーしたよ。bioに貼ってね');
      });
    }

    var btnViewerStart = $('btnViewerStart');
    if (btnViewerStart) btnViewerStart.addEventListener('click', startQuiz);

    $('resultBody').querySelectorAll('.pair-link').forEach(function (b) {
      b.addEventListener('click', function () { viewType(b.dataset.type); });
    });
  }

  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast(okMsg); },
        function () { toast('コピーできなかった…手動でお願い！'); }
      );
    } else {
      toast('コピーできなかった…手動でお願い！');
    }
  }

  /* ---------- 任意タイプ閲覧 ---------- */
  function viewType(id) {
    var mine = getMyType() === id;
    renderResult(id, { mine: mine, mix: mine ? getMyMix() : null });
    showScreen('result');
    try { history.replaceState(null, '', '?t=' + id); } catch (e) { /* 無視 */ }
  }

  /* ---------- 閲覧モード(?t=) ---------- */
  function openShared(id) {
    var mine = getMyType() === id;
    renderResult(id, { mine: mine, mix: mine ? getMyMix() : null });
    showScreen('result');
    if (!mine) {
      var banner = $('viewerBanner');
      banner.innerHTML =
        '<p>これは「<b>' + TYPES[id].name + '</b>」の味見ページ。<br>あなたはなに味？</p>' +
        '<button class="btn btn-primary" id="btnViewerStartTop">自分も診断する</button>';
      banner.classList.remove('hidden');
      $('btnViewerStartTop').addEventListener('click', startQuiz);
    }
  }

  /* ---------- 初期化 ---------- */
  function init() {
    // ロゴを1文字ずつspan化
    var logo = $('logo');
    var chars = logo.textContent.split('');
    logo.innerHTML = '';
    chars.forEach(function (ch) {
      var s = document.createElement('span');
      s.className = 'lg';
      s.textContent = ch;
      logo.appendChild(s);
    });

    // マーキー
    var set = '<span>あなたはなにあじ？</span><span>✦</span><span>フレーバー診断</span><span>✦</span><span>全16味</span><span>✦</span>';
    var mq = '';
    for (var i = 0; i < 8; i++) mq += set;
    $('marqueeTrack').innerHTML = mq;

    // ヒーローキャラ
    var heroIds = ['cheesehamburg', 'melonpan', 'mabo', 'hatsuyuki'];
    var delays = ['0s', '.4s', '.8s', '1.2s'];
    $('heroChars').innerHTML = heroIds.map(function (hid, j) {
      return '<div class="hero-char" style="--d:' + delays[j] + '">' + TYPES[hid].svg + '</div>';
    }).join('');

    // メニュー
    $('menuGrid').innerHTML = TYPE_ORDER.map(function (tid) {
      var t = TYPES[tid];
      return '<button class="menu-item" data-type="' + tid + '" style="--c:' + t.color + '">' +
        '<span class="menu-char">' + t.svg + '</span>' +
        '<span class="menu-name">' + t.short + '</span>' +
        '<span class="menu-rar">' + t.rarity + '%</span>' +
        '</button>';
    }).join('');
    $('menuGrid').addEventListener('click', function (ev) {
      var btn = ev.target.closest('.menu-item');
      if (btn) viewType(btn.dataset.type);
    });

    // 固定ボタン
    $('btnStart').addEventListener('click', startQuiz);
    document.querySelectorAll('.scale-btn').forEach(function (b) {
      b.addEventListener('click', function () { choose(parseInt(b.dataset.w, 10), b); });
    });
    $('btnQuitQuiz').addEventListener('click', function () {
      if (confirm('診断をやめてトップにもどる？')) {
        hideBanner();
        showScreen('landing');
      }
    });
    $('btnRetry').addEventListener('click', startQuiz);
    $('btnMenu').addEventListener('click', function () {
      hideBanner();
      showScreen('landing');
      $('menuSection').scrollIntoView();
    });

    // URLパラメータ
    var tid = null;
    try { tid = new URLSearchParams(location.search).get('t'); } catch (e) { /* 無視 */ }
    if (tid && TYPES[tid]) openShared(tid);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
