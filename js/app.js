/* =========================================================
   フレーバー診断 アプリロジック
   data.js(AXES/QUESTIONS/TYPES/TYPE_ORDER/LOADING_MSGS/pairScore),
   card.js(FlavorCard.save) に依存
   ========================================================= */
(function () {
  'use strict';

  if (window.__flavorInit) return;   // 二重初期化ガード
  window.__flavorInit = true;

  var answers = [];
  var index = 0;
  var transitioning = false;
  var toastTimer = null;
  var loadTimers = [];
  var revealObserver = null;
  var lastFocus = null;

  var REDUCE = false;
  try { REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // レア度ランキング(希少なほど上位)
  var RARITY_RANK = TYPE_ORDER.slice().sort(function (a, b) {
    return TYPES[a].rarity - TYPES[b].rarity;
  });
  function rarityRank(id) { return RARITY_RANK.indexOf(id) + 1; }

  function $(id) { return document.getElementById(id); }

  /* ---------- ハプティック ---------- */
  window.haptic = function (pattern) {
    if (REDUCE) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  };

  /* ---------- トースト ---------- */
  window.toast = function (msg) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  };

  /* ---------- 画面遷移 ---------- */
  function showScreen(name) {
    var target = $('screen-' + name);
    if (!target) return;
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    target.classList.add('active');
    document.body.classList.toggle('on-result', name === 'result');
    document.body.classList.toggle('on-quiz', name === 'quiz');
    if (name !== 'loading') cancelLoadTimers();
    window.scrollTo(0, 0);
  }

  function cancelLoadTimers() {
    loadTimers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
    loadTimers = [];
  }

  function hideBanner() { var b = $('viewerBanner'); if (b) b.classList.add('hidden'); }

  /* ---------- localStorage ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function getMyType() { return lsGet('flavor_my_type'); }
  function getPrevType() { return lsGet('flavor_prev_type'); }
  function getMyMix() {
    try {
      var c = JSON.parse(lsGet('flavor_my_mix'));
      // 長さがAXESと一致し全要素が数値のときだけ採用(古いキャッシュのNaN%防止)
      if (Array.isArray(c) && c.length === AXES.length &&
          c.every(function (n) { return typeof n === 'number' && isFinite(n); })) return c;
      return null;
    } catch (e) { return null; }
  }

  /* ---------- クイズ ---------- */
  function startQuiz() {
    answers = [];
    index = 0;
    transitioning = false;
    hideBanner();
    closeModal('quitModal');
    showScreen('quiz');
    renderQuestion();
    track('start');
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
      ratio <= 0.25 ? 'あなたの“素”、下ごしらえ中…' :
      ratio <= 0.5  ? 'いい味が出てきた…' :
      ratio <= 0.75 ? '香りが立ってきた…' : 'ラスト、ひと煮込み！';
    var fill = $('progFill');
    fill.style.width = (n / total * 100) + '%';
    var track = $('progTrack');
    if (track) { track.setAttribute('aria-valuenow', n); track.setAttribute('aria-valuemax', total); }
    $('qText').innerHTML = q.q;

    // スケールのチェック状態リセット
    document.querySelectorAll('.scale-btn').forEach(function (b) {
      b.classList.remove('picked');
      b.setAttribute('aria-checked', 'false');
    });

    // 戻るボタンの表示
    var back = $('btnBack');
    if (back) back.hidden = (index === 0);

    // アニメ＆フォーカス
    var card = $('qCard');
    card.classList.remove('anim-in');
    void card.offsetWidth;
    if (!REDUCE) card.classList.add('anim-in');
    var fillEl = $('progFill');
    if (!REDUCE && fillEl) { fillEl.classList.remove('bump'); void fillEl.offsetWidth; fillEl.classList.add('bump'); }
    try { $('qText').focus({ preventScroll: true }); } catch (e) { try { $('qText').focus(); } catch (e2) {} }
  }

  function choose(w, btn) {
    if (transitioning) return;
    transitioning = true;
    window.haptic(12);
    if (btn) {
      btn.classList.add('picked');
      btn.setAttribute('aria-checked', 'true');
    }
    answers[index] = w;
    index++;
    if (index >= QUESTIONS.length) {
      window.haptic([18, 40, 28]);
      setTimeout(finish, 230);
      return;
    }
    setTimeout(function () {
      renderQuestion();
      transitioning = false;
    }, 200);
  }

  function goBack() {
    if (transitioning || index === 0) return;
    window.haptic(10);
    index--;
    answers.pop();
    renderQuestion();
  }

  /* ---------- 集計 ---------- */
  function finish() {
    var sums = AXES.map(function () { return 0; });
    QUESTIONS.forEach(function (q, i) {
      sums[q.axis] += (q.dir === 'a' ? answers[i] : -answers[i]);
    });

    var code = AXES.map(function (ax, i) {
      if (sums[i] > 0) return ax.a[1];
      if (sums[i] < 0) return ax.b[1];
      for (var j = 0; j < QUESTIONS.length; j++) {
        if (QUESTIONS[j].axis !== i || answers[j] === 0) continue;
        var c = QUESTIONS[j].dir === 'a' ? answers[j] : -answers[j];
        return c > 0 ? ax.a[1] : ax.b[1];
      }
      return ax.a[1];
    }).join('');

    var id = null;
    Object.keys(TYPES).forEach(function (k) { if (TYPES[k].axes === code) id = k; });
    if (!id || !TYPES[id]) id = TYPE_ORDER[0]; // 念のためのフォールバック(白画面化を防ぐ)

    var mix = sums.map(function (s) {
      return Math.max(0, Math.min(100, Math.round((s + 10) / 20 * 100)));
    });

    // 前回の結果を退避してから保存
    var prev = getMyType();
    if (prev && prev !== id) lsSet('flavor_prev_type', prev);
    lsSet('flavor_my_type', id);
    lsSet('flavor_my_mix', JSON.stringify(mix));
    track('finish', id);
    try { history.replaceState(null, '', '?t=' + id + '&me=1'); } catch (e) {}

    showScreen('loading');
    var mi = 0;
    $('cookingMsg').textContent = LOADING_MSGS[0];
    var rot = setInterval(function () {
      if (!$('screen-loading').classList.contains('active')) { clearInterval(rot); return; }
      mi = (mi + 1) % LOADING_MSGS.length;
      $('cookingMsg').textContent = LOADING_MSGS[mi];
    }, 600);
    loadTimers.push(rot);
    var done = setTimeout(function () {
      clearInterval(rot);
      if (!$('screen-loading').classList.contains('active')) return; // 離脱していたら何もしない
      renderResult(id, { mine: true, mix: mix });
      showScreen('result');
    }, 2400);
    loadTimers.push(done);
  }

  /* ---------- シェア文・配合ラベル ---------- */
  function mixLabel(mix) {
    if (!mix) return '';
    var arr = AXES.map(function (ax, i) {
      var pa = mix[i];
      return { dist: Math.abs(pa - 50), label: (pa >= 50 ? ax.a[0] : ax.b[0]) + (pa >= 50 ? pa : 100 - pa) + '%' };
    });
    arr.sort(function (a, b) { return b.dist - a.dist; });
    return arr[0].label + '・' + arr[1].label;
  }

  function buildShareText(t, mix) {
    var lines = [];
    lines.push('私は『' + t.name + '』味でした' + t.emoji);
    var rank = rarityRank(t.id);
    var sub = (t.rarity <= 5 ? '激レア！全国の' : '全国の') + t.rarity + '%';
    sub += '（16味中レア度' + rank + '位）の' + t.catch + '。';
    lines.push(sub);
    var ml = mixLabel(mix);
    if (ml) lines.push(ml + 'の味らしい。');
    lines.push('あなたはなに味？ #フレーバー診断');
    return lines.join('\n');
  }

  /* ---------- メタ動的更新 ---------- */
  function setMeta(sel, content) {
    var el = document.head.querySelector(sel);
    if (el) el.setAttribute('content', content);
  }
  function updateMeta(t, mine) {
    var title = mine ? (t.name + '味でした｜フレーバー診断') : (t.name + '｜フレーバー診断');
    var desc = t.catch + '。全国の' + t.rarity + '%（16味中レア度' + rarityRank(t.id) + '位）。あなたはなに味？ #フレーバー診断';
    document.title = title;
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', desc);
  }

  /* ---------- 相性ランキング ---------- */
  function compatScored(id) {
    return TYPE_ORDER.filter(function (o) { return o !== id; })
      .map(function (o) { return { id: o, s: pairScore(id, o) }; })
      .sort(function (a, b) {
        if (b.s !== a.s) return b.s - a.s;
        return TYPES[a.id].rarity - TYPES[b.id].rarity;
      });
  }
  var COMPAT_LB = ['胃もたれ注意', 'クセ強コンビ', 'ふつう', 'good vibes', '運命のマリアージュ'];
  function compatRow(o) {
    var m = TYPES[o.id];
    var stars = '';
    for (var i = 0; i < 4; i++) stars += (i < o.s ? '★' : '☆');
    return '<button class="compat-row score-' + o.s + '" data-type="' + o.id + '" style="--c:' + m.color + '">' +
      '<span class="compat-char" aria-hidden="true">' + m.svg + '</span>' +
      '<span class="compat-name">' + m.short + '</span>' +
      '<span class="compat-stars" aria-hidden="true">' + stars + '</span>' +
      '<span class="compat-lb">' + COMPAT_LB[o.s] + '</span>' +
      '</button>';
  }

  /* ---------- パネル組み立て ---------- */
  function panel(tag, inner, color, extra) {
    return '<section class="panel panel-reveal' + (extra ? ' ' + extra : '') + '" style="--c:' + color + '">' +
      '<span class="panel-tag">' + tag + '</span>' + inner + '</section>';
  }
  function para(text) { return '<p class="panel-para">' + text + '</p>'; }

  function pairCardHTML(cls, title, mate, reason) {
    return '<div class="paircard ' + cls + '" style="--c:' + mate.color + '">' +
      '<p class="pair-title">' + title + '</p>' +
      '<div class="pair-char" role="img" aria-label="' + mate.name + 'のイラスト">' + mate.svg + '</div>' +
      '<p class="pair-name">' + mate.name + '</p>' +
      '<p class="pair-reason">' + reason + '</p>' +
      '<button class="pair-link" data-type="' + mate.id + '">この味をみる →</button>' +
      '</div>';
  }

  /* ---------- 結果描画 ---------- */
  function renderResult(id, opts) {
    if (!TYPES[id]) { toast('うまく調理できなかった…もう一回！'); showScreen('landing'); return; }
    var mine = opts.mine;
    var mix = opts.mix;
    var t = TYPES[id];
    var best = TYPES[t.bestId] || t;
    var worst = TYPES[t.worstId] || t;
    var rank = rarityRank(id);

    updateMeta(t, mine);

    // リード(レア度で動的・結果名をSRに告知)
    var leadVisible = mine
      ? (t.rarity <= 4 ? 'でた…！レアあじ…！' : 'あなたのフレーバーは…')
      : 'この味の正体は…';
    $('resultLead').innerHTML = leadVisible +
      '<span class="sr-only">。あなたの結果は ' + t.name + '、' + t.catch + '</span>';

    /* カード */
    $('cardMount').innerHTML =
      '<div class="card" style="--c:' + t.color + '">' +
        '<div class="card-inner">' +
          '<div class="card-banner">FLAVOR CHECK ✦ フレーバー診断</div>' +
          '<p class="card-lead">あなたのフレーバーは</p>' +
          '<div class="card-charwrap">' +
            '<div class="card-char" role="img" aria-label="' + t.name + 'のイラスト">' + t.svg + '</div>' +
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
      ? '<button class="btn btn-primary" id="btnSave">カードを保存／シェア</button>' +
        '<button class="btn" id="btnShareX">Xでポスト</button>' +
        '<button class="btn" id="btnCopyLink">リンクをコピー</button>'
      : '<button class="btn btn-primary" id="btnViewerStart">自分も診断してみる</button>' +
        '<button class="btn" id="btnCopyLink">リンクをコピー</button>';

    /* 本文パネル(新フィールドは未定義でも壊れないようガード) */
    var html = '';

    // ① こんな味
    html += panel('こんな味', t.desc.map(para).join(''), t.color);

    // ② 口ぐせ
    if (t.kuchiguse && t.kuchiguse.length) {
      html += panel('口ぐせ',
        '<ul class="kuchiguse">' + t.kuchiguse.map(function (k) {
          return '<li><span class="kuchiguse-bubble">' + k + '</span></li>';
        }).join('') + '</ul>', t.color);
    }

    // ③ 名言
    if (t.meigen) {
      html += panel('今日のひとこと',
        '<blockquote class="meigen">' + t.meigen + '<span class="meigen-stamp" aria-hidden="true">味</span></blockquote>', t.color);
    }

    // ④ せいぶん表示
    html += panel('せいぶん表示',
      '<p class="seibun-note">栄養成分表示（あなた1人あたり）</p>' +
      Object.keys(t.stats).map(function (k) {
        var v = t.stats[k];
        return '<div class="stat"><span class="stat-name">' + k + '</span>' +
          '<div class="stat-track" role="img" aria-label="' + k + ' ' + v + '%"><div class="stat-fill" style="width:' + v + '%"></div></div>' +
          '<span class="stat-val">' + v + '%</span></div>';
      }).join(''), t.color);

    // ⑤ 休日
    if (t.holiday) html += panel('休日のすごし方', para(t.holiday), t.color);
    // ⑥ しごと
    if (t.work) html += panel('しごと・べんきょうの味', para(t.work), t.color);

    // ⑦ 恋愛 / ⑧ ともだち
    html += panel('恋愛のあじ', para(t.love), t.color);
    html += panel('ともだちの中では', para(t.friend), t.color);

    // ⑨ 相性ランキング
    var scored = compatScored(id);
    html += panel('全16味との相性',
      '<p class="seibun-note">あの子は何点？ タップで味見できるよ</p>' +
      '<div class="compat-group"><p class="compat-head good">◎ 相性ベスト</p>' +
      scored.slice(0, 5).map(compatRow).join('') + '</div>' +
      '<div class="compat-group"><p class="compat-head bad">⚠ 食い合わせ注意</p>' +
      scored.slice(-2).map(compatRow).join('') + '</div>', t.color);

    // ⑩ たべあわせ
    html += panel('ベスト＆ワースト',
      '<div class="pairbox">' +
        pairCardHTML('good', '◎ ベストマリアージュ', best, t.bestReason) +
        pairCardHTML('bad', '✕ 食い合わせ注意', worst, t.worstRoast) +
      '</div>', t.color);

    // ⑪ 取扱説明書(6項目化・新ラベルはガード)
    var manualLabels = [['like', 'してほしい'], ['ng', 'ニガテ'], ['charge', '充電方法'], ['care', 'こわれたら'], ['danger', 'NGワード'], ['sweet', '殺し文句']];
    html += panel('取扱説明書',
      manualLabels.filter(function (m) { return t.manual[m[0]]; }).map(function (m) {
        return '<div class="manual-row"><span class="manual-k">' + m[1] + '</span>' +
          '<p class="manual-v">' + t.manual[m[0]] + '</p></div>';
      }).join(''), t.color);

    // ⑫ あるある
    html += panel('あるある',
      '<ul class="aruaru">' + t.aruaru.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>', t.color);

    // ⑬ ラッキー○○
    if (t.lucky) {
      html += panel('きょうのラッキー',
        '<div class="lucky">' +
          '<div class="lucky-cell"><span class="lucky-k">食べもの</span><span class="lucky-v">' + (t.lucky.food || '?') + '</span></div>' +
          '<div class="lucky-cell"><span class="lucky-k">場所</span><span class="lucky-v">' + (t.lucky.place || '?') + '</span></div>' +
          '<div class="lucky-cell"><span class="lucky-k">行動</span><span class="lucky-v">' + (t.lucky.action || '?') + '</span></div>' +
        '</div>', t.color);
    }

    // ⑭ テーマソング
    if (t.themesong) html += panel('テーマソング感', '<p class="panel-para themesong">♪ ' + t.themesong + '</p>', t.color);

    // ⑮ 注意報
    if (t.chui) html += panel('⚠ 注意報', '<p class="chui">' + t.chui + '</p>', t.color, 'panel-chui');

    // ⑯ 一緒にいると
    if (t.growWith || t.dryWith) {
      html += panel('一緒にいると…',
        '<div class="grow-dry">' +
          (t.growWith ? '<div class="gd gd-grow"><span class="gd-k">のびる相手</span><p class="gd-v">' + t.growWith + '</p></div>' : '') +
          (t.dryWith ? '<div class="gd gd-dry"><span class="gd-k">枯れる相手</span><p class="gd-v">' + t.dryWith + '</p></div>' : '') +
        '</div>', t.color);
    }

    // ⑰ MBTI
    html += panel('この味に多いMBTI',
      '<div class="chips">' + t.mbti.map(function (m) { return '<span class="chip">' + m + '</span>'; }).join('') + '</div>' +
      '<p class="chips-note">※体感です。MBTI警察の方は見逃してください🙏</p>', t.color);

    // ⑱ bio用おみやげ
    html += panel('bio用おみやげ',
      '<p class="emoji-row">' + t.emoji + '</p>' +
      '<button class="btn btn-small" id="btnCopyEmoji">絵文字をコピー</button>', t.color);

    // ⑲ あなたの配合（自分のときだけ）
    if (mine && mix) {
      var prevId = getPrevType();
      var retake = '';
      if (prevId && TYPES[prevId] && prevId !== id) {
        var diff = pairScore(prevId, id);
        var note = diff >= 4 ? '真逆まで振り切れた日だね。' : diff <= 1 ? 'ほぼ変わらず、安定の味。' : '前回からマイナーチェンジ。';
        retake = '<p class="retake">前回は『' + TYPES[prevId].short + '』→ 今回『' + t.short + '』。' + note + '</p>';
      }
      html += panel('あなたの配合',
        AXES.map(function (ax, i) {
          var pa = mix[i], pb = 100 - pa;
          return '<div class="gohai-row2">' +
            '<div class="gohai-labels">' +
              '<span class="' + (pa < 50 ? 'lose' : '') + '">' + ax.a[0] + ' ' + pa + '%</span>' +
              '<span class="' + (pb < 50 ? 'lose' : '') + '">' + ax.b[0] + ' ' + pb + '%</span>' +
            '</div>' +
            '<div class="gohai-bar"><div class="gohai-fill" style="width:' + pa + '%"></div></div>' +
            '</div>';
        }).join('') + retake +
        '<p class="gohai-note">ゲージが寄っているほど、その味が濃いめ。50%ぎりぎりの軸は、日によって変わるかも。</p>', t.color);
    }

    // つぎは何する？(バイラルCTA)
    html += '<div class="next-actions panel-reveal">' +
      '<p class="next-head">この診断、まわしてみて🍴</p>' +
      '<button class="btn next-btn" id="naInvite">友だちに送って当てさせる</button>' +
      '<button class="btn next-btn" id="naShare">Xでシェアする</button>' +
      '</div>';

    // 味めぐりナビ
    var ord = TYPE_ORDER.indexOf(id);
    var prevT = TYPES[TYPE_ORDER[(ord + TYPE_ORDER.length - 1) % TYPE_ORDER.length]];
    var nextT = TYPES[TYPE_ORDER[(ord + 1) % TYPE_ORDER.length]];
    html += '<nav class="flavor-nav" aria-label="味めぐり">' +
      '<button class="flavor-nav-btn" data-type="' + prevT.id + '">‹ ' + prevT.short + '</button>' +
      '<span class="flavor-nav-mid">味めぐり</span>' +
      '<button class="flavor-nav-btn" data-type="' + nextT.id + '">' + nextT.short + ' ›</button>' +
      '</nav>';

    $('resultBody').innerHTML = html;

    bindResultEvents(t, mix, mine);
    revealPanels();
  }

  /* ---------- 結果ページのイベント接続 ---------- */
  function bindResultEvents(t, mix, mine) {
    var shareText = buildShareText(t, mix);

    var btnSave = $('btnSave');
    if (btnSave) {
      var saving = false;
      btnSave.addEventListener('click', function () {
        if (saving) return;
        saving = true;
        FlavorCard.save(t)
          .then(function () { window.haptic([12, 30, 12]); track('save', t.id); toast('カード焼けた！🔥 ストーリーに貼ってね'); })
          .catch(function (e) { if (e && e.name !== 'AbortError') toast('うまく焼けなかった…もう一回試して！'); })
          .then(function () { saving = false; });
      });
    }

    function doShareX() {
      track('share', t.id);
      var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
      if (location.protocol.indexOf('http') === 0) url += '&url=' + encodeURIComponent(shareUrl(t.id));
      var w = window.open(url, '_blank');
      if (!w) copyText(shareText + '\n' + shareUrl(t.id), 'シェア文をコピー！どこかに貼ってね');
    }
    var btnShareX = $('btnShareX');
    if (btnShareX) btnShareX.addEventListener('click', doShareX);
    var naShare = $('naShare');
    if (naShare) naShare.addEventListener('click', doShareX);

    var btnCopyLink = $('btnCopyLink');
    if (btnCopyLink) btnCopyLink.addEventListener('click', function () {
      track('share', t.id);
      copyText(shareUrl(t.id), 'リンクをコピー！LINEやストーリーに貼ってね');
    });
    var naInvite = $('naInvite');
    if (naInvite) naInvite.addEventListener('click', function () {
      track('share', t.id);
      copyText('この診断、あなたはなに味？→ ' + shareUrl(t.id) + ' #フレーバー診断', 'おさそい文をコピー！友だちに送ってね');
    });

    var btnCopyEmoji = $('btnCopyEmoji');
    if (btnCopyEmoji) btnCopyEmoji.addEventListener('click', function () {
      copyText(t.emoji, 'コピーしたよ。bioに貼って布教して');
    });

    var btnViewerStart = $('btnViewerStart');
    if (btnViewerStart) btnViewerStart.addEventListener('click', startQuiz);

    $('resultBody').querySelectorAll('.pair-link, .compat-row, .flavor-nav-btn').forEach(function (b) {
      b.addEventListener('click', function () { viewType(b.dataset.type); });
    });
  }

  // 共有用URL: タイプ別の静的ページ /t/{id}/ を指す(SNSでプレビューが出る経路)
  function shareUrl(id) {
    if (location.protocol.indexOf('http') === 0) return location.origin + '/t/' + id + '/';
    return location.href; // file:// 等のフォールバック
  }

  // 計測ビーコン(Cloudflare Functions /api/ev へ。未デプロイ環境では黙って失敗)
  function track(ev, id) {
    try {
      var u = '/api/ev?e=' + encodeURIComponent(ev) + (id ? '&t=' + encodeURIComponent(id) : '');
      if (navigator.sendBeacon) navigator.sendBeacon(u);
      else { var img = new Image(); img.src = u; }
    } catch (e) {}
  }

  /* ---------- パネル段階登場 ---------- */
  function revealPanels() {
    var panels = document.querySelectorAll('#resultBody .panel-reveal');
    if (REDUCE || !('IntersectionObserver' in window)) {
      panels.forEach(function (p) { p.classList.add('in'); });
      return;
    }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    panels.forEach(function (p) { revealObserver.observe(p); });
  }

  /* ---------- コピー(多段フォールバック) ---------- */
  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, function () { legacyCopy(text, okMsg); });
    } else {
      legacyCopy(text, okMsg);
    }
  }
  function legacyCopy(text, okMsg) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) { toast(okMsg); return; }
    } catch (e) {}
    try { window.prompt('下のテキストをコピーしてね', text); } catch (e2) { toast('コピーできなかった…手動でお願い！'); }
  }

  /* ---------- 任意タイプ閲覧 ---------- */
  function viewType(id) {
    if (!TYPES[id]) return;
    var mine = getMyType() === id;
    renderResult(id, { mine: mine, mix: mine ? getMyMix() : null });
    showScreen('result');
    try {
      history.replaceState(null, '', '?t=' + id + (mine ? '&me=1' : ''));
    } catch (e) {}
    var lead = $('resultLead');
    if (lead) { try { lead.scrollIntoView({ block: 'start' }); } catch (e) {} }
  }

  /* ---------- 閲覧モード(?t=) ---------- */
  function openShared(id, isMineHint) {
    if (!TYPES[id]) { showScreen('landing'); return; }
    var mine = isMineHint && getMyType() === id;
    renderResult(id, { mine: mine, mix: mine ? getMyMix() : null });
    showScreen('result');
    track('view', id);
    if (!mine) {
      var banner = $('viewerBanner');
      var rank = rarityRank(id);
      banner.innerHTML =
        '<p>友だちは「<b>' + TYPES[id].name + '</b>」だったみたい。<br>全国の' + TYPES[id].rarity + '%（レア度' + rank + '位）。<br>じゃあ、あなたはなに味？</p>' +
        '<button class="btn btn-primary" id="btnViewerStartTop">私の味を診断する（約2分）</button>';
      banner.classList.remove('hidden');
      $('btnViewerStartTop').addEventListener('click', startQuiz);
    }
  }

  /* ---------- モーダル開閉(フォーカス管理) ---------- */
  function openModal(modalId) {
    var m = $(modalId);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.remove('hidden');
    var f = m.querySelector('button, [href], input');
    if (f) { try { f.focus(); } catch (e) {} }
  }
  function closeModal(modalId) {
    var m = $(modalId);
    if (!m) return;
    m.classList.add('hidden');
    if (lastFocus) { try { lastFocus.focus(); } catch (e) {} lastFocus = null; }
  }

  /* ---------- 初期化 ---------- */
  function init() {
    // ロゴを1文字ずつspan化
    var logo = $('logo');
    if (logo) {
      var chars = logo.textContent.split('');
      logo.innerHTML = '';
      chars.forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'lg';
        s.textContent = ch;
        logo.appendChild(s);
      });
    }

    // ヒーローのバッジ問数をJSで一元管理(数字ズレ恒久防止)
    var firstBadge = document.querySelector('.hero-badges li');
    if (firstBadge) firstBadge.textContent = '全' + QUESTIONS.length + '問';
    var eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) eyebrow.textContent = QUESTIONS.length + 'のしつもんで、あなたの味を調合します';

    // マーキー
    var set = '<span>あなたはなにあじ？</span><span>✦</span><span>フレーバー診断</span><span>✦</span><span>全16味</span><span>✦</span>';
    var mq = '';
    for (var i = 0; i < 8; i++) mq += set;
    var mt = $('marqueeTrack');
    if (mt) mt.innerHTML = mq;

    // ヒーローキャラ
    var heroIds = ['cheesehamburg', 'melonpan', 'mabo', 'hatsuyuki'];
    var delays = ['0s', '.4s', '.8s', '1.2s'];
    var hc = $('heroChars');
    if (hc) hc.innerHTML = heroIds.map(function (hid, j) {
      return '<div class="hero-char" aria-hidden="true" style="--d:' + delays[j] + '">' + TYPES[hid].svg + '</div>';
    }).join('');

    // メニュー(レア度で視覚序列化)
    var mg = $('menuGrid');
    if (mg) {
      mg.innerHTML = TYPE_ORDER.map(function (tid) {
        var t = TYPES[tid];
        var tier = t.rarity < 4 ? ' rare-ss' : (t.rarity < 6 ? ' rare-s' : '');
        var rareLabel = t.rarity < 4 ? '<span class="rare-flag" aria-hidden="true">RARE</span>' : '';
        return '<button class="menu-item' + tier + '" data-type="' + tid + '" style="--c:' + t.color + '" aria-label="' + t.name + 'をみる">' +
          rareLabel +
          '<span class="menu-char" aria-hidden="true">' + t.svg + '</span>' +
          '<span class="menu-name">' + t.short + '</span>' +
          '<span class="menu-rar">' + t.rarity + '%</span>' +
          '</button>';
      }).join('');
      mg.addEventListener('click', function (ev) {
        var btn = ev.target.closest('.menu-item');
        if (btn) viewType(btn.dataset.type);
      });
    }

    // 固定ボタン
    bind($('btnStart'), 'click', startQuiz);
    document.querySelectorAll('.scale-btn').forEach(function (b) {
      b.addEventListener('click', function () { choose(parseInt(b.dataset.w, 10), b); });
    });
    bind($('btnBack'), 'click', goBack);
    bind($('btnQuitQuiz'), 'click', function () { openModal('quitModal'); });
    bind($('quitContinue'), 'click', function () { closeModal('quitModal'); });
    bind($('quitConfirm'), 'click', function () { closeModal('quitModal'); hideBanner(); showScreen('landing'); });
    bind($('btnRetry'), 'click', startQuiz);
    bind($('btnMenu'), 'click', function () {
      hideBanner(); showScreen('landing');
      var ms = $('menuSection'); if (ms) ms.scrollIntoView();
    });

    // モーダル背景クリックで閉じる
    ['quitModal'].forEach(function (mid) {
      var m = $(mid);
      if (m) m.addEventListener('click', function (e) { if (e.target === m) closeModal(mid); });
    });

    // キーボード操作(クイズ中のみ)
    document.addEventListener('keydown', function (e) {
      if (!$('screen-quiz').classList.contains('active')) {
        if (e.key === 'Escape') { closeModal('quitModal'); closeModal('imgModal'); }
        return;
      }
      var map = { '1': 2, '2': 1, '3': 0, '4': -1, '5': -2 };
      if (e.key in map) {
        var w = map[e.key];
        var btn = document.querySelector('.scale-btn[data-w="' + w + '"]');
        choose(w, btn);
      } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        e.preventDefault(); goBack();
      } else if (e.key === 'Escape') {
        openModal('quitModal');
      }
    });

    // URLパラメータ
    var tid = null, me = false;
    try {
      var sp = new URLSearchParams(location.search);
      tid = sp.get('t');
      me = sp.get('me') === '1';
    } catch (e) {}
    if (tid && TYPES[tid]) openShared(tid, me);
  }

  function bind(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
