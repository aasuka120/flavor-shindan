/* =========================================================
   フレーバー診断 静的生成スクリプト
   実行: node build.cjs
   data.js を読み、以下を出力(サーバーは静的のまま=ランタイム不要):
     - /t/{id}/index.html  : タイプ別の静的ページ(per-typeメタ + SEO本文 + CTA)
     - /sitemap.xml
     - /robots.txt
   ※OG画像(/ogp/*.png)は tools/og-build.html をブラウザで開いて生成
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { TYPES, TYPE_ORDER } = require('./js/data.js');

const ORIGIN = 'https://flavorshindan.com';
const ROOT = __dirname;
const VER = '11';

// レア度ランキング(希少なほど上位)
const RANKED = TYPE_ORDER.slice().sort((a, b) => TYPES[a].rarity - TYPES[b].rarity);
const rankOf = (id) => RANKED.indexOf(id) + 1;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function clip(s, n) {
  s = String(s).replace(/\s+/g, '');
  return s.length > n ? s.slice(0, n) + '…' : s;
}
// 味タイプから導かれるMBTI(S/Nは味では決まらないので2通り)。app.jsのflavorMbtiと同一規則
function flavorMbti(axes) {
  const ei = axes.charAt(0) === 'C' ? 'E' : 'I';
  const tf = axes.charAt(2) === 'S' ? 'F' : 'T';
  const jp = axes.charAt(3) === 'R' ? 'J' : 'P';
  return [ei + 'S' + tf + jp, ei + 'N' + tf + jp];
}

function cardHTML(t) {
  const best = TYPES[t.bestId] || t;
  const worst = TYPES[t.worstId] || t;
  return `<div class="card" style="--c:${t.color}">
  <div class="card-inner">
    <div class="card-banner">FLAVOR CHECK ✦ フレーバー診断</div>
    <p class="card-lead">この味の正体は</p>
    <div class="card-charwrap">
      <div class="card-char" role="img" aria-label="${esc(t.name)}のイラスト">${t.svg}</div>
      <div class="card-stamp"><span>全国の</span><strong>${t.rarity}%</strong><span>おなじ味</span></div>
    </div>
    <h2 class="card-name${t.name.length > 10 ? ' long' : ''}">${esc(t.name)}</h2>
    <div class="card-catch">${esc(t.catch)}</div>
    <ul class="card-feats">${t.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    <div class="card-pair"><span class="good">◎ ${esc(best.short)}</span><span class="bad">✕ ${esc(worst.short)}</span></div>
    <div class="card-foot">フレーバー診断 <em>#フレーバー診断</em></div>
  </div>
</div>`;
}

function panel(tag, inner, color, extra) {
  return `<section class="panel${extra ? ' ' + extra : ''}" style="--c:${color}"><span class="panel-tag">${esc(tag)}</span>${inner}</section>`;
}

function bodyPanels(t) {
  let h = '';
  h += panel('こんな味', t.desc.map((p) => `<p class="panel-para">${esc(p)}</p>`).join(''), t.color);
  if (t.kuchiguse && t.kuchiguse.length) {
    h += panel('口ぐせ', `<ul class="kuchiguse">${t.kuchiguse.map((k) => `<li><span class="kuchiguse-bubble">${esc(k)}</span></li>`).join('')}</ul>`, t.color);
  }
  if (t.meigen) h += panel('今日のひとこと', `<blockquote class="meigen">${esc(t.meigen)}<span class="meigen-stamp" aria-hidden="true">味</span></blockquote>`, t.color);
  h += panel('あるある', `<ul class="aruaru">${t.aruaru.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`, t.color);
  if (t.lucky) {
    h += panel('きょうのラッキー', `<div class="lucky">
      <div class="lucky-cell"><span class="lucky-k">食べもの</span><span class="lucky-v">${esc(t.lucky.food)}</span></div>
      <div class="lucky-cell"><span class="lucky-k">場所</span><span class="lucky-v">${esc(t.lucky.place)}</span></div>
      <div class="lucky-cell"><span class="lucky-k">行動</span><span class="lucky-v">${esc(t.lucky.action)}</span></div>
    </div>`, t.color);
  }
  h += panel('この味に多いMBTI', `<div class="chips">${flavorMbti(t.axes).map((m) => `<span class="chip">${esc(m)}</span>`).join('')}</div>`, t.color);
  return h;
}

function pageHTML(t) {
  const rank = rankOf(t.id);
  const url = `${ORIGIN}/t/${t.id}/`;
  const ogImg = `${ORIGIN}/ogp/${t.id}.png`;
  const title = `${t.name}（${t.catch}）｜フレーバー診断`;
  const desc = `${t.catch}。全国の${t.rarity}%（16味中レア度${rank}位）。${clip(t.desc[0], 70)} あなたはなに味？ #フレーバー診断`;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8VBGJTD06T"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8VBGJTD06T');
</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="フレーバー診断">
<meta property="og:locale" content="ja_JP">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.name)}（${esc(t.catch)}）">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImg}">
<meta name="theme-color" content="#fff8ec">
<link rel="icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Mochiy+Pop+One&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Mochiy+Pop+One&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Mochiy+Pop+One&display=swap"></noscript>
<link rel="stylesheet" href="/css/style.css?v=${VER}">
<style>
  .tp-lead{ text-align:center; font-family:'Mochiy Pop One',sans-serif; font-size:17px; margin:24px 0 14px; }
  .tp-cta{ margin:28px 0 8px; text-align:center; background:var(--white); border:3px solid var(--ink); border-radius:18px; box-shadow:4px 4px 0 var(--ink); padding:20px 16px; }
  .tp-cta-head{ font-family:'Mochiy Pop One',sans-serif; font-size:18px; margin-bottom:14px; }
  .tp-cta .btn{ display:block; width:100%; margin:8px 0; text-decoration:none; }
  .tp-back{ display:block; text-align:center; margin:22px 0 8px; font-weight:900; font-size:13px; }
</style>
</head>
<body>
<div class="marquee" aria-hidden="true"><div class="marquee-track">${'<span>あなたはなにあじ？</span><span>✦</span><span>フレーバー診断</span><span>✦</span><span>全16味</span><span>✦</span>'.repeat(8)}</div></div>
<main class="container">
  <p class="tp-lead">『${esc(t.name)}』ってどんな味？</p>
  ${cardHTML(t)}
  <div class="tp-cta">
    <p class="tp-cta-head">あなたはなに味？🍴</p>
    <a class="btn btn-primary btn-big" href="/">25問・約2分で診断する</a>
    <a class="btn" href="/?t=${t.id}">この味を詳しく見る</a>
  </div>
  ${bodyPanels(t)}
  <a class="tp-back" href="/">← フレーバー診断トップへ</a>
</main>
<!-- 計測: Cloudflare Web Analytics を使う場合はトップと同じ beacon をここにも入れる -->

<footer class="site-foot">
  <p>※この診断はエンタメコンテンツです。科学的な性格分析ではありません。</p>
  <p>© 2026 フレーバー診断 <span>#フレーバー診断</span> ・ <a href="/privacy/">プライバシーポリシー</a></p>
</footer>
</body>
</html>
`;
}

// ---- 出力 ----
let count = 0;
TYPE_ORDER.forEach((id) => {
  const dir = path.join(ROOT, 't', id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageHTML(TYPES[id]), 'utf8');
  count++;
});

// sitemap.xml
const urls = [`${ORIGIN}/`].concat(TYPE_ORDER.map((id) => `${ORIGIN}/t/${id}/`));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

// robots.txt
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`, 'utf8');

console.log(`生成完了: タイプページ ${count}枚 + sitemap.xml + robots.txt`);
