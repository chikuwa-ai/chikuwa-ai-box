(function () {
  'use strict';

  const state = {
    usdJpy: SITE_CONFIG.defaultUsdJpy || 159,
    simMode: 'loss',
    selectedGoals: new Set(['research_writing', 'coding']),
    budget: '6500',
    manualSelected: new Set(['google_ai_pro', 'cursor_pro']),
    loss: {
      google: 'pro_monthly',
      googleYtDup: false,
      googleBfEligible: false,
      claude: 'web_monthly',
      claudePersonal: true,
      chatgpt: 'none',
      chatgptLight: false,
      cursor: 'none',
      unusedCount: 0
    },
    promptCategory: 'all',
    promptDifficulty: 'all',
    promptQuery: '',
    toolCategory: 'all',
    toolQuery: '',
    activePromptId: null
  };

  function toJpy(plan) {
    if (plan.currency === 'JPY') return Math.round(plan.price);
    return Math.round(plan.price * state.usdJpy);
  }

  function formatYen(amount) {
    return amount.toLocaleString('ja-JP') + '円';
  }

  function getShareUrl() {
    if (SITE_CONFIG.siteUrlHint) return SITE_CONFIG.siteUrlHint;
    if (window.location.protocol.startsWith('http')) return window.location.href.split('#')[0];
    return '';
  }

  function getCleanHandle() {
    const h = (SITE_CONFIG.xHandle || '@your_ai_lab').trim();
    return h.startsWith('@') ? h : '@' + h;
  }

  function openXShare(text) {
    const url = 'https://x.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  function copyText(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg || 'コピーしました');
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
      return;
    }
    fallbackCopy(text, successMsg);
  }

  function fallbackCopy(text, successMsg) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'コピーしました');
    } catch (e) {
      showToast('コピーに失敗しました。手動で選択してください');
    }
    document.body.removeChild(area);
  }

  function applyConfig() {
    const handle = getCleanHandle();
    const xProfileUrl = 'https://x.com/' + handle.replace(/^@/, '');

    document.title = SITE_CONFIG.siteName + '｜' + SITE_CONFIG.tagline;
    document.getElementById('site-title').textContent = SITE_CONFIG.siteName;
    document.getElementById('site-tagline').textContent = SITE_CONFIG.tagline;
    document.getElementById('updated-badge').textContent = '最終更新：' + SITE_CONFIG.updatedAt;

    document.getElementById('stat-subs').textContent = String(SUBSCRIPTIONS.length);
    document.getElementById('stat-prompts').textContent = String(PROMPTS.length);
    document.getElementById('stat-tools').textContent = String(TOOLS.length);

    const navX = document.getElementById('nav-x-link');
    if (navX) {
      navX.href = xProfileUrl;
      navX.textContent = handle + ' をフォロー';
    }

    const xFollow = document.getElementById('x-follow-link');
    if (xFollow) xFollow.href = xProfileUrl;
    const heroNote = document.getElementById('hero-note-link');
    if (heroNote) heroNote.href = SITE_CONFIG.noteUrl;
    const noteCta = document.getElementById('note-cta-link');
    if (noteCta) noteCta.href = SITE_CONFIG.noteUrl;
    document.getElementById('credit-text-preview').textContent = SITE_CONFIG.siteName + ' · ' + handle;
    document.getElementById('footer-text').textContent =
      SITE_CONFIG.siteName + '｜Created by ' + SITE_CONFIG.authorName + ' (' + handle + ')';

    const slider = document.getElementById('usd-jpy-slider');
    slider.value = String(state.usdJpy);
    updateRateLabels();
  }

  function updateRateLabels() {
    document.getElementById('usd-jpy-value').textContent = '1ドル = ' + state.usdJpy + '円';
    document.getElementById('sample-20usd').textContent = formatYen(20 * state.usdJpy);
  }

  function initTheme() {
    const btn = document.getElementById('theme-toggle');
    let saved = 'light';
    try {
      saved = localStorage.getItem('ai_hub_theme') || 'light';
    } catch (e) {
      saved = 'light';
    }
    setTheme(saved);

    btn.addEventListener('click', function () {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      btn.textContent = theme === 'dark' ? '☀️ ライト' : '🌙 ダーク';
      try {
        localStorage.setItem('ai_hub_theme', theme);
      } catch (e) {
        // file:// 環境等でストレージ制限がある場合は無視
      }
    }
  }

  function buildRecommendation() {
    const goals = state.selectedGoals;
    const budgetCap = state.budget === 'unlimited' ? Infinity : Number(state.budget);
    const byId = {};
    SUBSCRIPTIONS.forEach(function (s) {
      byId[s.id] = s;
    });

    let pickedIds = [];
    let reason = '';
    let skipAdvice = 'まだ無料枠の回数制限に1度も引っかかっていない場合は、初月から無理に課金せず1週間無料版を使い倒してから選ぶのが一番損しないルートです。';

    if (goals.size === 0) {
      return {
        plans: [byId.google_ai_plus],
        reason: 'やりたいことが未選択のため、まずは月1,000円以下で試せるライトプランを提案しています。上のQ1から目的をチェックしてみてください。',
        skipAdvice: skipAdvice
      };
    }

    if (budgetCap <= 3000) {
      if (goals.has('coding') && !goals.has('storage')) {
        pickedIds = goals.has('research_writing') ? ['claude_pro'] : ['cursor_pro'];
        reason = '月3,000円前後の1本枠で非エンジニアのツール自作も狙うなら、文章と開発の両輪を回せる Claude Pro（またはエディタ操作重視で Cursor Plus $8）が最もコスパ良く回収できます。';
        skipAdvice = 'いきなり複数のAIや上位Maxプラン（$100）に入る必要はありません。まずは1本だけ使い倒しましょう。';
      } else if (goals.has('storage') || goals.has('automation')) {
        pickedIds = ['google_ai_pro'];
        reason = '普段のGoogle連携や5TBストレージまで丸ごと付く Google AI Pro（2,900円）が、1本目の固定費として圧倒的に元が取りやすい構成です。';
        skipAdvice = 'Googleドライブ容量を一切使わない場合は、ChatGPT Plus（3,000円）や ChatGPT Go（1,400円）でも十分です。';
      } else if (goals.has('creative') && goals.size === 1) {
        pickedIds = ['midjourney_basic', 'suno_pro'];
        reason = '画像と音楽の制作特化なら、それぞれ月額$10クラスの組み合わせでも約3,000円前後に収まります。';
        skipAdvice = '動画生成（Runway等）はクレジット消費が早いため、最初は静止画・音楽を固めてから追加するのが節約のコツです。';
      } else {
        pickedIds = ['chatgpt_plus'];
        reason = '文章・リサーチ・画像生成・簡単な作業まで1つで完結する ChatGPT Plus（3,000円）が迷わない王道です。';
        skipAdvice = '使用頻度が週2〜3回程度なら、最初は ChatGPT Go（1,400円）や Google AI Plus（725円）から始めるのも賢い選択です。';
      }
    } else if (budgetCap <= 6500) {
      const baseId = goals.has('storage') ? 'google_ai_pro' : 'chatgpt_plus';
      if (goals.has('coding')) {
        pickedIds = goals.has('storage') ? ['google_ai_pro', 'cursor_pro'] : ['claude_pro', 'cursor_pro'];
        if (pickedIds[0] === 'claude_pro' && toJpy(byId.claude_pro) + toJpy(byId.cursor_pro) > budgetCap) {
          pickedIds = ['google_ai_pro', 'cursor_pro'];
        }
        reason = '日常のリサーチ・設計担当（Google AI Pro または Claude Pro）と、実際のツール自作担当（Cursor Plus）の2本柱。非エンジニアが「月10時間以上の時短＋ツール制作」に踏み込む最強の実用セットです。';
        skipAdvice = '月$100の Claude Max はまだ不要です。まずは定番＋手頃枠を組み合わせる方がカバー範囲が広くなります。';
      } else if (goals.has('creative')) {
        pickedIds = [baseId, 'suno_pro', 'midjourney_basic'];
        if (totalOf(pickedIds) > budgetCap) {
          pickedIds = [baseId, 'midjourney_basic'];
        }
        reason = '汎用AI（文章・企画出し）＋制作特化AIの組み合わせで、発信や制作物のクオリティを一気に引き上げられます。';
        skipAdvice = '動画AIまで同時に契約すると使い切れずもったいないので、よく使う1ジャンルだけ課金しましょう。';
      } else {
        pickedIds = ['google_ai_pro', 'perplexity_pro'];
        if (totalOf(pickedIds) > budgetCap) {
          pickedIds = ['google_ai_pro', 'chatgpt_plus'];
        }
        reason = '日常業務のGoogle連携（5TB付）＋最新情報や企画作成の精度を上げる組み合わせです。';
        skipAdvice = '同じ用途の汎用チャットAIを3つ同時に課金すると使わないものが必ず出ます。最大2つまでに絞るのが鉄則です。';
      }
    } else if (budgetCap <= 10000) {
      const picked = [goals.has('storage') ? 'google_ai_pro' : 'chatgpt_plus'];
      if (goals.has('coding')) picked.push('cursor_pro');
      if (goals.has('creative')) picked.push('midjourney_basic', 'suno_pro');
      else if (goals.has('research_writing')) picked.push('claude_pro');
      pickedIds = dedupeFit(picked, budgetCap);
      reason = '実務・開発・クリエイティブの主要領域をバランス良くカバーできる本格運用構成です。自分の時間が確実に浮く作業から優先投入できます。';
      skipAdvice = '使っていない月が出たサブスクは翌月すぐ解約して、使う月だけ入り直す「スポット課金」にするとさらに節約できます。';
    } else {
      const picked = [goals.has('storage') ? 'google_ai_pro' : 'chatgpt_plus', 'claude_pro'];
      if (goals.has('coding')) picked.push('cursor_pro');
      if (goals.has('creative')) picked.push('midjourney_basic', 'suno_pro', 'runway_standard');
      if (goals.has('research_writing') && !picked.includes('perplexity_pro')) picked.push('perplexity_pro');
      pickedIds = Array.from(new Set(picked));
      reason = '検証・発信・開発・動画制作までフルカバーするプロ検証構成。X発信や業務自動化で時間を丸ごと買うフェーズ向けです。';
      skipAdvice = 'フル構成でも「同じ役割のチャットを惰性で毎月払わない」ために、月1回は使用頻度を見直してください。';
    }

    function totalOf(ids) {
      return ids.reduce(function (sum, id) {
        return sum + (byId[id] ? toJpy(byId[id]) : 0);
      }, 0);
    }

    function dedupeFit(ids, cap) {
      const out = [];
      let sum = 0;
      Array.from(new Set(ids)).forEach(function (id) {
        const plan = byId[id];
        if (!plan) return;
        const cost = toJpy(plan);
        if (sum + cost <= cap || out.length === 0) {
          out.push(id);
          sum += cost;
        }
      });
      return out;
    }

    return {
      plans: pickedIds.map(function (id) { return byId[id]; }).filter(Boolean),
      reason: reason,
      skipAdvice: skipAdvice
    };
  }

  function renderGoals() {
    const container = document.getElementById('goal-checkboxes');
    container.innerHTML = '';
    GOALS.forEach(function (goal) {
      const label = document.createElement('label');
      label.className = 'goal-item' + (state.selectedGoals.has(goal.id) ? ' selected' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = state.selectedGoals.has(goal.id);
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) state.selectedGoals.add(goal.id);
        else state.selectedGoals.delete(goal.id);
        renderGoals();
        renderDiagnosis();
      });

      const body = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = goal.label;
      const span = document.createElement('span');
      span.textContent = goal.desc;
      body.appendChild(strong);
      body.appendChild(span);

      label.appendChild(checkbox);
      label.appendChild(body);
      container.appendChild(label);
    });
  }

  function renderDiagnosis() {
    const container = document.getElementById('diagnosis-result');
    const result = buildRecommendation();
    const total = result.plans.reduce(function (sum, p) { return sum + toJpy(p); }, 0);

    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'diag-header';
    const titleWrap = document.createElement('div');
    const badge = document.createElement('span');
    badge.className = 'badge badge-accent';
    badge.textContent = 'あなたへのおすすめ構成';
    const h3 = document.createElement('h3');
    h3.style.margin = '6px 0 0';
    h3.textContent = result.plans.map(function (p) { return p.name; }).join(' ＋ ');
    titleWrap.appendChild(badge);
    titleWrap.appendChild(h3);

    const priceBox = document.createElement('div');
    priceBox.className = 'diag-price';
    priceBox.textContent = '約 ' + formatYen(total) + ' / 月';

    header.appendChild(titleWrap);
    header.appendChild(priceBox);
    container.appendChild(header);

    const list = document.createElement('div');
    list.className = 'diag-list';
    result.plans.forEach(function (plan) {
      const card = document.createElement('div');
      card.className = 'diag-plan-card';

      const top = document.createElement('div');
      top.className = 'diag-plan-top';
      const name = document.createElement('strong');
      name.textContent = plan.name;
      const price = document.createElement('span');
      price.className = 'badge';
      price.textContent = plan.currency === 'JPY'
        ? formatYen(plan.price)
        : '$' + plan.price + '（約' + formatYen(toJpy(plan)) + '）';
      top.appendChild(name);
      top.appendChild(price);

      const p = document.createElement('p');
      p.textContent = plan.summary;

      card.appendChild(top);
      card.appendChild(p);
      list.appendChild(card);
    });
    container.appendChild(list);

    const reasonP = document.createElement('p');
    reasonP.style.fontSize = '13.5px';
    reasonP.style.margin = '0 0 12px';
    reasonP.textContent = '💡 選定理由：' + result.reason;
    container.appendChild(reasonP);

    const warn = document.createElement('div');
    warn.className = 'warn-callout';
    const warnTitle = document.createElement('strong');
    warnTitle.textContent = '⚠️ 逆に「今すぐ課金しなくていい人」';
    const warnBody = document.createElement('span');
    warnBody.textContent = result.skipAdvice;
    warn.appendChild(warnTitle);
    warn.appendChild(warnBody);
    container.appendChild(warn);

    const actions = document.createElement('div');
    actions.className = 'diag-actions';
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-primary';
    shareBtn.textContent = '診断結果をXでシェア';
    shareBtn.addEventListener('click', function () {
      const planNames = result.plans.map(function (p) { return p.name; }).join(' + ');
      const url = getShareUrl();
      const lines = [
        SITE_CONFIG.siteName + ' でAI課金コスパを診断してみた',
        '',
        '・おすすめ構成：' + planNames,
        '・月額目安：約' + formatYen(total) + '（1ドル=' + state.usdJpy + '円換算）',
        '',
        'via ' + getCleanHandle()
      ];
      if (url) lines.push(url);
      openXShare(lines.join('\n'));
    });

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-outline';
    copyBtn.textContent = '結果をテキストコピー';
    copyBtn.addEventListener('click', function () {
      const text = 'おすすめAI構成：' + result.plans.map(function (p) { return p.name; }).join(' + ') +
        '（合計約' + formatYen(total) + '/月）｜' + SITE_CONFIG.siteName + ' ' + getCleanHandle();
      copyText(text, '診断結果をコピーしました');
    });

    actions.appendChild(shareBtn);
    actions.appendChild(copyBtn);
    container.appendChild(actions);
  }

  function renderManualSimulator() {
    const grid = document.getElementById('manual-subs-grid');
    grid.innerHTML = '';

    let total = 0;
    let count = 0;
    const selectedNames = [];

    SUBSCRIPTIONS.forEach(function (plan) {
      const isChecked = state.manualSelected.has(plan.id);
      const jpy = toJpy(plan);
      if (isChecked) {
        total += jpy;
        count += 1;
        selectedNames.push(plan.name);
      }

      const card = document.createElement('label');
      card.className = 'sub-card' + (isChecked ? ' checked' : '');

      const upper = document.createElement('div');
      const top = document.createElement('div');
      top.className = 'sub-top';

      const titleWrap = document.createElement('div');
      titleWrap.className = 'sub-title-wrap';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = isChecked;
      cb.addEventListener('change', function () {
        if (cb.checked) state.manualSelected.add(plan.id);
        else state.manualSelected.delete(plan.id);
        renderManualSimulator();
      });

      const titleBox = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = plan.name;
      const small = document.createElement('div');
      small.style.fontSize = '11.5px';
      small.style.color = 'var(--text-muted)';
      small.textContent = plan.billingNote;
      titleBox.appendChild(strong);
      titleBox.appendChild(small);
      titleWrap.appendChild(cb);
      titleWrap.appendChild(titleBox);

      const priceTag = document.createElement('span');
      priceTag.className = 'sub-price-tag';
      priceTag.textContent = plan.currency === 'JPY'
        ? formatYen(jpy)
        : '$' + plan.price + ' / 約' + formatYen(jpy);

      top.appendChild(titleWrap);
      top.appendChild(priceTag);

      const summary = document.createElement('p');
      summary.className = 'sub-summary';
      summary.textContent = plan.summary;

      const ul = document.createElement('ul');
      ul.className = 'sub-perks';
      plan.perks.forEach(function (perk) {
        const li = document.createElement('li');
        li.textContent = perk;
        ul.appendChild(li);
      });

      upper.appendChild(top);
      upper.appendChild(summary);
      upper.appendChild(ul);

      const caveat = document.createElement('div');
      caveat.className = 'sub-caveat';
      caveat.textContent = '注意点：' + plan.caveat;

      card.appendChild(upper);
      card.appendChild(caveat);
      grid.appendChild(card);
    });

    document.getElementById('manual-total-jpy').textContent = formatYen(total) + ' / 月';
    document.getElementById('manual-yearly-jpy').textContent = formatYen(total * 12) + ' / 年';
    document.getElementById('manual-count').textContent = count + '件';

    const shareBtn = document.getElementById('manual-share-btn');
    shareBtn.onclick = function () {
      const url = getShareUrl();
      const body = count > 0
        ? 'AIサブスクの月額を計算してみた\n' + selectedNames.join(' + ') + '\n合計：約' + formatYen(total) + '/月（1ドル=' + state.usdJpy + '円）\n\nvia ' + getCleanHandle()
        : SITE_CONFIG.siteName + ' のAI課金シミュレーターで比較中\n\nvia ' + getCleanHandle();
      openXShare(url ? body + '\n' + url : body);
    };
  }

  function computeLossAnalysis() {
    const L = state.loss;
    const rate = state.usdJpy;
    const feeMul = 1.025;
    let currentYearly = 0;
    const findings = [];
    const warnings = [];

    // 1. Google AI
    if (L.google === 'pro_monthly') {
      currentYearly += 2900 * 12;
      if (L.googleBfEligible) {
        findings.push({
          title: 'Google AI Pro：月払い → BF年額半額(14,500円)へ切替',
          saveYearly: 2900 * 12 - 14500,
          detail: '月2,900円(年34,800円)から11/26頃までの先行BF半額(年14,500円)へ切り替えると直近月分は返金調整。2年目の定価29,000円更新だけカレンダー推奨。'
        });
      } else {
        findings.push({
          title: 'Google AI Pro：月払い → 公式年額(29,000円)へ切替',
          saveYearly: 2900 * 12 - 29000,
          detail: '1年使う予定なら年額29,000円にするだけで2ヶ月分(5,800円)浮く。対象アカウントなら11/26頃まで初年14,500円表示も確認してみて。'
        });
      }
    } else if (L.google === 'pro_annual') {
      currentYearly += 29000;
    } else if (L.google === 'pro_bf') {
      currentYearly += 14500;
      warnings.push({
        title: 'Google AI Pro BF半額：2年目の自動更新に注意',
        detail: '初年度14,500円のあと、2年目は自動で定価29,000円に更新されるため更新日のメモが安心。'
      });
    } else if (L.google === 'ultra_5x') {
      currentYearly += 14500 * 12;
    } else if (L.google === 'ultra_20x') {
      currentYearly += 32000 * 12;
    }

    if (L.googleYtDup && L.google !== 'none') {
      currentYearly += 1280 * 12;
      findings.push({
        title: 'YouTube Premium(月1,280円)の二重払いを整理',
        saveYearly: 1280 * 12,
        detail: 'Google AI Pro以上の特典(YouTube Premium Lite等)へ寄せて個別契約を止めると年15,360円削減。Google One特典タブから手動有効化を忘れずに。'
      });
    }

    // 2. Claude
    const claudeWebMonthly = Math.round(20 * 1.1 * rate * feeMul);
    const claudeWebYearly = Math.round(200 * 1.1 * rate * feeMul);
    if (L.claude === 'web_monthly') {
      currentYearly += claudeWebMonthly * 12;
      if (L.claudePersonal) {
        const diffMonthly = Math.max(0, claudeWebMonthly - 3000);
        if (diffMonthly > 0) {
          findings.push({
            title: 'Claude Pro：Webドル建て → 日本iOS App Store(月3,000円)へ',
            saveYearly: diffMonthly * 12,
            detail: '1ドル' + rate + '円＋税10%＋海外手数料でWebは月約' + formatYen(claudeWebMonthly) + '。インボイス不要の個人利用ならApp Store固定3,000円が割安。'
          });
        }
      } else {
        warnings.push({
          title: 'Claude Pro：インボイス(適格請求書)要ならWeb直販を維持',
          detail: 'App Store経由はApple名義になりAnthropicの適格請求書が出ないため、経費精算・法人利用ならWeb直販一択。'
        });
      }
    } else if (L.claude === 'ios_monthly') {
      currentYearly += 3000 * 12;
    } else if (L.claude === 'web_annual') {
      currentYearly += claudeWebYearly;
    } else if (L.claude === 'max') {
      currentYearly += Math.round(100 * 1.1 * rate * feeMul) * 12;
    }

    // 3. ChatGPT
    if (L.chatgpt === 'plus') {
      currentYearly += 3000 * 12;
      if (L.chatgptLight) {
        findings.push({
          title: 'ChatGPT：Plus(3,000円) → Go(1,400円)へ見直し',
          saveYearly: (3000 - 1400) * 12,
          detail: '重い推論やDeep Researchを毎日使わないなら、円建て同額のChatGPT Go(1,400円)に落とすだけで年19,200円浮く。'
        });
      }
    } else if (L.chatgpt === 'go') {
      currentYearly += 1400 * 12;
    }

    // 4. Cursor
    if (L.cursor === 'old_pro') {
      currentYearly += Math.round(20 * rate * feeMul) * 12;
      warnings.push({
        title: 'Cursor 旧Pro($20)維持中：新プランへの誤切替に厳重注意',
        detail: '2026年10月の統合後、一度でも新プランへ切り替えると旧Pro($20)には戻せない仕様。切替ボタンを押さないのが鉄則。'
      });
    } else if (L.cursor === 'new_plus') {
      currentYearly += Math.round(8 * rate * feeMul) * 12;
      warnings.push({
        title: 'Cursor 新Plus($8)：自社モデル専用に注意',
        detail: 'Plus($8)ではClaudeやGPTが選べないため、他社モデル目当てで追加課金する前に役割を整理しておくとムダがない。'
      });
    } else if (L.cursor === 'new_premium') {
      currentYearly += Math.round(30 * rate * feeMul) * 12;
      warnings.push({
        title: 'Cursor Premium($30)：他社モデルのAPI従量課金に注意',
        detail: 'Claude/GPTの利用分は月額$30とは別に各社API定価の従量課金が発生。普段使いは定額プランへ逃がすと膨らみにくい。'
      });
    }

    // 5. 放置枠
    if (L.unusedCount > 0) {
      currentYearly += 3000 * 12 * L.unusedCount;
      findings.push({
        title: 'ほとんど開いていない月3,000円枠(' + L.unusedCount + '本)を休止',
        saveYearly: 3000 * 12 * L.unusedCount,
        detail: '使わない月だけ一旦止めて、必要な月だけ入り直すスポット運用にすると大きく固定費を削れる。'
      });
    }

    const totalSaveYearly = findings.reduce(function (sum, f) { return sum + f.saveYearly; }, 0);
    return {
      rate: rate,
      currentYearly: currentYearly,
      currentMonthly: Math.round(currentYearly / 12),
      saveYearly: totalSaveYearly,
      saveMonthly: Math.round(totalSaveYearly / 12),
      afterYearly: Math.max(0, currentYearly - totalSaveYearly),
      findings: findings,
      warnings: warnings
    };
  }

  function renderLossInputs() {
    const container = document.getElementById('loss-inputs');
    if (!container) return;
    const L = state.loss;
    container.innerHTML = '';

    const head = document.createElement('div');
    head.className = 'loss-inputs-head';
    const h3 = document.createElement('h3');
    h3.textContent = '今の契約状況をチェック（10秒）';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-outline btn-sm';
    resetBtn.textContent = 'すべて未契約に';
    resetBtn.addEventListener('click', function () {
      state.loss = {
        google: 'none',
        googleYtDup: false,
        googleBfEligible: false,
        claude: 'none',
        claudePersonal: true,
        chatgpt: 'none',
        chatgptLight: false,
        cursor: 'none',
        unusedCount: 0
      };
      renderLossInputs();
      renderLossDiagnosis();
    });
    head.appendChild(h3);
    head.appendChild(resetBtn);
    container.appendChild(head);

    function addPillGroup(title, options, currentVal, onSelect, checks) {
      const grp = document.createElement('div');
      grp.className = 'loss-group';
      const pTitle = document.createElement('p');
      pTitle.className = 'loss-group-title';
      pTitle.textContent = title;
      grp.appendChild(pTitle);

      const pills = document.createElement('div');
      pills.className = 'loss-pills';
      options.forEach(function (opt) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'loss-pill' + (currentVal === opt.id ? ' active' : '');
        b.textContent = opt.label;
        b.addEventListener('click', function () {
          onSelect(opt.id);
          renderLossInputs();
          renderLossDiagnosis();
        });
        pills.appendChild(b);
      });
      grp.appendChild(pills);

      if (checks && checks.length > 0) {
        const cWrap = document.createElement('div');
        cWrap.className = 'loss-checks';
        checks.forEach(function (chk) {
          if (chk.visible === false) return;
          const lbl = document.createElement('label');
          lbl.className = 'loss-check';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = Boolean(chk.checked);
          cb.addEventListener('change', function () {
            chk.onChange(cb.checked);
            renderLossDiagnosis();
          });
          const sp = document.createElement('span');
          sp.textContent = chk.label;
          lbl.appendChild(cb);
          lbl.appendChild(sp);
          cWrap.appendChild(lbl);
        });
        if (cWrap.childNodes.length > 0) grp.appendChild(cWrap);
      }
      container.appendChild(grp);
    }

    addPillGroup(
      '1. Google AI（Gemini / 5TB）',
      [
        { id: 'none', label: '未契約' },
        { id: 'pro_monthly', label: 'Pro 月2,900円' },
        { id: 'pro_annual', label: 'Pro 年29,000円' },
        { id: 'pro_bf', label: 'Pro BF半額14,500円' },
        { id: 'ultra_5x', label: 'Ultra 5x' },
        { id: 'ultra_20x', label: 'Ultra 20x' }
      ],
      L.google,
      function (v) { L.google = v; },
      [
        {
          visible: L.google === 'pro_monthly',
          checked: L.googleBfEligible,
          label: '11/26頃までの先行BF半額（初年14,500円）対象が表示されている',
          onChange: function (c) { L.googleBfEligible = c; }
        },
        {
          visible: L.google !== 'none',
          checked: L.googleYtDup,
          label: '別で通常のYouTube Premium（月1,280円）も契約中（YouTube Music不要）',
          onChange: function (c) { L.googleYtDup = c; }
        }
      ]
    );

    addPillGroup(
      '2. Claude（Anthropic）',
      [
        { id: 'none', label: '未契約' },
        { id: 'web_monthly', label: 'Pro Web直販($20+税)' },
        { id: 'ios_monthly', label: 'Pro iOS(3,000円)' },
        { id: 'web_annual', label: 'Pro Web年払($200+税)' },
        { id: 'max', label: 'Max($100〜)' }
      ],
      L.claude,
      function (v) { L.claude = v; },
      [
        {
          visible: L.claude === 'web_monthly',
          checked: L.claudePersonal,
          label: '個人利用（法人の適格請求書・インボイスは不要）',
          onChange: function (c) { L.claudePersonal = c; }
        }
      ]
    );

    addPillGroup(
      '3. ChatGPT（OpenAI）',
      [
        { id: 'none', label: '未契約' },
        { id: 'plus', label: 'Plus (3,000円)' },
        { id: 'go', label: 'Go (1,400円)' }
      ],
      L.chatgpt,
      function (v) { L.chatgpt = v; },
      [
        {
          visible: L.chatgpt === 'plus',
          checked: L.chatgptLight,
          label: '重い推論やDeep Researchは毎日使わない（軽い相談中心）',
          onChange: function (c) { L.chatgptLight = c; }
        }
      ]
    );

    addPillGroup(
      '4. Cursor（X統合後）',
      [
        { id: 'none', label: '未契約' },
        { id: 'old_pro', label: '旧Pro ($20維持)' },
        { id: 'new_plus', label: '新Plus ($8)' },
        { id: 'new_premium', label: '新Premium ($30+従量)' }
      ],
      L.cursor,
      function (v) { L.cursor = v; },
      []
    );

    addPillGroup(
      '5. 1ヶ月ほぼ開いていない月3,000円クラスのAI',
      [
        { id: 0, label: '0本（なし）' },
        { id: 1, label: '1本ある' },
        { id: 2, label: '2本ある' }
      ],
      L.unusedCount,
      function (v) { L.unusedCount = Number(v); },
      []
    );
  }

  function fillRoundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawLossCardCanvas(analysis) {
    const canvas = document.getElementById('loss-share-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 1200;
    const H = 630;
    const fontMain = '"Yu Gothic UI", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif';

    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow
    const grad = ctx.createRadialGradient(240, 120, 20, 240, 120, 520);
    grad.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
    grad.addColorStop(1, 'rgba(11, 17, 32, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Header pill + title
    fillRoundRect(ctx, 52, 40, 270, 38, 19, 'rgba(56, 189, 248, 0.14)', 'rgba(56, 189, 248, 0.5)');
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px ' + fontMain;
    ctx.fillText('2026年11月 AI課金見直し診断', 72, 66);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px ' + fontMain;
    ctx.textAlign = 'right';
    ctx.fillText(getCleanHandle(), W - 52, 66);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 34px ' + fontMain;
    ctx.fillText('AIサブスク 年間ロス10秒チェック結果', 52, 124);

    // KPI boxes
    fillRoundRect(ctx, 52, 148, 534, 134, 16, '#131c31', '#253451');
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px ' + fontMain;
    ctx.fillText('いまの年間目安（1ドル=' + analysis.rate + '円換算）', 78, 184);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 44px ' + fontMain;
    ctx.fillText('約 ' + formatYen(analysis.currentYearly) + ' / 年', 78, 242);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px ' + fontMain;
    ctx.fillText('月額換算：約 ' + formatYen(analysis.currentMonthly) + ' / 月', 78, 268);

    fillRoundRect(ctx, 614, 148, 534, 134, 16, '#1a1a10', '#fbbf24');
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 18px ' + fontMain;
    ctx.fillText('見直しで浮く可能性がある金額', 640, 184);
    ctx.fillStyle = analysis.saveYearly > 0 ? '#fbbf24' : '#4ade80';
    ctx.font = '800 46px ' + fontMain;
    ctx.fillText(
      analysis.saveYearly > 0 ? ('年 ' + formatYen(analysis.saveYearly) + ' 得') : 'ロス 0円（最適化済）',
      640,
      242
    );
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px ' + fontMain;
    ctx.fillText(
      analysis.saveYearly > 0
        ? ('月あたり約 ' + formatYen(analysis.saveMonthly) + ' 削減')
        : '今の構成にムダな決済ズレは見当たりません',
      640,
      268
    );

    // Findings list
    fillRoundRect(ctx, 52, 304, 1096, 254, 16, '#131c31', '#253451');
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 19px ' + fontMain;
    ctx.fillText('見つかった主な見直しポイント', 78, 340);

    const rows = analysis.findings.slice(0, 3);
    if (rows.length === 0) {
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 24px ' + fontMain;
      ctx.fillText('✓ 課金ルートや二重払いのロスは見つかりませんでした', 78, 412);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px ' + fontMain;
      ctx.fillText('※為替・キャンペーン・年額更新日だけ定期確認がおすすめ', 78, 456);
    } else {
      rows.forEach(function (item, idx) {
        const ry = 360 + idx * 60;
        fillRoundRect(ctx, 76, ry, 1048, 50, 10, '#0f172a', '#253451');
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 19px ' + fontMain;
        const label = (idx + 1) + '. ' + item.title;
        ctx.fillText(label.slice(0, 56), 96, ry + 32, 830);

        ctx.fillStyle = '#4ade80';
        ctx.font = '800 20px ' + fontMain;
        ctx.textAlign = 'right';
        ctx.fillText('-' + formatYen(item.saveYearly) + '/年', 1102, ry + 32);
        ctx.textAlign = 'left';
      });
    }

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px ' + fontMain;
    ctx.fillText(SITE_CONFIG.siteName + '（chikuwa-ai.github.io/chikuwa-ai-box/）', 52, 594);
    ctx.textAlign = 'right';
    ctx.fillText('※2026年11月時点目安・最終金額は公式決済画面を確認', W - 52, 594);
    ctx.textAlign = 'left';
  }

  function renderLossDiagnosis() {
    const area = document.getElementById('loss-summary-area');
    if (!area) return;
    const analysis = computeLossAnalysis();
    area.innerHTML = '';

    const hero = document.createElement('div');
    hero.className = 'loss-hero-box';

    const k1 = document.createElement('div');
    k1.className = 'loss-kpi';
    k1.innerHTML =
      '<span class="loss-kpi-label">いまの年間目安</span>' +
      '<strong class="loss-kpi-val">' + formatYen(analysis.currentYearly) + '</strong>' +
      '<span class="loss-kpi-sub">月額換算：約 ' + formatYen(analysis.currentMonthly) + ' / 月</span>';

    const k2 = document.createElement('div');
    k2.className = 'loss-kpi is-save';
    k2.innerHTML =
      '<span class="loss-kpi-label">見直しで浮く金額</span>' +
      '<strong class="loss-kpi-val">' + (analysis.saveYearly > 0 ? ('年 ' + formatYen(analysis.saveYearly)) : '0円') + '</strong>' +
      '<span class="loss-kpi-sub">月あたり約 ' + formatYen(analysis.saveMonthly) + ' 節約余地</span>';

    hero.appendChild(k1);
    hero.appendChild(k2);
    area.appendChild(hero);

    if (analysis.findings.length > 0) {
      const cards = document.createElement('div');
      cards.className = 'loss-cards';
      analysis.findings.forEach(function (f) {
        const c = document.createElement('div');
        c.className = 'loss-card';
        const top = document.createElement('div');
        top.className = 'loss-card-top';
        const st = document.createElement('strong');
        st.textContent = f.title;
        const bdg = document.createElement('span');
        bdg.className = 'badge badge-accent';
        bdg.textContent = '年 -' + formatYen(f.saveYearly);
        top.appendChild(st);
        top.appendChild(bdg);
        const p = document.createElement('p');
        p.textContent = f.detail;
        c.appendChild(top);
        c.appendChild(p);
        cards.appendChild(c);
      });
      area.appendChild(cards);
    } else {
      const okBox = document.createElement('div');
      okBox.className = 'loss-empty-ok';
      okBox.textContent = '✓ いまの選択では大きな課金ロスは見つかりませんでした。下の警告・注意点だけ確認してみて。';
      area.appendChild(okBox);
    }

    analysis.warnings.forEach(function (w) {
      const wc = document.createElement('div');
      wc.className = 'loss-warn-card';
      const wst = document.createElement('strong');
      wst.textContent = '⚠️ ' + w.title;
      const wsp = document.createElement('span');
      wsp.textContent = w.detail;
      wc.appendChild(wst);
      wc.appendChild(wsp);
      area.appendChild(wc);
    });

    drawLossCardCanvas(analysis);
  }

  function renderSimulator() {
    renderLossInputs();
    renderLossDiagnosis();
    renderGoals();
    renderDiagnosis();
    renderManualSimulator();
  }

  function getCategoryLabel(catId, list) {
    const found = list.find(function (c) { return c.id === catId; });
    return found ? found.label : catId;
  }

  function renderPromptCategories() {
    const container = document.getElementById('prompt-category-pills');
    container.innerHTML = '';
    PROMPT_CATEGORIES.forEach(function (cat) {
      const count = cat.id === 'all'
        ? PROMPTS.length
        : PROMPTS.filter(function (p) { return p.category === cat.id; }).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-btn' + (state.promptCategory === cat.id ? ' active' : '');
      btn.textContent = cat.label + ' (' + count + ')';
      btn.addEventListener('click', function () {
        state.promptCategory = cat.id;
        renderPromptCategories();
        renderPrompts();
      });
      container.appendChild(btn);
    });
  }

  function renderPrompts() {
    const grid = document.getElementById('prompts-grid');
    const q = state.promptQuery.trim().toLowerCase();

    const filtered = PROMPTS.filter(function (p) {
      if (state.promptCategory !== 'all' && p.category !== state.promptCategory) return false;
      if (state.promptDifficulty !== 'all' && p.difficulty !== state.promptDifficulty) return false;
      if (!q) return true;
      const hay = (p.title + ' ' + p.summary + ' ' + p.recommendedTool + ' ' + p.promptText).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    document.getElementById('prompt-count-label').textContent =
      filtered.length + '件のプロンプトを表示中（全' + PROMPTS.length + '件）';

    grid.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '該当するプロンプトが見つかりませんでした。検索ワードを変えてお試しください。';
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(function (p) {
      const card = document.createElement('article');
      card.className = 'prompt-card';

      const top = document.createElement('div');
      const badges = document.createElement('div');
      badges.className = 'card-badges';

      const bCat = document.createElement('span');
      bCat.className = 'badge';
      bCat.textContent = getCategoryLabel(p.category, PROMPT_CATEGORIES);

      const bDiff = document.createElement('span');
      bDiff.className = 'badge badge-accent';
      bDiff.textContent = p.difficulty;

      const bTool = document.createElement('span');
      bTool.className = 'badge badge-teal';
      bTool.textContent = p.recommendedTool;

      badges.appendChild(bCat);
      badges.appendChild(bDiff);
      badges.appendChild(bTool);

      const h3 = document.createElement('h3');
      h3.textContent = p.title;

      const desc = document.createElement('p');
      desc.textContent = p.summary;

      const preview = document.createElement('div');
      preview.className = 'prompt-preview';
      preview.textContent = p.promptText;

      top.appendChild(badges);
      top.appendChild(h3);
      top.appendChild(desc);
      top.appendChild(preview);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.className = 'btn btn-outline btn-sm';
      viewBtn.textContent = '全文・コツを見る';
      viewBtn.addEventListener('click', function () {
        openPromptModal(p);
      });

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn-primary btn-sm';
      copyBtn.textContent = 'コピー';
      copyBtn.addEventListener('click', function () {
        copyText(p.promptText, '「' + p.title + '」をコピーしました');
      });

      const shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'btn btn-ghost btn-sm';
      shareBtn.textContent = 'Xで紹介';
      shareBtn.addEventListener('click', function () {
        sharePromptToX(p);
      });

      actions.appendChild(viewBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(shareBtn);

      card.appendChild(top);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function sharePromptToX(prompt) {
    const url = getShareUrl();
    const lines = [
      '『' + prompt.title + '』がそのまま使えて便利だった',
      '',
      prompt.summary,
      '',
      '出典：' + SITE_CONFIG.siteName + ' (' + getCleanHandle() + ')'
    ];
    if (url) lines.push(url);
    openXShare(lines.join('\n'));
  }

  function openPromptModal(prompt) {
    state.activePromptId = prompt.id;
    document.getElementById('modal-category').textContent = getCategoryLabel(prompt.category, PROMPT_CATEGORIES);
    document.getElementById('modal-difficulty').textContent = prompt.difficulty;
    document.getElementById('modal-tool').textContent = prompt.recommendedTool;
    document.getElementById('modal-title').textContent = prompt.title;
    document.getElementById('modal-summary').textContent = prompt.summary;
    document.getElementById('modal-prompt-text').textContent = prompt.promptText;
    document.getElementById('modal-tips').textContent = prompt.tips;

    document.getElementById('modal-copy-btn').onclick = function () {
      copyText(prompt.promptText, 'プロンプト全文をコピーしました');
    };
    document.getElementById('modal-share-btn').onclick = function () {
      sharePromptToX(prompt);
    };

    document.getElementById('prompt-modal').classList.remove('hidden');
  }

  function closePromptModal() {
    document.getElementById('prompt-modal').classList.add('hidden');
    state.activePromptId = null;
  }

  function renderToolCategories() {
    const container = document.getElementById('tool-category-pills');
    container.innerHTML = '';
    TOOL_CATEGORIES.forEach(function (cat) {
      const count = cat.id === 'all'
        ? TOOLS.length
        : TOOLS.filter(function (t) { return t.category === cat.id; }).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-btn' + (state.toolCategory === cat.id ? ' active' : '');
      btn.textContent = cat.label + ' (' + count + ')';
      btn.addEventListener('click', function () {
        state.toolCategory = cat.id;
        renderToolCategories();
        renderTools();
      });
      container.appendChild(btn);
    });
  }

  function renderTools() {
    const grid = document.getElementById('tools-grid');
    const q = state.toolQuery.trim().toLowerCase();

    const filtered = TOOLS.filter(function (t) {
      if (state.toolCategory !== 'all' && t.category !== state.toolCategory) return false;
      if (!q) return true;
      const hay = (t.name + ' ' + t.freeTier + ' ' + t.paidPrice + ' ' + t.bestFor + ' ' + t.pitfall).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    grid.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '該当するツールが見つかりませんでした。';
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(function (t) {
      const card = document.createElement('article');
      card.className = 'tool-card';

      const top = document.createElement('div');
      top.className = 'tool-top';
      const h3 = document.createElement('h3');
      h3.textContent = t.name;
      const rating = document.createElement('span');
      rating.className = 'tool-rating';
      rating.textContent = '非Eng向け ' + '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      top.appendChild(h3);
      top.appendChild(rating);

      const meta = document.createElement('div');
      meta.className = 'tool-meta';
      const bFree = document.createElement('span');
      bFree.className = 'badge badge-teal';
      bFree.textContent = t.freeTier;
      const bPaid = document.createElement('span');
      bPaid.className = 'badge';
      bPaid.textContent = '有料: ' + t.paidPrice;
      meta.appendChild(bFree);
      meta.appendChild(bPaid);

      const best = document.createElement('p');
      best.className = 'tool-best';
      best.textContent = '得意用途：' + t.bestFor;

      const pitfall = document.createElement('p');
      pitfall.className = 'tool-pitfall';
      pitfall.textContent = '⚠️ ハマりやすい罠：' + t.pitfall;

      card.appendChild(top);
      card.appendChild(meta);
      card.appendChild(best);
      card.appendChild(pitfall);
      grid.appendChild(card);
    });
  }

  function switchSimMode(mode) {
    state.simMode = mode;
    const lossBtn = document.getElementById('mode-loss-btn');
    const diagBtn = document.getElementById('mode-diagnose-btn');
    const manBtn = document.getElementById('mode-manual-btn');
    const lossPanel = document.getElementById('loss-panel');
    const diagPanel = document.getElementById('diagnose-panel');
    const manPanel = document.getElementById('manual-panel');

    const map = [
      { id: 'loss', btn: lossBtn, panel: lossPanel },
      { id: 'diagnose', btn: diagBtn, panel: diagPanel },
      { id: 'manual', btn: manBtn, panel: manPanel }
    ];
    map.forEach(function (entry) {
      const on = entry.id === mode;
      if (entry.btn) {
        entry.btn.classList.toggle('active', on);
        entry.btn.setAttribute('aria-selected', on ? 'true' : 'false');
      }
      if (entry.panel) entry.panel.classList.toggle('hidden', !on);
    });
  }

  function bindEvents() {
    const slider = document.getElementById('usd-jpy-slider');
    slider.addEventListener('input', function () {
      state.usdJpy = Number(slider.value);
      updateRateLabels();
      renderLossDiagnosis();
      renderDiagnosis();
      renderManualSimulator();
    });

    const lossBtn = document.getElementById('mode-loss-btn');
    const diagBtn = document.getElementById('mode-diagnose-btn');
    const manBtn = document.getElementById('mode-manual-btn');

    if (lossBtn) lossBtn.addEventListener('click', function () { switchSimMode('loss'); });
    if (diagBtn) diagBtn.addEventListener('click', function () { switchSimMode('diagnose'); });
    if (manBtn) manBtn.addEventListener('click', function () { switchSimMode('manual'); });

    const navLossLink = document.getElementById('nav-loss-link');
    if (navLossLink) navLossLink.addEventListener('click', function () { switchSimMode('loss'); });
    const heroLossCta = document.getElementById('hero-loss-cta');
    if (heroLossCta) heroLossCta.addEventListener('click', function () { switchSimMode('loss'); });

    const pngBtn = document.getElementById('loss-png-btn');
    if (pngBtn) {
      pngBtn.addEventListener('click', function () {
        const canvas = document.getElementById('loss-share-canvas');
        if (!canvas) return;
        const a = document.createElement('a');
        a.download = 'ai_billing_check.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
        showToast('診断カードPNGを保存しました');
      });
    }

    const lossShareBtn = document.getElementById('loss-share-btn');
    if (lossShareBtn) {
      lossShareBtn.addEventListener('click', function () {
        const a = computeLossAnalysis();
        const url = getShareUrl();
        const topLines = a.findings.slice(0, 2).map(function (f) {
          return '・' + f.title + '（年 -' + formatYen(f.saveYearly) + '）';
        });
        const lines = [
          a.saveYearly > 0
            ? 'AI課金の年間ロスを計算してみたら、見直し余地が年' + formatYen(a.saveYearly) + 'あった。'
            : 'AI課金の年間ロスをチェックしてみたらムダは0円だった。',
          ''
        ].concat(topLines);
        lines.push('', 'via ' + getCleanHandle());
        if (url) lines.push(url);
        openXShare(lines.join('\n'));
      });
    }

    const lossCopyBtn = document.getElementById('loss-copy-btn');
    if (lossCopyBtn) {
      lossCopyBtn.addEventListener('click', function () {
        const a = computeLossAnalysis();
        const items = a.findings.map(function (f) {
          return '・' + f.title + '（年 -' + formatYen(f.saveYearly) + '）';
        });
        const txt = [
          '【AI課金 年間ロス診断結果】',
          '現在目安：年 ' + formatYen(a.currentYearly) + '（月 ' + formatYen(a.currentMonthly) + '）',
          '見直し余地：年 ' + formatYen(a.saveYearly) + '（月 ' + formatYen(a.saveMonthly) + '）'
        ].concat(items).join('\n');
        copyText(txt, '診断結果をコピーしました');
      });
    }

    document.querySelectorAll('#budget-radios .pill-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#budget-radios .pill-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        state.budget = btn.getAttribute('data-budget');
        renderDiagnosis();
      });
    });

    document.getElementById('manual-reset-btn').addEventListener('click', function () {
      state.manualSelected.clear();
      renderManualSimulator();
      showToast('選択をリセットしました');
    });

    const promptSearch = document.getElementById('prompt-search');
    promptSearch.addEventListener('input', function () {
      state.promptQuery = promptSearch.value;
      renderPrompts();
    });

    document.querySelectorAll('#prompt-difficulty-pills .pill-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#prompt-difficulty-pills .pill-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        state.promptDifficulty = btn.getAttribute('data-diff');
        renderPrompts();
      });
    });

    const toolSearch = document.getElementById('tool-search');
    toolSearch.addEventListener('input', function () {
      state.toolQuery = toolSearch.value;
      renderTools();
    });

    document.getElementById('copy-credit-btn').addEventListener('click', function () {
      copyText(SITE_CONFIG.siteName + ' · ' + getCleanHandle(), 'クレジット表記をコピーしました');
    });

    document.getElementById('modal-close-btn').addEventListener('click', closePromptModal);
    document.getElementById('modal-backdrop').addEventListener('click', closePromptModal);

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        promptSearch.focus();
        promptSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (e.key === 'Escape' && state.activePromptId) {
        closePromptModal();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    applyConfig();
    bindEvents();
    renderSimulator();
    renderPromptCategories();
    renderPrompts();
    renderToolCategories();
    renderTools();
  });
})();
