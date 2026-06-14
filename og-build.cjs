/* =========================================================
   フレーバー診断 OG画像生成スクリプト
   実行: node og-build.cjs
   出力: /ogp.png(デフォルト) + /ogp/{id}.png ×16 (1200×630)
   ※ブランドフォント(Mochiy/Zen Maru)はWeb専用のため、
     OG画像はWindows同梱の日本語フォントで描画(リンクプレビュー用途では十分)
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { TYPES, TYPE_ORDER } = require('./js/data.js');

// 日本語フォント登録(太め優先)
const FONT = 'OGJP';
const candidates = [
  'C:\\Windows\\Fonts\\YuGothB.ttc',
  'C:\\Windows\\Fonts\\meiryob.ttc',
  'C:\\Windows\\Fonts\\YuGothR.ttc',
  'C:\\Windows\\Fonts\\meiryo.ttc',
];
for (const p of candidates) { if (fs.existsSync(p)) { GlobalFonts.registerFromPath(p, FONT); break; } }

const W = 1200, H = 630;
const INK = '#3a2c23', CREAM = '#fff8ec', WHITE = '#fffdf6', RED = '#c9402a';
const RANKED = TYPE_ORDER.slice().sort((a, b) => TYPES[a].rarity - TYPES[b].rarity);
const rankOf = (id) => RANKED.indexOf(id) + 1;

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function tint(hex, amt) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
  return `rgb(${r},${g},${b})`;
}
function star(ctx, x, y, r, fill) {
  ctx.save(); ctx.translate(x, y); ctx.scale(0.8, 1);
  ctx.beginPath(); ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.16, -r * 0.16, r, 0);
  ctx.quadraticCurveTo(r * 0.16, r * 0.16, 0, r);
  ctx.quadraticCurveTo(-r * 0.16, r * 0.16, -r, 0);
  ctx.quadraticCurveTo(-r * 0.16, -r * 0.16, 0, -r);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
}
function svgImg(svg) {
  let s = String(svg);
  if (!/<svg[^>]*\swidth=/.test(s)) s = s.replace('<svg', '<svg width="400" height="400"');
  return loadImage(Buffer.from(s));
}

function bgAndPanel(ctx, color) {
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  let row = 0;
  for (let y = 0; y <= H + 92; y += 92, row++) {
    const off = (row % 2) ? 46 : 0;
    for (let x = off - 92; x <= W + 92; x += 92) { ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill(); }
  }
  rr(ctx, 40 + 14, 40 + 14, 1120, 550, 40); ctx.fillStyle = 'rgba(58,44,35,.85)'; ctx.fill();
  rr(ctx, 40, 40, 1120, 550, 40); ctx.fillStyle = CREAM; ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.save();
  rr(ctx, 62, 62, 1076, 506, 30); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(58,44,35,.5)';
  ctx.setLineDash([10, 9]); ctx.stroke(); ctx.restore();
  star(ctx, 92, 92, 13, tint(color, 0.3));
  star(ctx, 1108, 92, 13, tint(color, 0.3));
  star(ctx, 92, 538, 13, tint(color, 0.3));
  star(ctx, 1108, 538, 13, tint(color, 0.3));
}

function charWindow(ctx, cx, cy, R, color, img, charSize) {
  for (let i = 0; i < 20; i++) {
    const a = i * Math.PI * 2 / 20;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 22, 0, Math.PI * 2);
    ctx.fillStyle = tint(color, 0.75); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, R - 18, 0, Math.PI * 2); ctx.fillStyle = WHITE; ctx.fill();
  ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  ctx.drawImage(img, cx - charSize / 2, cy - charSize / 2, charSize, charSize);
}

function fitFont(ctx, text, start, min, maxW, weight) {
  let s = start;
  ctx.font = `${weight} ${s}px ${FONT}`;
  while (ctx.measureText(text).width > maxW && s > min) { s -= 3; ctx.font = `${weight} ${s}px ${FONT}`; }
  return s;
}

async function drawType(t) {
  const canvas = createCanvas(W, H); const ctx = canvas.getContext('2d');
  bgAndPanel(ctx, t.color);
  const img = await svgImg(t.svg);
  charWindow(ctx, 320, 315, 200, t.color, img, 330);

  const cx = 800; // 右ブロック中心
  ctx.textAlign = 'center';

  // バナー
  rr(ctx, cx - 215, 118, 430, 56, 28); ctx.fillStyle = INK; ctx.fill();
  ctx.fillStyle = CREAM; ctx.font = `700 24px ${FONT}`; ctx.textBaseline = 'middle';
  ctx.fillText('FLAVOR CHECK ☆フレーバー診断', cx, 147);

  ctx.fillStyle = INK; ctx.font = `700 26px ${FONT}`;
  ctx.fillText('あなたを“味”にたとえると', cx, 212);

  // タイプ名(マーカー帯付き)
  const ns = fitFont(ctx, t.name, 62, 30, 540, '700');
  const nw = ctx.measureText(t.name).width;
  rr(ctx, cx - nw / 2 - 16, 256 + ns * 0.32, nw + 32, ns * 0.42, 8);
  ctx.fillStyle = tint(t.color, 0.5); ctx.fill();
  ctx.fillStyle = INK; ctx.textBaseline = 'middle'; ctx.fillText(t.name, cx, 268);

  // キャッチ(ピル)
  ctx.font = `700 26px ${FONT}`;
  const cw = ctx.measureText(t.catch).width;
  rr(ctx, cx - cw / 2 - 24, 318, cw + 48, 50, 25); ctx.fillStyle = t.color; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillText(t.catch, cx, 344);

  // レア度
  ctx.fillStyle = INK; ctx.font = `700 28px ${FONT}`;
  ctx.fillText(`全国の ${t.rarity}% ・ 16味中レア度 ${rankOf(t.id)}位`, cx, 414);

  // 下段
  ctx.font = `700 32px ${FONT}`;
  ctx.fillText('あなたはなに味？ #フレーバー診断', cx, 478);
  ctx.fillStyle = 'rgba(58,44,35,.6)'; ctx.font = `700 24px ${FONT}`;
  ctx.fillText('flavor-shindan.pages.dev', cx, 522);

  return canvas;
}

async function drawDefault() {
  const color = '#f3aa3c';
  const canvas = createCanvas(W, H); const ctx = canvas.getContext('2d');
  bgAndPanel(ctx, color);
  // 4キャラ
  const ids = ['cheesehamburg', 'mabo', 'melonpan', 'hatsuyuki'];
  const imgs = await Promise.all(ids.map((id) => svgImg(TYPES[id].svg)));
  const xs = [300, 500, 700, 900];
  for (let i = 0; i < 4; i++) ctx.drawImage(imgs[i], xs[i] - 80, 150, 160, 160);

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  // バナー
  rr(ctx, 600 - 200, 96, 400, 52, 26); ctx.fillStyle = INK; ctx.fill();
  ctx.fillStyle = CREAM; ctx.font = `700 23px ${FONT}`;
  ctx.fillText('FLAVOR CHECK ☆全16味', 600, 122);

  // タイトル
  ctx.fillStyle = INK; ctx.font = `700 76px ${FONT}`;
  const tw = ctx.measureText('フレーバー診断').width;
  rr(ctx, 600 - tw / 2 - 18, 360, tw + 36, 34, 10); ctx.fillStyle = tint(color, 0.5); ctx.fill();
  ctx.fillStyle = INK; ctx.fillText('フレーバー診断', 600, 372);

  ctx.font = `700 34px ${FONT}`;
  ctx.fillText('あなたを“味”にたとえると？', 600, 440);

  ctx.font = `700 27px ${FONT}`;
  ctx.fillText('全20問 ・ 約2分 ・ 登録なし ・ #フレーバー診断', 600, 492);
  ctx.fillStyle = 'rgba(58,44,35,.6)'; ctx.font = `700 24px ${FONT}`;
  ctx.fillText('flavor-shindan.pages.dev', 600, 532);
  return canvas;
}

(async () => {
  const ogDir = path.join(__dirname, 'ogp');
  fs.mkdirSync(ogDir, { recursive: true });

  const def = await drawDefault();
  fs.writeFileSync(path.join(__dirname, 'ogp.png'), def.toBuffer('image/png'));

  let n = 0;
  for (const id of TYPE_ORDER) {
    const cv = await drawType(TYPES[id]);
    fs.writeFileSync(path.join(ogDir, id + '.png'), cv.toBuffer('image/png'));
    n++;
  }
  console.log(`OG画像生成完了: デフォルト1枚 + タイプ別${n}枚`);
})();
