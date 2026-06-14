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

## デプロイ後にやる小タスク

- [ ] **OGP画像 `ogp.png`(1200×630)をルートに置く** — `index.html` の `og:image`/`twitter:image` が `https://flavor-shindan.pages.dev/ogp.png` を参照済み。画像を用意するとX/LINEのシェアカードに大きく出る(未設置でも壊れはしない)
- [ ] **アセットのバージョンクエリ** — `index.html` の `css/style.css?v=2` などの `?v=` は更新時にキャッシュを確実に切るための番号。大きく変えたら数字を上げる(Cloudflareは基本自動でキャッシュを更新するので必須ではない)
- [ ] **Cloudflare Web Analytics**(Cookieレス・無料)を1行入れると、PV・完走率・シェアの効果が測れる(IMPROVEMENTS.md 抜け漏れチェック参照)

## トラブルシューティング

- **OGP画像が共有時に反映されない**: SNSのキャッシュ。XやLINEのカードプレビューは数時間〜1日かかることがあります
- **`?t=`リンクで結果ページが直接開かない**: localStorageが空のブラウザでも閲覧モードで開くようになっているので、もし不具合があればコンソールエラーを確認
- **保存ボタンが効かない**: スマホ実機ではWeb Share API、PCではダウンロード+モーダル表示。シークレットモードだとshare APIが制限されていることあり
