/* =========================================================
   Cloudflare Pages Function: 計測ビーコン受け口
   GET /api/ev?e=start|finish|save|share|view&t={typeId}
   app.js の track() から navigator.sendBeacon で叩かれる。
   Cookieレス・匿名(個人情報は一切受け取らない)。

   集計のために Analytics Engine バインディングを使う。
   未設定でも 204 を返して握りつぶす(クライアントは黙って失敗扱い)。

   有効化するには Cloudflare ダッシュボード or wrangler で
   Analytics Engine バインディング名 "FLAVOR_EV" を Pages プロジェクトに追加:
     [[analytics_engine_datasets]]
     binding = "FLAVOR_EV"
     dataset = "flavor_events"
   ========================================================= */
const ALLOWED = { start: 1, finish: 1, save: 1, share: 1, view: 1 };

// navigator.sendBeacon は POST を送るため全メソッドを受ける(パラメータはクエリ文字列)
export function onRequest({ request, env }) {
  try {
    const url = new URL(request.url);
    const e = url.searchParams.get('e') || '';
    const t = (url.searchParams.get('t') || '').slice(0, 32);
    if (ALLOWED[e] && env && env.FLAVOR_EV) {
      env.FLAVOR_EV.writeDataPoint({
        blobs: [e, t],
        indexes: [e],
        doubles: [1],
      });
    }
  } catch (err) { /* 握りつぶす */ }
  // 204 No Content(計測は副作用なので本文不要)
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
