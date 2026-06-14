# デプロイ手順 — Cloudflare Pages

GitHubリポジトリ: <https://github.com/aasuka120/flavor-shindan>

## 1回だけやる初期設定(ここから)

### A. Cloudflareアカウント作成

1. <https://dash.cloudflare.com/sign-up> でアカウント作成(無料、メアドだけでOK)
2. ログインしてダッシュボードへ

### B. GitHub連携で Pages プロジェクトを作成

1. ダッシュボード左メニュー → **Compute (Workers)** → **Workers & Pages** を開く
2. **「Create」** ボタン → タブで **「Pages」** → **「Connect to Git」** を選択
3. **GitHub** を選んで認証 → 「aasuka120」アカウントを承認
4. リポジトリ選択画面で **`flavor-shindan`** を選ぶ
5. ビルド設定の画面が出るので、以下のとおり入力:

   | 項目 | 値 |
   |---|---|
   | Project name | `flavor-shindan`(自動で入る) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | (空欄でOK) |
   | Build output directory | `/`(または空欄) |

   ※このサイトはビルド不要の素のHTML/CSS/JSなので、ビルドコマンドは要りません。

6. **「Save and Deploy」** をクリック

### C. デプロイ完了 → URLが発行される

数十秒で初回ビルドが終わり、以下のような公開URLが発行されます:

```
https://flavor-shindan.pages.dev
```

これが本番URLです。

---

## 以降の運用

### コードを更新したとき

ローカルで編集 → 普通にgit push するだけ。Cloudflare Pagesが自動的に検知して再ビルド・再デプロイします(1〜2分)。

```powershell
git add .
git commit -m "fix: 質問8の文言を修正"
git push
```

### PRごとのプレビューURL

ブランチを切ってPRを作ると、PRごとに **プレビューURL** が自動発行されます(例: `https://abc123.flavor-shindan.pages.dev`)。本番に影響せず動作確認できます。

### 独自ドメインを後から付けたいとき

Cloudflare Pagesプロジェクトの「Custom domains」タブから追加できます。Cloudflareでドメインを買う(または既存ドメインをCloudflareに移管する)とDNS設定もワンクリックで完了します。

---

## ビルド(コンテンツを変えたら再生成)

タイプ別の静的ページ(共有プレビュー&SEO用)とOG画像は **生成物** です。`js/data.js` を編集したら再生成して再push:

```powershell
npm install        # 初回のみ(OG画像生成に @napi-rs/canvas を使う。devDependency)
npm run build       # /t/{id}/ の16ページ + sitemap.xml + robots.txt を再生成
npm run build:og    # /ogp.png + /ogp/{id}.png ×16 を再生成
# 両方まとめて: npm run build:all
```

生成される静的ファイル(コミット対象):
- `/t/{id}/index.html` ×16 … タイプ別の共有プレビュー&SEOページ(per-typeメタ + 静的本文 + CTA)
- `/ogp.png`, `/ogp/{id}.png` ×16 … OGP画像(1200×630)
- `/sitemap.xml`, `/robots.txt`, `/favicon.svg`

> 共有リンクは `/t/{id}/`(プレビューが出る経路)を指すようになっている。`/?t={id}` は従来どおりアプリ内のインタラクティブ結果。

## 計測(KPI)

1. **トラフィック(最優先・コード不要)**: Cloudflare ダッシュボード → **Web Analytics** で `flavor-shindan.pages.dev` を追加 → Pagesドメインに自動注入(Cookieレス・無料)。PV・流入元・FCPが取れる。手動で入れる場合は `index.html` のコメント内 beacon の token を差し替えて有効化。
2. **ファネルKPI(完走率・K係数)**: `functions/api/ev.js` が `start/finish/save/share/view` を受ける。**Analytics Engine** バインディングを有効化すると集計できる:
   - ダッシュボード Pages › Settings › Functions › Analytics Engine bindings に `FLAVOR_EV` = dataset `flavor_events` を追加
   - 完走率 = finish/start、保存率 = save/finish、K係数 ≈ (`/t/`流入のstart)/share
   - 未設定でも `/api/ev` は204を返すだけで無害(計測しないだけ)

## トラブルシューティング

## トラブルシューティング

- **OGP画像が共有時に反映されない**: SNSのキャッシュ。XやLINEのカードプレビューは数時間〜1日かかることがあります
- **`?t=`リンクで結果ページが直接開かない**: localStorageが空のブラウザでも閲覧モードで開くようになっているので、もし不具合があればコンソールエラーを確認
- **保存ボタンが効かない**: スマホ実機ではWeb Share API、PCではダウンロード+モーダル表示。シークレットモードだとshare APIが制限されていることあり
