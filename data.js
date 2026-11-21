/**
 * 非エンジニアのAI道具箱 - 設定＆データ定義
 *
 * 【最初にここだけ書き換えてください】
 * SITE_CONFIG の中身を自分のアカウント名・ハンドル・URLに変更するだけで、
 * サイト内のヘッダー、フッター、Xシェアボタン、クレジット文面がすべて自動更新されます。
 */
const SITE_CONFIG = {
  siteName: 'ちくわのAI道具箱',
  tagline: 'コスパ診断＆コピペで動くプロンプト実験室',
  authorName: 'ちくわ',
  xHandle: '@chikuwa_ai_box', // ← あなたのXハンドル（@付き）に書き換えてください
  noteUrl: 'https://note.com/', // ← あなたのnoteプロフィールまたは記事URLに書き換えてください
  updatedAt: '2026年11月',
  defaultUsdJpy: 155,
  siteUrlHint: '' // 空文字の場合、公開時の現在URL（https://〜）を自動で使用します
};

const GOALS = [
  {
    id: 'research_writing',
    label: '文章作成・調べ物・要約',
    desc: 'メール・議事録・企画案・英語記事の翻訳など日常の相棒にしたい'
  },
  {
    id: 'coding',
    label: '非エンジニアのツール・Web自作',
    desc: 'Claude Code や Cursor で自分用の便利ツールやサイトを作りたい'
  },
  {
    id: 'automation',
    label: '業務効率化・自動化',
    desc: 'Excel / スプレッドシート / 定型作業の時間を半分以下にしたい'
  },
  {
    id: 'creative',
    label: '画像・動画・音楽生成',
    desc: 'SNSアイコン、15秒デモ動画、作業用BGMなどを自分で作りたい'
  },
  {
    id: 'storage',
    label: 'Google連携・大容量ストレージ',
    desc: 'Gmailやドライブ（5TB等）も含めてお得にまとめたい'
  }
];

const SUBSCRIPTIONS = [
  {
    id: 'google_ai_plus',
    name: 'Google AI Plus',
    provider: 'Google',
    currency: 'JPY',
    price: 725,
    billingNote: 'ライト向け・月額固定（円建て）',
    tags: ['research_writing', 'automation'],
    tier: 'light',
    summary: 'まずは月1,000円未満で無料版より快適に使いたい人の入門枠。',
    perks: [
      'Googleの軽量〜標準AI機能を低コストで拡張',
      '円建て定額で為替の影響を受けない',
      '「毎日使うか分からない」お試し期に最適'
    ],
    caveat: '本格的な開発や大容量ストレージ目的なら Google AI Pro（2,900円）の方が割安になりやすい。'
  },
  {
    id: 'google_ai_pro',
    name: 'Google AI Pro',
    provider: 'Google',
    currency: 'JPY',
    price: 2900,
    billingNote: '定番主力・月額固定（円建て）',
    tags: ['research_writing', 'automation', 'storage', 'creative'],
    tier: 'standard',
    summary: 'Gemini上位モデル＋5TBクラウド＋Gmail/Docs連携まで付く総合コスパ最強枠。',
    perks: [
      '上位Geminiモデル・長文解析・リサーチ機能が充実',
      'Google One 5TBクラウドストレージ込みで単体計算のコスパが高い',
      'Gmail / スプレッドシート / Googleドキュメント上で直接AI呼び出し'
    ],
    caveat: 'Googleサービスを普段あまり使わない人や、ローカルでのAIコーディング特化ならClaude/Cursor優先。'
  },
  {
    id: 'chatgpt_go',
    name: 'ChatGPT Go',
    provider: 'OpenAI',
    currency: 'JPY',
    price: 1400,
    billingNote: 'ライト向け・月額固定（円建て）',
    tags: ['research_writing', 'automation'],
    tier: 'light',
    summary: 'ChatGPTの使いやすさは欲しいが月3,000円はまだ重い人向けの手頃プラン。',
    perks: [
      '日本円決済（1,400円）で分かりやすい',
      '無料枠の回数制限ストレスを軽く緩和',
      '日常の文章作成・相談の習慣化に十分なバランス'
    ],
    caveat: 'Deep Researchや重い推論を毎日回す場合は Plus（3,000円）への切り替えが推奨。'
  },
  {
    id: 'chatgpt_plus',
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    currency: 'JPY',
    price: 3000,
    billingNote: '定番主力・月額3,000円（税込）',
    tags: ['research_writing', 'automation', 'creative', 'coding'],
    tier: 'standard',
    summary: '文章・リサーチ・画像生成・簡単なコード生成まで1つで何でもこなす王道プラン。',
    perks: [
      '高度な推論モデル・Deep Research・画像生成をオールインワンで利用可',
      '日本円直接決済で為替ブレの心配が少ない',
      'ネット上の日本語ノウハウ・プロンプト事例が最も豊富'
    ],
    caveat: '複数ファイルを跨ぐ本格的なアプリ開発は、専用エディタ（Cursor / Claude Code）に一歩譲る。'
  },
  {
    id: 'claude_pro',
    name: 'Claude Pro',
    provider: 'Anthropic',
    currency: 'USD',
    price: 20,
    billingNote: '定番主力・$20/月（為替で変動）',
    tags: ['research_writing', 'coding', 'automation'],
    tier: 'standard',
    summary: '自然な日本語文章・長文読解・非エンジニアのツール自作（Artifacts/Claude Code）の最強相棒。',
    perks: [
      '日本語のトーンが自然で「AIっぽさ」が少ない文章が出やすい',
      'Artifacts機能でその場でHTMLツールや図解のプレビューが可能',
      'Sonnet / Opus等の高性能モデルで開発・構成力が非常に高い'
    ],
    caveat: 'ヘビーに連続利用すると5時間ごとの利用上限に当たることがある。ドル建て決済のためカード手数料込みで計算を。'
  },
  {
    id: 'claude_max',
    name: 'Claude Max',
    provider: 'Anthropic',
    currency: 'USD',
    price: 100,
    billingNote: 'ヘビー・本格開発向け（$100/月〜）',
    tags: ['coding', 'automation'],
    tier: 'heavy',
    summary: 'Claude Codeで毎日大量にアプリや自動化ツールを作り込む人向けの拡張上限枠。',
    perks: [
      'Claude Proの制限を大幅に引き上げ、長時間の開発セッションでも止まりにくい',
      '大規模ファイル生成や連続テストをストレスなく実行可能'
    ],
    caveat: '非エンジニアの最初の1ヶ月ではオーバースペック。まずはPro（$20）で制限に頻繁に当たってから検討すべき。'
  },
  {
    id: 'cursor_pro',
    name: 'Cursor Pro',
    provider: 'Cursor',
    currency: 'USD',
    price: 20,
    billingNote: 'AI開発エディタ定番・$20/月（年払いで割安枠あり）',
    tags: ['coding', 'automation'],
    tier: 'standard',
    summary: '画面を見ながらAIにアプリ・Webサイト制作を丸投げできる非エンジニア開発の本命。',
    perks: [
      'ClaudeやGPTなど複数社の最新モデルを1つのエディタ内で使い分け可能',
      'どのファイルがどう書き換わるか画面上で目視確認しながら進められる',
      'エラー文をワンクリックでAIに投げて修正できる'
    ],
    caveat: '通常のチャット相談やスマホからの利用には不向き。PCで「何かを作る」ための専門ツール。'
  },
  {
    id: 'perplexity_pro',
    name: 'Perplexity Pro',
    provider: 'Perplexity',
    currency: 'USD',
    price: 20,
    billingNote: 'リサーチ特化・$20/月',
    tags: ['research_writing'],
    tier: 'standard',
    summary: '出典リンク付きの最新情報調査・競合リサーチを爆速化するAI検索エンジン。',
    perks: [
      '「いつの情報か・どこが出典か」をURL付きで提示するため事実確認が速い',
      '複数の推論モデルを切り替えてDeep Researchを実行可能',
      'X発信のネタ探しや海外動向の裏取りに非常に強い'
    ],
    caveat: 'ソフトバンク/キャリア特典や他キャンペーンで無料枠が付与されているケースもあるため契約前に確認を。'
  },
  {
    id: 'midjourney_basic',
    name: 'Midjourney Basic',
    provider: 'Midjourney',
    currency: 'USD',
    price: 10,
    billingNote: '画像生成特化・$10/月',
    tags: ['creative'],
    tier: 'creative',
    summary: 'SNSアイコン、ヘッダー、世界観のあるイラスト制作の最高峰（月200枚目安）。',
    perks: [
      'Web版エディタで直感的に高クオリティなイラスト・写真風画像を生成',
      'スタイルリファレンス機能で同じ画風の連作が作りやすい',
      '有料プラン加入で商用利用規約（年商条件等あり）に対応'
    ],
    caveat: '日本語テキストを画像内に直接描画するのは不向き。文字はCanva等での後乗せ前提。'
  },
  {
    id: 'suno_pro',
    name: 'Suno Pro',
    provider: 'Suno',
    currency: 'USD',
    price: 10,
    billingNote: '音楽・BGM生成・$10/月',
    tags: ['creative'],
    tier: 'creative',
    summary: '作業用BGM・デモ動画の背景音楽・オリジナル楽曲を30秒で商用利用可能レベルで生成。',
    perks: [
      'Proプランで生成した楽曲は商用利用（YouTube・動画素材・Web等）に対応',
      'Instrumental指定で作業・解説動画に使いやすいBGMを量産可能',
      '月2,500クレジット（約500曲分）で個人用途なら十分すぎる容量'
    ],
    caveat: '無料プラン（Basic）時代に作った曲は後からProにしても原則商用利用権は付与されない点に注意。'
  },
  {
    id: 'runway_standard',
    name: 'Runway Standard',
    provider: 'Runway',
    currency: 'USD',
    price: 15,
    billingNote: '動画生成・編集・$15/月（月払い目安）',
    tags: ['creative'],
    tier: 'creative',
    summary: '静止画を動かしたり、Xのタイムラインで指を止めるショート映像を作る定番動画AI。',
    perks: [
      '画像から数秒の滑らかな動画（Image-to-Video）を高精度に生成',
      'ウォーターマーク（透かし）なしの書き出しに対応',
      'Web上で簡単なカットや背景除去も完結'
    ],
    caveat: '動画生成はクレジット消費が早いため、まず静止画（Midjourney等）を完璧にしてから動かすのが節約のコツ。'
  }
];

const PROMPT_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'coding', label: 'AI開発・ツール自作' },
  { id: 'work', label: '業務時短・自動化' },
  { id: 'creative', label: '画像・動画・音楽' },
  { id: 'research', label: '海外速報・X発信' }
];

const PROMPTS = [
  // --- coding (6) ---
  {
    id: 'code_01',
    category: 'coding',
    title: '非エンジニア向け「要件定義ヒアリング」プロンプト',
    difficulty: 'コピペOK',
    recommendedTool: 'Claude / ChatGPT / Gemini',
    summary: 'いきなりコードを書かせず、AIに逆質問させて失敗しない設計図を先に作らせる。',
    promptText: `私はプログラミングの知識がない非エンジニアです。
今から【作りたいもの：例＝自分用の作業タイマー兼メモツール】を作りたいと考えています。

いきなりコードや専門用語を出さず、まず以下の手順で進めてください。
1. 私への確認質問を「番号付きで5つ以内」に絞って聞いてください（画面イメージ、必要なボタン、スマホで使うか等）
2. 私が答えたあと、「できること」「今回は入れないこと（シンプルにする部分）」「全体の画面構成」を日本語で提案してください
3. 私が「OK」と答えてから実際の作成に進んでください`,
    tips: '最初の一言目でこれを投げるだけで、「思っていたのと違う複雑なアプリ」を勝手に出される事故を防げます。'
  },
  {
    id: 'code_02',
    category: 'coding',
    title: '1ファイル完結HTMLツール一発生成プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / Cursor / Gemini',
    summary: 'サーバーや環境構築ゼロで、ブラウザにドラッグするだけで動く実用ツールを作らせる。',
    promptText: `プログラミング知識ゼロの私でも、PCのブラウザ（Chrome等）でダブルクリックするだけで動く【作りたいツール名：例＝文字数＆X文字数チェッカー】を作ってください。

【絶対条件】
- index.html という「HTMLファイル1つだけ」で完結させること（外部ライブラリやビルド不要）
- スマホ画面でも崩れないレスポンシブデザインにすること
- 白ベースの見やすく清潔なデザインで、日本語UIにすること
- 入力したデータはブラウザ内のlocalStorageに自動保存されるようにすること

出力の最後に、非エンジニア向けに「ファイルを保存してブラウザで開く3ステップ」を分かりやすく添えてください。`,
    tips: '出力されたコードをメモ帳やCursorに貼り付けて「tool.html」という名前で保存するだけで即動きます。'
  },
  {
    id: 'code_03',
    category: 'coding',
    title: 'エラー沼脱出「書き換え禁止ブレーキ」プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Cursor / Claude Code',
    summary: 'エラーを連打して他ファイルまで壊される悲劇を止める、調査専用ブレーキ指示。',
    promptText: `以下のエラーが発生しました。
【お願い】今回はまだコードを一切書き換えないでください。

まず以下の3点だけを、非エンジニアにも分かる日本語で教えてください。
1. このエラーが起きている一番可能性が高い原因（専門用語はかみ砕いて）
2. 他に考えられる原因候補を2つ
3. 既存の正常な機能を壊さずに直すための「一番小さな修正案」

【エラー内容 / 今の状況】
[ここにエラー文や画面の状況をそのまま貼り付け]`,
    tips: '同じエラー修正で2回失敗したら必ずこれを挟んでください。AIの暴走を即止められます。'
  },
  {
    id: 'code_04',
    category: 'coding',
    title: '既存デザインを壊さず「1機能だけ追加」プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Cursor / Claude Code',
    summary: 'せっかく整えた見た目を勝手にリセットされずに、狙った機能だけを安全に足す。',
    promptText: `現在の画面デザイン・配色・既存機能はそのまま維持した状態で、以下の「1機能だけ」を追加したいです。

【追加したい機能】
[例：右上に「CSVダウンロード」ボタンを1つ追加し、表示中のデータをExcelで文字化けしないUTF-8 BOM付きCSVで保存できるようにする]

【厳守ルール】
- 既存のレイアウトや変数名を不要に書き換えないこと
- 変更する箇所と理由を、作業前に3行で説明してから編集すること
- 編集後、こちらがブラウザで確認すべきテスト手順を3つ提示すること`,
    tips: '「UTF-8 BOM付き」と指定しておくと、Excelで開いた時の日本語文字化けも防げます。'
  },
  {
    id: 'code_05',
    category: 'coding',
    title: '非エンジニア向け「既存コード解読＆安全確認」',
    difficulty: 'コピペOK',
    recommendedTool: 'Cursor / Claude / ChatGPT',
    summary: 'AIが書いた中身が怪しくないか、勝手に秘密鍵や危険な挙動が入っていないかチェックする。',
    promptText: `以下のコードが安全で、想定通りに動くかを非エンジニア向けにチェックしてください。
コードの専門的な説明は不要です。以下の4点だけ回答してください。

1. このコードは何をするものか（小学生にも分かる例えで2行）
2. 外部の怪しいサイトへデータ送信したり、危険な処理をしている箇所はないか
3. スマホで見た時や、オフライン・ローカルファイル（file://）で開いた時に動かなくなる罠（type="module"等）はないか
4. 改善するとしたら一番効果が高いポイントを1つだけ

【チェックしたいコード】
[ここにコードやファイルを貼り付け]`,
    tips: 'GitHubで見つけたスクリプトやAIが出したコードを公開する前に通す習慣をつけると安全です。'
  },
  {
    id: 'code_06',
    category: 'coding',
    title: 'GitHub Pages公開前 最終チェックプロンプト',
    difficulty: 'コピペOK',
    recommendedTool: 'Cursor / Claude Code',
    summary: '無料Webサイトをインターネット公開する直前に、リンク切れや設定漏れを総点検させる。',
    promptText: `このフォルダ一式を GitHub Pages で公開しようとしています。
非エンジニアがブラウザからドラッグ＆ドロップでアップロードして公開する前提で、以下の項目に問題がないかすべて点検してください。

- index.html がルート階層でそのまま開ける構造になっているか
- 相対パス・画像パス・CSS/JSの読み込みに壊れている箇所はないか
- <script type="module"> などローカル確認でCORSエラーになる書き方が残っていないか
- ダミーの個人情報やAPIキー、不要なテスト文言が残っていないか

問題がある箇所だけ、修正案とあわせてリストアップしてください。`,
    tips: '公開前チェックをAIにやらせることで「公開したのに真っ白画面」を9割防げます。'
  },

  // --- work (6) ---
  {
    id: 'work_01',
    category: 'work',
    title: '議事録「決定事項・未決・アクション」3変換プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT / Gemini',
    summary: '雑な会議メモや音声文字起こしを、捏造ゼロで即共有できる議事録へ整形。',
    promptText: `以下の会議メモ（または文字起こし）を、関係者にチャットでそのまま共有できる議事録に整理してください。

【出力フォーマット】
■ 会議の結論（3行以内）
■ 決定事項（箇条書き）
■ 未決・持ち越し論点（何が課題か）
■ ネクストアクション（表形式：担当者｜やること｜期限）

【厳守事項】
- メモに書かれていない期限や担当者を勝手に推測・捏造しないこと（記載がない場合は「【要確認】」と書く）
- フィラー（「えー」「あのー」）や雑談はすべて削ぎ落とすこと

【会議メモ】
[ここにメモや文字起こしを貼り付け]`,
    tips: '「書いてない期限は【要確認】にする」制約により、AIが勝手に日付を作るハルシネーションを防止できます。'
  },
  {
    id: 'work_02',
    category: 'work',
    title: '角を立てない「お断り・催促・お詫び」ビジネスメール生成',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT',
    summary: '書くのに20分悩む気まずいメールを、温度感の異なる3案で10秒作成。',
    promptText: `以下の状況のビジネスメール（またはチャット返信）を作成してください。
相手との関係性を悪くせず、かつこちらの結論が曖昧にならない文章にしてください。

【状況】
・相手との関係：[例：取引先の担当者／社内の別部署の上司]
・伝えたい結論：[例：見積条件が合わず今回は見送りたい／返事が3日来ていないので優しく催促したい]
・入れてほしいクッション言葉や条件：[例：来月以降の別案件ではぜひ相談したい]

【出力形式】
1. 丁寧・フォーマル版（外部取引先向け）
2. 柔らかめ・チャット寄り版（距離が近い相手向け）
3. 最短3行版（Slack/Teams用）
の3パターンを作ってください。`,
    tips: '最初から「温度感の違う3案」を出させると、微調整だけでそのまま送信できます。'
  },
  {
    id: 'work_03',
    category: 'work',
    title: 'Excel関数・スプレッドシート＆GAS一発生成',
    difficulty: '穴埋め式',
    recommendedTool: 'ChatGPT / Gemini / Claude',
    summary: '「〇〇したい」と列番号を伝えるだけで、コピペして即動く数式やGASを得る。',
    promptText: `Googleスプレッドシート（またはExcel）で使いたい数式（またはGAS）を作ってください。

【シートの列構造】
- A列：[例：日付]
- B列：[例：取引先名]
- C列：[例：金額]
- D列：[例：ステータス（完了／未処理）]
※1行目は見出し行、データは2行目から入っています。

【やりたいこと】
[例：別のシートのA1セルに書いた取引先名と一致し、かつD列が「完了」になっている行のC列だけを合計したい]

【お願い】
1. そのままコピペできる数式を1つ提示してください（Excelとスプレッドシートで違う場合は分けて記載）
2. エラー（#VALUE! や #N/A 等）が出た時によくある原因を2つ教えてください
3. もし関数よりGASの方が良い場合は、初心者が迷わない貼り付け手順付きで教えてください`,
    tips: '「1行目が見出しかどうか」と「列の意味」を先に教えるのが一発で動く最大のコツです。'
  },
  {
    id: 'work_04',
    category: 'work',
    title: '長文PDF・英語マニュアル「数字と例外分離」要約',
    difficulty: 'コピペOK',
    recommendedTool: 'Gemini / Claude / NotebookLM',
    summary: '普通の要約で抜け落ちがちな「料金・期限・例外条件」を強制的に別枠へ抜き出す。',
    promptText: `以下の資料・Web記事を、忙しい非エンジニアが30秒で実務判断できる形に要約してください。

【出力フォーマット】
1. 一言まとめ（40文字以内）
2. 重要な数字・金額・日付・上限値（すべて箇条書き）
3. 私たちが取るべき具体的なアクション（最大3つ）
4. 【重要】原文に書かれている「注意点・例外・やってはいけないこと」

文章の雰囲気だけでまとめず、原文に「例外」や「条件」が書かれていたら絶対に漏らさず4番に入れてください。

【資料テキスト】
[ここにPDFの内容や記事本文を貼り付け]`,
    tips: '規約や料金プランのページをこの型に通すと、「実は〇〇プランは対象外」などの罠を即発見できます。'
  },
  {
    id: 'work_05',
    category: 'work',
    title: '「ツッコミ先回り型」企画書・提案ドラフト作成',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT',
    summary: '上司やクライアントに提出する前に、懸念点と反論回答までセットで企画を組む。',
    promptText: `以下のアイデアで、社内（またはクライアント）向けの企画提案の骨子を作ってください。

【企画のテーマ】：[例：問い合わせ一次対応にAIチャットボットを試験導入したい]
【解決したい課題】：[例：同じ質問への返信に毎日1時間かかっている]
【想定予算・期間】：[例：月額5,000円以内・まず1ヶ月テスト]

【出力してほしい構成】
1. 企画タイトル＆1行サマリー
2. 現状の課題と導入後のBefore/After（時間・コスト効果）
3. 最小スタートの3ステップ実行計画
4. 【想定される反対意見と回答例】慎重派の上司から出そうなツッコミを3つ想定し、納得感のある返答を用意する`,
    tips: '4番の「想定される反対意見と回答」を先に入れておくことで、会議での差し戻し率が激減します。'
  },
  {
    id: 'work_06',
    category: 'work',
    title: '日常業務の「AI自動化・時短棚卸し」コーチ',
    difficulty: 'コピペOK',
    recommendedTool: 'ChatGPT / Claude / Gemini',
    summary: '自分の1週間の仕事から「一番ラクにAI化できて効果が高い作業」を仕分けさせる。',
    promptText: `あなたは業務効率化のコンサルタントです。
私が普段やっている面倒な作業を下に書きます。プログラミング不要・非エンジニアでも今日からできるレベルで仕分けしてください。

【仕分け基準】
- ① 今すぐ単発プロンプトで半分になる作業（今日やる）
- ② テンプレート化やスプレッドシート連携で半自動化できる作業（今月やる）
- ③ まだAIに任せず人間がやった方が早い・安全な作業（任せない）

それぞれの作業について「おすすめのツール」と「最初の一歩」を1行で添えてください。

【私の普段の面倒な作業リスト】
・[例：毎週月曜の売上データ転記]
・[例：定例会議の事前アジェンダ作成]
・[例：SNS投稿のネタ出しと画像探し]`,
    tips: '「③人間に残すべき作業」も選ばせることで、無理なAI化で逆に時間がかかる失敗を防げます。'
  },

  // --- creative (6) ---
  {
    id: 'creative_01',
    category: 'creative',
    title: '画風がブレない「キャラ＆トンマナ固定ブロック」生成',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT → Midjourney等',
    summary: 'SNSやブログで毎回絵柄が変わってしまう問題を解決する、共通英語プロンプトの芯を作る。',
    promptText: `X（Twitter）やnoteで発信するキャラクター画像・アイキャッチ画像の画風を毎回統一したいです。
MidjourneyやImageFXなどの画像生成AIで使い回せる「固定スタイル指定ブロック（英語）」を3パターン提案してください。

【希望のイメージ】
・雰囲気：[例：知的で親しみやすいダークモード系デジタルイラスト／日本の現代アニメ塗り]
・メインカラー：[例：深い紺色＋温かみのあるゴールド＋差し色にシアン]
・避けたいこと：文字が勝手に入ること（no text必須）、不自然なリアル実写化

出力は「そのまま英語プロンプトの末尾にコピペできる1行ブロック」と「日本語での特徴解説」をセットにしてください。`,
    tips: 'できた固定ブロックをメモ帳に保存し、先頭に「どんなポーズ・場面か」だけを書き換えて使います。'
  },
  {
    id: 'creative_02',
    category: 'creative',
    title: '文字崩れゼロ前提「Xヘッダー・note見出し画像」構成設計',
    difficulty: '穴埋め式',
    recommendedTool: 'ChatGPT / Claude → 画像AI＋Canva',
    summary: '画像AIに日本語文字を描かせて崩れるのを防ぎ、「文字を置く余白」を計算した背景を作る。',
    promptText: `note記事のヘッダー画像（横長16:9）またはXのバナー（横長3:1）の背景イラストを画像生成AIで作りたいです。
あとからCanvaやPowerPointで日本語タイトルを重ねるため、文字を置くスペースが空いている構図のプロンプト（英語）を3つ作ってください。

【テーマ】：[例：非エンジニアがAIツールを整理しているワークスペース]
【構図ルール】
- 左側60%は文字が読みやすいよう暗い単色グラデーションまたはシンプルな余白（uncluttered negative space）にする
- 右側40%にだけメインのモチーフ（PC、ホログラム、小道具等）を配置する
- 画像内に文字・ロゴ・数字は絶対に入れない（strictly no text, no letters, no watermark）`,
    tips: '「左側60%を暗い余白、右側40%にモチーフ」はXヘッダーでも記事見出しでも一番プロっぽく見えます。'
  },
  {
    id: 'creative_03',
    category: 'creative',
    title: 'Xで指が止まる「15秒デモ動画」構成＆撮影台本',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT',
    summary: '静止画より圧倒的に伸びる「15秒画面録画・ショート動画」の順番を3秒単位で設計する。',
    promptText: `Xに投稿するための「15秒無音デモ動画（画面録画または動画生成AI素材の組み合わせ）」の構成台本を作ってください。

【紹介したいツール・作例】：[例：AIコスパ診断サイトの使い方]
【絶対条件】
- 最初の0〜3秒で「完成した一番インパクトのある画面／結果」を先に見せる（挨拶やロゴ待機は入れない）
- 音声なし（無音自動再生）でも何をしているか一瞬で分かる動きにする
- 最後に保存・フォローしたくなる一言（画面上のテロップ案またはポスト誘導）を入れる

0〜3秒 / 4〜8秒 / 9〜12秒 / 13〜15秒 の4ブロックに分けて、撮影する操作手順を具体的に書いてください。`,
    tips: '画面録画はWindowsなら「Win+Alt+R」または「Snipping Toolの録画」、Macなら「Shift+Cmd+5」で無料撮影できます。'
  },
  {
    id: 'creative_04',
    category: 'creative',
    title: 'Suno用「作業用BGM・動画背景音」タグ生成プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT → Suno Pro',
    summary: 'BGMを作りたいのに勝手にボーカルが入るのを防ぎ、狙った雰囲気のインスト曲を作る。',
    promptText: `音楽生成AI（Suno）で、解説動画や作業用に使える「歌なしBGM（Instrumental）」を作りたいです。
SunoのStyle of Music欄にそのままコピペできる英語タグの組み合わせを5パターン作ってください。

【使いたいシーン】：[例：落ち着いたAI解説動画のバック／夜の作業集中用Lo-Fi]
【条件】
- ジャンル、雰囲気（mood）、楽器編成（instruments）、テンポ（BPM）の4要素を含める
- ボーカルが混ざらないよう「instrumental only, no vocals」等の補助表現も意識する
- 5パターンは少しずつ曲調（Lo-Fi系、アンビエント系、シネマティック系など）を変える`,
    tips: 'Sunoの入力画面でも必ず「Instrumental」トグルをONにしてください。商用利用時は有料プラン（Pro以上）で生成が必要です。'
  },
  {
    id: 'creative_05',
    category: 'creative',
    title: '難しい比較を1枚で見せる「図解・インフォグラフィック」設計',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / Gemini（HTML/SVG図解生成）',
    summary: '文字だけの投稿を視覚化してブクマ率を上げる、1枚HTML図解カード生成プロンプト。',
    promptText: `以下の比較情報を、Xでそのままスクショして画像1枚として投稿できる「見やすい図解カード（1200×675のHTML 1ファイル）」にしてください。

【デザイン条件】
- スマホで拡大しなくてもパッと読める大きい文字サイズ（見出し大きく、項目は短く）
- 白・クリーム背景に、見分けやすいアクセントカラーを2色まで使用
- 表や矢印を使って「違い」と「誰向けか」が一目で分かるレイアウト
- 右下に小さくアカウント名スペース「@your_handle」を入れる

【図解にしたい情報】
[ここに比較したい2〜4個のツールや手順を貼り付け]`,
    tips: 'ClaudeのArtifactsやブラウザで開いたHTMLをスクショするだけで、Canvaで30分かかる図解が1分で完成します。'
  },
  {
    id: 'creative_06',
    category: 'creative',
    title: 'SNSアイコン・バナー「第一印象＆視認性」辛口レビュー',
    difficulty: 'コピペOK',
    recommendedTool: 'ChatGPT / Gemini / Claude（画像添付）',
    summary: '自分のXアイコンやヘッダー画像をAIに見せて、タイムラインで埋もれないか客観診断させる。',
    promptText: `添付した画像は、私がX（Twitter）のアイコン（またはヘッダー・サムネ）として使おうとしているデザインです。
「Xのタイムラインで小さく丸く表示された時」を前提に、非エンジニアの一般ユーザー目線で厳しくレビューしてください。

【チェック項目】
1. タイムライン上の小さいサイズ（直径40px程度）で見た時、何が描かれているかパッと判別できるか
2. 背景色（ライトモードの白・ダークモードの黒）のどちらでも輪郭が埋もれないか
3. 「このアカウントをフォローしたら何が知れるか・プロっぽいか」の第一印象
4. 明日からさらに良くするための具体的な修正案を2つだけ`,
    tips: 'XのアイコンはスマホTL上で非常に小さく表示されるため、AIに画像を見せて客観チェックすると失敗が減ります。'
  },

  // --- research (6) ---
  {
    id: 'res_01',
    category: 'research',
    title: '海外Xポスト「認知負荷ダウン翻訳引用」生成プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT / Gemini',
    summary: '英語の公式発表やベンチマーク投稿を、日本の非エンジニア向け3行要約＋注意点の引用文に変換。',
    promptText: `あなたは「非エンジニア向けに海外の最新AI情報を認知負荷ゼロで翻訳・解説する」Xアカウントです。
以下の海外ポスト（英語）を、日本人が3秒で価値を理解できる引用RT文章に構成してください。

【構成ルール】
1. 1行目：スクロールを止める率直なフック（過度な煽りや「人生終わる」系の商材言葉は禁止）
2. 本文：専門用語を使わず「何が新しくなったか・何が嬉しいか」を箇条書き3点
3. 必須情報：「無料で試せるか／課金が必要か」「非エンジニアでも今すぐ触れるか」の1行補足
4. 結び：「手元で触ってみたスクショをリプ欄に置きます👇」等の一次情報誘導
5. 全体で300〜420文字程度に収める

【元の英語ポスト・発表文】
[ここに英語ポストや公式発表のテキストを貼り付け]`,
    tips: 'AIが出した翻訳文に「自分が実際に5分触って撮ったスクショ1枚」をリプ欄に足すだけで信頼性が段違いになります。'
  },
  {
    id: 'res_02',
    category: 'research',
    title: '新ツール＆既存ツール「自腹比較マトリクス」作成',
    difficulty: '穴埋め式',
    recommendedTool: 'Perplexity / Gemini / Claude',
    summary: '「結局いま使ってるツールから乗り換える価値ある？」を客観条件で比較表にする。',
    promptText: `新しいAIツール【新ツール名】が登場しました。すでに定番の【比較対象ツール：例＝ChatGPT Plus / Claude Pro】と比べて、非エンジニアが乗り換える・追加課金する価値があるか比較表を作ってください。

【比較軸（必ずこの列で作る）】
ツール名｜月額料金（無料枠の有無）｜一番得意なこと｜非エンジニアの使いやすさ｜乗り換えなくていい人の条件

※推測や不明な最新価格は「公式サイト要確認」と正直に書き、誇張表現なしでフラットに比較してください。`,
    tips: '「乗り換えなくていい人の条件」を書くことで、読者から「この人は煽らず本音で教えてくれる」と信頼されます。'
  },
  {
    id: 'res_03',
    category: 'research',
    title: 'AIニュースの「誇張・バイアス」ファクトチェック',
    difficulty: '穴埋め式',
    recommendedTool: 'Perplexity / ChatGPT（検索ON）/ Gemini',
    summary: 'SNSでバズっている「〇〇が完全終了！」系ポストの裏を取り、冷静な事実だけを抽出する。',
    promptText: `SNS上で以下のAIニュース（またはツール評価）が話題になっていますが、誇張やポジショントークが含まれていないか検証したいです。

【検証してほしいこと】
1. 一次情報（公式発表や公式ドキュメント）で確実に言える事実だけは何％か
2. 「まだベータ版／ウェイトリスト制／英語のみ／API従量課金が高額」など、バズ投稿で隠されがちな制約条件は何か
3. 結論として「非エンジニアが今日飛びつくべきか／1週間様子見でいいか」

【話題になっている内容】
[ここにSNSの投稿やニュースの要点を貼り付け]`,
    tips: 'SNSの過激な煽りを冷静に事実訂正するポストは「Trust（信頼）」とブックマークが非常に伸びやすい型です。'
  },
  {
    id: 'res_04',
    category: 'research',
    title: '週末用「ブクマ＞いいね」キラー長文構成プロンプト',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT',
    summary: '自分の雑な1週間の検証メモを、保存したくなる「■見出し構造」のX長文に仕上げる。',
    promptText: `以下の検証メモをもとに、Xの「週末保存版・長文ポスト（いいねよりブックマーク数を狙う投稿）」のドラフトを作ってください。

【構成ルール】
- 冒頭2行：誰のどんな悩みを解決する投稿か（例：「AI課金で迷っている非エンジニアへ」）
- 『■』を使った3〜4ブロックの構成（1ブロック3〜5行でテンポ良く）
- 具体的な金額・時間・設定手順のいずれかを必ず含める
- 最後に必ず「■ 逆にこういう人はやらなくていい（注意点）」のブロックを入れる
- メモに書いていない架空の体験談や嘘の数字は絶対に追加しないこと

【私の検証メモ】
[ここに自分で試したこと、料金、良かった点、悪かった点を箇条書きで入力]`,
    tips: '土曜の20〜21時または日曜の朝・夜に投下するのが最も読まれやすいゴールデンタイムです。'
  },
  {
    id: 'res_05',
    category: 'research',
    title: '0→500人期「価値ある追記リプ」3パターン作成',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT / Gemini',
    summary: 'フォロワーが少ない初期に、他者の伸びている投稿へ「プロフィールを見たくなる有益リプ」を返す補助。',
    promptText: `以下の他者のX投稿に対して、ただの「すごいですね！」「勉強になります！」ではない、読者にも投稿者にも喜ばれる「価値ある追記リプ（80〜130文字）」を3パターン作ってください。

【ルール】
- 自分の感想ではなく「非エンジニア目線の実体験」「つまずき防止の補足」「具体的な使い道の1例」を1つ足す
- 自分のアカウント宣伝やリンク誘導は絶対に書かない
- 相手への敬意がありつつ、自然な会話トーンにする

【相手の投稿内容】
[ここにリプしたい相手の投稿文を貼り付け]

【私が補足したい実体験・視点】
[例：自分も試したら無料枠でもここまで動いた／Windowsだとここでちょっと注意が必要だった]`,
    tips: 'リプ欄で「この人の補足わかりやすいな」と思われてプロフィールをクリックされるのが初期（0→500人）最大の流入源です。'
  },
  {
    id: 'res_06',
    category: 'research',
    title: 'バズったXポスト → 「無料8割・有料2割」note変換',
    difficulty: '穴埋め式',
    recommendedTool: 'Claude / ChatGPT',
    summary: 'ブックマークが伸びたポストだけを根拠に、押し売り感ゼロで売れるnoteの章立てを作る。',
    promptText: `以下のXポストのブックマーク数が伸びたため、読者の試行錯誤時間を3〜5時間短縮する有料note（980円想定）にまとめたいです。
商材屋っぽさを完全に排除し、「無料パート（8割）だけでも十分有益、有料パート（2割）はそのままコピペで動く時短キット」という構成案を作ってください。

【出力してほしい内容】
1. 誇張なしの誠実でクリックしたくなるタイトル案（3つ）
2. 無料パート（第1〜4章）の詳細な見出しと書くべきポイント
3. 有料ライン直前に置く、納得感のある自然な案内文
4. 有料パートに入れる「コピペ用実装キット（プロンプト・エラー早見表・チェックリスト）」の具体項目

【反応が良かった元のXポスト】
[ここにバズったX投稿のテキストを貼り付け]`,
    tips: '必ずXで反応（ブクマ数）を確認してからnoteを書くことで、「せっかく書いたのに1本も売れない」リスクをゼロにできます。'
  }
];

const TOOL_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'llm', label: '対話・リサーチAI' },
  { id: 'coding', label: 'AI開発・自動化' },
  { id: 'creative', label: '画像・動画・音楽' },
  { id: 'docs', label: '資料・ナレッジ整理' }
];

const TOOLS = [
  // --- llm (4) ---
  {
    id: 'tool_chatgpt',
    category: 'llm',
    name: 'ChatGPT (OpenAI)',
    freeTier: '無料枠あり',
    paidPrice: 'Go 1,400円 / Plus 3,000円',
    rating: 5,
    bestFor: '日常の相談、Deep Research、画像・音声・簡単なデータ分析まで何でもこなす万能基準。',
    pitfall: '長文の日本語執筆はやや硬い「AI調」になりがち。プロンプトで文体例を渡すと改善する。'
  },
  {
    id: 'tool_claude',
    category: 'llm',
    name: 'Claude (Anthropic)',
    freeTier: '無料枠あり',
    paidPrice: 'Pro $20 / Max $100〜',
    rating: 5,
    bestFor: '自然な日本語文章作成、X/note執筆の壁打ち、Artifactsを使ったHTMLツール即時作成。',
    pitfall: '無料枠やProでも長文を連続往復させると利用上限（数時間ロック）に当たりやすい。スレッドをこまめに分けるのがコツ。'
  },
  {
    id: 'tool_gemini',
    category: 'llm',
    name: 'Gemini (Google)',
    freeTier: '無料枠あり',
    paidPrice: 'Plus 725円 / Pro 2,900円',
    rating: 5,
    bestFor: '長大PDF/動画の読み込み、Gmail・ドキュメント連携、5TBストレージ込みの総合コスパ。',
    pitfall: '無料版・有料版やモデル選択が頻繁に変わるため、今どのモデルを選んでいるか画面上部の表示を確認すること。'
  },
  {
    id: 'tool_perplexity',
    category: 'llm',
    name: 'Perplexity',
    freeTier: '無料枠あり',
    paidPrice: 'Pro $20',
    rating: 4,
    bestFor: '出典URL付きでの最新ニュース調査、英語情報の裏取り、X発信前のファクトチェック。',
    pitfall: '検索結果をまとめるのは得意だが、細かいアプリ作成や複雑な文体調整はClaude/ChatGPTの方が向く。'
  },

  // --- coding (4) ---
  {
    id: 'tool_cursor',
    category: 'coding',
    name: 'Cursor',
    freeTier: '無料お試し枠あり',
    paidPrice: 'Pro $20（年払い割安あり）',
    rating: 5,
    bestFor: '非エンジニアが画面を見ながらAIにWebツールやスクリプトを作ってもらう最強エディタ。',
    pitfall: '最初にプロジェクトフォルダをバックアップせずに連続でAIに編集させると、元の正常状態に戻れなくなる（Git保存を習慣化推奨）。'
  },
  {
    id: 'tool_claude_code',
    category: 'coding',
    name: 'Claude Code',
    freeTier: 'Pro枠以上で利用対象',
    paidPrice: 'Claude Pro $20〜（またはAPI従量）',
    rating: 4,
    bestFor: 'ターミナル（黒い画面）でチャット感覚で複数ファイルの一括生成・テストまで丸投げする開発。',
    pitfall: '黒い画面（CLI）に慣れるまでは少し心理的ハードルがある。また、他ツールの認証を勝手に叩くような無茶な指示は避けること。'
  },
  {
    id: 'tool_dify',
    category: 'coding',
    name: 'Dify',
    freeTier: 'Cloud無料枠あり',
    paidPrice: '有料プラン $59〜 / 自前環境可',
    rating: 4,
    bestFor: 'ブロックを繋ぐ視覚的画面で、社内マニュアル検索ボットや専用AIワークフローを作成。',
    pitfall: 'クラウド無料枠にはアプリ数やメッセージ回数の上限があり、本格運用時は別途AIのAPIキー設定が必要になる。'
  },
  {
    id: 'tool_n8n',
    category: 'coding',
    name: 'n8n',
    freeTier: 'セルフホスト無料',
    paidPrice: 'Cloud €20〜目安',
    rating: 3,
    bestFor: '「毎日決まった時間に最新情報を集めて通知する」などの自動連携パイプライン構築。',
    pitfall: 'ZapierやDifyより自由度が高い反面、API設定やWebhook周りで非エンジニアが最初は少し悩みやすい。まず1ステップの自動化から。'
  },

  // --- creative (4) ---
  {
    id: 'tool_midjourney',
    category: 'creative',
    name: 'Midjourney',
    freeTier: '原則有料（一部体験除く）',
    paidPrice: 'Basic $10〜',
    rating: 4,
    bestFor: 'SNSアイコン、Xヘッダー、note見出し、世界観の統一された高品質イラスト・画像生成。',
    pitfall: '英語プロンプトが基本で、画像内の細かい日本語テキスト描画には向かない。文字はCanva等で後付けする。'
  },
  {
    id: 'tool_suno',
    category: 'creative',
    name: 'Suno',
    freeTier: '無料枠あり（非商用のみ）',
    paidPrice: 'Pro $10〜',
    rating: 5,
    bestFor: '解説動画の背景BGM、作業用ループ音楽、オリジナルソングを数十秒で制作。',
    pitfall: '無料プラン時に生成した曲は商用利用不可。YouTube収益化や商用利用したい場合はProプラン加入後に生成する必要がある。'
  },
  {
    id: 'tool_runway',
    category: 'creative',
    name: 'Runway',
    freeTier: '初回無料クレジットあり',
    paidPrice: 'Standard $15〜',
    rating: 4,
    bestFor: '生成した静止画を数秒の滑らかな動画へ変換し、Xで指を止めるショート映像を作成。',
    pitfall: '生成のやり直しでクレジットが一瞬で消える。いきなり動画化せず、先に静止画を完璧に仕上げてから動かすこと。'
  },
  {
    id: 'tool_elevenlabs',
    category: 'creative',
    name: 'ElevenLabs',
    freeTier: '無料枠あり（月1万文字目安）',
    paidPrice: 'Starter $5〜',
    rating: 4,
    bestFor: '極めて自然な日本語・英語ナレーション音声生成、動画の多言語吹き替え。',
    pitfall: '日本語の漢字読み間違いが起きることがあるため、固有名詞はひらがな・カタカナにして渡すと綺麗に読まれる。'
  },

  // --- docs (4) ---
  {
    id: 'tool_notebooklm',
    category: 'docs',
    name: 'NotebookLM (Google)',
    freeTier: '基本無料（Plus特典枠あり）',
    paidPrice: '無料〜 / Google AI Pro連動',
    rating: 5,
    bestFor: '大量のPDF・YouTube動画・Web記事を読み込ませ、その資料だけに基づく正確なQ&Aや音声概要生成。',
    pitfall: '一般チャットAIと違い「入れた資料外の情報」は原則答えない仕様のため、最新トレンド検索には向かない。'
  },
  {
    id: 'tool_gamma',
    category: 'docs',
    name: 'Gamma',
    freeTier: '初回クレジット無料',
    paidPrice: 'Plus $8〜10目安',
    rating: 4,
    bestFor: '箇条書きメモを貼るだけで、デザイン済みのプレゼン資料・PDF・Webスライドを1分で作成。',
    pitfall: '一発で完璧なレイアウトにはなりにくいため、全体の7割をGammaで作って細かい文言だけ手直しする使い方が最速。'
  },
  {
    id: 'tool_notion_ai',
    category: 'docs',
    name: 'Notion AI',
    freeTier: '一部お試し枠',
    paidPrice: 'アドオン $10目安（プランにより変動）',
    rating: 3,
    bestFor: 'すでにNotionへ議事録や案件情報を溜めている人が、ワークスペース横断で検索・要約する用途。',
    pitfall: 'Notion自体を普段あまり使っていない人がAI目当てで契約するより、汎用AI（ChatGPT/Claude/Gemini）を契約する方が割安。'
  },
  {
    id: 'tool_lmarena',
    category: 'docs',
    name: 'Chatbot Arena / Artificial Analysis',
    freeTier: '完全無料（Web公開）',
    paidPrice: '無料',
    rating: 5,
    bestFor: '「今どの最新AIモデルが一番賢くて速くて安いか」の客観データ確認＆無料テスト比較。',
    pitfall: 'ベンチマーク順位は英語・特定課題基準のスコアも含まれるため、最終的には自分の日本語業務で試して判断すること。'
  }
];
