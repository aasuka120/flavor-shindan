/* =========================================================
   フレーバー診断 結果カード画像ジェネレータ (1080x1920)
   window.FlavorCard = { build, save }
   ========================================================= */
(function () {
  'use strict';

  var W = 1080, H = 1920;
  var INK = '#3a2c23';
  var CREAM = '#fff8ec';
  var WHITE = '#fffdf6';
  var RED = '#c9402a';
  var GREEN = '#2e7d3a';

  var FONT_SPECS = [
    '900 28px "Zen Maru Gothic"',
    '900 30px "Zen Maru Gothic"',
    '900 38px "Zen Maru Gothic"',
    '900 40px "Zen Maru Gothic"',
    '700 28px "Zen Maru Gothic"',
    '700 33px "Zen Maru Gothic"',
    '84px "Mochiy Pop One"',
    '58px "Mochiy Pop One"',
    '44px "Mochiy Pop One"',
  ];

  /* ---------- ヘルパー ---------- */

  // 角丸矩形パス（roundRect非依存）
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // hexを白とmix（amount=1で白）
  function tint(hex, amount) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // 4ポイントスター（縦長ダイヤ型）
  function star(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.8, 1);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.16, -r * 0.16, r, 0);
    ctx.quadraticCurveTo(r * 0.16, r * 0.16, 0, r);
    ctx.quadraticCurveTo(-r * 0.16, r * 0.16, -r, 0);
    ctx.quadraticCurveTo(-r * 0.16, -r * 0.16, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // SVG文字列 → Image（data URLなのでcanvasは汚染されない）
  function svgToImage(svg) {
    return new Promise(function (resolve, reject) {
      var s = String(svg);
      // 固有サイズ無しSVG対策（Firefox等）
      if (!/<svg[^>]*\swidth=/.test(s)) {
        s = s.replace('<svg', '<svg width="460" height="460"');
      }
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('キャラ画像の読み込みに失敗しました')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }

  function loadFonts(type, best, worst) {
    var sample = 'あなたのフレーバー診断はこんなたべあわせ全国のおなじ味 FLAVOR CHECK 0123456789.%✦◎✕──#'
      + type.name + type.catch + (type.features || []).join('') + best.short + worst.short;
    return Promise.all(FONT_SPECS.map(function (f) {
      return document.fonts.load(f, sample).catch(function () {});
    })).then(function () { return document.fonts.ready; });
  }

  /* ---------- 描画 ---------- */

  function drawTape(ctx, cx, cy, deg) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fillRect(-95, -26, 190, 52);
    ctx.restore();
  }

  // たべあわせピル（記号と名前を別色で中央寄せ）
  function drawPairPill(ctx, px, sym, symColor, name) {
    rr(ctx, px, 1600, 384, 82, 41);
    ctx.fillStyle = WHITE;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();

    ctx.font = '900 30px "Zen Maru Gothic"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var gap = 10;
    var symW = ctx.measureText(sym).width;
    var maxName = 384 - 48 - symW - gap;
    var nameW = Math.min(ctx.measureText(name).width, maxName);
    var sx = px + 192 - (symW + gap + nameW) / 2;
    ctx.fillStyle = symColor;
    ctx.fillText(sym, sx, 1642);
    ctx.fillStyle = INK;
    ctx.fillText(name, sx + symW + gap, 1642, maxName);
  }

  function draw(ctx, type, img, best, worst) {
    var i, a;

    /* 1. 背景：タイプ色＋白水玉 */
    ctx.fillStyle = type.color;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    var row = 0;
    for (var y = 0; y <= H + 92; y += 92, row++) {
      var off = (row % 2) ? 46 : 0;
      for (var x = off - 92; x <= W + 92; x += 92) {
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* 2. パネル：影→本体→枠線 */
    rr(ctx, 64 + 16, 110 + 16, 952, 1700, 46);
    ctx.fillStyle = 'rgba(58,44,35,.9)';
    ctx.fill();
    rr(ctx, 64, 110, 952, 1700, 46);
    ctx.fillStyle = CREAM;
    ctx.fill();
    ctx.lineWidth = 9;
    ctx.strokeStyle = INK;
    ctx.stroke();

    /* 3. マスキングテープ */
    drawTape(ctx, 255, 118, -18);
    drawTape(ctx, 840, 124, 15);

    /* 4. 上部バナー */
    rr(ctx, 540 - 310, 210 - 36, 620, 72, 36);
    ctx.fillStyle = INK;
    ctx.fill();
    ctx.fillStyle = CREAM;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 30px "Zen Maru Gothic"';
    var banner = 'FLAVOR CHECK ✦ フレーバー診断';
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = '6px';
      ctx.fillText(banner, 540, 212);
      ctx.letterSpacing = '0px';
    } else {
      ctx.fillText(banner.split('').join(' '), 540, 212);
    }

    /* 5. リード */
    ctx.fillStyle = INK;
    ctx.font = '900 40px "Zen Maru Gothic"';
    ctx.fillText('あなたのフレーバーは', 540, 330);

    /* 6. キャラクター窓：スカラップ→メイン円→SVG */
    var scallopColor = tint(type.color, 0.75);
    for (i = 0; i < 22; i++) {
      a = i * Math.PI * 2 / 22;
      ctx.beginPath();
      ctx.arc(540 + Math.cos(a) * 268, 650 + Math.sin(a) * 268, 26, 0, Math.PI * 2);
      ctx.fillStyle = scallopColor;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(540, 650, 256, 0, Math.PI * 2);
    ctx.fillStyle = WHITE;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.drawImage(img, 540 - 230, 650 - 230, 460, 460);

    /* 7. キラキラ */
    ctx.fillStyle = 'rgba(58,44,35,.75)';
    star(ctx, 205, 415, 30);
    star(ctx, 885, 800, 24);
    star(ctx, 168, 840, 20);

    /* 8. レア度スタンプ */
    ctx.save();
    ctx.translate(870, 420);
    ctx.rotate(-12 * Math.PI / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,248,236,.96)';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = RED;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 94, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = RED;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 28px "Zen Maru Gothic"';
    ctx.fillText('全国の', 0, -46);
    ctx.font = '58px "Mochiy Pop One"';
    ctx.fillText(type.rarity + '%', 0, 12);
    ctx.font = '900 28px "Zen Maru Gothic"';
    ctx.fillText('おなじ味', 0, 58);
    ctx.restore();

    /* 9. タイプ名（マーカー→文字、幅860以下まで縮小） */
    var size = 84;
    ctx.font = size + 'px "Mochiy Pop One"';
    while (ctx.measureText(type.name).width > 860 && size > 40) {
      size -= 4;
      ctx.font = size + 'px "Mochiy Pop One"';
    }
    var nameW = ctx.measureText(type.name).width;
    rr(ctx, 540 - (nameW + 48) / 2, 1032 - 13, nameW + 48, 26, 13);
    ctx.fillStyle = tint(type.color, 0.5);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(type.name, 540, 1020);

    /* 10. キャッチコピー帯 */
    ctx.font = '900 38px "Zen Maru Gothic"';
    var catchText = '── ' + type.catch + ' ──';
    var cw = ctx.measureText(catchText).width;
    rr(ctx, 540 - (cw + 80) / 2, 1130 - 34, cw + 80, 68, 34);
    ctx.fillStyle = type.color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(58,44,35,.45)';
    ctx.fillText(catchText, 541, 1133);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(catchText, 540, 1132);

    /* 11. 特徴3行 */
    ctx.font = '900 30px "Zen Maru Gothic"';
    ctx.fillStyle = 'rgba(58,44,35,.7)';
    ctx.fillText('✦ こんなあなた ✦', 540, 1245);
    rr(ctx, 140, 1272, 800, 256, 22);
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.setLineDash([12, 9]);
    ctx.stroke();
    ctx.setLineDash([]);
    var features = type.features || [];
    for (i = 0; i < 3; i++) {
      var fy = 1336 + i * 76;
      ctx.beginPath();
      ctx.arc(192, fy, 9, 0, Math.PI * 2);
      ctx.fillStyle = type.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = INK;
      ctx.stroke();
      ctx.font = '700 33px "Zen Maru Gothic"';
      ctx.fillStyle = INK;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(features[i] || '', 218, fy, 690);
    }

    /* 12. たべあわせ */
    ctx.font = '900 28px "Zen Maru Gothic"';
    ctx.fillStyle = 'rgba(58,44,35,.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('たべあわせ', 540, 1580);
    drawPairPill(ctx, 140, '◎', GREEN, best.short || '');
    drawPairPill(ctx, 556, '✕', RED, worst.short || '');

    /* 13. フッター */
    ctx.beginPath();
    ctx.moveTo(140, 1716);
    ctx.lineTo(940, 1716);
    ctx.lineWidth = 3;
    ctx.setLineDash([2, 14]);
    ctx.lineCap = 'round';
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineCap = 'butt';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '44px "Mochiy Pop One"';
    ctx.fillStyle = INK;
    ctx.fillText('フレーバー診断', 540, 1790);
    ctx.font = '700 28px "Zen Maru Gothic"';
    ctx.fillStyle = 'rgba(58,44,35,.6)';
    ctx.fillText('#フレーバー診断', 540, 1844);
  }

  /* ---------- 公開API ---------- */

  function lookup(id) {
    return (typeof TYPES !== 'undefined' && TYPES[id]) || { short: '' };
  }

  // 何度呼んでも安全：毎回新しいcanvasを返す
  async function build(type) {
    var best = lookup(type.bestId);
    var worst = lookup(type.worstId);
    await loadFonts(type, best, worst);
    var img = await svgToImage(type.svg);
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    draw(ctx, type, img, best, worst);
    return canvas;
  }

  async function save(type) {
    if (typeof window.toast === 'function') window.toast('カードを焼いてます…');
    var canvas = await build(type);
    var blob = await new Promise(function (resolve, reject) {
      canvas.toBlob(function (b) {
        if (b) resolve(b);
        else reject(new Error('PNGの生成に失敗しました'));
      }, 'image/png');
    });
    var file = new File([blob], 'flavor_' + type.id + '.png', { type: 'image/png' });

    // モバイル：Web Share API
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'フレーバー診断' });
      } catch (err) {
        if (!err || err.name !== 'AbortError') throw err; // キャンセルは成功扱い
      }
      return;
    }

    // PC等：ダウンロード＋モーダルプレビュー
    var url = URL.createObjectURL(blob);
    if (lastUrl) URL.revokeObjectURL(lastUrl);
    lastUrl = url;
    var aEl = document.createElement('a');
    aEl.href = url;
    aEl.download = file.name;
    document.body.appendChild(aEl);
    aEl.click();
    aEl.remove();
    showModal(url);
  }

  /* ---------- モーダル（初期化時に1回だけバインド） ---------- */

  var lastUrl = null;

  function showModal(url) {
    var modal = document.getElementById('imgModal');
    var pic = document.getElementById('imgModalPic');
    if (!modal || !pic) return;
    pic.src = url;
    modal.classList.remove('hidden');
  }

  function hideModal() {
    var modal = document.getElementById('imgModal');
    if (modal) modal.classList.add('hidden');
  }

  (function initModal() {
    var modal = document.getElementById('imgModal');
    var close = document.getElementById('imgModalClose');
    if (close) close.addEventListener('click', hideModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) hideModal();
      });
    }
  })();

  window.FlavorCard = { build: build, save: save };
})();
