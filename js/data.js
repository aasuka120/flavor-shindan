/* =========================================================
   フレーバー診断 データ定義
   診断の追加・コピー修正はこのファイルだけでOK
   軸: 濃さ[C こってり/A あっさり] 温度[H ホット/I アイス]
       後味[S 甘口/P 辛口] 入手性[R 定番/L 限定]
   ========================================================= */

const AXES = [
  { key: '濃さ',   a: ['こってり', 'C'], b: ['あっさり', 'A'] },
  { key: '温度',   a: ['ホット', 'H'],   b: ['アイス', 'I'] },
  { key: '後味',   a: ['甘口', 'S'],     b: ['辛口', 'P'] },
  { key: '入手性', a: ['定番', 'R'],     b: ['限定', 'L'] },
];

/* 質問: 一人称の文に5段階(そう+2 〜 ちがう-2)で答える。
   dir はその文が肯定している側('a'=軸の前者 / 'b'=後者)。
   各軸5問(うち2問は逆方向)で軸ごとに-10〜+10点。
   軸が連続しないよう 0,1,2,3 の順で回している。 */
const QUESTIONS = [
  { axis: 0, dir: 'a', q: '「今から集まれる人〜！」の誘いには、ノリで行きがちだ' },
  { axis: 1, dir: 'a', q: 'うれしい気持ちや悲しい気持ちが、すぐ顔や声に出る' },
  { axis: 2, dir: 'a', q: '相談されたら、アドバイスより先に「わかる」と共感する' },
  { axis: 3, dir: 'a', q: '旅行は、行く場所と時間を決めてから出発したい' },
  { axis: 0, dir: 'b', q: '遊んだ次の日は、ひとりで回復する時間がほしい' },
  { axis: 1, dir: 'b', q: '落ち込んでいても、まわりにはあまり気づかれないほうだ' },
  { axis: 2, dir: 'b', q: '友だちの選択が微妙なときは、正直にそう言いたい' },
  { axis: 3, dir: 'b', q: 'その日の気分で予定を変えるのは、よくあることだ' },
  { axis: 0, dir: 'a', q: '初対面の人とでも、わりとすぐ仲良くなれる' },
  { axis: 1, dir: 'a', q: '映画やライブで感動すると、涙が出がちだ' },
  { axis: 2, dir: 'a', q: '場の空気が悪くならないように、つい合わせてしまう' },
  { axis: 3, dir: 'a', q: 'お店では「いつもの」を頼みがちだ' },
  { axis: 0, dir: 'a', q: 'グループにいるとき、自分はしゃべってる側だと思う' },
  { axis: 1, dir: 'b', q: '気持ちを伝えるなら、口で言うより文章のほうが得意だ' },
  { axis: 2, dir: 'b', q: '間違っていることは、相手が誰でも指摘したくなる' },
  { axis: 3, dir: 'b', q: '「限定」の文字を見ると、つい試したくなる' },
  { axis: 0, dir: 'b', q: '理想の休日は、家でのんびり過ごすことだ' },
  { axis: 1, dir: 'a', q: '「テンション高いね」と言われることがある' },
  { axis: 2, dir: 'a', q: '「優しいね」と言われることが多い' },
  { axis: 3, dir: 'a', q: '自分のテンションは、毎日わりと一定だ' },
];

const TYPE_ORDER = [
  'cheesehamburg','fondant','mabo','ramen',
  'parfait','vanilla','cacao','yaminabe',
  'shiomusubi','melonpan','udon','gingerale',
  'peachjelly','hatsuyuki','wasabi','flatcola',
];

const TYPES = {

  /* ---------- 1. とろけるチーズハンバーグ (CHSR) ---------- */
  cheesehamburg: {
    id: 'cheesehamburg', axes: 'CHSR',
    name: 'とろけるチーズハンバーグ', short: 'チーズハンバーグ',
    catch: '王道の愛されエース',
    color: '#f3aa3c', rarity: 9.6, emoji: '🥩🧀🔥',
    mbti: ['ESFJ', 'ENFJ'],
    stats: { ノリ: 88, やさしさ: 85, 毒: 15, 愛の重さ: 65, 気まぐれ: 25 },
    features: ['初対面3分で「もう友達」', '盛り上げ役、でも実は気配りの人', 'みんなの「とりあえず呼ぶ」枠'],
    desc: [
      '鉄板の人気者。出てくるだけで場があったまる、デミグラスソース級の包容力の持ち主。誰にでも分け隔てなく優しくて、気づいたらグループの真ん中にいる。本人は「真ん中に行こう」なんて思っていない。チーズのように、誰とでもとろけて馴染んでしまうだけ。',
      'ただし「みんなの人気者」ゆえに、ひとりの時間の確保がへた。全員に優しくして、全員に気を使って、たまに電池切れする日がある。あなたの優しさは、おかわり無料じゃなくていい。',
    ],
    manual: {
      like: 'ノリの良い相づち。「それな」の一言で喜ぶ',
      ng: '仲間はずれの空気。本人がいない場所の悪口がいちばん嫌い',
      charge: 'みんなでごはん。なんなら今夜',
      care: '落ち込むと逆に元気にふるまう。「無理してない？」の一言で溶ける',
    },
    aruaru: [
      '友達の誕生日を全員分覚えてる',
      '店員さんに「お似合いですよ」と言われると買う',
      'LINEの返信が秒',
      '幹事を任されがち、そして断れない',
      '「今度ごはん行こう」を社交辞令にしない',
    ],
    love: '好きになると尽くすし、わかりやすい。デートプランは王道（水族館→夜ごはん）をきっちり押さえてくる安心感がある。ただし「みんなに優しい」せいで、本命が「私って特別？」と不安になりがち。特別な人には、ちゃんと言葉で「特別」と言おう。',
    friend: 'グループの「接着剤」。あなたがいる日といない日で、会話量が体感1.5倍違う。「いつメン」の中心は、いつだってあなた。',
    bestId: 'gingerale',
    bestReason: 'こってりなあなたの隣で、シュワッと場を回す炭酸系。あなたが温め、相手がはじける。セットで頼みたくなる名コンビ。',
    worstId: 'parfait',
    worstRoast: '濃厚×濃厚、優しさ×重い愛。最初は最高、3日で胃もたれ。距離感を間違えるとお互い「いい人なのにしんどい」になる。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="163" rx="72" ry="14" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><ellipse cx="100" cy="118" rx="58" ry="40" fill="#9c6644" stroke="#3a2c23" stroke-width="5"/><path d="M46 110 Q100 64 154 110 L154 116 Q147 132 139 116 Q132 134 122 116 Q114 130 106 116 Q98 134 88 116 Q80 130 72 116 Q64 132 56 116 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><path d="M84 38 Q78 48 84 56" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round" opacity=".45"/><path d="M114 32 Q108 44 114 54" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round" opacity=".45"/><circle cx="84" cy="130" r="4.5" fill="#3a2c23"/><circle cx="116" cy="130" r="4.5" fill="#3a2c23"/><path d="M93 137 Q100 144 107 137" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="66" cy="139" r="7" fill="#f2a39b" opacity=".6"/><circle cx="134" cy="139" r="7" fill="#f2a39b" opacity=".6"/></svg>`,
  },

  /* ---------- 2. フォンダンショコラ (CHSL) ---------- */
  fondant: {
    id: 'fondant', axes: 'CHSL',
    name: 'フォンダンショコラ', short: 'フォンダンショコラ',
    catch: '感情だだ漏れロマンチスト',
    color: '#a9715d', rarity: 5.8, emoji: '🍫🍓🫠',
    mbti: ['ENFP', 'INFP'],
    stats: { ノリ: 75, やさしさ: 80, 毒: 10, 愛の重さ: 95, 気まぐれ: 70 },
    features: ['好きになったら一直線', '感情の沸点が低い（良くも悪くも）', '中身はいつでもあっつあつ'],
    desc: [
      '見た目は落ち着いたケーキ。でも割ったら中から、あっつあつの感情が流れ出す。喜怒哀楽が顔に出る、というか全身から出る。推しが尊くて泣くし、友達の幸せで自分が泣く。感受性のかたまり。',
      '気分の波はある。今日のあなたと昨日のあなたは、別の焼き上がり。でもその「揺れ」こそが魅力で、まわりはあなたの熱に巻き込まれたくて集まってくる。',
    ],
    manual: {
      like: '感情に同じ温度で乗ってくれること。「わかる!!」の圧は強いほど良い',
      ng: '正論で冷やされること。いま欲しいのは答えじゃなくて共感',
      charge: '泣ける映画、エモい音楽、夜のドライブ',
      care: '沸騰中は触らず見守る。冷めた頃に甘いものを差し入れると復活',
    },
    aruaru: [
      '映画の予告編で泣ける',
      '「テンション高いね」と週3で言われる',
      '推しの話になると早口',
      '衝動買いした服がクローゼットで眠ってる',
      '手紙やサプライズの計画が大好き',
    ],
    love: '恋に落ちるスピードは16タイプ中ぶっちぎりの1位。「気づいたら好きだった」ではなく「出会った瞬間に好きだった」。愛情表現は惜しまないけれど、相手の温度が自分より低いと一気に不安になる。温度差にだけ注意。',
    friend: 'ムードメーカー兼、グループの「感情担当」。みんなが言葉にできない気持ちを、あなたが先に泣いて表現してくれる。',
    bestId: 'udon',
    bestReason: '穏やかな出汁があなたの熱を受け止めて、たまにピリッと正気に戻してくれる。甘×辛の完璧なマリアージュ。',
    worstId: 'vanilla',
    worstRoast: '甘い×甘い×夜のテンション。盛り上がりは最高だが、お互い感情のカロリーが高すぎて共倒れする。会うのは月1がちょうどいい。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="164" rx="62" ry="12" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><rect x="62" y="84" width="76" height="70" rx="12" fill="#6b4632" stroke="#3a2c23" stroke-width="5"/><path d="M62 98 Q100 76 138 98 L138 104 Q132 120 124 104 Q117 122 108 104 Q100 120 92 104 Q84 122 76 104 Q70 116 62 104 Z" fill="#46291c" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><circle cx="100" cy="66" r="13" fill="#e0533d" stroke="#3a2c23" stroke-width="5"/><path d="M100 53 Q104 46 112 48" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="95" cy="63" r="1.8" fill="#fffdf6"/><circle cx="104" cy="69" r="1.8" fill="#fffdf6"/><path d="M152 64 q6 -8 12 0 q-6 8 -12 0 M158 60 v8" fill="#f2a39b" stroke="none"/><circle cx="156" cy="68" r="6" fill="#f2a39b"/><circle cx="84" cy="126" r="4.5" fill="#3a2c23"/><circle cx="116" cy="126" r="4.5" fill="#3a2c23"/><path d="M92 134 Q100 142 108 134" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="136" r="7" fill="#f2a39b" opacity=".6"/><circle cx="130" cy="136" r="7" fill="#f2a39b" opacity=".6"/></svg>`,
  },

  /* ---------- 3. 激辛麻婆豆腐 (CHPR) ---------- */
  mabo: {
    id: 'mabo', axes: 'CHPR',
    name: '激辛麻婆豆腐', short: '麻婆豆腐',
    catch: '熱くて辛い、姉御・兄貴',
    color: '#d34d39', rarity: 7.1, emoji: '🌶️🥵❤️‍🔥',
    mbti: ['ESTJ', 'ENTJ'],
    stats: { ノリ: 90, やさしさ: 70, 毒: 75, 愛の重さ: 70, 気まぐれ: 30 },
    features: ['口は悪いが面倒見は16タイプNo.1', '曲がったことが許せない', '実は涙もろい（隠してる）'],
    desc: [
      '辛い。熱い。でも、旨い。それがあなた。思ったことははっきり言うし、ダメなものはダメと言う。最初は「ちょっと怖い人？」と思われがちだけど、付き合えば付き合うほど旨味が出てくる山椒系。',
      '仲間が理不尽な目にあうと、自分のことより怒る。「私が言ってくる」と立ち上がるのはいつもあなた。辛さの中の豆腐のように、芯はやわらかくて熱い。',
    ],
    manual: {
      like: 'ストレートな会話。回りくどい前置きは不要',
      ng: '陰でコソコソ。本人に言わない不満がいちばん嫌い',
      charge: 'サウナ、激辛、筋トレ。汗と一緒にストレスを流す',
      care: '怒ってるときは大体、誰かのために怒ってる。まず話を全部聞いて',
    },
    aruaru: [
      '「はっきり言うね」のあとに本当にはっきり言う',
      '後輩にごはんをおごりがち',
      '涙腺は実はゆるい（全力で隠す）',
      '行列に並ぶくらいなら別の店に行く',
      '「怒ってる？」「怒ってる」と即答できる',
    ],
    love: '好きな人ほど雑にいじってしまう、小学生システムを搭載。でも一度付き合えば一途で、守りの強さは全タイプ随一。「私が／俺がなんとかする」が口癖になる。素直な「好き」が言えたら無敵。',
    friend: 'グループの用心棒兼ツッコミ。あなたの「それはちがう」が、グループの空気を何度も救ってる。',
    bestId: 'melonpan',
    bestReason: 'あなたの辛さを、ふわっと甘く中和してくれる存在。向こうはあなたの「はっきり」に守られてる。激辛×甘パン、意外すぎて最強。',
    worstId: 'cacao',
    worstRoast: '辛い×苦い、正論×正論。どっちも「自分が正しい」を譲らないので議論が終わらない。旨味で和解しろ。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M40 112 Q40 162 100 162 Q160 162 160 112 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><ellipse cx="100" cy="108" rx="62" ry="17" fill="#b03a2a" stroke="#3a2c23" stroke-width="5"/><rect x="68" y="99" width="15" height="11" rx="3" fill="#fffdf6" stroke="#3a2c23" stroke-width="3" transform="rotate(-8 75 104)"/><rect x="104" y="101" width="15" height="11" rx="3" fill="#fffdf6" stroke="#3a2c23" stroke-width="3" transform="rotate(6 111 106)"/><rect x="124" y="96" width="13" height="10" rx="3" fill="#fffdf6" stroke="#3a2c23" stroke-width="3" transform="rotate(-10 130 101)"/><path d="M96 86 Q92 74 102 70 Q112 67 116 76 Q118 84 108 88" fill="#d34d39" stroke="#3a2c23" stroke-width="4" stroke-linejoin="round"/><path d="M101 69 Q103 62 110 61" fill="none" stroke="#5f7d54" stroke-width="4" stroke-linecap="round"/><path d="M64 56 Q58 66 64 74" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round" opacity=".4"/><path d="M140 52 Q134 62 140 70" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round" opacity=".4"/><path d="M74 128 L90 134" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><path d="M126 128 L110 134" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="84" cy="142" r="4.5" fill="#3a2c23"/><circle cx="116" cy="142" r="4.5" fill="#3a2c23"/><path d="M93 150 Q100 155 107 150" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/></svg>`,
  },

  /* ---------- 4. 爆盛り限定ラーメン (CHPL) ---------- */
  ramen: {
    id: 'ramen', axes: 'CHPL',
    name: '爆盛り限定ラーメン', short: '爆盛りラーメン',
    catch: '瞬間最大風速の祭り型',
    color: '#ef7d2f', rarity: 5.1, emoji: '🍜🔥🎆',
    mbti: ['ESTP', 'ESFP'],
    stats: { ノリ: 98, やさしさ: 65, 毒: 60, 愛の重さ: 55, 気まぐれ: 90 },
    features: ['テンションの出力が常に全開', '「今が一番楽しい」を毎日更新', '燃え尽きるのも早い'],
    desc: [
      '行列のできる限定ラーメン。あなたが現れると、その場が「イベント」になる。ノリと勢いと声量で場を支配して、思いついたら即行動。「今から海行かない？」の発信源は、だいたいあなた。',
      'ただしスープは煮詰まりやすい。全力で楽しんだ次の日、突然電源が落ちる。それでいい。限定営業だからこそ、並ぶ価値がある。',
    ],
    manual: {
      like: 'ノリの即レス。「いいね、やろう」の5文字',
      ng: '「それ意味ある？」系の冷却水。火が消える',
      charge: '新しい場所、新しい人、新しい味。刺激が主食',
      care: '急に静かになったら燃え尽きサイン。そっと好物を与えて寝かせる',
    },
    aruaru: [
      '「限定」の文字に勝てない',
      'グループ通話の主催者になりがち',
      '財布より思い出にお金を使う',
      '計画を立てるが、当日に別の計画を思いつく',
      '楽しすぎた日の夜、急に寂しくなる',
    ],
    love: '恋もアトラクション。猛アタックで距離を詰める瞬発力は誰にも負けない。ただ、安定期に入ると「俺たち、マンネリ？」と勝手に不安になる。恋の楽しさは打ち上げ花火だけじゃなくて、毎日の出汁にもあると知れたら最強。',
    friend: 'イベント製造機。あなたの「思いつき」が、グループの一生モノの思い出を量産してる。アルバムの中心、だいたいあなた。',
    bestId: 'shiomusubi',
    bestReason: '爆盛りラーメンに塩むすび。これ以上の組み合わせがあるか？あなたの暴走を、急かさず受け止める最高の付け合わせ。',
    worstId: 'yaminabe',
    worstRoast: 'カオス×カオス。楽しいのは確定だが、誰も全体を把握していないので、気づいたら知らない街にいる。保護者必須。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M36 116 Q36 166 100 166 Q164 166 164 116 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><path d="M48 116 Q46 72 100 66 Q154 72 152 116 Z" fill="#f7e2b4" stroke="#3a2c23" stroke-width="5"/><path d="M70 78 Q74 96 68 112 M100 70 Q104 92 98 112 M130 78 Q126 96 132 112" fill="none" stroke="#d9b97c" stroke-width="4" stroke-linecap="round"/><path d="M100 18 Q88 34 94 44 Q86 40 84 50 Q84 64 100 66 Q116 64 116 50 Q114 40 106 44 Q112 34 100 18 Z" fill="#ef7d2f" stroke="#3a2c23" stroke-width="4.5" stroke-linejoin="round"/><path d="M100 44 Q94 52 100 60 Q106 52 100 44 Z" fill="#ffd24d"/><path d="M150 28 L122 84 M158 34 L130 88" stroke="#9c6644" stroke-width="5" stroke-linecap="round"/><circle cx="84" cy="134" r="4.5" fill="#3a2c23"/><circle cx="116" cy="134" r="4.5" fill="#3a2c23"/><path d="M90 142 Q100 152 110 142 Z" fill="#3a2c23"/><circle cx="68" cy="142" r="7" fill="#f2a39b" opacity=".6"/><circle cx="132" cy="142" r="7" fill="#f2a39b" opacity=".6"/></svg>`,
  },

  /* ---------- 5. 生クリームマシマシパフェ (CISR) ---------- */
  parfait: {
    id: 'parfait', axes: 'CISR',
    name: '生クリームマシマシパフェ', short: 'マシマシパフェ',
    catch: 'もの静かな愛の重量級',
    color: '#f49ab5', rarity: 6.9, emoji: '🍨🍓🎀',
    mbti: ['ISFJ', 'INFJ'],
    stats: { ノリ: 40, やさしさ: 90, 毒: 10, 愛の重さ: 98, 気まぐれ: 25 },
    features: ['口数は少ないが愛は多い', '「推す」と決めたら一生', '尽くしすぎ注意報、発令中'],
    desc: [
      '見た目は静かで上品なパフェ。でも層をスプーンで掘っていくと、生クリーム、アイス、ホイップ、また生クリーム……愛が、重い。大事な人への愛情の総量が、16タイプ中トップクラス。',
      '表に出すのが得意じゃないだけで、内側の感情は常に満タン。「別に」と言いながら、相手の好きな飲み物を覚えているタイプ。その重さは、正しい相手に出せば「一生の安心感」になる。',
    ],
    manual: {
      like: '小さいことを覚えていてくれること。「前これ好きって言ってたよね」で陥落',
      ng: '雑に扱われること。既読無視3日で静かに凍る',
      charge: 'ひとりでカフェ。甘いもの。推しの供給',
      care: '「重いかな」と不安になってる時に、重さごと受け止めると一生ついてくる',
    },
    aruaru: [
      '友達の好みを本人より把握してる',
      'プレゼント選びに3週間かける',
      '「気にしないで」と言いつつ全部気にしてる',
      '推しのグッズは祭壇方式で飾る',
      '愛情表現がモノに変換される（差し入れ職人）',
    ],
    love: '一途オブ一途。浮気の概念がインストールされていない。ただし愛情を「気づいてもらう」スタイルなので、鈍感な相手だと永遠に伝わらない。たまにはスプーンを置いて、言葉で「好き」と言ってみて。',
    friend: 'グループの「お母さん」枠。目立たないけれど、あなたが抜けると全員が栄養失調になる。差し入れと気遣いの供給源。',
    bestId: 'flatcola',
    bestReason: '省エネな相手が、あなたの重さを「ふーん、いいじゃん」と平然と受け止める。あなたは安心して、相手は満たされる。実は黄金比。',
    worstId: 'cheesehamburg',
    worstRoast: '相手はみんなに優しい。あなたはひとりに深く優しい。「私だけじゃないんだ」が積もると、甘いはずの2人が一番しんどくなる。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M64 80 L136 80 L121 134 Q100 142 79 134 Z" fill="#f7c9d4" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><path d="M72 98 Q100 106 128 98" fill="none" stroke="#fffdf6" stroke-width="7" stroke-linecap="round"/><rect x="95" y="140" width="10" height="14" fill="#fffdf6" stroke="#3a2c23" stroke-width="4"/><ellipse cx="100" cy="160" rx="30" ry="7" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><path d="M70 80 Q74 58 88 64 Q92 46 104 54 Q114 40 119 58 Q133 56 130 80 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><circle cx="106" cy="36" r="9" fill="#e0533d" stroke="#3a2c23" stroke-width="4"/><path d="M106 27 Q109 20 115 19" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><path d="M52 52 q5 -7 10 0 q-5 7 -10 0" fill="#f2a39b"/><path d="M146 96 q5 -7 10 0 q-5 7 -10 0" fill="#f2a39b"/><circle cx="86" cy="106" r="4.5" fill="#3a2c23"/><circle cx="114" cy="106" r="4.5" fill="#3a2c23"/><path d="M95 114 Q100 118 105 114" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="74" cy="114" r="6.5" fill="#f2a39b" opacity=".6"/><circle cx="126" cy="114" r="6.5" fill="#f2a39b" opacity=".6"/></svg>`,
  },

  /* ---------- 6. 夜中のバニラアイス (CISL) ---------- */
  vanilla: {
    id: 'vanilla', axes: 'CISL',
    name: '夜中のバニラアイス', short: '夜中のバニラ',
    catch: '背徳系の癒し枠',
    color: '#3c4d7d', rarity: 7.0, emoji: '🍦🌙⭐',
    mbti: ['INFP', 'ISFP'],
    stats: { ノリ: 35, やさしさ: 85, 毒: 25, 愛の重さ: 80, 気まぐれ: 65 },
    features: ['昼と夜で人格が違う', '聞き上手で、秘密の金庫', '「今日だけだよ」が口癖'],
    desc: [
      '昼間は冷凍庫でクール。でも夜になると、フタが開く。深夜2時、あなたに相談のLINEが集まるのは、あなたが「夜の包容力」を持っているから。否定しない、説教しない、ただ甘く溶ける。',
      '自分のことを話すのは苦手で、人の話を聞く側に回りがち。でもあなたの中にも、溶けかけの感情が溜まってる。たまには誰かのスプーンに掬われていい。',
    ],
    manual: {
      like: '夜の長電話と、オチのない話を歓迎してくれる人',
      ng: '朝のテンションを求められること。午前中は冷凍されてる',
      charge: '夜ふかし、こたつ、罪の味のするおやつ',
      care: '「大丈夫」は大丈夫じゃないの意。夜にあったかい飲み物を',
    },
    aruaru: [
      '深夜のコンビニが好き',
      '「もう寝る」と言ってから2時間起きてる',
      '相談されるけど、自分からは相談しない',
      '昼のテンション高い集まりで静かに消耗する',
      '夜中に思い出して恥ずかしくなる記憶のストックが多い',
    ],
    love: '恋愛もスロー解凍。仲良くなるまでが長いけれど、溶けたら全部甘い。夜の長電話で恋に落ちるタイプ。相手に求めるのは刺激より「安心して黙れる関係」。沈黙が気まずくない人が、運命の人。',
    friend: 'グループの「保健室」。表のイベントには遅刻するが、誰かが病んだ夜には一番に駆けつける。',
    bestId: 'wasabi',
    bestReason: 'バニラに醤油は、通の組み合わせ。静かな毒舌があなたの「いい人疲れ」を笑いに変えてくれる。夜の2人の会話、永遠に終わらない。',
    worstId: 'fondant',
    worstRoast: '向こうは沸点が低く、あなたは融点が低い。甘×甘で居心地は最高だが、甘やかし合って2人とも夜型が悪化する。健康に注意。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M62 110 L138 110 L132 156 Q100 164 68 156 Z" fill="#3c4d7d" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><path d="M78 110 Q72 92 90 92 Q80 70 100 70 Q120 70 110 92 Q128 92 122 110 Z" fill="#fdf3dd" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><path d="M150 26 A19 19 0 1 0 169 56 A15 15 0 1 1 150 26 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="4" stroke-linejoin="round"/><path d="M44 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="3"/><path d="M84 96 Q88 100 92 96" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><path d="M108 96 Q112 100 116 96" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="103" r="2.5" fill="#3a2c23"/><circle cx="78" cy="103" r="6.5" fill="#f2a39b" opacity=".6"/><circle cx="122" cy="103" r="6.5" fill="#f2a39b" opacity=".6"/><circle cx="80" cy="132" r="2.5" fill="#fdf3dd"/><circle cx="100" cy="140" r="2.5" fill="#fdf3dd"/><circle cx="120" cy="130" r="2.5" fill="#fdf3dd"/></svg>`,
  },

  /* ---------- 7. カカオ95%チョコ (CIPR) ---------- */
  cacao: {
    id: 'cacao', axes: 'CIPR',
    name: 'カカオ95%チョコ', short: 'カカオ95%',
    catch: '孤高のビター職人',
    color: '#5c4338', rarity: 6.3, emoji: '🍫🖤☕',
    mbti: ['INTJ', 'ISTJ'],
    stats: { ノリ: 25, やさしさ: 55, 毒: 80, 愛の重さ: 60, 気まぐれ: 20 },
    features: ['甘くない、媚びない、ブレない', 'こだわりの濃度が95%', '分かる人にだけ、刺さる'],
    desc: [
      '大衆向けに甘くするつもりは、一切ない。自分の基準、自分の美学、自分のペース。流行りに乗らないんじゃなく、興味の対象が「自分の好きな世界」に固定されている。',
      '口数は少なく、たまに出る一言が辛口。でもその一言の精度が高いので、まわりは結構メモってる。雑に生きてるようで、好きな分野への集中力と継続力は全タイプ最強。職人。',
    ],
    manual: {
      like: '中身のある会話。浅い雑談より深い議論',
      ng: '「ノリ悪いね」という雑な評価。ノリの基準が違うだけ',
      charge: 'ひとりの作業時間。誰にも口出しされない聖域',
      care: '悩んでも顔に出ない。1対1で「最近どう？」と聞くと、ぽつぽつ話す',
    },
    aruaru: [
      '好きなものを聞かれると説明が長い',
      '「初心者向け」を飛ばして「上級者向け」から入る',
      '群れない。でも孤独ではない',
      '妥協で買い物ができない',
      '褒められると「いや、まだまだ」と返す（本心）',
    ],
    love: '恋愛の優先度は普段低め。でも一度「この人は本物」と認定すると、静かに深く、長い。記念日より「毎日同じ温度でいられること」を重視する。相手の表面より、中身を95%見ている。',
    friend: 'グループの「鑑定士」。あなたの「これは良い」「それは微妙」が、みんなの判断基準になってる。信頼のビター。',
    bestId: 'hatsuyuki',
    bestReason: '滅多に心を開かない者同士、開いた時の結合力は最強。静かな2人の間にだけ流れる、誰にも見えない会話がある。',
    worstId: 'mabo',
    worstRoast: '苦い×辛い。お互いプライドの濃度が高く、「正しさ」の戦争が勃発する。どちらかが甘味を持参しない限り、休戦できない。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="58" y="56" width="84" height="106" rx="10" fill="#4a332b" stroke="#3a2c23" stroke-width="5"/><path d="M86 56 V128 M114 56 V128" stroke="#5f4639" stroke-width="4"/><path d="M58 94 H142" stroke="#5f4639" stroke-width="4"/><rect x="54" y="128" width="92" height="36" rx="9" fill="#c9bfb4" stroke="#3a2c23" stroke-width="5"/><rect x="86" y="138" width="28" height="16" rx="4" fill="#d04f2e" stroke="#3a2c23" stroke-width="3.5"/><path d="M156 44 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="2.5"/><path d="M70 70 L84 74 M130 70 L116 74" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="78" cy="84" r="4.5" fill="#3a2c23"/><circle cx="122" cy="84" r="4.5" fill="#3a2c23"/><path d="M93 100 H107" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/></svg>`,
  },

  /* ---------- 8. 闇鍋 (CIPL) ---------- */
  yaminabe: {
    id: 'yaminabe', axes: 'CIPL',
    name: '闇鍋', short: '闇鍋',
    catch: '予測不能のミステリアス',
    color: '#5d4a7e', rarity: 3.1, emoji: '🍲🌑❓',
    mbti: ['INTP', 'INFJ'],
    stats: { ノリ: 45, やさしさ: 60, 毒: 70, 愛の重さ: 65, 気まぐれ: 95 },
    features: ['何を考えてるか分からない（本人も）', '引き出しの数が異常', '実は具だくさんの愛'],
    desc: [
      'フタを開けるまで中身が分からない。今日のあなたと明日のあなたは、別の鍋。趣味の幅が広く、知識の出どころが謎で、「なんでそれ知ってるの？」と週1で言われる。',
      'ミステリアスと言われるけれど、隠してるわけじゃなく、出すタイミングを見てるだけ。フタの下では常にぐつぐつ何かが煮えていて、それが天才的なアイデアになる日も、ただの闇のままの日もある。',
    ],
    manual: {
      like: '予定のない日。「何が出てくるか」を楽しんでくれる人',
      ng: '「あなたって〇〇な人だよね」と決めつけられること。心のフタが閉まる',
      charge: 'ひとり旅、深夜の検索の旅、誰も知らない趣味',
      care: '沈んでる時は深く潜ってるだけ。無理に引き上げず、浮上を待つ',
    },
    aruaru: [
      '検索履歴が世界一カオス',
      '「変わってるね」が褒め言葉',
      '集合写真でどこにいるか分からない',
      '急に連絡が取れなくなる期間がある',
      '持ち物の入手経路が謎',
    ],
    love: '恋愛もフタを開けるまで分からない。落ちる相手は、だいたい周囲の予想外。束縛されると蒸発するが、自由にさせてくれる相手にはとことん深い。「全部は分からないけど、おもしろいから一緒にいる」と言ってくれる人が正解。',
    friend: 'グループの「ジョーカー」。普段は静かなのに、ここぞの場面で謎の特技と人脈を出してきて全員を救う。',
    bestId: 'peachjelly',
    bestReason: '透明なゼリーは、闇鍋の中身を怖がらずに「何それ、見せて」と覗いてくる唯一の存在。あなたの闇が、相手の透明で少し透ける。',
    worstId: 'ramen',
    worstRoast: '闇鍋に爆盛り。エンタメ性は宇宙一だが、2人とも舵を取らないので帰る家を見失う。旅程表を作れる第三者を1名追加してください。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M44 98 Q40 158 100 160 Q160 158 156 98 Z" fill="#41355c" stroke="#3a2c23" stroke-width="5"/><ellipse cx="100" cy="98" rx="58" ry="12" fill="#2e2542" stroke="#3a2c23" stroke-width="5"/><g transform="rotate(-7 98 76)"><ellipse cx="98" cy="76" rx="50" ry="13" fill="#5d4a7e" stroke="#3a2c23" stroke-width="5"/><circle cx="98" cy="62" r="8" fill="#5d4a7e" stroke="#3a2c23" stroke-width="5"/></g><ellipse cx="40" cy="112" rx="9" ry="6" fill="#41355c" stroke="#3a2c23" stroke-width="4"/><ellipse cx="160" cy="112" rx="9" ry="6" fill="#41355c" stroke="#3a2c23" stroke-width="4"/><path d="M134 46 Q140 36 150 40 Q158 44 152 52" fill="none" stroke="#8d7ab5" stroke-width="4.5" stroke-linecap="round"/><circle cx="152" cy="60" r="2.5" fill="#8d7ab5"/><path d="M48 40 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="2.5"/><circle cx="80" cy="122" r="4.5" fill="#fdf3dd"/><circle cx="120" cy="122" r="4.5" fill="#fdf3dd"/><path d="M92 136 Q102 142 110 134" fill="none" stroke="#fdf3dd" stroke-width="4" stroke-linecap="round"/></svg>`,
  },

  /* ---------- 9. 握りたて塩むすび (AHSR) ---------- */
  shiomusubi: {
    id: 'shiomusubi', axes: 'AHSR',
    name: '握りたて塩むすび', short: '塩むすび',
    catch: '実家のような安心感',
    color: '#86b287', rarity: 9.2, emoji: '🍙🤍🌿',
    mbti: ['ISFJ', 'ESFJ'],
    stats: { ノリ: 55, やさしさ: 95, 毒: 10, 愛の重さ: 50, 気まぐれ: 15 },
    features: ['そばにいるだけで安心される', 'シンプルだけど、替えがきかない', 'みんなの心の non-stop 供給源'],
    desc: [
      '派手な具はない。でも、結局みんな、あなたのところに帰ってくる。話を聞いて、否定しないで、「大丈夫だよ」とちょうどいい塩加減で握ってくれる。あなたの安心感は当たり前すぎて気づかれにくいけれど、いなくなった瞬間に全員が気づく。',
      '自己主張は控えめで「なんでもいいよ」が口癖。でもそれは無関心じゃなくて、「あなたが嬉しいのが嬉しい」という愛のかたち。お米と同じ、毎日でも飽きない人。',
    ],
    manual: {
      like: '「ありがとう」をちゃんと言葉にされること。それだけで3日がんばれる',
      ng: '優しさを「都合のいい人」として消費されること',
      charge: 'いつもの友達、いつもの店、いつもの帰り道',
      care: '不調を絶対に言わない。声のトーン（米の硬さ）で察してあげて',
    },
    aruaru: [
      '「なんでもいいよ」（本当になんでもいい）',
      '相談員としての稼働率が高い',
      '古い友達が、ずっと友達',
      '流行には1年遅れで乗る。そして長く使う',
      '「優しいね」と言われ慣れてるが、毎回ちょっと嬉しい',
    ],
    love: '劇的な恋より、隣にいる恋。気づいたら好きになっていて、気づいたら長く付き合っている。刺激は少なめだけど、あなたとの恋は「実家の安心感」と「お米の飽きなさ」を兼ね備えた、無敵の日常になる。',
    friend: 'グループの「ホーム」。遊びの内容より「あなたが来るかどうか」で参加を決めてる人、実は多い。',
    bestId: 'ramen',
    bestReason: 'ラーメンに塩むすび、完全食。相手の暴走をあなたが受け止め、あなたの日常を相手が祭りに変える。お互いに、無いものしか持ってない。',
    worstId: 'peachjelly',
    worstRoast: '優しい×優しい。「どこ行く？」「どこでもいいよ」「私も」の無限ループで、集合から3時間、まだ駅にいる。決定権を外注しろ。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 44 Q146 100 142 132 Q128 154 100 154 Q72 154 58 132 Q54 100 100 44 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><rect x="80" y="118" width="40" height="36" rx="7" fill="#3b4a3a" stroke="#3a2c23" stroke-width="5"/><path d="M56 62 l4 4 -4 4 -4 -4 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="2.5"/><path d="M148 76 l4 4 -4 4 -4 -4 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="2.5"/><path d="M152 48 l3 3 -3 3 -3 -3 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="2.5"/><circle cx="84" cy="96" r="4.5" fill="#3a2c23"/><circle cx="116" cy="96" r="4.5" fill="#3a2c23"/><path d="M93 104 Q100 110 107 104" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="106" r="7" fill="#f2a39b" opacity=".6"/><circle cx="130" cy="106" r="7" fill="#f2a39b" opacity=".6"/></svg>`,
  },

  /* ---------- 10. 焼きたてメロンパン (AHSL) ---------- */
  melonpan: {
    id: 'melonpan', axes: 'AHSL',
    name: '焼きたてメロンパン', short: 'メロンパン',
    catch: '気まぐれ天使',
    color: '#e6bb5e', rarity: 7.8, emoji: '🍈🥐✨',
    mbti: ['ENFP', 'ESFP'],
    stats: { ノリ: 70, やさしさ: 90, 毒: 15, 愛の重さ: 45, 気まぐれ: 85 },
    features: ['現れるだけで場が甘くなる', '気分屋。でも憎めない', '「焼きたて」の時の多幸感は無敵'],
    desc: [
      'ふわっと現れて、みんなを幸せにして、ふわっといなくなる。あなたの機嫌がいい日は、周囲の幸福度が体感1.3倍になる。天性の愛されオーラ。',
      'ただし焼きたて時間は有限。気分の鮮度で生きているので、ノっている時とそうでない時の差が激しい。ドタキャンの常習犯でも、なぜか誰も本気で怒れない。それがメロンパンの徳。',
    ],
    manual: {
      like: '気分の波ごと楽しんでくれること。「今日はどっちのメロンパン？」',
      ng: '気分が乗らない日に、無理やり外に連れ出されること',
      charge: '天気のいい日の散歩、かわいいカフェ、新作スイーツ',
      care: 'しょんぼりしてる時は理由を聞くより、おいしいものの画像を送る',
    },
    aruaru: [
      '「行けたら行く」（行かない）',
      '機嫌がいい日は鼻歌が出る',
      'かわいいものセンサーが高感度',
      '写真フォルダの中身が空と食べ物',
      '謝るのが上手で、許され力が高い',
    ],
    love: '恋の入り口は直感。「なんかいい匂いがする人」を見抜く嗅覚がある。付き合うと甘えん坊全開だけど、束縛されると焦げる。「会いたい時に会える」ゆるい距離感を許してくれる人と、いちばん長く焼きたてでいられる。',
    friend: 'グループの「癒し兼マスコット」。あなたの「ねえ見てこれ」から始まる雑談が、みんなの平和の象徴。',
    bestId: 'mabo',
    bestReason: '辛い相手があなたの甘さで丸くなり、あなたは相手の「はっきり」に守られる。甘×辛、足して2で割って完璧。',
    worstId: 'hatsuyuki',
    worstRoast: '気まぐれ×レア出現。お互い「会いたい時に会えない」を引き当て続け、予定が合うのは年2回。文通から始めよう。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="108" r="58" fill="#e6bb5e" stroke="#3a2c23" stroke-width="5"/><path d="M58 88 L118 54 M66 120 L146 72 M88 148 L154 104 M82 54 L148 112 M58 88 L132 152 M54 118 L94 156" stroke="#c89a3f" stroke-width="4.5" stroke-linecap="round"/><path d="M70 30 Q64 40 70 48" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round" opacity=".4"/><path d="M130 26 Q124 36 130 44" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round" opacity=".4"/><circle cx="84" cy="112" r="4.5" fill="#3a2c23"/><circle cx="116" cy="112" r="4.5" fill="#3a2c23"/><path d="M92 120 Q100 128 108 120" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="122" r="7" fill="#f2a39b" opacity=".65"/><circle cx="130" cy="122" r="7" fill="#f2a39b" opacity=".65"/></svg>`,
  },

  /* ---------- 11. 七味マシマシうどん (AHPR) ---------- */
  udon: {
    id: 'udon', axes: 'AHPR',
    name: '七味マシマシうどん', short: '七味うどん',
    catch: '穏やかな正論スナイパー',
    color: '#b98d52', rarity: 6.6, emoji: '🍜🌶️😌',
    mbti: ['ISTJ', 'ESTJ'],
    stats: { ノリ: 50, やさしさ: 80, 毒: 60, 愛の重さ: 45, 気まぐれ: 20 },
    features: ['基本は出汁のように穏やか', 'たまに七味（正論）が効く', '実務能力が地味に高い'],
    desc: [
      '普段は温厚で、聞き上手で、争いを好まない出汁ベースの人格。でも、ここぞという場面で振られる七味——「それ、本人に言った？」——が、的確すぎて場が静まる。',
      'あなたの辛さは攻撃じゃなくて調味料。関係の味を引き締めるために、必要な時だけ振る。この采配センスのおかげで、あなたの周りの人間関係は妙に健全。',
    ],
    manual: {
      like: '筋の通った話と、ちゃんとしたお礼',
      ng: '感情論のゴリ押し。出汁が濁る',
      charge: '規則正しい生活、湯船、整った部屋',
      care: 'キャパオーバーでも顔に出さず受けてしまう。頼みごとを物理的に減らして',
    },
    aruaru: [
      '「常識的に考えて」が脳内口癖',
      '友達の書類・手続き系の相談役',
      '怒りの沸点は高い。でも超えた時は静かに怖い',
      '部屋がきれい',
      '「ちゃんとしてるね」と言われるが、本人は普通のつもり',
    ],
    love: '安定感のある大人の恋愛をする。サプライズより「ゴミ出しを当たり前にやる」タイプの愛情表現。たまの七味（拗ね）が分かりにくいので、相手に「不満は言葉で言って」と頼まれがち。言っていい。むしろ言って。',
    friend: 'グループの「良心」兼「書記」。ノリで暴走する議題に「で、予算は？」と現実を持ち込む、必要不可欠な存在。',
    bestId: 'fondant',
    bestReason: '感情の洪水を出汁が受け止め、熱を上品な旨味に変える。相手はあなたの正論で我に返り、あなたは相手の熱で人生の彩度が上がる。',
    worstId: 'wasabi',
    worstRoast: '辛口×辛口の和風対決。お互い「正しさ」の精度で勝負するため、議論は高度だが誰も折れない。気づけば2人で第三者の人生にダメ出しして夜が明ける。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M38 112 Q38 162 100 162 Q162 162 162 112 Z" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><rect x="80" y="160" width="40" height="8" rx="3" fill="#9c6644" stroke="#3a2c23" stroke-width="4"/><path d="M44 112 Q48 92 60 100 Q66 86 78 96 Q86 84 96 94 Q106 84 116 94 Q124 86 134 98 Q146 90 156 112 Z" fill="#f7e9c8" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><circle cx="124" cy="84" r="12" fill="#fffdf6" stroke="#3a2c23" stroke-width="4.5"/><path d="M124 78 Q130 82 124 88 Q119 85 122 81" fill="none" stroke="#f2a39b" stroke-width="3.5" stroke-linecap="round"/><rect x="70" y="86" width="11" height="6" rx="3" fill="#7fae62" transform="rotate(-15 75 89)"/><rect x="92" y="80" width="11" height="6" rx="3" fill="#7fae62" transform="rotate(10 97 83)"/><circle cx="86" cy="72" r="2.5" fill="#d34d39"/><circle cx="104" cy="66" r="2.5" fill="#d34d39"/><circle cx="112" cy="74" r="2.5" fill="#d34d39"/><circle cx="94" cy="58" r="2.5" fill="#d34d39"/><circle cx="84" cy="130" r="4.5" fill="#3a2c23"/><circle cx="116" cy="130" r="4.5" fill="#3a2c23"/><path d="M93 138 Q100 144 107 138" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="68" cy="138" r="6.5" fill="#f2a39b" opacity=".55"/><circle cx="132" cy="138" r="6.5" fill="#f2a39b" opacity=".55"/></svg>`,
  },

  /* ---------- 12. 強炭酸ジンジャーエール (AHPL) ---------- */
  gingerale: {
    id: 'gingerale', axes: 'AHPL',
    name: '強炭酸ジンジャーエール', short: 'ジンジャーエール',
    catch: 'シュワ弾けるムードブレイカー',
    color: '#d2a936', rarity: 5.4, emoji: '🥤⚡🍋',
    mbti: ['ESFP', 'ENTP'],
    stats: { ノリ: 92, やさしさ: 70, 毒: 55, 愛の重さ: 30, 気まぐれ: 88 },
    features: ['第一声がデカい', 'ツッコミの瞬発力が音速', '気が抜けるのも早い'],
    desc: [
      '開栓した瞬間の爆発力。場に入った瞬間に空気を変える、歩く強炭酸。ノリが良く、ツッコミが速く、辛口なのに後味が爽やか。言われた側も笑ってしまうのは、あなたの刺激に「悪意の糖分」がゼロだから。',
      'ただし炭酸には限りがある。騒いだあと、急にトーンダウンして「あ、帰るわ」と消える。その切り替えの潔さも含めて、あなたは爽快。',
    ],
    manual: {
      like: 'ボケの供給。あなたのツッコミの燃料を絶やさないこと',
      ng: 'ツッコミを「悪口」と受け取られること。愛なのに',
      charge: '新しい遊び、初めての店、知らない人との集まり',
      care: '静かな時は気が抜けてるだけ。無理に振らず、次の開栓を待つ',
    },
    aruaru: [
      '「いや、なんでだよ」が1日10回出る',
      '初対面の人と10分で仲良くなる',
      '飽きるのも早い（趣味の墓場を持っている）',
      'テンションの賞味期限が短い',
      '帰り際が爽やかすぎて逆に印象に残る',
    ],
    love: '恋の立ち上がりは全タイプ最速クラス。ノリと勢いで距離を詰めて、気づいたら付き合ってる。問題はその後で、「落ち着いた関係」を「気が抜けた」と誤読しがち。炭酸が抜けたあとの優しい甘さに気づけたら、その恋は本物。',
    friend: 'グループの「起爆剤」。あなたのツッコミで会話のテンポが決まる。あなたがいない日の通話、ちょっと静か。',
    bestId: 'cheesehamburg',
    bestReason: '王道の人気者の、実は唯一無二の相方。あなたの刺激と相手の包容力で、場が無限に回る。セットで頼みたくなる2人。',
    worstId: 'flatcola',
    worstRoast: '同じ炭酸系のはずが、向こうはすでに抜けている。あなたの「うぇーい」に「うん」で返され、シュワシュワが虚空に消える。テンションの格差社会。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="66" y="58" width="68" height="104" rx="14" fill="#f2c14e" stroke="#3a2c23" stroke-width="5"/><path d="M66 76 H134" stroke="#3a2c23" stroke-width="3" opacity=".25"/><circle cx="134" cy="56" r="15" fill="#ffe08a" stroke="#3a2c23" stroke-width="4.5"/><circle cx="134" cy="56" r="9" fill="#fffdf6" stroke="#3a2c23" stroke-width="2.5"/><path d="M134 47 V65 M125 56 H143" stroke="#3a2c23" stroke-width="2"/><rect x="80" y="14" width="11" height="52" rx="5" fill="#d04f2e" stroke="#3a2c23" stroke-width="3.5" transform="rotate(14 85 40)"/><circle cx="86" cy="94" r="5" fill="#fffdf6" opacity=".9"/><circle cx="112" cy="86" r="4" fill="#fffdf6" opacity=".9"/><circle cx="96" cy="146" r="4" fill="#fffdf6" opacity=".9"/><circle cx="118" cy="136" r="5" fill="#fffdf6" opacity=".9"/><path d="M48 44 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="2.5"/><path d="M156 110 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#ffd24d" stroke="#3a2c23" stroke-width="2.5"/><circle cx="88" cy="108" r="4.5" fill="#3a2c23"/><circle cx="114" cy="108" r="4.5" fill="#3a2c23"/><path d="M91 116 Q101 126 111 116 Z" fill="#3a2c23"/><circle cx="76" cy="116" r="6" fill="#f2a39b" opacity=".55"/><circle cx="126" cy="116" r="6" fill="#f2a39b" opacity=".55"/></svg>`,
  },

  /* ---------- 13. 白桃ゼリー (AISR) ---------- */
  peachjelly: {
    id: 'peachjelly', axes: 'AISR',
    name: '白桃ゼリー', short: '白桃ゼリー',
    catch: '透明感のある癒し',
    color: '#f6b3a3', rarity: 7.4, emoji: '🍑🫧🌸',
    mbti: ['INFP', 'ISFJ'],
    stats: { ノリ: 45, やさしさ: 92, 毒: 8, 愛の重さ: 55, 気まぐれ: 30 },
    features: ['存在がやわらかい', '聞き上手で、否定をしない', 'ぷるぷるしてるが、芯はある'],
    desc: [
      '透明で、やわらかくて、つるんと優しい。あなたの周りだけ時間の流れが0.8倍速になっていて、せかせかした人もあなたと話すと深呼吸する。声を荒げた記録が、観測されていない。',
      '「ふわふわしてる」と言われがちだけど、ゼリーには実は形がある。流されているようで、嫌なことは静かに避けているし、譲れない芯（桃）はちゃんと中心にある。',
    ],
    manual: {
      like: 'ゆっくりしたペースを尊重してくれること。急かさない人',
      ng: '大声、詰問、圧。物理的に振動する',
      charge: '昼寝、あったかいお茶、ぬいぐるみ、静かな友達',
      care: '嫌なことを言えずに溜め込む。「嫌だった？」と聞かれると、やっと頷ける',
    },
    aruaru: [
      '「癒される〜」と言われるのが日常',
      '歩くのがゆっくり',
      '怒り方が分からない',
      'ぬいぐるみと会話できる',
      '周りが勝手に守ってくれる',
    ],
    love: '恋愛はスローテンポ。グイグイ来られると固まるけれど、ゆっくり距離を詰めてくれる人には、少しずつ、確実に心を開く。付き合ってからの安心感と居心地の良さは全タイプ随一。「守りたい」を発動させる天才。',
    friend: 'グループの「オアシス」。ギスギスした空気が、あなたの一言（またはただの微笑み）で溶ける。争いの中和剤。',
    bestId: 'yaminabe',
    bestReason: '正反対に見えて、お互い「ペースを乱されたくない」同士。あなたは闇鍋の中身を怖がらない唯一の人で、向こうはあなたを退屈させない唯一の人。',
    worstId: 'shiomusubi',
    worstRoast: '優しさの渋滞。お互い譲り合った結果、何も決まらず、何も始まらず、解散時刻だけが来る。どちらかが「決める係」を外注する勇気を。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="150" rx="58" ry="12" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><path d="M54 146 Q52 84 100 80 Q148 84 146 146 Z" fill="#f6b8a9" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><ellipse cx="78" cy="102" rx="8" ry="13" fill="#fffdf6" opacity=".75" transform="rotate(-16 78 102)"/><circle cx="100" cy="74" r="8" fill="#ef9d92" stroke="#3a2c23" stroke-width="4"/><path d="M100 66 Q105 59 112 59" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><path d="M42 110 q-5 8 0 16 M36 116 q-4 6 0 12" fill="none" stroke="#3a2c23" stroke-width="3" stroke-linecap="round" opacity=".4"/><path d="M158 110 q5 8 0 16 M164 116 q4 6 0 12" fill="none" stroke="#3a2c23" stroke-width="3" stroke-linecap="round" opacity=".4"/><circle cx="86" cy="116" r="4.5" fill="#3a2c23"/><circle cx="114" cy="116" r="4.5" fill="#3a2c23"/><path d="M94 124 Q100 129 106 124" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="72" cy="126" r="7" fill="#f2a39b" opacity=".7"/><circle cx="128" cy="126" r="7" fill="#f2a39b" opacity=".7"/></svg>`,
  },

  /* ---------- 14. 初雪サイダー (AISL) ---------- */
  hatsuyuki: {
    id: 'hatsuyuki', axes: 'AISL',
    name: '初雪サイダー', short: '初雪サイダー',
    catch: '年に数回しか出会えないレア枠',
    color: '#8ec8dd', rarity: 2.4, emoji: '🫧❄️🩵',
    mbti: ['INFJ', 'INTP'],
    stats: { ノリ: 30, やさしさ: 85, 毒: 20, 愛の重さ: 75, 気まぐれ: 80 },
    features: ['全16タイプ中、出現率さいてい', '心を開くまで平均1年', '開いたあとの特別感は無限大'],
    desc: [
      '初雪のように、めったに降らない。グループにいても気配が薄く、SNSの更新は年3回。でも、あなたが心を許した相手にだけ見せる素顔と話し方は、全タイプでいちばん「特別」の純度が高い。',
      '人見知りなのではなく、選んでいる。あなたの「仲良い人リスト」は短いけれど、その全員があなたのことを「親友」と言う。狭く、深く、静かに、一生。',
    ],
    manual: {
      like: 'ゆっくり時間をかけて知ろうとしてくれること。距離の詰め方が丁寧な人',
      ng: '「もっと喋りなよ」という善意の圧。雪が溶ける',
      charge: 'ひとりの部屋、静かな音楽、気を使わない人と並んで無言',
      care: '悩みを話すまでに時差がある。急かさず「そういえばあれどうなった？」と',
    },
    aruaru: [
      '「実は面白い人」と発見されがち',
      'LINEの文章を打っては消す',
      '仲良くなると口数が3倍になる（ギャップ）',
      '大人数の集まりの翌日は冬眠',
      '「初めて人に言った」という話を3人にしか言ってない',
    ],
    love: '恋に落ちるまでも、伝えるまでも、史上最遅。でもあなたの「好き」は積雪のように静かに深く積もったもので、軽さが一切ない。あなたを「待てる人」だけがたどり着ける、限定味。',
    friend: 'グループの「レアキャラ」。たまに来るだけで場の特別感が増す。あなたの参加表明でグループLINEが沸く。',
    bestId: 'cacao',
    bestReason: '言葉の少ない者同士、沈黙が会話になる稀有な関係。お互いの「狭くて深い世界」に入場を許可し合った、奇跡のペア。',
    worstId: 'melonpan',
    worstRoast: '向こうは気まぐれに「会いたい！」と言い、あなたは心の準備に3営業日かかる。タイミングが合った時だけ奇跡的に楽しい、流星群みたいな関係。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M88 24 H112 V40 Q112 52 120 60 Q130 72 130 92 V148 Q130 162 100 162 Q70 162 70 148 V92 Q70 72 80 60 Q88 52 88 40 Z" fill="#d4ecf5" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><rect x="84" y="12" width="32" height="13" rx="4" fill="#8ec8dd" stroke="#3a2c23" stroke-width="4"/><circle cx="100" cy="66" r="8" fill="#fffdf6" stroke="#3a2c23" stroke-width="3.5"/><g stroke="#6fb4cf" stroke-width="3.5" stroke-linecap="round"><path d="M48 50 v16 M40 58 h16 M43 52.5 l10 11 M53 52.5 l-10 11"/><path d="M152 84 v14 M145 91 h14 M147.5 86 l9 10 M156.5 86 l-9 10"/><path d="M46 120 v12 M40 126 h12 M42 121.5 l8 9 M50 121.5 l-8 9"/></g><circle cx="88" cy="108" r="4" fill="#3a2c23"/><circle cx="112" cy="108" r="4" fill="#3a2c23"/><path d="M96 117 Q100 120 104 117" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><circle cx="78" cy="118" r="8" fill="#f2a39b" opacity=".7"/><circle cx="122" cy="118" r="8" fill="#f2a39b" opacity=".7"/></svg>`,
  },

  /* ---------- 15. わさび醤油 (AIPR) ---------- */
  wasabi: {
    id: 'wasabi', axes: 'AIPR',
    name: 'わさび醤油', short: 'わさび醤油',
    catch: '静かに効く辛口の参謀',
    color: '#94a83b', rarity: 6.1, emoji: '🥢💚⚡',
    mbti: ['ISTP', 'INTJ'],
    stats: { ノリ: 30, やさしさ: 75, 毒: 88, 愛の重さ: 40, 気まぐれ: 15 },
    features: ['少量で効く毒舌', '観察眼が異常に鋭い', '信頼度は16タイプ最高クラス'],
    desc: [
      '普段は小皿で静かにしている。でも、ここぞの一言が、ツーンと効く。あなたの毒舌は量産型の悪口じゃなく、観察に裏打ちされた「的確すぎる一刺し」。言われた本人が3日後に「あれ、正しかったわ」と気づくやつ。',
      '感情より事実、ノリより精度。冷たく見られがちだけど、あなたは「本当のことを言う」という、いちばん誠実な優しさを選んでいるだけ。',
    ],
    manual: {
      like: '率直さ。お世辞抜きの会話ができる人',
      ng: '中身のない長話と、根拠のないポジティブ',
      charge: '良質なコンテンツを、ひとりで摂取する時間',
      care: '心配を言葉にしない代わりに、行動（さりげない情報共有）で示してる。気づいて',
    },
    aruaru: [
      '相談には乗るが、慰めはしない（そして感謝される）',
      '「よく見てるね」と言われる',
      '大人数より2人',
      '興味のない話のとき、目が死んでる',
      '信頼した人への忠誠心は犬',
    ],
    love: '恋愛でも嘘がつけない。「かわいいね」を連発はしないけれど、相手の変化（髪、体調、機嫌）に世界一早く気づく。あなたの「気づき」こそが愛情表現だと理解してくれる人となら、一生分の信頼を築く。',
    friend: 'グループの「参謀」。決断に迷ったとき、全員があなたの顔を見る。あなたの「いいんじゃない」は、他の人の「絶対いいよ！」の10倍重い。',
    bestId: 'vanilla',
    bestReason: '甘いバニラにひとたらしの醤油は、知る人ぞ知る背徳の美味。相手の夜の包容力があなたの口を軽くし、あなたの辛口が相手を笑わせる。',
    worstId: 'udon',
    worstRoast: '辛口同士の精度バトル。お互いの正論が高速で飛び交い、議論は白熱するが着地しない。同族嫌悪に気をつけて、味変を覚えよう。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M146 36 L168 118 M158 32 L178 112" stroke="#9c6644" stroke-width="5" stroke-linecap="round"/><ellipse cx="100" cy="140" rx="58" ry="20" fill="#fffdf6" stroke="#3a2c23" stroke-width="5"/><ellipse cx="100" cy="138" rx="42" ry="11" fill="#46291c" stroke="#3a2c23" stroke-width="3"/><path d="M76 126 Q80 96 100 92 Q120 96 124 126 Q112 134 100 132 Q88 134 76 126 Z" fill="#94a83b" stroke="#3a2c23" stroke-width="5" stroke-linejoin="round"/><path d="M100 92 Q108 84 104 77" fill="none" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><path d="M84 110 H94 M106 110 H116" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/><path d="M96 121 H104" stroke="#3a2c23" stroke-width="4" stroke-linecap="round"/></svg>`,
  },

  /* ---------- 16. 炭酸抜きコーラ (AIPL) ---------- */
  flatcola: {
    id: 'flatcola', axes: 'AIPL',
    name: '炭酸抜きコーラ', short: '炭酸抜きコーラ',
    catch: '省エネモードの大物',
    color: '#7e4a41', rarity: 4.2, emoji: '🥤🧊😴',
    mbti: ['ISTP', 'INTP'],
    stats: { ノリ: 20, やさしさ: 60, 毒: 65, 愛の重さ: 35, 気まぐれ: 75 },
    features: ['常に省エネ運転', 'なのに妙にクセになる存在感', '本気を出した日のギャップが伝説になる'],
    desc: [
      '炭酸は抜けている。でも、コーラはコーラ。シュワシュワした自己アピールを一切しないのに、なぜかみんなあなたを覚えていて、なぜかまた会いたくなる。中毒性の正体は、その「無理のなさ」。',
      'やる気がないわけじゃなく、エネルギーの使い所を選んでいるだけ。普段ローテンションなあなたが本気を出した日の衝撃は、グループの語り草になる。年に2回の全力、それで十分。',
    ],
    manual: {
      like: '省エネを許してくれる空気。「来るだけでいいよ」',
      ng: 'テンションの強制供給。「もっと盛り上がろうよ」で帰りたくなる',
      charge: '布団、誰の予定も入っていない休日、気の合う2〜3人',
      care: '「だるい」が口癖だが、本当に潰れる前は「だるい」すら言わなくなる。沈黙に注意',
    },
    aruaru: [
      '既読はする。返信は明日',
      '「眠い」が挨拶',
      'ドタキャンではなく、最初から「行けたら行く」と言う誠実さ',
      'たまに行くと「来た！？」とどよめかれる',
      '本気を出すと「誰？」と言われる',
    ],
    love: '追いかける恋はしない。というか、追いかけるカロリーがない。でも、隣で一緒にダラダラできる相手には、ぽつりと本音を漏らす。あなたの「楽でいられる」は最上級の愛情表現。それを「冷めてる」と誤読しない人を選んで。',
    friend: 'グループの「縁側」。ノリも気遣いも要求してこないあなたの隣が、実は一番の人気席。みんな疲れると、あなたのところに来る。',
    bestId: 'parfait',
    bestReason: '重量級の愛を「ふーん、いいじゃん」と受け流しつつ、全部受け止める器。あなたの省エネと相手の深い愛、燃費が完璧に噛み合う。',
    worstId: 'gingerale',
    worstRoast: '向こうはシュワシュワ、こっちは無炭酸。「ねぇ聞いてる！？」「聞いてる（聞いてない）」のすれ違いが日常。お互いのガス圧、永遠に合わない。',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="68" y="84" width="64" height="78" rx="10" fill="#6b4632"/><rect x="68" y="52" width="64" height="110" rx="12" fill="none" stroke="#3a2c23" stroke-width="5"/><rect x="84" y="68" width="22" height="22" rx="5" fill="#fffdf6" opacity=".8" stroke="#3a2c23" stroke-width="3.5" transform="rotate(-12 95 79)"/><path d="M112 62 L116 30 L134 24 L136 31 L122 36 L120 62 Z" fill="#d04f2e" stroke="#3a2c23" stroke-width="3.5" stroke-linejoin="round"/><circle cx="88" cy="104" r="4" fill="#fffdf6" opacity=".75"/><circle cx="146" cy="50" r="2.5" fill="#3a2c23" opacity=".5"/><circle cx="152" cy="42" r="2.5" fill="#3a2c23" opacity=".5"/><circle cx="158" cy="34" r="2.5" fill="#3a2c23" opacity=".5"/><path d="M80 116 Q85 120 90 116" fill="none" stroke="#fdf3dd" stroke-width="4" stroke-linecap="round"/><path d="M110 116 Q115 120 120 116" fill="none" stroke="#fdf3dd" stroke-width="4" stroke-linecap="round"/><path d="M96 130 Q100 132 104 130" fill="none" stroke="#fdf3dd" stroke-width="3.5" stroke-linecap="round"/><circle cx="76" cy="126" r="6" fill="#f2a39b" opacity=".4"/><circle cx="124" cy="126" r="6" fill="#f2a39b" opacity=".4"/></svg>`,
  },
};

/* 相性スコア: 濃さ逆+1 / 温度同+1 / 甘辛逆+1 / 入手性逆+1 */
function pairScore(a, b) {
  const A = TYPES[a].axes, B = TYPES[b].axes;
  let s = 0;
  if (A[0] !== B[0]) s++;
  if (A[1] === B[1]) s++;
  if (A[2] !== B[2]) s++;
  if (A[3] !== B[3]) s++;
  return s;
}

const LOADING_MSGS = [
  'あなたの素材を計量中…',
  'とろ火で煮込んでいます…',
  'かくし味を追加中…',
  '盛り付けています…',
];
